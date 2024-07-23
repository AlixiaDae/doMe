import Stickies from "./Stickies";
import StickyNote from "./StickyNote";
import { format } from "date-fns";

const stickies = new Stickies();

const test1 = new StickyNote("Test 1", "thisonenew", "06/02/2024");
const test2 = new StickyNote("Test 2", "adhfiudsh");
const test3 = new StickyNote("Test 3", "testing description");
stickies.addSticky(test1);
stickies.addSticky(test2);
stickies.addSticky(test3);

// DOM Elements

const content = document.querySelector(".content-container");
const addNoteBtn = document.querySelector(".add-note-container");
const form = document.querySelector("form");
const dateElement = document.querySelector(".date-element");
const pinSubmitBtn = document.getElementById("pin-it-btn");
const maybeLaterSubmitBtn = document.getElementById("maybe-later-btn");

// DOM Creator Functions

const createStickyNoteComponent = (stickyObject) => {
  const stickyNote = document.createElement("div");
  stickyNote.classList.add("sticky-note");

  const stickyTitle = document.createElement("div");
  stickyTitle.classList.add("sticky-title");
  stickyTitle.textContent = stickyObject.title;

  const stickyDescription = document.createElement("div");
  stickyDescription.classList.add("sticky-description");
  stickyDescription.textContent = "- " + stickyObject.description;

  const stickyDate = document.createElement("div");
  stickyDate.classList.add("sticky-date");
  stickyDate.textContent = formatDate(stickyObject.date);

  stickyNote.append(stickyTitle, stickyDescription, stickyDate);

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

// Listeners

addNoteBtn.addEventListener("click", handleFormClass);

maybeLaterSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    handleFormClass()
});

// Utils

const formatDate = (dateEntered) => {
  if (dateEntered === "") return;
  const date = format(new Date(dateEntered), "MMM dd yyyy");
  return date;
};

function render() {
  stickies.getList().map((sticky) => {
    content.appendChild(createStickyNoteComponent(sticky));
  });
}

render();
