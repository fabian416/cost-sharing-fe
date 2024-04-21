// @ts-nocheck
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { APPLICATION_CONFIGURATION } from "../consts/contracts";


function useContracts() {

  const { isConnected, chainId, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { open } = useWeb3Modal();
  const walletConnected = Boolean(address) && isConnected;


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


  return {
    checkConnectedNetwork,
    open,
    chainId,
    walletConnected,
    address
  };
}

export default useContracts;