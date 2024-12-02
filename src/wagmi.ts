
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';

const projectId = process.env.VITE_WEB3_PROJECT_ID || "PROJECT_ID_NEEDED";

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
});
