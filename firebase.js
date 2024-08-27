// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO5Y0nxihY3x_WvFlrHNU1dz3diDKfrTE",
  authDomain: "life-sim-94a63.firebaseapp.com",
  projectId: "life-sim-94a63",
  storageBucket: "life-sim-94a63.appspot.com",
  messagingSenderId: "752614498677",
  appId: "1:752614498677:web:732f2ede3d87c3d465733c",
  measurementId: "G-DYKSVFTGV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);