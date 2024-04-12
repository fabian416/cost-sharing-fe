import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers5/react";

function useStatusBar() {
  const { open } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  function openWalletConnectModal() {
    open();
  }

  function openNetworks() {
    open({ view: "Networks" });
  }

  return { openWalletConnectModal, openNetworks, address, chainId, isConnected };
}

export default useStatusBar;


