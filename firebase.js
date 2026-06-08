import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuHiIQSTr_7S9CjwVUxJimSuxPbOLyfbk",
  authDomain: "itoj-91bcc.firebaseapp.com",
  projectId: "itoj-91bcc",
  storageBucket: "itoj-91bcc.firebasestorage.app",
  messagingSenderId: "917771517858",
  appId: "1:917771517858:web:0b91aa0a58a1ada4a3fcfb",
  measurementId: "G-DZ23TER76P"
};

// Firebase init
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(); // Google login ke liye
export const db = getFirestore(app);
export const storage = getStorage(app);

// Login save rahega page refresh ke baad bhi
setPersistence(auth, browserLocalPersistence);