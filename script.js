"use strict";
const taskNameInput = document.querySelector("#taskName");
const taskDescInput = document.querySelector("#taskDescription");
const taskDateInput = document.querySelector("#taskDate");
const taskStatusInput = document.querySelector("#taskStatus");
const buttonAddTask = document.getElementById("addTaskBtn");
const taskListElement = document.querySelector(".tasklist-container__list");
let currentId = 1;
const taskList = [];
loadTasksFromLocalStorage();
buttonAddTask === null || buttonAddTask === void 0 ? void 0 : buttonAddTask.addEventListener("click", handleAddTask);
function handleAddTask() {
    if (taskNameInput) {
        const newTask = {
            id: currentId++,
            nome: taskNameInput.value,
            descricao: taskDescInput && taskDescInput.value
                ? taskDescInput.value
                : "A tarefa não tem descrição.",
            dataVencimento: taskDateInput && taskDateInput.value
                ? taskDateInput.value
                : "Sem prazo",
            completed: false,
        };
        taskRenderController(newTask);
        clearFieds();
        setLocalStorage();
    }
}
function taskRenderController(newTask) {
    const newTaskHTML = document.createElement("div");
    newTaskHTML.classList.add("task-item");
    newTaskHTML.innerHTML = taskHTMLRender(newTask);
    taskListElement === null || taskListElement === void 0 ? void 0 : taskListElement.appendChild(newTaskHTML);
    taskList.push(newTask);
    setDropdownBtnListener(newTaskHTML);
}
function taskHTMLRender(newTask) {
    const newTaskRender = `
    <div class="task-item__header">
        <div class="checkbox-task">
            <input type="checkbox" name="checkTask${newTask.id}" id="checkTask${newTask.id}" />
            <label for="checkTask${newTask.id}"></label>
        </div>
        <h2>${newTask.nome}</h2>
        <p class="${newTask.dataVencimento && isDueDate(newTask.dataVencimento)
        ? "due-date"
        : ""}">${newTask.dataVencimento}</p>
        <button class="dropdown-task">
            <i class="fa-solid fa-chevron-down"></i>
        </button>
    </div>
    <div class="task-item__body">
        <p>
            ${newTask.descricao}
        </p>
    </div>
  `;
    return newTaskRender;
}
function setDropdownBtnListener(task) {
    const btnDropdown = task.querySelector(".dropdown-task");
    btnDropdown === null || btnDropdown === void 0 ? void 0 : btnDropdown.addEventListener("click", function () {
        var _a, _b;
        (_b = (_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.classList.toggle("expanded");
    });
}
function clearFieds() {
    if (taskNameInput) {
        taskNameInput.value = "";
    }
    if (taskDescInput) {
        taskDescInput.value = "";
    }
    if (taskDateInput) {
        taskDateInput.value = "";
    }
    if (taskStatusInput) {
        taskStatusInput.value = "";
    }
}
function setLocalStorage() {
    const taskListToString = JSON.stringify(taskList);
    localStorage.setItem("taskList", taskListToString);
}
function loadTasksFromLocalStorage() {
    const localStorageData = localStorage.getItem("taskList");
    if (localStorageData) {
        const taskListReturned = JSON.parse(localStorageData);
        console.log(taskListReturned);
        taskListReturned.forEach((task) => {
            taskRenderController(task);
        });
    }
    if (taskList.length > 0) {
        let lastIndex = taskList.length - 1;
        // console.log("taskList.length" + taskList.length);
        // console.log("lastIndex" + lastIndex);
        currentId = lastIndex + 1;
        // console.log("currentId" + currentId);
    }
}
function isDueDate(dataVencimento) {
    const today = new Date();
    const settedData = new Date(dataVencimento);
    if (settedData < today) {
        return true;
    }
    else {
        return false;
    }
}
const taskElements = document.querySelectorAll(".task-item");
let selectedTask = null;
taskElements.forEach((element) => {
    element.addEventListener("click", function () {
        if (selectedTask && selectedTask !== this) {
            selectedTask.classList.remove("selected");
        }
        this.classList.add("selected");
        selectedTask = this;
        getTaskInfosToInputs(this);
    });
});
const buttonDeleteTask = document.querySelector("#removeTaskBtn");
const buttonEditTask = document.querySelector("#saveEditBtn");
buttonDeleteTask === null || buttonDeleteTask === void 0 ? void 0 : buttonDeleteTask.addEventListener("click", () => {
    var _a;
    if (selectedTask) {
        const indexToRemove = getTaskIndex(selectedTask);
        if (indexToRemove !== -1) {
            taskList.splice(indexToRemove, 1);
            (_a = selectedTask.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(selectedTask);
            selectedTask = null;
            setLocalStorage();
            clearFieds();
        }
        else {
            console.error("Índice inválido ao remover a tarefa.");
        }
    }
});
buttonEditTask === null || buttonEditTask === void 0 ? void 0 : buttonEditTask.addEventListener("click", () => {
    if (selectedTask) {
        const indexToEdit = getTaskIndex(selectedTask);
        if (taskNameInput && indexToEdit !== -1 && taskList[indexToEdit]) {
            const tempObject = {
                nome: taskNameInput.value,
                descricao: taskDescInput && taskDescInput.value
                    ? taskDescInput.value
                    : "A tarefa não tem descrição.",
                dataVencimento: taskDateInput && taskDateInput.value
                    ? taskDateInput.value
                    : "Sem prazo",
            };
            Object.assign(taskList[indexToEdit], tempObject);
            // Atualizar a interface
            const nameElement = selectedTask.querySelector(".task-item__header h2");
            const dateElement = selectedTask.querySelector(".task-item__header p");
            const descElement = selectedTask.querySelector(".task-item__body p");
            if (nameElement && nameElement instanceof HTMLElement) {
                nameElement.innerText = taskList[indexToEdit].nome;
            }
            if (dateElement && dateElement instanceof HTMLElement) {
                dateElement.innerText =
                    taskList[indexToEdit].dataVencimento || "Sem prazo";
            }
            if (descElement && descElement instanceof HTMLElement) {
                descElement.innerText =
                    taskList[indexToEdit].descricao || "A tarefa não tem descrição.";
            }
            setLocalStorage();
        }
        else {
            console.error("Índice inválido ou objeto não encontrado em taskList.");
        }
    }
});
const taskListWrapper = document.querySelector(".tasklist-container");
taskListWrapper === null || taskListWrapper === void 0 ? void 0 : taskListWrapper.addEventListener("click", (event) => {
    if (selectedTask && !selectedTask.contains(event.target)) {
        selectedTask.classList.remove("selected");
        selectedTask = null;
        clearFieds();
    }
});
function getTaskInfosToInputs(task) {
    var _a, _b, _c;
    const taskName = (_a = task.querySelector("h2")) === null || _a === void 0 ? void 0 : _a.innerText;
    const taskDesc = (_b = task
        .querySelector(".task-item__body p")) === null || _b === void 0 ? void 0 : _b.innerText.trim();
    const taskDate = (_c = task.querySelector(".task-item__header p")) === null || _c === void 0 ? void 0 : _c.innerText;
    const taskStatus = task.querySelector('input[type="checkbox"]');
    const taskStatusString = (taskStatus === null || taskStatus === void 0 ? void 0 : taskStatus.checked)
        ? "Completada"
        : "Não completada";
    if (taskNameInput && taskName) {
        taskNameInput.value = taskName;
    }
    if (taskDescInput && taskDesc) {
        taskDescInput.value = taskDesc;
    }
    if (taskDateInput && taskDate) {
        if (taskDate === "Sem prazo") {
            taskDateInput.value = "";
        }
        else {
            taskDateInput.value = taskDate;
        }
    }
    if (taskStatusInput && taskStatus) {
        taskStatusInput.value = taskStatusString;
    }
}
function getTaskIndex(task) {
    const taskElements = Array.from(document.querySelectorAll(".task-item"));
    return taskElements.indexOf(task);
}
