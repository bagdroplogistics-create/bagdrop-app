import { initializeApp } from "firebase/app";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPLpFJ38zNPp77DwHpFw6SdYrKbVMpdpY",
  authDomain: "bagdrop-56119.firebaseapp.com",
  projectId: "bagdrop-56119",
  storageBucket: "bagdrop-56119.firebasestorage.app",
  messagingSenderId: "526819522969",
  appId: "1:526819522969:web:8ffb87312f0bbab1fd7b08",
  measurementId: "G-K0SGTFLJEZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export {
  RecaptchaVerifier,
  signInWithPhoneNumber
};

