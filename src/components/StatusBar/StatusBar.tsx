import styles from "./StatusBar.module.css";
import WalletConnectImg from "../../assets/walletConnect/walletConnectButton.png";
import useStatusBar from "./useStatusBar";
import MaticIcon from "../../assets/walletConnect/polygonMaticIcon.png";
import ProfilePic from "../../assets/walletConnect/userProfile.png";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function StatusBar() {
  const navigate = useNavigate();
  const { openWalletConnectModal, address, isConnected } = useStatusBar();
  const reducedAddress = `${address?.slice(0, 10)}...`;

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard'); // Cambia esto por la ruta que quieras después de la conexión
    }
  }, [isConnected, navigate]);


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
