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
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

// DOM Elements

const userH1 = document.querySelector(".user-container h1");
const stickyNotesElement = document.querySelector(".sticky-notes-container");
const addNoteBtn = document.querySelector(".add-note-container");
const pinForm = document.querySelector(".add");
const signUpAuth = document.querySelector(".sign-up");
const signUpForm = document.querySelector(".sign-up-form");
const signUpLater = document.querySelector(".sign-up-later-btn");
const logInForm = document.querySelector(".log-in-form");
const logIn = document.querySelector(".log-in");
const logOut = document.querySelector(".log-out");
const inputField = document.querySelector("label input");
const textField = document.querySelector("label textarea");
const fields = [inputField, textField];
const dateElement = document.querySelector(".date-element");
const maybeLaterSubmitBtn = document.getElementById("maybe-later-btn");

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
const auth = getAuth();
let currentUser;

signUpAuth.addEventListener("click", () => {
  handleSignUpFormClass();
});

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm.email.value;
  const password = signUpForm.password.value;
  const userName = signUpForm.username.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      let userID = cred.user.uid;
      const data = { id: userID, email: email, username: userName };
      const db = getFirestore();
      const userRef = doc(db, "users", userID);
      setDoc(userRef, data)
        .then(() => {
          //console.log("Collection doc created!")
        })
        .catch((err) => console.log(err.message));
      signUpForm.reset();
    })
    .catch((err) => console.log(err.message));
  handleSignUpFormClass();
});

signUpLater.addEventListener("click", (e) => {
  e.preventDefault();
  handleSignUpFormClass();
});

logIn.addEventListener("click", () => {
  handleLogInFormClass();
});

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
    const db = getFirestore();
    const docRef = doc(db, "users", currentUser, "pins", id);
    deleteDoc(docRef)
      .then(() => {
        // console.log("Document deleted");
      })
      .catch((err) => console.log(err.message));
  });

  return stickyNote;
};

// Handlers

function handlePinFormClass() {
  if (pinForm.classList.contains("invisible")) {
    pinForm.classList.remove("invisible");
  } else {
    pinForm.classList.add("invisible");
  }
  signUpForm.classList.add("invisible");
  logInForm.classList.add("invisible");
}

function handleSignUpFormClass() {
  if (signUpForm.classList.contains("invisible")) {
    signUpForm.classList.remove("invisible");
  } else {
    signUpForm.classList.add("invisible");
  }
  pinForm.classList.add("invisible");
  logInForm.classList.add("invisible");
}

function handleLogInFormClass() {
  if (logInForm.classList.contains("invisible")) {
    logInForm.classList.remove("invisible");
  } else {
    logInForm.classList.add("invisible");
  }
  pinForm.classList.add("invisible");
  signUpForm.classList.add("invisible");
}

function emptyFields() {
  fields.forEach((field) => {
    field.value = "";
  });
}

// Listeners

addNoteBtn.addEventListener("click", () => {
  handlePinFormClass();
  emptyFields();
  formatTodayDateOnForm();
  inputField.focus();
});

pinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const currentUser = auth.currentUser.uid;
  const db = getFirestore();
  const pinRef = collection(db, "users", currentUser, "pins");
  addDoc(pinRef, {
    title: pinForm.title.value,
    description: pinForm.description.value,
    date: format(new Date(pinForm.date.value), "MMM dd yyyy"),
  })
    .then(() => {
      emptyFields();
    })
    .catch((err) => console.log(err.message));

  handlePinFormClass();
});

maybeLaterSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  handlePinFormClass();
});

logOut.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      stickyNotesElement.textContent = "";
      logIn.classList.remove("invisible");
      logOut.classList.add("invisible");
      userH1.textContent = "User?";
    })
    .catch((err) => console.log(err.message));
});

logInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = logInForm.email.value;
  const password = logInForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      //console.log("User logged in:", cred.user);
      logOut.classList.remove("invisible");
      logIn.classList.add("invisible");
    })
    .catch((err) => console.log(err.message));
  logInForm.classList.add("invisible");
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
/*
onSnapshot(colRef, (snapshot) => {
  stickyNotesElement.textContent = "";
  snapshot.docs.forEach((doc) => {
    stickyNotesElement.appendChild(createStickyElement(doc.data(), doc.id));
  });
}); */

onAuthStateChanged(auth, (user) => {
  if (!user) return logOut.classList.add("invisible");
  //console.log(user.uid);
  logIn.classList.add("invisible");
  logOut.classList.remove("invisible");
  currentUser = auth.currentUser.uid;
  const docRef = doc(db, "users", currentUser);
  getDoc(docRef).then((snapshot) => {
    let username = snapshot.data().username;
    userH1.textContent = username;
  });

  const colRef = collection(db, "users", currentUser, "pins");
  onSnapshot(colRef, (snapshot) => {
    stickyNotesElement.textContent = "";
    snapshot.docs.forEach((doc) => {
      stickyNotesElement.appendChild(createStickyElement(doc.data(), doc.id));
    });
  });
});
