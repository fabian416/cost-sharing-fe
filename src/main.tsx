import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import App from "./App";
import { APPLICATION_CONFIGURATION } from "./consts/contracts";

// const projectId = import.meta.env.VITE_PROJECT_ID;
const projectId = "";
const { chainConfig } = APPLICATION_CONFIGURATION;

const metadata = {
  name: "Squary",
  description: "Share expenses - Settle up with crypto",
  url: "",
  icons: ["https://avatars.mywebsite.com/"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [chainConfig],
  projectId,
  enableAnalytics: true,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);