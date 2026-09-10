import api from "./api.js";

let selectedPriority = "media";

const priorityIcons = {
  alta: "⭡",
  media: "→",
  baixa: "⭣",
};

const priorityBadgeTexts = {
  alta: "ALTA",
  media: "MÉDIA",
  baixa: "BAIXA",
};

function isOverdue(task) {
  if (task.completed) return false;
  if (!task.due_date) return false;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const dueDate = new Date(task.due_date);
  dueDate.setUTCHours(0, 0, 0, 0);

  return dueDate < today;
}

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
  currentPage: 1,

  showLoading() {
    document.getElementById("loading-overlay").classList.remove("hidden");
  },

  hideLoading() {
    document.getElementById("loading-overlay").classList.add("hidden");
  },

  async testConnection() {
    const result = await api.test();
    document.getElementById("status").textContent = result.status;
  },

  async renderTasks(tasks, append = false) {
    const taskList = document.getElementById("task-list");

    if (!append) {
      taskList.innerHTML = "";
    }

    tasks.forEach((task) => {
      const card = document.createElement("li");
      card.innerHTML = `
 <article class="task-card bg-surface rounded-lg p-4 mb-4 border-r-4 border-accent-500 md:flex md:items-center md:justify-between md:border-r-0 md:border-l-4">
    <div class="md:gap-4 md:flex-1">
      <div class="flex justify-between">
        <div class="flex gap-2">
          <input type="checkbox" id="task-${task.id}" ${task.completed ? "checked" : ""}>
          <strong class="${task.completed ? "line-through opacity-50" : ""}">${task.title}</strong>
        </div>
        <span class="md:hidden">${priorityIcons[task.priority]}</span>
      </div>
      <p class="line-clamp-1 text-neutral-400 ${task.completed ? "opacity-50" : ""}">${task.description || ""}</p>
    </div>

    <footer class="flex gap-2 md:gap-3 md:items-center">
      ${isOverdue(task) ? '<span class="rounded-full px-3 py-1 bg-accent text-xs">ATRASADA</span>' : ""}
      <span class="rounded-full px-3 py-1 bg-divider text-xs">${formatDate(task.due_date)}</span>
      <span class="rounded-full px-3 py-1 bg-divider text-xs">${priorityBadgeTexts[task.priority]}</span>
      <span class="hidden md:inline">${priorityIcons[task.priority]}</span>
      <button type="button" class="hidden md:inline-block border border-divider rounded-lg px-4 py-2 text-xs font-bold btn-edit">EDITAR</button>
      <button type="button" class="hidden md:inline-block border border-accent text-accent rounded-lg px-4 py-2 text-xs font-bold btn-delete-card">EXCLUIR</button>
    </footer>
  </article>
`;

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

      const article = card.querySelector("article");
      article.addEventListener("click", (event) => {
        if (event.target.type === "checkbox") return;
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

      countAll.textContent = `· ${result.count}`;
      countToday.textContent = `· ${result.counts.today}`;
      countPriority.textContent = `· ${result.counts.priority}`;
      countCompleted.textContent = `· ${result.counts.completed}`;
      countOverdue.textContent = `${result.counts.overdue} ATRASADAS`;

      //contador mobile no header
      const openCount = result.count - result.counts.completed;
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

  setupTaskForm() {
    const form = document.getElementById("task-form");
    const modal = document.getElementById("task-modal");

    form.addEventListener("submit", async (event) => {
      this.showLoading();
      try {
        event.preventDefault();

        const taskData = {
          title: document.getElementById("task-title").value,
          description: document.getElementById("task-description").value,
          due_date: document.getElementById("task-date").value,
          priority: selectedPriority,
        };

        const editingId = modal.dataset.editingId;

        if (editingId) {
          await api.updateTask(editingId, taskData);
        } else {
          await api.createTask(taskData);
        }

        this.closeTaskModal();
        this.loadTasks();
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

  setupFilterButtons() {
    const filterButtons = document.querySelectorAll("[data-filter]");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("bg-accent"));
        filterButtons.forEach((b) => b.classList.add("bg-divider"));
        button.classList.remove("bg-divider");
        button.classList.add("bg-accent");

        const filter = button.dataset.filter;
        this.loadTasks("", 1, false, filter);
      });
    });
  },
};

export default ui;
