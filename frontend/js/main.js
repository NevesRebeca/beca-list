import api from "./api.js";
import ui from "./ui.js";

ui.loadTasks();
ui.setupTaskForm();
ui.setupPriorityButtons();
ui.setupDeleteButton();

document
  .getElementById("btn-new-task")
  .addEventListener("click", () => ui.openTaskModal("create"));

document
  .getElementById("btn-close-modal")
  .addEventListener("click", () => ui.closeTaskModal());
