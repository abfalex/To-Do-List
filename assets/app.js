const taskForm = document.querySelector("#task-form");
const taskTitle = document.querySelector("#task-title");
const taskDescription = document.querySelector("#task-description");
const taskList = document.querySelector("#task-list");

let tasks = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];

function generateId() {
    return Date.now().toString();
}

function saveTasks() {
    localStorage.setItem("items", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    console.log(tasks, typeof tasks);
    Array.from(tasks).forEach(task => createTask(task));
}

function createTask(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.innerHTML = `
        <div class="task-header">
        <input type="checkbox" class="task-status" ${task.status ? "checked" : ""}>
            <h3 class="task-title-content">${task.title}</h3>
            <button class="edit-task">Edit</button>
            <button class="delete-task">Delete</button>
        </div>
        <p class="task-description-content">${task.description}</p>
    `;

    const deleteButton = taskElement.querySelector(".delete-task");
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    
    const editButton = taskElement.querySelector(".edit-task");
    editButton.addEventListener("click", () => editTask(task.id));

    const statusCheckbox = taskElement.querySelector(".task-status");
    statusCheckbox.addEventListener("click", () => toggleTaskStatus(task.id));

    taskList.append(taskElement);
}

function addTask(title, description) {
    const newTask = {
        id: generateId(),
        title,
        description,
        status: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const newTitle = prompt("Enter new title", task.title);
    const newDescription = prompt("Enter new description", task.description);
    if (newTitle && newDescription) {
        task.title = newTitle;
        task.description = newDescription;
        saveTasks();
        renderTasks();
    }
}

function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.status = !task.status;
    saveTasks();
    renderTasks();
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask(taskTitle.value, taskDescription.value);
    taskTitle.value = "";
    taskDescription.value = "";
})

document.addEventListener("DOMContentLoaded", renderTasks);