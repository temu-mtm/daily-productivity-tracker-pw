const STORAGE_KEY = "daily-focus-tasks-v1";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  const remaining = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("totalCount").textContent = total;
  document.getElementById("doneCount").textContent = completed;
  document.getElementById("leftCount").textContent = remaining;
  document.getElementById("progressPercent").textContent = percent;
  document.getElementById("ringPercent").textContent = `${percent}%`;
  document.getElementById("progressRing").style.setProperty("--progress", `${percent}%`);
  document.getElementById("progressRing").setAttribute("aria-label", `${percent} percent complete`);

  const message = total === 0
    ? "A fresh start. Choose one task to begin."
    : percent === 100
      ? "Amazing work. You completed every task!"
      : `${remaining} task${remaining === 1 ? "" : "s"} left. Keep going!`;
  document.getElementById("progressMessage").textContent = message;

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "done") return task.completed;
    return true;
  });

  taskList.innerHTML = "";
  visibleTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item${task.completed ? " done" : ""}`;

    const check = document.createElement("button");
    check.className = "task-check";
    check.type = "button";
    check.textContent = task.completed ? "✓" : "";
    check.setAttribute("aria-label", task.completed ? "Mark task incomplete" : "Mark task complete");
    check.addEventListener("click", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.className = "delete-btn";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Delete ${task.text}`);
    remove.addEventListener("click", () => deleteTask(task.id));

    li.append(check, text, remove);
    taskList.appendChild(li);
  });

  emptyState.hidden = visibleTasks.length !== 0;
}

function addTask(text) {
  tasks.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    text,
    completed: false
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  render();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    render();
  });
});

const today = new Date();
document.getElementById("todayLabel").textContent =
  today.toLocaleDateString(undefined, { weekday: "long" }).toUpperCase();
document.getElementById("dateShort").textContent =
  today.toLocaleDateString(undefined, { month: "short", day: "numeric" });

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(() => console.log("Offline support is ready."))
      .catch(error => console.error("Service worker registration failed:", error));
  });
}

render();
