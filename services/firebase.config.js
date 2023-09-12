// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYvlFBAqNPbDdJ6OwsdSphRlB90GIDv0Y",
  authDomain: "otp-verification-994a2.firebaseapp.com",
  projectId: "otp-verification-994a2",
  storageBucket: "otp-verification-994a2.appspot.com",
  messagingSenderId: "966624791587",
  appId: "1:966624791587:web:fc51ffdf3cfb8c5438b596",
  measurementId: "G-M6VLB2Q8K4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
