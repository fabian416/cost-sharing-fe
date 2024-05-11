import React, { useEffect } from 'react';
import ConnectButton from '../../components/ConnectButton/ConnectButton';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();
    const { isConnected } = useWeb3ModalAccount();  // Obtiene el estado de conexión desde useWeb3Modal

    useEffect(() => {
        if (isConnected) {  // Si isConnected es true, navega al dashboard
            navigate('./dashboard')
        }
    }, [isConnected, navigate]);  // Dependencias del efecto

    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Welcome to Squary</h1>
            <p className={styles.description}>Share expenses and settle up easy with Crypto.</p>
            <div className={styles.walletButtonContainer}>
                <ConnectButton/>
            </div>
        </div>
    );
};

export default Home;
