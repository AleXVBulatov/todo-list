// =================================================
// ----------------- localStorage ------------------

const ref = {
  buttonEdit: document.querySelector(".js-edit"),
  title: document.querySelector(".js-title"),
  inputTitle: document.querySelector(".js-inputTitle"),
  input: document.querySelector(".js-input"),
  itemsList: document.querySelector(".js-items-list"),
  buttonAdd: document.querySelector(".js-button-add"), 
  buttonRem: document.querySelector(".js-button-rem"),
  modal: document.querySelector(".js-modal"),
}
const { buttonEdit, title, input, inputTitle, itemsList, buttonAdd, buttonRem, modal } = ref;
// console.log(title, input, itemsList, buttonAdd, buttonRem);

let items = JSON.parse(localStorage.getItem("items")) || [];  // взять значения из localStorage
// console.log(items);
title.textContent = localStorage.getItem("titleLocal") || title.textContent; // взять значения из localStorage
// console.log(title);
console.log(modal);

// Проверка для включения prompt
function editTitle() {
  inputTitle.classList.toggle("hidden");
  inputTitle.focus();
  if (inputTitle.value.length === 0) {
    return;
  };
  title.textContent = inputTitle.value;

  localStorage.setItem("titleLocal", title.textContent);
  inputTitle.value = "";
};


// Добавить фокус на input 
input.addEventListener("focus", () => {
  input.style.outline = "3px solid rgb(131, 85, 0)";
});

// Убрать фокус с input 
input.addEventListener("blur", () => {
  input.style.outline = "none";
});

// Убрать фокус с input 
window.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    input.blur() // снять фокус с инпута
  };
});


// функция удаления класса с кнопку
function activeBtnAdd() {
  // console.log(input.value.length > 0);
  if (input.value.length > 0) {
    buttonAdd.classList.remove("disabled");
  } else {
    buttonAdd.classList.add("disabled");
  }; 
};

// функция устанавливает активность кнопки очистить 
function activeBtnRem() {
  if (items.length !== 0) {
    buttonRem.classList.remove("disabled");
  } else {
    buttonRem.classList.add("disabled")
  };
};


// функция добавления элементов в список (по кнопке добавить)
function addItem() {
  if (input.value.length !== 0) {
    const text = input.value;
    const item = {
      text: text,
      checked: false,
    }
    items.push(item);
    // console.log(item);
    // console.log(items);
    localStorage.setItem("items", JSON.stringify(items)); // записать значения в localStorage
    displayItems(items, itemsList);
    input.value = "";

    buttonAdd.classList.add("disabled");
  }; 
};


// функция добавления элементов в список (по кнопке Enter)
function addItemEnter(event) {
  // console.log(event.code);
  if ((event.code === "Enter" || event.code === "NumpadEnter") && input.value.length !== 0) {
    addItem();
  } else if ((event.code === "Enter" || event.code === "NumpadEnter") && inputTitle.value.length !== 0) {
    editTitle();
  } else {
    return
  };
};


// функция очистки всего списка (по кнопке удалить)
function removeList(event) {
  if (buttonRem.classList.contains("disabled")) {
    return;
  };
  if (event.target.nodeName === "BUTTON") {
    const answer = confirm("Вы точно хотите очистить весь список?");
    if (answer) {
      items = [];
    };
  };
  localStorage.setItem("items", JSON.stringify(items)); // записать значения в localStorage
  displayItems(items, itemsList);
};



// функция добавления списка
function displayItems(items, itemsList) {
  // console.log(items, itemsList);
  itemsList.innerHTML = items.map((item, index) => {
    return `
    <li>
      <input type="checkbox" id="item${index}" class="input-check" data-index="${index}" ${item.checked ? "checked" : "" } />        
      <label for="item${index}" ${item.checked ? "class='list-through'" : ""}>${index + 1}. ${item.text}</label>
      <i ${item.checked ? "class='icon-cancel js-button-cansel'" : ""} data-index="${index}"></i>  
    </li>`;
  }).join("");

  activeBtnRem();
};


// функция добавления checked в input 
function toggleClick(event) {
  // console.log(event);
  // console.log(event.target);
  // console.log(event.target.checked);
  if (!event.target.matches("input")) {
    return;
  };
  // console.log(event.target.dataset.index);
  const element = event.target.dataset.index;
  items[element].checked = !items[element].checked; // поменять значение на противоположное

  localStorage.setItem("items", JSON.stringify(items)); // записать значения в localStorage

  displayItems(items, itemsList);
};


// Не работает!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function btnCancel(event) {
  // console.log(event.target);
  // console.log(event.target.matches("i"));
  if (!event.target.matches("i")) {
    return;
  };
  const element = event.target.dataset.index;
  console.log(element);

  items.splice(element, 1);
  localStorage.setItem("items", JSON.stringify(items)); // записать значения в localStorage
  displayItems(items, itemsList);
};


// Всплытие моддального окна
function modalOpenClose(event) {
  if (event.target.nodeName === "I") {
    modal.classList.toggle("hidden");
  };
};
buttonEdit.addEventListener("mouseover", modalOpenClose);
buttonEdit.addEventListener("mouseout", modalOpenClose);

// Слушатели событий
itemsList.addEventListener("click", btnCancel);
buttonEdit.addEventListener("click", editTitle);
input.addEventListener("input", activeBtnAdd);
buttonAdd.addEventListener("click", addItem);
window.addEventListener("keydown", addItemEnter);
buttonRem.addEventListener("click", removeList);
itemsList.addEventListener("click", toggleClick);

displayItems(items, itemsList); // для отображения списка после перезагрузки страницы



// Всплытие моддального окна
// buttonEdit.addEventListener("mouseover", (event) => {
//   // console.log(event.target.nodeName);
//   if (event.target.nodeName === "I") {
//     modal.classList.remove("hidden");
//   };
// });
// buttonEdit.addEventListener("mouseout", (event) => {
//   // console.log(event.target.nodeName);
//   if (event.target.nodeName === "I") {
//     modal.classList.add("hidden");
//   };
// });