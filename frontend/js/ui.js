import api from "./api.js";

let selectedPriority = "media";

const ui = {
  async testConnection() {
    const result = await api.test();
    document.getElementById("status").textContent = result.status;
  },

  async renderTasks(tasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Limpa a lista antes de renderizar
    tasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.textContent = task.title;
      taskList.appendChild(taskItem);
    });
  },

  async loadTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "<li>Carregando tarefas...</li>";

    const tasks = await api.fetchTasks();
    this.renderTasks(tasks);
  },

  openTaskModal(mode) {
    const modal = document.getElementById("task-modal");
    if (mode === "create") {
      modal.classList.remove("hidden");
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

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const taskData = {
        title: document.getElementById("task-title").value,
        description: document.getElementById("task-description").value,
        due_date: document.getElementById("task-date").value,
        priority: selectedPriority,
      };

      await api.createTask(taskData);
      this.closeTaskModal();
      this.loadTasks();
    });
  },
};
export default ui;
