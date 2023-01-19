// TODO: Replace the following with your app's Firebase project configuration

import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  getAuth,
  User,
  connectAuthEmulator,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";

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
const persistent = setPersistence(auth, browserSessionPersistence);
export const myLogin = persistent
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

// currentUserHook
const useFirebaseUser = () => {
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return user;
};

export { auth, useFirebaseUser };
