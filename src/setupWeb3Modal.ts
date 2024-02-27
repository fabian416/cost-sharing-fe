import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

export const setupWeb3Modal = () => {
// 1. Get projectId
const projectId = 'YOUR_PROJECT_ID'

// 2. Set chains
const mumbai = {
  chainId: 80001,
  name: "Mumbai",
  currency: "MATIC",
  explorerUrl: "https://mumbai.polygonscan.com/",
  rpcUrl: "https://rpc-mumbai.maticvigil.com/",
};

// 3. Create modal
const metadata = {
  name: 'Squary App',
  description: 'Cost sharing application',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mumbai],
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})
}
