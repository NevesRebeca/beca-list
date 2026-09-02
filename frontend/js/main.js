import api from "./api.js";
import ui from "./ui.js";
import { debounce } from "./debounce.js";

const searchInput = document.getElementById("search-input");
const debouncedSearch = debounce((texto) => {
  ui.loadTasks(texto);
}, 400);

searchInput.addEventListener("input", (event) => {
  debouncedSearch(event.target.value);
});

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
