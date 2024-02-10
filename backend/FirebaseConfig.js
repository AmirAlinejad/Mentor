// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsKuXAZ6FnP-OxWnDpltr0Wim7x951S5o",
  authDomain: "mentor-ea775.firebaseapp.com",
  projectId: "mentor-ea775",
  storageBucket: "mentor-ea775.appspot.com",
  messagingSenderId: "128552240068",
  appId: "1:128552240068:web:9f6806869027546c6b1a91",
  measurementId: "G-CP0FMRYDYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Authentication
const firestore = getFirestore(app); // Firestore
const db = getDatabase(app); // Realtime Database
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export { auth, firestore, db};
export default app;