// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKoApktEE-64k7IKDlbZruYzagMYaCs0o",
  authDomain: "restaurant-c51e9.firebaseapp.com",
  projectId: "restaurant-c51e9",
  storageBucket: "restaurant-c51e9.firebasestorage.app",
  messagingSenderId: "720284298924",
  appId: "1:720284298924:web:bc08abd34dc6d224b87909"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);