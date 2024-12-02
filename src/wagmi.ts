
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia, mainnet, sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

const projectId = process.env.VITE_WEB3_PROJECT_ID || "PROJECT_ID_NEEDED";

export const config = getDefaultConfig({
  appName: 'Squary',
  projectId: projectId,
  chains: [baseSepolia, mainnet, base, sepolia],
});
