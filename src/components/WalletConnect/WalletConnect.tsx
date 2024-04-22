import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./WalletConnect.module.css";
import WalletConnectImg from "../../assets/walletConnect/walletConnectButton.png";
import MaticIcon from "../../assets/walletConnect/polygonMaticIcon.png";
import ProfilePic from "../../assets/walletConnect/userProfile.png";
import RegistrationModal from '../RegistrationModal/RegistrationModal';
import useRegistrationModal from '../RegistrationModal/useRegistrationModal';
import useWalletConnect from  "./useWalletConnect";

function WalletConnect() {
  const navigate = useNavigate();
  const { openWalletConnectModal, address, walletConnected, isRegistered, setIsRegistered } = useWalletConnect();
  const {
    handleSubmit,
    alias,
    setAlias,
    email,
    setEmail,
    isSubmitting,
    error,
    handleCloseModal
  } = useRegistrationModal(() => setIsRegistered(true), () => navigate('/dashboard'));


  useEffect(() => {
    if (walletConnected && isRegistered) {
        console.log("Conectado y registrado, redirigiendo al dashboard...");
        navigate('/dashboard');
    } else if (!walletConnected) {
        console.log("No hay conexión de wallet, redirigiendo al inicio...");
        navigate('/');
    }
  }, [walletConnected, isRegistered, navigate]);

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
              {/* Asegúrate de que las imágenes y textos sean elementos separados adecuadamente */}
              <img src={MaticIcon} alt="Polygon Network Icon" />
              <div className={styles.onlineDot} />
              <span>{address ? address.slice(0, 10) : "Loading..."}</span>
            </div>
            <img src={ProfilePic} alt="user profile picture" />
          </button>
          <RegistrationModal
            isOpen={!isRegistered}
            onRequestClose={handleCloseModal} // Asegúrate de que handleCloseModal esté definido y sea pasado correctamente
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
