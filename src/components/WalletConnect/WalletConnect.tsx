import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./WalletConnect.module.css";
import WalletConnectImg from "../../assets/walletConnect/walletConnectButton.png";
import MaticIcon from "../../assets/walletConnect/polygonMaticIcon.png";
import ProfilePic from "../../assets/walletConnect/userProfile.png";
import RegistrationModal from '../RegistrationModal/RegistrationModal';
import useRegistrationModal from '../RegistrationModal/useRegistrationModal';
import useWalletConnect from "./useWalletConnect";

function WalletConnect() {
    const navigate = useNavigate();
    const { openWalletConnectModal, address, walletConnected, setIsRegistered } = useWalletConnect();
    const {
        handleSubmit,
        alias,
        setAlias,
        email,
        setEmail,
        isSubmitting,
        error,
        handleCloseModal,
        isRegistered
    } = useRegistrationModal(onCloseModal, onRegistrationSuccess);

    const [showRegistrationModal, setShowRegistrationModal] = useState(false);

    useEffect(() => {
        if (walletConnected && isRegistered) {
            console.log("Conectado y registrado, redirigiendo al dashboard...");
            navigate('/dashboard');
        }
    }, [walletConnected,isRegistered, navigate]);

    function onRegistrationSuccess() {
        openWalletConnectModal();  // Abre la conexión de la wallet después del registro exitoso
        setIsRegistered(true);  // Marca al usuario como registrado
    }

    function onCloseModal() {
        setShowRegistrationModal(false);  // Cierra el modal
    }

    const handleConnectClick = () => {
        if (!isRegistered) {
            setShowRegistrationModal(true);  // Solo muestra el modal si el usuario no está registrado
        } else {
            openWalletConnectModal();  // De otra manera, abre la conexión de wallet directamente
        }
    };

    return (
        <section className={styles.statusbarContainer}>
            {walletConnected ? (
                <>
                    <button className={styles.authorizedButton} onClick={handleConnectClick}>
                        <div>
                            <img src={MaticIcon} alt="Polygon Network Icon" />
                            <div className={styles.onlineDot} />
                            <span>{address ? address.slice(0, 10) : "Loading..."}</span>
                        </div>
                        <img src={ProfilePic} alt="user profile picture" />
                    </button>
                </>
            ) : (
                <button className={styles.connectWalletButton} onClick={handleConnectClick}>
                    <img src={WalletConnectImg} alt="Connect Wallet" />
                </button>
            )}
            <RegistrationModal
                isOpen={showRegistrationModal}
                onRequestClose={handleCloseModal}
                onRegistered={onRegistrationSuccess}
                walletAddress={address}
                handleSubmit={handleSubmit}
                alias={alias}
                setAlias={setAlias}
                email={email}
                setEmail={setEmail}
                isSubmitting={isSubmitting}
                error={error}
            />
        </section>
    );
}

export default WalletConnect;