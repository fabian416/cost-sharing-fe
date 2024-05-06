import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import App from "./App";
import { APPLICATION_CONFIGURATION } from "./consts/contracts";

const projectId = "4d378fa56130355ea47ae76070a0c491";
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