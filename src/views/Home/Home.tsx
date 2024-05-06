import React, { useState } from 'react';
import RegistrationModal from './RegistrationModal';
import WalletButton from '../../components/WalletButton/WalletButton';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

// Home.tsx

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(localStorage.getItem('isRegistered') === 'true');
    const navigate = useNavigate();

    const handleRegistrationSuccess = (nickname: string, email: string) => {
        console.log("Registrando:", nickname, email); // Verifica que los datos lleguen aquí
        localStorage.setItem('isRegistered', 'true');
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('email', email);
        setIsRegistered(true);
        setIsModalOpen(false);
        navigate('/dashboard');
    };
    const redirectToDashboard = () => {
        navigate('/dashboard');
    };
    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Welcome to Squary</h1>
            <p className={styles.description}>Share expenses and settle up easy with Crypto.</p>
            <div className={styles.walletButtonContainer}>
                {isRegistered ? (
                    <WalletButton onClick={redirectToDashboard} />
                ) : (
                    <button onClick={() => setIsModalOpen(true)}>Register / Connect Wallet</button>
                )}
            </div>
            <RegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRegister={handleRegistrationSuccess}
            />
        </div>
    );
};

export default Home;
