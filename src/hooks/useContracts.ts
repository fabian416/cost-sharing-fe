import { useEffect, useState } from 'react';
import { ethers } from 'ethers';  // Asegúrate de que ethers está correctamente importado
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { APPLICATION_CONFIGURATION } from "../consts/contracts";
import SQUARY from '../abi/dev/SQUARY.json';


function useContracts() {
  const { isConnected, chainId, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();
  const walletConnected = Boolean(address) && isConnected;

  const [squaryContract, setSquaryContract] = useState(null);  // Define el estado del contrato

  async function connectSquaryContract() {
    if (walletConnected && walletProvider) {
      try {
        const contract = new ethers.Contract(SQUARY.address, SQUARY.abi, walletProvider.getSigner());
        setSquaryContract(contract);
      } catch (error) {
        console.error("Failed to get contract:", error);
      }
    }
  }

  useEffect(() => {
    if (walletConnected && address) {
      connectContracts();
    } else {
      clearContracts();
    }
  }, [walletConnected, address]);

  async function checkConnectedNetwork(): Promise<boolean> {
    if (walletProvider && isConnected && walletProvider.request) {
      console.log("Wallet connected:", walletConnected);
      if (chainId !== APPLICATION_CONFIGURATION.chainId) {
        try {
          await walletProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexValue(APPLICATION_CONFIGURATION.chainId) }],
          });
          return true;
        } catch (switchError) {
          console.error("Switch network error:", switchError);
          return false;
        }
      }
      return true;
    }
    return false;
  }

  async function connectContracts() {
    const correctNetwork = await checkConnectedNetwork();
    if (correctNetwork) {
      await connectSquaryContract();
    }
  }

  function clearContracts() {
    setSquaryContract(null);  // Ahora esta línea funciona porque setSquaryContract está definido
  }

  return {
    checkConnectedNetwork,
    open,
    chainId,
    walletConnected,
    address,
    connectContracts,
    squaryContract  // Devolver también el contrato para uso externo si es necesario
  };
}

export default useContracts;
