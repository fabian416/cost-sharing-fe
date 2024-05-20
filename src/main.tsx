import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import App from "./App";
import { APPLICATION_CONFIGURATION } from "./consts/contracts";
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


const projectId = "4d378fa56130355ea47ae76070a0c491";
const { chainAmoy, chainPolygon} = APPLICATION_CONFIGURATION;

const metadata = {
  name: "Squary",
  description: "Share expenses - Settle up with crypto",
  url: "",
  icons: ["https://avatars.mywebsite.com/"],
};

createWeb3Modal({
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': 'black', // Color principal del botón
    '--w3m-accent': 'blue',
    '--w3m-color-mix-strength': 20, // Intensidad del color
    '--w3m-font-size-master': '18px', // Tamaño de la fuente
    '--w3m-border-radius-master': '8px', // Radio del borde
    
  },
  ethersConfig: defaultConfig({ metadata }),
  chains: [chainAmoy, chainPolygon],
  projectId,
  enableAnalytics: true,
});

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const functions = getFunctions(app);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);