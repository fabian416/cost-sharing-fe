import styles from "./StatusBar.module.css";
import WalletConnectImg from "../../assets/walletConnect/walletConnectButton.png";
import useStatusBar from "./useStatusBar";
import MaticIcon from "../../assets/walletConnect/polygonMaticIcon.png";
import ProfilePic from "../../assets/walletConnect/userProfile.png";
import RegistrationModal from '../RegistrationModal/RegistrationModal';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function StatusBar() {
  const navigate = useNavigate();
  const { openWalletConnectModal, address, walletConnected, isRegistered, setIsRegistered } = useStatusBar(); // Cambiado isConnected a walletConnected
  const reducedAddress = `${address?.slice(0, 10)}...`;

  useEffect(() => {
    console.log("Effect running in StatusBar, walletConnected:", walletConnected);
    if (walletConnected) { // Cambiado isConnected a walletConnected
      console.log("Navigating to /dashboard");
      navigate('/dashboard');
    }
  }, [walletConnected, navigate]);

  return (
    <section className={styles.statusbarContainer}>
      {walletConnected ? ( // Cambiado isConnected a walletConnected
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
