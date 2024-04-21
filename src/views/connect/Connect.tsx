import { useWeb3Modal } from "@web3modal/ethers5/react";
import styles from "./Connect.module.css";
import WalletConnectImg from "../../../assets/components/walletConnect/walletConnectButton.png";

function Connect() {
  const { open } = useWeb3Modal();

  return (
    <section className={styles.beginning}>
      <div className="wrapper">
        <h1>Everything Begins Here!</h1>
        <p className="text">
          Connect your wallet now!
        </p>
        <button className={styles.connectWalletButton} onClick={() => open()}>
          <img src={WalletConnectImg} alt="wallet connect button" />
        </button>
      </div>
    </section>
  );
}

export default Connect;
