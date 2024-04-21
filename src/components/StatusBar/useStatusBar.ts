import useContracts from "../../hooks/useContracts";


function useStatusBar() {
  const { walletConnected, chainId, open, address } = useContracts();
  const [isRegistered, setIsRegistered] = useState(false);

  function openWalletConnectModal() {
    console.log("Is Connected from useStatusBar:", walletConnected);
    open();
  }

  function openNetworks() {
    open({ view: "Networks" });
  }

  return { openWalletConnectModal, openNetworks, address, chainId, walletConnected };
}
export default useStatusBar;
