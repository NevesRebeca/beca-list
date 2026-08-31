import api from "./api.js";

let selectedPriority = "media";

const priorityIcons = {
  alta: "⬆",
  media: "→",
  baixa: "⬇",
};

const textBadgesPriority = {
  alta: "ALTA",
  media: "MÉDIA",
  baixa: "BAIXA",
};

const ui = {
  async testConnection() {
    const result = await api.test();
    document.getElementById("status").textContent = result.status;
  },

  async renderTasks(tasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Limpa a lista antes de renderizar

    tasks.forEach((task) => {
      const card = document.createElement("li");
      card.innerHTML = `
      <article class="bg-surface rounded-lg p-4 mb-3 border-r-4 border-accent-500">
            <label for="task-${task.id}" class="flex justify-between">
              <div class="flex gap-2">
                <input type="checkbox" id="task-${task.id}" ${task.completed ? "checked" : ""}>
                <strong class="${task.completed ? "line-through opacity-50" : ""}">${task.title}</strong>
              </div>
              <span>${priorityIcons[task.priority]}</span>
            </label>
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

  AddingTaskToList(task) {},
};
export default ui;
