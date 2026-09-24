import api from "./api.js";

// ferramentas internas, não precisam ser acessadas em outros arquivos, então não são exportadas

// muda -> prioridade padrão inicial
let selectedPriority = "media";

// dicionário de prioridades
// const priorityIcons = {
//   alta: "⭡",
//   media: "→",
//   baixa: "⭣",
// };

const priorityBadgeTexts = {
  alta: "ALTA",
  media: "MÉDIA",
  baixa: "BAIXA",
};

const priorityColors = {
  alta: "bg-accent-500",
  media: "bg-accent-300",
  baixa: "bg-neutral-400",
};

// verifica se a tarefa está atrasada
function isOverdue(task) {
  if (task.completed) return false;
  if (!task.due_date) return false;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const dueDate = new Date(task.due_date);
  dueDate.setUTCHours(0, 0, 0, 0);

  return dueDate < today;
}

// formata a data para exibição no card da tarefa
function formatDate(dateString) {
  if (!dateString) return "Sem data";

  const date = new Date(dateString);
  date.setUTCHours(0, 0, 0, 0);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.getTime() === today.getTime()) return "HOJE";
  if (date.getTime() === tomorrow.getTime()) return "AMANHÃ";

  const months = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

const ui = {
  // pra guardar a página atual, para que ao carregar mais tarefas, ele continue de onde parou
  currentPage: 1,
  // pra guardar o filtro ativo, para que ao carregar mais tarefas, ele continue aplicando o filtro TIVEMOS PROBLEMAS
  currentFilter: "",

  // loading
  showLoading() {
    document.getElementById("loading-overlay").classList.remove("hidden");
  },

  hideLoading() {
    document.getElementById("loading-overlay").classList.add("hidden");
  },

  async renderTasks(tasks, append = false) {
    const taskList = document.getElementById("task-list");

    // se eu não cliquei em carregar mais em outras utilidades, ele apaga tudo, limpa a lista, e redesenha do zero com dados atualizados
    // se append true, ele não apaga, apenas adiciona mais tarefas no final da lista
    //LoadTasks é chamado com append true quando o usuário clica no botão "Carregar mais" -> consultar
    if (!append) {
      taskList.innerHTML = "";
    }

    // template de cada card de tarefa
    tasks.forEach((task) => {
      const card = document.createElement("li");
      card.innerHTML = `
 <article class="task-card bg-surface rounded-lg p-4 mb-4 border-r-4 border-accent-500 md:flex md:items-center md:justify-between md:border-r-0 md:border-l-4">
    <div class="md:gap-4 md:flex-1 md:min-w-0">
      <div class="flex justify-between">
        <div class="flex gap-2 flex-1 min-w-0">
          <input type="checkbox" id="task-${task.id}" ${task.completed ? "checked" : ""}>
          <strong class="flex-1 min-w-0 line-clamp-1 ${task.completed ? "line-through opacity-50" : ""} ">${task.title}</strong>
        </div>
      </div>
      <p class="line-clamp-1 text-neutral-400 ${task.completed ? "opacity-50" : ""}">${task.description || ""}</p>
    </div>

    <footer class="flex mt-1 gap-2 md:gap-3 md:items-center">
      ${isOverdue(task) ? '<span class="rounded-full px-3 py-1 bg-accent text-xs">ATRASADA</span>' : ""}
      <span class="rounded-full px-3 py-1 bg-divider text-xs">${formatDate(task.due_date)}</span>
      <span class="rounded-full px-3 py-1 ${priorityColors[task.priority]} text-xs  text-bg ">${priorityBadgeTexts[task.priority]}</span>
      <button type="button" class="hidden md:inline-block border border-divider rounded-lg px-4 py-2 text-xs font-bold btn-edit">EDITAR</button>
      <button type="button" class="hidden md:inline-block border border-accent text-accent rounded-lg px-4 py-2 text-xs font-bold btn-delete-card">EXCLUIR</button>
    </footer>
  </article>
`;
      // card na tela -> lista de tarefas
      taskList.appendChild(card);

      card.querySelector(".btn-edit").addEventListener("click", async () => {
        this.openTaskModal("edit", task);
      });

      card
        .querySelector(".btn-delete-card")
        .addEventListener("click", async () => {
          const confirmDelete = confirm(
            "Tem certeza que deseja excluir essa tarefa?",
          );
          if (!confirmDelete) return;

          await api.deleteTask(task.id);
          this.loadTasks();
        });

      const checkbox = card.querySelector("input[type='checkbox']");
      checkbox.addEventListener("change", async () => {
        this.showLoading();
        try {
          await api.toggleTaskStatus(task.id);
          this.loadTasks();
        } finally {
          this.hideLoading();
        }
      });

      // para abrir o modal de edição ao clicar no card, mas não no checkbox nem nos botões se for mobile. Desktop não abre o modal ao clicar no card, apenas nos botões de editar
      const article = card.querySelector("article");
      article.addEventListener("click", (event) => {
        if (event.target.type === "checkbox") return;
        if (event.target.closest("button")) return;

        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        if (isDesktop) return;

        this.openTaskModal("edit", task);
      });
    });
  },

  async loadTasks(search = "", page = 1, append = false, filter = "") {
    this.showLoading();
    try {
      const taskList = document.getElementById("task-list");

      // antigo loading de tarefas, agora substituído por um spinner
      // if (!append) {
      //   taskList.innerHTML = "<li>Carregando tarefas...</li>";
      // }

      this.currentPage = page;
      const result = await api.fetchTasks(search, page, 5, filter);
      this.renderTasks(result.rows, append);

      // botão de carregar mais tarefas
      const loadMoreButton = document.getElementById("btn-load-more");
      const totalLoaded = append
        ? document.querySelectorAll("#task-list .task-card").length
        : result.rows.length;

      // possível contador para versão web
      const countAll = document.getElementById("count-all");
      const countToday = document.getElementById("count-today");
      const countPriority = document.getElementById("count-priority");
      const countCompleted = document.getElementById("count-completed");
      const countOverdue = document.getElementById("count-overdue");

      countAll.textContent = `· ${result.counts.total}`;
      countToday.textContent = `· ${result.counts.today}`;
      countPriority.textContent = `· ${result.counts.priority}`;
      countCompleted.textContent = `· ${result.counts.completed}`;
      countOverdue.textContent = `${result.counts.overdue} ATRASADAS`;

      //contador mobile no header
      const openCount = result.counts.uncompleted;
      document.getElementById("open-count").textContent = openCount;
      document.getElementById("today-count-header").textContent =
        result.counts.today;
      document.getElementById("open-count-desktop").textContent = openCount;

      if (totalLoaded >= result.count) {
        loadMoreButton.classList.add("hidden");
      } else {
        loadMoreButton.classList.remove("hidden");
      }
    } finally {
      this.hideLoading();
    }
  },

  openTaskModal(mode, taskData = null) {
    const modal = document.getElementById("task-modal");
    modal.classList.remove("hidden");

    const modalTitle = document.getElementById("modal-title");
    const submitButton = document.getElementById("btn-submit-task");
    const priorityButtons = document.querySelectorAll("[data-priority]");
    const deleteButton = document.getElementById("btn-delete-task");

    // num tindi muito bem, mas tá bom
    if (mode === "edit" && taskData) {
      deleteButton.classList.remove("hidden");
      modalTitle.textContent = "EDITAR TAREFA";
      submitButton.textContent = "SALVAR ALTERAÇÕES";
      document.getElementById("task-title").value = taskData.title;
      document.getElementById("task-description").value =
        taskData.description || "";
      document.getElementById("task-date").value = taskData.due_date
        ? taskData.due_date.split("T")[0]
        : "";

      selectedPriority = taskData.priority;
      document.getElementById("default-priority").textContent =
        `PRIORIDADE: ${priorityBadgeTexts[taskData.priority]}`;

      priorityButtons.forEach((button) => {
        button.classList.remove("bg-accent");
        if (button.dataset.priority === taskData.priority) {
          button.classList.add("bg-accent");
        }
      });

      // qual tarefa está sendo editada, pra quando clicar em salvar, ele saber qual atualizar
      modal.dataset.editingId = taskData.id;
    } else {
      deleteButton.classList.add("hidden");
      modalTitle.textContent = "NOVA TAREFA";
      submitButton.textContent = "CRIAR TAREFA";
      document.getElementById("task-form").reset();
      selectedPriority = "media";
      document.getElementById("default-priority").textContent =
        "PRIORIDADE: MÉDIA";

      priorityButtons.forEach((button) => {
        button.classList.remove("bg-accent");
        if (button.dataset.priority === "media") {
          button.classList.add("bg-accent");
        }
      });

      modal.dataset.editingId = "";
    }
  },

  closeTaskModal() {
    const modal = document.getElementById("task-modal");
    modal.classList.add("hidden");
  },

  setupPriorityButtons() {
    const buttons = document.querySelectorAll("[data-priority]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedPriority = button.dataset.priority;

        buttons.forEach((b) => b.classList.remove("bg-accent"));
        button.classList.add("bg-accent");

        document.getElementById("default-priority").textContent =
          `PRIORIDADE: ${selectedPriority.toUpperCase()}`;
      });
    });
  },

  // salva as alterações do formulário de criação/edição de tarefas
  setupTaskForm() {
    const form = document.getElementById("task-form");
    const modal = document.getElementById("task-modal");

    form.addEventListener("submit", async (event) => {
      this.showLoading();
      try {
        // cancela o comportamento padrão do formulário, que é recarregar a página
        event.preventDefault();

        const taskData = {
          title: document.getElementById("task-title").value,
          description: document.getElementById("task-description").value,
          due_date: document.getElementById("task-date").value,
          priority: selectedPriority,
        };

        const editingId = modal.dataset.editingId;

        if (editingId) {
          // try {
          console.log("editingId", editingId);
          await api.updateTask(editingId, taskData);
          // } catch (error) {
          //   console.log({ error });
          //   alert("Erro ao atualizar tarefa");
          //   throw error;
          // }
        } else {
          await api.createTask(taskData);
        }

        this.closeTaskModal();
        this.loadTasks("", 1, false, this.currentFilter);
      } finally {
        this.hideLoading();
      }
    });
  },

  setupDeleteButton() {
    const deleteButton = document.getElementById("btn-delete-task");
    const modal = document.getElementById("task-modal");

    deleteButton.addEventListener("click", async () => {
      this.showLoading();
      try {
        const confirmDelete = confirm(
          "Tem certeza que deseja excluir essa tarefa?",
        );
        if (!confirmDelete) return;

        const id = modal.dataset.editingId;
        await api.deleteTask(id);
        this.closeTaskModal();
        this.loadTasks();
      } finally {
        this.hideLoading();
      }
    });
  },

  // registra os eventos de clique nos botões de filtro
  // TODAS, HOJE, PRIORIDADE ALTA, CONCLUÍDAS
  setupFilterButtons() {
    const filterButtons = document.querySelectorAll("[data-filter]");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("bg-accent"));
        filterButtons.forEach((b) => b.classList.add("bg-divider"));
        button.classList.remove("bg-divider");
        button.classList.add("bg-accent");

        document.getElementById("search-input").value = "";
        document.getElementById("search-input-desktop").value = "";

        const filter = button.dataset.filter;
        this.currentFilter = filter;
        this.loadTasks("", 1, false, filter);
      });
    });
  },
};

export default ui;

//  <!-- <span class="md:hidden">${priorityIcons[task.priority]}</span> -->
// <!-- <span class="hidden md:inline">${priorityIcons[task.priority]}</span> -->
