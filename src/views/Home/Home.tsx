import React, { useState } from 'react';
import RegistrationModal from './RegistrationModal';
import WalletButton from '../../components/WalletButton/WalletButton';
import styles from './Home.module.css';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleRegistrationSuccess = () => {
        setIsRegistered(true);
        setIsModalOpen(false);
        // Tal vez redirigir al dashboard o conectar la wallet
    };

    return (
        <div className={styles.home}>
            <h1 className={styles.title}>Welcome to Squary</h1>
            <p className={styles.description}>Share expenses and settle up easy with Crypto.</p>
            {isRegistered ? (
                <WalletButton />
            ) : (
                <button onClick={() => setIsModalOpen(true)}>Register / Connect Wallet</button>
            )}
            <RegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRegister={handleRegistrationSuccess}
            />
        </div>
    );
};

export default Home;
