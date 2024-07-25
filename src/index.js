import { format } from "date-fns";
import "./styles.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

// FIREBASE

const firebaseConfig = {
  apiKey: "AIzaSyAI-DheX8imePx6Nr27yutHquK4EI42kxg",
  authDomain: "fir-tutorial-fb9ff.firebaseapp.com",
  projectId: "fir-tutorial-fb9ff",
  storageBucket: "fir-tutorial-fb9ff.appspot.com",
  messagingSenderId: "386305329607",
  appId: "1:386305329607:web:e4c062f3d859752183b1e2",
};

initializeApp(firebaseConfig);

const db = getFirestore();
const colRef = collection(db, "pins");

// DOM Elements

const stickyNotesElement = document.querySelector(".sticky-notes-container");
const addNoteBtn = document.querySelector(".add-note-container");
const form = document.querySelector("form");
const inputField = document.querySelector("label input");
const textField = document.querySelector("label textarea");
const fields = [inputField, textField];
const dateElement = document.querySelector(".date-element");
const maybeLaterSubmitBtn = document.getElementById("maybe-later-btn");

// DOM Creator Functions

const createStickyElement = (stickyObject, id) => {
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

  // Ref for firestore
  const stickyRef = doc(db, "pins", id);

  // Listeners for sticky notes

  stickyTitle.addEventListener("click", (e) => {
    e.target.setAttribute("contenteditable", "true");
  });

  stickyTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      updateDoc(stickyRef, {
        title: e.target.textContent,
      });
    }
  });

  stickyDescription.addEventListener("click", (e) => {
    e.target.setAttribute("contenteditable", "true");
    const arr = e.target.textContent.split(" ");
    arr.shift();
    e.target.textContent = arr;
  });

  stickyDescription.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      updateDoc(stickyRef, {
        description: e.target.textContent,
      });
    }
  });

  deleteBtn.addEventListener("click", () => {
    const docRef = doc(db, "pins", id);
    deleteDoc(docRef);
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: form.title.value,
    description: form.description.value,
    date: formatDate(form.date.value),
  }).then(() => {
    emptyFields();
  });

  handleFormClass();
});

maybeLaterSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handleFormClass();
});

// Utils

// this is for the pin itself
const formatDate = (dateEntered) => {
  if (dateEntered === "") return;
  const date = format(new Date(dateEntered), "MMM dd yyyy");
  return "Complete by " + date;
};

// this makes date on pin default to current date
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

// MAIN RENDERING FUNCTION using Firebase

onSnapshot(colRef, (snapshot) => {
  stickyNotesElement.textContent = "";
  snapshot.docs.forEach((doc) => {
    stickyNotesElement.appendChild(createStickyElement(doc.data(), doc.id));
  });
});
