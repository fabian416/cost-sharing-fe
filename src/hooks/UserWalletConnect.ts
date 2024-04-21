import { useState } from 'react';
import { useWeb3Modal } from "@web3modal/ethers5/react";

export const useWalletConnect = () => {
  const { connect, disconnect, account, isConnected } = useWeb3Modal();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleConnect,
    disconnect,
    account,
    isConnected,
    isLoading
  };
};
