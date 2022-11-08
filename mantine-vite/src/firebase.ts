// TODO: Replace the following with your app's Firebase project configuration

import { initializeApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";

// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBUWfnNdDpvVrF27882U8sGxlsRj1gjalI",
  authDomain: "spralnica.firebaseapp.com",
  projectId: "spralnica",
  storageBucket: "spralnica.appspot.com",
  messagingSenderId: "225308004725",
  appId: "1:225308004725:web:087e3c66689f40c1b8433c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
