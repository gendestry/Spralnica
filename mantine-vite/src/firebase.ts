// TODO: Replace the following with your app's Firebase project configuration

import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, User, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBUWfnNdDpvVrF27882U8sGxlsRj1gjalI",
  authDomain: "spralnica.firebaseapp.com",
  projectId: "spralnica",
  storageBucket: "spralnica.appspot.com",
  messagingSenderId: "225308004725",
  appId: "1:225308004725:web:087e3c66689f40c1b8433c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
connectAuthEmulator(auth, import.meta.env.VITE_AUTH_URL);

const db = getFirestore(app);
connectFirestoreEmulator(
  db,
  import.meta.env.VITE_FIRESTORE_HOST,
  import.meta.env.VITE_FIRESTORE_PORT
);

export { db, auth };
