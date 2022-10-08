// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4Rx-S3Y7mMpDXjAI263Uzf_YJjd_xFu4",
  authDomain: "chat-3f672.firebaseapp.com",
  projectId: "chat-3f672",
  storageBucket: "chat-3f672.appspot.com",
  messagingSenderId: "962642563620",
  appId: "1:962642563620:web:25f4f459ef0dafc44bfeb1",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
