import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/UserContext'; // Importa el hook del contexto
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();
    const { isConnected } = useUser();
  
    useEffect(() => {
        if (isConnected) {
          navigate('./dashboard');
        }
      }, [isConnected, navigate]);
    
    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Welcome to Squary</h1>
            <p className={styles.description}>Share expenses and settle up easy with Crypto.</p>
            <div className={styles.walletButtonContainer}>
                <ConnectButton />
            </div>
        </div>
    );
};

export default Home;