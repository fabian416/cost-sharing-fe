import React, { useState } from 'react';
import RegistrationModal from './RegistrationModal';
import WalletButton from '../../components/WalletButton/WalletButton';
import styles from './Home.module.css';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(localStorage.getItem('isRegistered') === 'true');

    const handleRegistrationSuccess = () => {
        localStorage.setItem('isRegistered', 'true');
        setIsRegistered(true);
        setIsModalOpen(false);
    };

    const handleWalletButtonClick = () => {
        if (!isRegistered) {
            setIsModalOpen(true);
        } else {
            console.log("Connecting wallet...");
        }
    };

    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Welcome to Squary</h1>
            <p className={styles.description}>Share expenses and settle up easy with Crypto.</p>
            <WalletButton onClick={handleWalletButtonClick} />
            <RegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRegister={handleRegistrationSuccess}
            />
        </div>
    );
};

export default Home;
