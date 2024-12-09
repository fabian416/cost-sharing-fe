import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/UserContext'; // Import your UserContext
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();
    const { isConnected } = useUser(); // Check connection state from your context

    useEffect(() => {
         if (isConnected && window.location.pathname === "/") {
           navigate("/dashboard");
         }
      }, [isConnected, navigate]);

    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Welcome to Squary</h1>
            <p className={styles.description}>Share expenses and settle up easily with Crypto.</p>
            <div className={styles.walletButtonContainer}>
             <appkit-button />
            </div>
        </div>
    );
};

export default Home;