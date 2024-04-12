import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { APPLICATION_CONFIGURATION } from './consts/contracts.ts';
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";


const { chainConfig } = APPLICATION_CONFIGURATION;
const projectId = 'YOUR_PROJECT_ID'

const metadata = {
  name: 'Squary App',
  description: 'Cost sharing application',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [chainConfig],
  projectId,
  enableAnalytics: true,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
