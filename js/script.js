// =================================================
// ----------------- localStorage ------------------

const ref = {
  body: document.querySelector("body"),
  buttonEdit: document.querySelector(".js-edit"),
  title: document.querySelector(".js-title"),
  inputTitle: document.querySelector(".js-inputTitle"),
  input: document.querySelector(".js-input"),
  itemsList: document.querySelector(".js-items-list"),
  buttonAdd: document.querySelector(".js-button-add"), 
  buttonRem: document.querySelector(".js-button-rem"),
  modal: document.querySelector(".js-modal"),
  btn: document.querySelector(".js-button-edit"), 
}
const { body, buttonEdit, title, input, inputTitle, itemsList, buttonAdd, buttonRem, modal, btn } = ref;
// console.log(title, input, itemsList, buttonAdd, buttonRem);

let items = JSON.parse(localStorage.getItem("items")) || [];  // взять значения из localStorage
// console.log(items);
title.textContent = localStorage.getItem("titleLocal") || title.textContent; // взять значения из localStorage
// console.log(title);


// Всплытие инпута
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

// Скрыть всплытие инпута
function closeInputTitle(event) {
  if (event.target.nodeName !== "I" && !inputTitle.classList.contains("hidden") && event.target.nodeName !== "INPUT") {
    inputTitle.value = ""
    inputTitle.classList.toggle("hidden");
    return;
  };  
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


// функция если в инпуте больше 0 символов, то удалить с кнопки disabled
function activeBtnAdd() {
  // console.log(input.value.length > 0);
  if (input.value.length > 0) {
    buttonAdd.classList.remove("disabled");
    btn.classList.remove("disabled");
  } else {
    buttonAdd.classList.add("disabled");
    btn.classList.add("disabled");
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

  if ((event.code === "Enter" || event.code === "NumpadEnter") && input.value.length !== 0 && btn.classList.contains("hidden")) {
    addItem();

  } else if ((event.code === "Enter" || event.code === "NumpadEnter") && input.value.length !== 0 && buttonAdd.classList.contains("hidden")) {
    edit();

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
      <i ${!item.checked ? "class='icon-pencil js-button-pencil'" : ""} data-index="${index}"></i>  
      <i ${item.checked ? "class='icon-cross js-button-cansel'" : ""} data-index="${index}"></i>  
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
  if (buttonAdd.classList.contains("hidden")) {
    return;
  }
  console.log(event.target.dataset.index);
  const element = event.target.dataset.index;
  items[element].checked = !items[element].checked; // поменять значение на противоположное
  event.target.classList.toggle("disabled");

  localStorage.setItem("items", JSON.stringify(items)); // записать значения в localStorage

  displayItems(items, itemsList);  
  input.value = "";
  buttonAdd.classList.add("disabled");
};


// функция удаления и редактирования элементов списка
function btnCancel(event) {
  // console.log(event.target);
  // console.log(event.target.classList);
  // console.log(event.target.matches("i"));
  if (!event.target.matches("i")) {
    return;
  };

  if (event.target.classList.contains('js-button-cansel') && buttonAdd.classList.contains("disabled")) {
    const element = event.target.dataset.index;
    // console.log(element);
    items.splice(element, 1);

    localStorage.setItem("items", JSON.stringify(items)); // записать значения в localStorage
    displayItems(items, itemsList);

    window.addEventListener("keydown", addItemEnter);
    return
  };
// =============================================
  console.log(event.currentTarget);
  const LabelRef = itemsList.querySelectorAll("label");
  console.log(LabelRef);
  const element = event.target.dataset.index;
  console.log(element);
  console.log(LabelRef[element]);
// =============================================
  if (event.target.classList.contains('js-button-pencil') && buttonAdd.classList.contains("disabled")) {
    // console.log(input.value.length);
    const element = event.target.dataset.index;
    // console.log(element);
    const needLabelRef = itemsList.querySelectorAll("label")[element];
    // console.log(needLabelRef);
    
    if (input.value.length === 0 && !needLabelRef.classList.contains("colored")) {
      const editText = input.value = items[element].text;
      // console.log(editText); // Получили в переменную текст
      needLabelRef.classList.add("colored");
      btn.classList.remove("hidden");
      btn.classList.remove("disabled");
      buttonAdd.classList.add("hidden");
      input.focus();
      return;
    };

    activeBtnAdd();    
    if (input.value.length > 0 && btn.classList.contains("hidden")) {
      // console.log(element);
      input.value = ""; 
      // console.log(editText); // Получили в переменную текст
      needLabelRef.classList.remove("colored");
      btn.classList.add("hidden");
      buttonAdd.classList.remove("hidden");
      buttonAdd.classList.add("disabled");
      return
    };
  };
};


// Функция по работа кнопки Изменить
function edit() {
  // console.log(event.target);
  if (btn.classList.contains("disabled")) {
    return;
  };
  const editText = input.value;
  // console.log(editText);

  const labelRef = itemsList.querySelectorAll("label");
  // console.log(labelRef);

  let needelem;

  labelRef.forEach((elem, index) => {
    // console.log(elem);
    if (elem.classList.contains("colored")) {
      needelem = index;
    };
    return needelem;
  });
  // console.log(needelem);

  // console.log(items[needelem].text);
  items[needelem].text = input.value

  localStorage.setItem("items", JSON.stringify(items)); // записать значения в localStorage
  displayItems(items, itemsList);
  input.value = "";
  btn.classList.toggle("hidden");
  buttonAdd.classList.toggle("hidden");
  buttonAdd.classList.add("disabled");
  window.addEventListener("keydown", addItemEnter);
};


// Функция по работа кнопки Escape
function enterEsc(event) {
  // console.log(buttonAdd.classList.contains("hidden"));
  if (event.code === "Escape" && buttonAdd.classList.contains("hidden")) {
    input.value = "";
    inputTitle.value = "";
    buttonAdd.classList.add("disabled");
    buttonAdd.classList.remove("hidden");
    inputTitle.classList.add("hidden");
    btn.classList.add("hidden");

    // Для удаления выделения вета при нажатии ESC
    const labelRef = itemsList.querySelectorAll("label");
    // console.log(labelRef);

    labelRef.forEach((elem, index) => {
      if (elem.classList.contains("colored")) {
        elem.classList.remove("colored");
      };
    });
    window.addEventListener("keydown", addItemEnter);
  } else if (event.code === "Escape" && !buttonAdd.classList.contains("disabled")) {
    input.value = "";
    inputTitle.value = "";
    inputTitle.classList.add("hidden");
    buttonAdd.classList.add("disabled");
  } else if (event.code === "Escape") {
    input.value = "";
    inputTitle.value = "";
    inputTitle.classList.add("hidden");
  };
};


function enterDel(event) {
  if (event.code === "Delete") {
    input.value = "";
    inputTitle.value = "";
  };
  activeBtnAdd();
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
body.addEventListener("click", closeInputTitle); // Слушатель на скрытие inputTitle 
itemsList.addEventListener("click", btnCancel); // Слушатель на редактирование и удаление элементов списка
buttonEdit.addEventListener("click", editTitle); // Слушатель на редактирование заглавия
input.addEventListener("input", activeBtnAdd); // Слушатель на добавление или удаления класса на кнопки disabled
btn.addEventListener("click", edit); // Слушатель на кнопку изменить
buttonAdd.addEventListener("click", addItem);
window.addEventListener("keydown", enterDel); // Слушатель на клавишу Del
window.addEventListener("keydown", enterEsc); // Слушатель на клавишу ESC
window.addEventListener("keydown", addItemEnter);
buttonRem.addEventListener("click", removeList);
itemsList.addEventListener("click", toggleClick);

displayItems(items, itemsList); // для отображения списка после перезагрузки страницы


