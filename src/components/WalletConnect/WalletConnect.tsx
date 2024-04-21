import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./StatusBar.module.css";
import WalletConnectImg from "../../assets/walletConnect/walletConnectButton.png";
import MaticIcon from "../../assets/walletConnect/polygonMaticIcon.png";
import ProfilePic from "../../assets/walletConnect/userProfile.png";
import RegistrationModal from '../RegistrationModal/RegistrationModal';
import useRegistrationModal from '../RegistrationModal/useRegistrationModal';
import useStatusBar from "./useWalletConnect";

function WalletConnect() {
  const navigate = useNavigate();
  const { openWalletConnectModal, address, walletConnected, isRegistered, setIsRegistered } = useStatusBar();
  const {
    handleSubmit,
    alias,
    setAlias,
    email,
    setEmail,
    isSubmitting,
    error
  } = useRegistrationModal(() => setIsRegistered(true), () => navigate('/dashboard'));

  useEffect(() => {
    console.log("Verificando conexión en WalletConnect:", walletConnected);// FIJARME QUE SE LOGEA APENAS ME DESCONECTO Y CONECTO DESDE WALLET CONNECT
    if (!walletConnected) {
      console.log("No hay conexión de wallet, redirigiendo al inicio...");
      navigate('/'); // Navegar al inicio si no hay conexión de wallet
    }
  }, [walletConnected, navigate]);
  
  const handleRegistrationComplete = (wasRegistered: boolean) => {
    setIsRegistered(wasRegistered);
    if (wasRegistered) {
      console.log("Registro completado, redirigiendo al dashboard...");
      navigate('/dashboard'); // Redirige al dashboard solo si el registro es exitoso
    }
  };
  
  return (
    <section className={styles.statusbarContainer}>
      {walletConnected ? (
        <>
          <button className={styles.authorizedButton} onClick={openWalletConnectModal}>
            <div>
              <img src={MaticIcon} alt="Polygon Network Icon" />
              <div className={styles.onlineDot} />
              <span>{address?.slice(0, 10)}...</span>
            </div>
            <img src={ProfilePic} alt="user profile picture" />
          </button>
          <RegistrationModal
            isOpen={!isRegistered}
            onRequestClose={() => setIsRegistered(true)}
            onRegistered={handleRegistrationComplete}
            walletAddress={address}
            handleSubmit={handleSubmit}
            alias={alias}
            setAlias={setAlias}
            email={email}
            setEmail={setEmail}
            isSubmitting={isSubmitting}
            error={error}
          />
        </>
      ) : (
        <button className={styles.connectWalletButton} onClick={openWalletConnectModal}>
          <img src={WalletConnectImg} alt="wallet connect button" />
        </button>
      )}
    </section>
  );
}

export default WalletConnect;
