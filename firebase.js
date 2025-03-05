// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy, startAfter, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6Tvphk75LvXNhiUcnqLItn3Iqh34Q3Nw",
  authDomain: "coder-next-fd8f2.firebaseapp.com",
  projectId: "coder-next-fd8f2",
  storageBucket: "coder-next-fd8f2.firebasestorage.app",
  messagingSenderId: "4928946300",
  appId: "1:4928946300:web:22c4658f3d83d18e8b89f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Exporta solo los métodos necesarios
export { collection, getDocs, query, where, orderBy, startAfter, limit };
