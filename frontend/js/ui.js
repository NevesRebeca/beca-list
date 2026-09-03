import api from "./api.js";

let selectedPriority = "media";

const priorityIcons = {
  alta: "⭡",
  media: "→",
  baixa: "⭣",
};

const textBadgesPriority = {
  alta: "ALTA",
  media: "MÉDIA",
  baixa: "BAIXA",
};

const ui = {
  currentPage: 1,

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
  <article class="task-card bg-surface rounded-lg p-4 mb-3">
    <div class="flex justify-between">
      <div class="flex gap-2">
        <input type="checkbox" id="task-${task.id}" ${task.completed ? "checked" : ""}>
        <strong class="${task.completed ? "line-through opacity-50" : ""}">${task.title}</strong>
      </div>
      <span>${priorityIcons[task.priority]}</span>
    </div>
    <p class="line-clamp-1 text-neutral-400 ${task.completed ? "opacity-50" : ""}">${task.description || ""}</p>
    <footer class="flex gap-2">
      <span class="rounded-full px-3 py-1 bg-divider text-xs">${task.due_date || "Sem data"}</span>
      <span class="rounded-full px-3 py-1 bg-divider text-xs">${textBadgesPriority[task.priority]}</span>
    </footer>
  </article>
`;

      taskList.appendChild(card);

      const checkbox = card.querySelector("input[type='checkbox']");
      checkbox.addEventListener("change", async () => {
        await api.toggleTaskStatus(task.id);
        this.loadTasks();
      });

      const article = card.querySelector("article");
      article.addEventListener("click", (event) => {
        if (event.target.type === "checkbox") return;
        this.openTaskModal("edit", task);
      });
    });
  },

  async loadTasks(search = "", page = 1, append = false) {
    const taskList = document.getElementById("task-list");

    if (!append) {
      taskList.innerHTML = "<li>Carregando tarefas...</li>";
    }

    this.currentPage = page;
    const result = await api.fetchTasks(search, page);
    this.renderTasks(result.rows, append);

    const loadMoreButton = document.getElementById("btn-load-more");
    const totalLoaded = append
      ? document.querySelectorAll("#task-list .task-card").length
      : result.rows.length;

    if (totalLoaded >= result.count) {
      loadMoreButton.classList.add("hidden");
    } else {
      loadMoreButton.classList.remove("hidden");
    }
  },

  openTaskModal(mode, taskData = null) {
    const modal = document.getElementById("task-modal");
    modal.classList.remove("hidden");

    const modalTitle = document.getElementById("modal-title");
    const submitButton = document.getElementById("btn-submit-task");
    const priorityButtons = document.querySelectorAll("[data-prioridade]");
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
      document.getElementById("prioridade-padrao").textContent =
        `PRIORIDADE: ${textBadgesPriority[taskData.priority]}`;

      priorityButtons.forEach((button) => {
        button.classList.remove("bg-accent");
        if (button.dataset.prioridade === taskData.priority) {
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
      document.getElementById("prioridade-padrao").textContent =
        "PRIORIDADE: MÉDIA";

      priorityButtons.forEach((button) => {
        button.classList.remove("bg-accent");
        if (button.dataset.prioridade === "media") {
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
    const buttons = document.querySelectorAll("[data-prioridade]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedPriority = button.dataset.prioridade;

        buttons.forEach((b) => b.classList.remove("bg-accent"));
        button.classList.add("bg-accent");

        document.getElementById("prioridade-padrao").textContent =
          `PRIORIDADE: ${selectedPriority.toUpperCase()}`;
      });
    });
  },

  setupTaskForm() {
    const form = document.getElementById("task-form");
    const modal = document.getElementById("task-modal");

    form.addEventListener("submit", async (event) => {
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
    });
  },

  setupDeleteButton() {
    const deleteButton = document.getElementById("btn-delete-task");
    const modal = document.getElementById("task-modal");

    deleteButton.addEventListener("click", async () => {
      const confirmDelete = confirm(
        "Tem certeza que deseja excluir essa tarefa?",
      );
      if (!confirmDelete) return;

      const id = modal.dataset.editingId;
      await api.deleteTask(id);
      this.closeTaskModal();
      this.loadTasks();
    });
  },
};

export default ui;
