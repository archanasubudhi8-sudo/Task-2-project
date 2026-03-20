let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Add Task
function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!text) {
        alert("Task cannot be empty!");
        return;
    }

    const task = {
        id: Date.now(),
        text,
        completed: false,
        priority,
        dueDate
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    document.getElementById("taskInput").value = "";
}

// Delete
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle Complete
function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks();
    renderTasks();
}

// Edit Task
function editTask(id) {
    const newText = prompt("Edit your task:");
    if (!newText) return;

    tasks = tasks.map(t =>
        t.id === id ? { ...t, text: newText } : t
    );

    saveTasks();
    renderTasks();
}

// Filter
function setFilter(type) {
    filter = type;
    renderTasks();
}

// Clear Completed
function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle("light");
}

// Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Get Filtered
function getTasks() {
    if (filter === "active") return tasks.filter(t => !t.completed);
    if (filter === "completed") return tasks.filter(t => t.completed);
    return tasks;
}

// Render
function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    getTasks().forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <div class="task-top">
                <span ondblclick="editTask(${task.id})"
                      onclick="toggleTask(${task.id})">
                      ${task.text}
                </span>

                <div>
                    <button onclick="deleteTask(${task.id})">❌</button>
                </div>
            </div>

            <div class="meta">
                <span class="${task.priority}">${task.priority}</span>
                | ${task.dueDate || "No date"}
            </div>
        `;

        list.appendChild(li);
    });

    updateStats();
}

// Stats
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    document.getElementById("total").innerText = total;
    document.getElementById("completed").innerText = completed;
    document.getElementById("active").innerText = total - completed;
}

// Enter Key Support
document.getElementById("taskInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTask();
});

// Init
renderTasks();