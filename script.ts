interface Task {
  id: number;
  nome: string;
  descricao?: string;
  dataVencimento?: string;
  completed: boolean;
}

const taskNameInput = document.querySelector<HTMLInputElement>("#taskName");
const taskDescInput =
  document.querySelector<HTMLTextAreaElement>("#taskDescription");
const taskDateInput = document.querySelector<HTMLInputElement>("#taskDate");
const taskStatusInput = document.querySelector<HTMLInputElement>("#taskStatus");
const buttonAddTask = document.getElementById("addTaskBtn");
const taskListElement = document.querySelector<HTMLElement>(
  ".tasklist-container__list"
);

let currentId = 1;

const taskList: Task[] = [];

loadTasksFromLocalStorage();

buttonAddTask?.addEventListener("click", handleAddTask);

function handleAddTask() {
  if (taskNameInput) {
    const newTask: Task = {
      id: currentId++,
      nome: taskNameInput.value,
      descricao:
        taskDescInput && taskDescInput.value
          ? taskDescInput.value
          : "A tarefa não tem descrição.",
      dataVencimento:
        taskDateInput && taskDateInput.value
          ? taskDateInput.value
          : "Sem prazo",
      completed: false,
    };

    taskRenderController(newTask);
    clearFieds();
    setLocalStorage();
  }
}

function taskRenderController(newTask: Task) {
  const newTaskHTML = document.createElement("div");
  newTaskHTML.classList.add("task-item");
  newTaskHTML.innerHTML = taskHTMLRender(newTask);
  taskListElement?.appendChild(newTaskHTML);
  taskList.push(newTask);
  setDropdownBtnListener(newTaskHTML);
}

function taskHTMLRender(newTask: Task): string {
  const newTaskRender = `
    <div class="task-item__header">
        <div class="checkbox-task">
            <input type="checkbox" name="checkTask${newTask.id}" id="checkTask${
    newTask.id
  }" />
            <label for="checkTask${newTask.id}"></label>
        </div>
        <h2>${newTask.nome}</h2>
        <p class="${
          newTask.dataVencimento && isDueDate(newTask.dataVencimento)
            ? "due-date"
            : ""
        }">${newTask.dataVencimento}</p>
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

function setDropdownBtnListener(task: HTMLElement) {
  const btnDropdown = task.querySelector(".dropdown-task");
  btnDropdown?.addEventListener("click", function (this: HTMLButtonElement) {
    this.parentElement?.parentElement?.classList.toggle("expanded");
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
    const taskListReturned: Task[] = JSON.parse(localStorageData);

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

function isDueDate(dataVencimento: string) {
  const today = new Date();
  const settedData = new Date(dataVencimento);

  if (settedData < today) {
    return true;
  } else {
    return false;
  }
}

const taskElements = document.querySelectorAll(".task-item");
let selectedTask: HTMLElement | null = null;

taskElements.forEach((element) => {
  element.addEventListener("click", function (this: HTMLElement) {
    if (selectedTask && selectedTask !== this) {
      selectedTask.classList.remove("selected");
    }

    this.classList.add("selected");
    selectedTask = this;
    getTaskInfosToInputs(this);
  });
});

const buttonDeleteTask =
  document.querySelector<HTMLButtonElement>("#removeTaskBtn");
const buttonEditTask =
  document.querySelector<HTMLButtonElement>("#saveEditBtn");

buttonDeleteTask?.addEventListener("click", () => {
  if (selectedTask) {
    const indexToRemove = getTaskIndex(selectedTask);

    if (indexToRemove !== -1) {
      taskList.splice(indexToRemove, 1);
      selectedTask.parentNode?.removeChild(selectedTask);
      selectedTask = null;

      setLocalStorage();
      clearFieds();
    } else {
      console.error("Índice inválido ao remover a tarefa.");
    }
  }
});

buttonEditTask?.addEventListener("click", () => {
  if (selectedTask) {
    const indexToEdit = getTaskIndex(selectedTask);

    if (taskNameInput && indexToEdit !== -1 && taskList[indexToEdit]) {
      const tempObject = {
        nome: taskNameInput.value,
        descricao:
          taskDescInput && taskDescInput.value
            ? taskDescInput.value
            : "A tarefa não tem descrição.",
        dataVencimento:
          taskDateInput && taskDateInput.value
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
    } else {
      console.error("Índice inválido ou objeto não encontrado em taskList.");
    }
  }
});

const taskListWrapper = document.querySelector<HTMLElement>(
  ".tasklist-container"
);
taskListWrapper?.addEventListener("click", (event: MouseEvent) => {
  if (selectedTask && !selectedTask.contains(event.target as Node)) {
    selectedTask.classList.remove("selected");
    selectedTask = null;
    clearFieds();
  }
});

function getTaskInfosToInputs(task: HTMLElement) {
  const taskName = task.querySelector("h2")?.innerText;
  const taskDesc = task
    .querySelector<HTMLParagraphElement>(".task-item__body p")
    ?.innerText.trim();
  const taskDate = task.querySelector<HTMLParagraphElement>(
    ".task-item__header p"
  )?.innerText;
  const taskStatus = task.querySelector<HTMLInputElement>(
    'input[type="checkbox"]'
  );

  const taskStatusString = taskStatus?.checked
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
    } else {
      taskDateInput.value = taskDate;
    }
  }

  if (taskStatusInput && taskStatus) {
    taskStatusInput.value = taskStatusString;
  }
}

function getTaskIndex(task: HTMLElement): number {
  const taskElements = Array.from(document.querySelectorAll(".task-item"));
  return taskElements.indexOf(task);
}
