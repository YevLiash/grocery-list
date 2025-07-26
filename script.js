const form = document.querySelector(".form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const groceryContainer = document.querySelector(".grocery-container");
const groceryList = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// variables for editing grocery
let editElement;
let isEditing = false;
let editID = "";

// events
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);

window.addEventListener("DOMContentLoaded", setupItems);

function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if (value && !isEditing) {
    createListItem(id, value);
    showAlert("Item added", "successful");
    addToLocalStorage(id, value);
    resetToDefault();
  } else if (value && isEditing) {
    editElement.innerHTML = value;
    showAlert("Value changed", "successful");
    editLocalStorage(editID, value);
    resetToDefault();
  } else {
    showAlert("Empty value", "dangerous");
  }
}

// Functions
function showAlert(content, style) {
  alert.textContent = content;
  alert.classList.add(`alert-${style}`, "visible");

  setTimeout(() => {
    alert.classList.remove("visible");
    setTimeout(() => {
      alert.textContent = "";
      alert.classList.remove(`alert-${style}`);
    }, 400);
  }, 2000);
}

function resetToDefault() {
  grocery.value = "";
  isEditing = false;
  editID = "";
  submitBtn.textContent = "Submit";
}

function clearItems() {
  groceryList.innerHTML = "";
  groceryContainer.classList.remove("visible");
  localStorage.removeItem("list");
  resetToDefault();
}

function doneItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  element.classList.toggle("done");
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  setTimeout(() => {
    groceryList.removeChild(element);
    if (groceryList.children.length === 0) {
      groceryContainer.classList.remove("visible");
    }
  }, 300);
  showAlert("Item deleted", "dangerous");
  removeFromLocalStorage(id);
  resetToDefault();
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit element with getting the title of grocery
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set input value
  grocery.value = editElement.innerHTML;

  isEditing = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
}

// Local Storage
function getFromLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function addToLocalStorage(id, value) {
  const newGrocery = { id, value };
  let items = getFromLocalStorage();
  items.push(newGrocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function setupItems() {
  let items = getFromLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    groceryContainer.classList.add("visible");
  }
}

function createListItem(id, value) {
  const item = document.createElement("article");
  item.classList.add("grocery-item");

  item.setAttribute("data-id", id);

  item.innerHTML = `<p class="grocery-title">${value}</p>
            <div class="grocery-button-container">
              <button class="done-btn">
                <img
                  src="./icons/check_24dp_48D564_FILL0_wght400_GRAD0_opsz24.svg"
                  alt="done-icon"
                />
              </button>
              <button type="button" class="edit-btn">
                <img
                  src="./icons/edit_24dp_EAC452_FILL0_wght400_GRAD0_opsz24.svg"
                  alt="edit-icon"
                />
              </button>
              <button type="button" class="delete-btn">
                <img
                  src="./icons/delete_forever_24dp_BB271A_FILL0_wght400_GRAD0_opsz24.svg"
                  alt="delete-icon"
                />
              </button>
            </div>`;

  groceryList.appendChild(item);
  setTimeout(() => {
    item.classList.add("visible");
  }, 300);

  const doneBtn = item.querySelector(".done-btn");
  const editBtn = item.querySelector(".edit-btn");
  const deleteBtn = item.querySelector(".delete-btn");
  doneBtn.addEventListener("click", doneItem);
  editBtn.addEventListener("click", editItem);
  deleteBtn.addEventListener("click", deleteItem);

  groceryContainer.classList.add("visible");
}
