import { auth, db, storage } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let user = null;

/* 🌸 SAKURA CLICK */
document.getElementById("sakura").onclick = () => {
  if (!user) {
    openLoginBox();
  } else {
    document.getElementById("fileInput").click();
  }
};

/* 💛 HEART CLICK */
document.getElementById("heart").onclick = () => {
  openGallery();
};

/* 🔐 LOGIN STATE */
onAuthStateChanged(auth, (u) => {
  user = u;

  if (user) {
    document.getElementById("heart").style.display = "block";
  } else {
    document.getElementById("heart").style.display = "none";
  }
});

/* 🔐 LOGIN FUNCTION */
window.login = async function () {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, pass);
  closeLoginBox();
};

/* 🆕 SIGNUP FUNCTION */
window.signup = async function () {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  await createUserWithEmailAndPassword(auth, email, pass);
  closeLoginBox();
};

/* 📤 UPLOAD PHOTO */
document.getElementById("fileInput").onchange = async (e) => {
  let file = e.target.files[0];

  if (!file || !user) return;

  let storageRef = ref(storage, `${user.uid}/${file.name}`);

  await uploadBytes(storageRef, file);

  let url = await getDownloadURL(storageRef);

  await addDoc(collection(db, "photos"), {
    userId: user.uid,
    url: url,
    name: file.name,
    createdAt: Date.now()
  });

  alert("Photo uploaded 🌸");

  document.getElementById("heart").style.display = "block";
};

/* 💛 OPEN GALLERY */
async function openGallery() {
  let q = query(
    collection(db, "photos"),
    where("userId", "==", user.uid)
  );

  let snapshot = await getDocs(q);

  let win = window.open();
  win.document.write("<h2>Your Photos 💛</h2>");

  snapshot.forEach(doc => {
    let data = doc.data();
    win.document.write(`
      <img src="${data.url}" style="width:150px;margin:10px;border-radius:10px;">
    `);
  });
}

/* 🔐 LOGIN BOX (SIMPLE UI) */
function openLoginBox() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("loginBox").style.display = "block";
}

function closeLoginBox() {
  let box = document.getElementById("loginBox");
  if (box) box.style.display = "none";
}