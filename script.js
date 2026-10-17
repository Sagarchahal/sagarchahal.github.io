let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = task.text;

        if (task.completed) {
            text.classList.add("completed");
        }

        text.onclick = function() {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        };

        const del = document.createElement("button");
        del.textContent = "Delete";

        del.onclick = function() {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };

        li.append(text, del);
        list.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    const value = input.value.trim();

    if (!value) {
        alert("Please enter a task!");
        return;
    }

    tasks.push({ text: value, completed: false });
    saveTasks();
    renderTasks();
    input.value = "";
}

renderTasks();