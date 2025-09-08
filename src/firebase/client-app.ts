
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX0mJJt5SW2L55Fs5SPWHsXP2gQHFbRPY",
  authDomain: "woundwise-g3zb9.firebaseapp.com",
  projectId: "woundwise-g3zb9",
  storageBucket: "woundwise-g3zb9.firebasestorage.app",
  messagingSenderId: "315167035013",
  appId: "1:315167035013:web:189654d5723c779cf963ec",
  databaseURL: "https://woundwise-g3zb9-default-rtdb.firebaseio.com/"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const realtimeDb = getDatabase(app);

export { app, auth, db, storage, realtimeDb };
