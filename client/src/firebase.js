// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-commerce-1f8f8.firebaseapp.com",
  projectId: "e-commerce-1f8f8",
  storageBucket: "e-commerce-1f8f8.appspot.com",
  messagingSenderId: "464448003367",
  appId: "1:464448003367:web:9512722ce603f7aba4dd02"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);