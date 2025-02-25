// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBIteVa9SagNUJhXZ6CVuq02c9LU30NcJk",
    authDomain: "expensetrackingapp-5643d.firebaseapp.com",
    projectId: "expensetrackingapp-5643d",
    storageBucket: "expensetrackingapp-5643d.firebasestorage.app",
    messagingSenderId: "278285243088",
    appId: "1:278285243088:web:0f002ae02ef1e84f6c44d5",
    measurementId: "G-ZCBQRKPSC5"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
