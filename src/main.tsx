import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import App from "./App";
import { APPLICATION_CONFIGURATION } from "./consts/contracts";

const projectId = process.env.VITE_WEB3_PROJECT_ID || "PROJECT_ID_NEEDED";
const { chainAmoy, chainPolygon, baseTestnet } = APPLICATION_CONFIGURATION;

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
  chains: [chainAmoy, chainPolygon, baseTestnet],
  projectId,
  enableAnalytics: true,
});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);