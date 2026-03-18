/**
 * Firebase Data Connect Service
 * 
 * Este arquivo demonstra como usar Firebase Data Connect com PostgreSQL
 * em vez de Firestore/Realtime Database
 */

import {
  initializeApp,
  getApps,
  getApp,
  FirebaseApp,
} from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDataConnect, DataConnect } from "firebase/data-connect";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Firebase Services
const auth: Auth = getAuth(app);
const dataConnect: DataConnect = getDataConnect(app, {
  connectorId: process.env.NEXT_PUBLIC_DATA_CONNECT_CONNECTOR_ID || "",
});

export { app, auth, dataConnect };

/**
 * EXEMPLOS DE USO COM DATA CONNECT
 *
 * 1. Executar uma Query SQL:
 *
 *    import { dataConnect } from "./data-connect-app";
 *    import { executeQuery } from "firebase/data-connect";
 *
 *    const result = await executeQuery(
 *      dataConnect,
 *      "seu_connector_name",
 *      "sua_operacao_sql"
 *    );
 *    console.log(result.data);
 *
 * 2. Substituir Firestore por Data Connect:
 *
 *    // ANTES (Firestore):
 *    import { getFirestore, collection, getDocs } from "firebase/firestore";
 *    const db = getFirestore(app);
 *    const querySnapshot = await getDocs(collection(db, "users"));
 *
 *    // DEPOIS (Data Connect):
 *    import { dataConnect } from "./data-connect-app";
 *    import { executeQuery } from "firebase/data-connect";
 *    const result = await executeQuery(
 *      dataConnect,
 *      "seu_connector",
 *      "SELECT * FROM users"
 *    );
 *
 * 3. Autenticação mantém a mesma:
 *
 *    import { auth } from "./data-connect-app";
 *    import { signInWithEmailAndPassword } from "firebase/auth";
 *
 *    const userCredential = await signInWithEmailAndPassword(
 *      auth,
 *      email,
 *      password
 *    );
 */
