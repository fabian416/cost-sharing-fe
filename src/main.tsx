import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { wagmiConfig } from "./wagmi"; 
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

// Crear el cliente para React Query
const queryClient = new QueryClient();

const projectIdSandbox = process.env.VITE_WEB3_PROJECT_ID_SANDBOX || "project id not defined"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: projectIdSandbox, 
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <App />
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  </React.StrictMode>
);