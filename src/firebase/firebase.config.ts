// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAnalytics, isSupported } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBwXnrKaLVz5zZDdgVV_jsaaU3VXERvkEY",
  authDomain: "leqaa-5b749.firebaseapp.com",
  projectId: "leqaa-5b749",
  storageBucket: "leqaa-5b749.appspot.com",
  messagingSenderId: "184440419151",
  appId: "1:184440419151:web:892b2e89d21165e6670b3a",
  measurementId: "G-BP2SSB1CJP"
};
export const app = initializeApp(firebaseConfig);
if (isSupported()) {
  if (typeof window !== "undefined") {
    initializeAnalytics(app);
  }
}