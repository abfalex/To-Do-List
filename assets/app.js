const taskForm = document.querySelector("#task-form");
const taskTitle = document.querySelector("#task-title");
const taskDescription = document.querySelector("#task-description");
const taskStatus = document.querySelector("#task-status");
const taskList = document.querySelector("#task-list");

const editModal = document.querySelector("#edit-modal");
const closeModalButton = document.querySelector(".close-modal");
const editTaskForm = document.querySelector("#edit-task-form");
const editTaskTitle = document.querySelector("#edit-task-title");
const editTaskDescription = document.querySelector("#edit-task-description");
const editTaskStatus = document.querySelector("#edit-task-status");

let tasks = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
let currentTaskId = null;

function generateId() {
    return Date.now().toString();
}

function saveTasks() {
    localStorage.setItem("items", JSON.stringify(tasks));
}

function sortTasks(tasks) {
    const statusOrder = { "in-progress": 1, "not-started": 2, "completed": 3 };
    return tasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
}

function renderTasks() {
    taskList.innerHTML = "";
    const sortedTasks = sortTasks(tasks);
    Array.from(sortedTasks).forEach(task => createTask(task));
}

function createTask(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task", task.status);
    taskElement.innerHTML = `
    <div class="task-header">
        <p class="task-status" ${task.status}>
            <h3 class="task-title-content">${task.title}</h3>
            <button class="edit-task">Edit</button>
            <button class="delete-task">Delete</button>
        </div>
        <p class="task-description-content">${task.description}</p>
    `;
    

    const deleteButton = taskElement.querySelector(".delete-task");
    deleteButton.addEventListener("click", () => deleteTask(task.id));
    
    const editButton = taskElement.querySelector(".edit-task");
    editButton.addEventListener("click", () => openEditModal(task.id));

    taskList.append(taskElement);
}

function addTask(title, description, status) {
    const newTask = {
        id: generateId(),
        title,
        description,
        status
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

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    currentTaskId = taskId;
    editTaskTitle.value = task.title;
    editTaskDescription.value = task.description;
    editModal.style.display = "flex";
}

function closeEditModal() {
    editModal.style.display = "none";
}

function saveEditedTask(event) {
    event.preventDefault();
    const task = tasks.find(t => t.id === currentTaskId);
    task.title = editTaskTitle.value;
    task.description = editTaskDescription.value;
    task.status = editTaskStatus.value;
    saveTasks();
    renderTasks();
    closeEditModal();
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    addTask(taskTitle.value, taskDescription.value, taskStatus.value);
    taskTitle.value = "";
    taskDescription.value = "";
})

closeModalButton.addEventListener("click", closeEditModal);
editTaskForm.addEventListener("submit", saveEditedTask);

window.addEventListener("click", (event) => {
    if (event.target === editModal) {
        closeEditModal();
    }
});

document.addEventListener("DOMContentLoaded", renderTasks);