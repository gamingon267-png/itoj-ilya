import { auth, db, provider } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let user = null;

// 🔑 Teri ImgBB API key
const IMGBB_KEY = "95e68af14309396d5e9c4755eb4b789b";

/* 🔐 LOGIN STATE - Page load pe check karega */
onAuthStateChanged(auth, (u) => {
  user = u;
  if (user) {
    document.getElementById("heart").style.display = "block";
    closeLoginBox();
  } else {
    document.getElementById("heart").style.display = "none";
    document.getElementById("gallery").style.display = "none";
  }
});

/* 🌸 SAKURA CLICK = Login nahi hai to login box, hai to upload */
document.getElementById("sakura").onclick = () => {
  if (!user) {
    openLoginBox();
  } else {
    document.getElementById("fileInput").click();
  }
};

/* 💛 HEART CLICK = Gallery kholega */
document.getElementById("heart").onclick = async () => {
  if (!user) return;
  await openGallery();
};

/* 🔐 LOGIN FUNCTION */
window.login = async function (e) {
  e.preventDefault();
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch(err) {
    alert("Login Error: " + err.message);
  }
};

/* 🆕 SIGNUP FUNCTION */
window.signup = async function (e) {
  e.preventDefault();
  let email = document.getElementById("email").value.trim();
  let pass = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
  } catch(err) {
    alert("Signup Error: " + err.message);
  }
};

/* GOOGLE LOGIN - location.reload hata diya */
document.getElementById("googleLogin").onclick = async (e) => {
  e.preventDefault();
  try {
    await signInWithPopup(auth, provider);
  } catch(err) {
    alert("Google Error: " + err.message);
  }
};

/* 📤 UPLOAD PHOTO - ImgBB se */
document.getElementById("fileInput").onchange = async (e) => {
  let file = e.target.files[0];
  if (!file ||!user) return;

  let formData = new FormData();
  formData.append("image", file);

  try {
    await alert("Uploading... ruk ja 🌸");

    let res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
      method: "POST",
      body: formData
    });

    let data = await res.json();
    let url = data.data.url;

    await addDoc(collection(db, "photos"), {
      userId: user.uid,
      url: url,
      name: file.name,
      createdAt: serverTimestamp()
    });

    alert("Photo uploaded 🌸");
    e.target.value = ""; // input reset kar de
  } catch(err) {
    alert("Upload Error: " + err.message);
  }
};

/* 💛 OPEN GALLERY - Same page me dikhegi */
async function openGallery() {
  if (!user) return;

  let galleryDiv = document.getElementById("gallery");
  galleryDiv.innerHTML = "<h2>Your Photos 💛</h2><p>Loading...</p>";
  galleryDiv.style.display = "block";

  try {
    let q = query(
      collection(db, "photos"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    let snapshot = await getDocs(q);

    if (snapshot.empty) {
      galleryDiv.innerHTML = "<h2>Your Photos 💛</h2><p>No photos yet. Upload from 🌸</p>";
      return;
    }

    let html = "<h2>Your Photos 💛</h2><div style='display:flex;flex-wrap:wrap;gap:10px;'>";
    snapshot.forEach(doc => {
      let data = doc.data();
      html += `<img src="${data.url}" style="width:150px;height:150px;object-fit:cover;border-radius:10px;border:2px solid #fff;">`;
    });
    html += "</div>";
    galleryDiv.innerHTML = html;
  } catch(err) {
    galleryDiv.innerHTML = "<h2>Your Photos 💛</h2><p>Error loading photos</p>";
    console.error(err);
  }
}

/* 🔐 LOGIN BOX */
function openLoginBox() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("loginBox").style.display = "block";
}

function closeLoginBox() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("loginBox").style.display = "none";
}

/* ESC dabane se login box band */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLoginBox();
});