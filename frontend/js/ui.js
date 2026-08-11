import api from "./api.js";

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
};
export default ui;
