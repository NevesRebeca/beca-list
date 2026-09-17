import api from "./api.js";
import ui from "./ui.js";
import { debounce } from "./debounce.js";

const searchInput = document.getElementById("search-input");
const searchInputDesktop = document.getElementById("search-input-desktop");
const debouncedSearch = debounce((text) => {
  ui.loadTasks(text, 1, false, ui.currentFilter);
}, 400);

const loadMoreButton = document.getElementById("btn-load-more");

searchInput.addEventListener("input", (event) => {
  debouncedSearch(event.target.value);
});
searchInputDesktop.addEventListener("input", (event) => {
  debouncedSearch(event.target.value);
});

ui.loadTasks();
ui.setupTaskForm();
ui.setupPriorityButtons();
ui.setupDeleteButton();
ui.setupFilterButtons();

document
  .getElementById("btn-new-task")
  .addEventListener("click", () => ui.openTaskModal("create"));

document
  .getElementById("btn-new-task-desktop")
  .addEventListener("click", () => ui.openTaskModal("create"));

document
  .getElementById("btn-close-modal")
  .addEventListener("click", () => ui.closeTaskModal());

loadMoreButton.addEventListener("click", () => {
  ui.loadTasks(searchInput.value, ui.currentPage + 1, true, ui.currentFilter);
});
