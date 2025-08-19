
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDX0mJJt5SW2L55Fs5SPWHsXP2gQHFbRPY",
  authDomain: "woundwise-g3zb9.firebaseapp.com",
  projectId: "woundwise-g3zb9",
  storageBucket: "woundwise-g3zb9.firebasestorage.app",
  messagingSenderId: "315167035013",
  appId: "1:315167035013:web:c6b876cc9a961e0ff963ec"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
