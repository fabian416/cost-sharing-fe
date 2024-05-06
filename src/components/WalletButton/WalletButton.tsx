import React, { useState } from 'react';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import useContracts from '../../hooks/useContracts';
import styles from './WalletButton.module.css';

interface WalletButtonProps {
    onClick?: () => void;  // Prop onClick opcional
}

const WalletButton: React.FC<WalletButtonProps> = ({ onClick }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { open } = useWeb3Modal();
    const { checkConnectedNetwork, connectContracts } = useContracts();

    const handleDefaultConnect = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await open();  // Intenta abrir la conexión con la wallet
            const isCorrectNetwork = await checkConnectedNetwork();  // Comprueba si la red es correcta
            if (!isCorrectNetwork) {
                throw new Error('Please switch to the correct network.');
            }
            await connectContracts();  // Conecta los contratos si la red es correcta
        } catch (err) {
            const error = err as Error;
            console.error('Error al conectar la billetera o cargar contratos:', error);
            setError(error.message || 'Failed to connect.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = () => {
        if (onClick) {
            onClick();  // Si hay una prop onClick, úsala
        } else {
            handleDefaultConnect();  // Si no, usa la lógica de conexión predeterminada
        }
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <button className={styles.connectWalletButton} onClick={handleClick} disabled={isLoading}>
                    Connect Wallet
                </button>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default WalletButton;
