import Stickies from "./Stickies";
import StickyNote from "./StickyNote";
import Storage from "./Storage";
import { format } from "date-fns";


// DOM Elements

const stickyNotesElement = document.querySelector(".sticky-notes-container");
const addNoteBtn = document.querySelector(".add-note-container");
const form = document.querySelector("form");
const inputField = document.querySelector("label input");
const textField = document.querySelector("label textarea");
const fields = [inputField, textField];
const dateElement = document.querySelector(".date-element");
const pinSubmitBtn = document.getElementById("pin-it-btn");
const maybeLaterSubmitBtn = document.getElementById("maybe-later-btn");

// DOM Creator Functions

const createStickyElement = (stickyObject) => {
  const stickyNote = document.createElement("div");
  stickyNote.classList.add("sticky-note");
  stickyNote.style.transform = `rotate(${getRandomDegree()}deg)`;

  const deleteBtn = document.createElement("button");
  deleteBtn.id = "delete-btn";

  const stickyTitle = document.createElement("div");
  stickyTitle.classList.add("sticky-title");
  stickyTitle.textContent = stickyObject.title;

  const stickyDescription = document.createElement("div");
  stickyDescription.classList.add("sticky-description");
  stickyDescription.textContent = "- " + stickyObject.description;

  const stickyDate = document.createElement("div");
  stickyDate.classList.add("sticky-date");
  stickyDate.textContent = formatDate(stickyObject.date);

  stickyNote.append(deleteBtn, stickyTitle, stickyDescription, stickyDate);

  // Listeners for sticky notes

  stickyTitle.addEventListener("click", (e) => {
    e.target.setAttribute("contenteditable", "true");
  });

  stickyTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      Storage.reTitleStickyNote(stickyObject, e.target.textContent);
      render();
    }
  });

  // Add a way to add more "bullet points" to sticky notes

  stickyDescription.addEventListener("click", (e) => {
    e.target.setAttribute("contenteditable", "true");
    const array = e.target.textContent.split(" ");
    e.target.textContent = array.pop();
  });

  stickyDescription.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      Storage.setNewDescription(stickyObject, e.target.textContent);
      render();
    }
  });

  deleteBtn.addEventListener("click", () => {
    Storage.deleteStickyNote(stickyObject);
    render();
  });

  return stickyNote;
};

// Handlers

function handleFormClass() {
  if (form.classList.contains("invisible")) {
    form.classList.remove("invisible");
  } else {
    form.classList.add("invisible");
  }
}

function emptyFields() {
  fields.forEach((field) => {
    field.value = "";
  });
}

// Listeners

addNoteBtn.addEventListener("click", () => {
  handleFormClass();
  emptyFields();
  formatTodayDateOnForm();
  inputField.focus();
});

pinSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputField.value === "" || textField.value === "") return;
  const newNote = new StickyNote(
    inputField.value,
    textField.value,
    dateElement.value
  );
  Storage.addStickyNote(newNote);
  handleFormClass();
  render();
});

maybeLaterSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleFormClass();
});

// Utils

const formatDate = (dateEntered) => {
  if (dateEntered === "") return;
  const date = format(new Date(dateEntered), "MMM dd yyyy");
  return "Complete by " + date;
};

const formatToday = () => {
  const dateToday = new Date().toDateString().split(" ");
  const date = format(new Date(dateToday), "MM/dd/yyyy");
  return date
};

const formatTodayDateOnForm = () => {
  const dateToday = new Date().toDateString().split(" ");
  const dateToEnter = dateToday.join("/");
  const fomattedDate = format(dateToEnter, "yyyy-MM-dd");
  dateElement.value = `${fomattedDate.toString()}`;
};

//Using this to place random tilt on sticky notes
const getRandomDegree = () => {
  const min = Math.ceil(-12);
  const max = Math.floor(12);

  return Math.floor(Math.random() * (max - min)) + min;
};

// MAIN RENDERING FUNCTION
function render() {
  stickyNotesElement.textContent = "";
  Storage.getStickyNotes()
    .getList()
    .map((sticky) => {
      stickyNotesElement.appendChild(createStickyElement(sticky));
    });
}

const test1 = new StickyNote("Example pin", "This is how your pins will look like! Edit me if you want or delete me using the red pin on top of the note!", `${formatToday()}`);

Storage.addStickyNote(test1);

render();
