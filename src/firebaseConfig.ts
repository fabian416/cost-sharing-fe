import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC817hRLJCJODWD6_stCVn6KrxfCwyW1To",
  authDomain: "squary-b5fea.firebaseapp.com",
  projectId: "squary-b5fea",
  storageBucket: "squary-b5fea.appspot.com",
  messagingSenderId: "519153045444",
  appId: "1:519153045444:web:450209327c59577f4c1e91",
  measurementId: "G-TVNJ1QKKEG"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const functions = getFunctions(app);

export { app, firestore, functions };
