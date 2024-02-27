import styles from "./StatusBar.module.css";
import WalletConnectImg from "../../assets/walletConnect/walletConnectButton.png";
import useStatusBar from "./useStatusBar";
import MaticIcon from "../../assets/walletConnect/polygonMaticIcon.png";
import ProfilePic from "../../assets/walletConnect/userProfile.png";

function StatusBar() {
  const { openWalletConnectModal, address, isConnected } = useStatusBar();
  const reducedAddress = `${address?.slice(0, 10)}...`;

  return (
    <section className={styles.statusbarContainer}>
      {isConnected ? (
        <button className={styles.authorizedButton} onClick={openWalletConnectModal}>
          <div>
            <img src={MaticIcon} alt="Polygon Network Icon" />
            <div className={styles.onlineDot} />
            <span>{reducedAddress}</span>
          </div>
          <img src={ProfilePic} alt="user profile picture" />
        </button>
      ) : (
        <button className={styles.connectWalletButton} onClick={openWalletConnectModal}>
          <img src={WalletConnectImg} alt="wallet connect button" />
        </button>
      )}
    </section>
  );
}

export default StatusBar;
