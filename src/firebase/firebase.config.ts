// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, initializeAnalytics, isSupported } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCqguT2paqMmpv2GuVLmxPvVqdp5sZGBFA",
  authDomain: "seeko-ca8c2.firebaseapp.com",
  projectId: "seeko-ca8c2",
  storageBucket: "seeko-ca8c2.appspot.com",
  messagingSenderId: "251848160420",
  appId: "1:251848160420:web:cce3168a0a636fa0cf2231",
  measurementId: "G-B8VZHM8T0S"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
if (isSupported()) {
  // Initialize Firebase Analytics only if supported
  if (typeof window !== "undefined") {
    initializeAnalytics(app);
  }
}