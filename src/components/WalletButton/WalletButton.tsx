import React, { useState } from 'react';
import { useWeb3Modal } from '@web3modal/ethers5/react';
import useContracts from '../../hooks/useContracts';

function WalletConnect() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Cambia a string para manejar mensajes de error
    const { open } = useWeb3Modal();
    const { checkConnectedNetwork, connectContracts } = useContracts();

    const handleConnect = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await open();
            const isCorrectNetwork = await checkConnectedNetwork();
            if (!isCorrectNetwork) {
                throw new Error('Please switch to the correct network.');
            }
            await connectContracts();
        } catch (err) {
            const error = err as Error; // Afirmación de tipo
            console.error('Error al conectar la billetera o cargar contratos:', error);
            setError(error.message || 'Failed to connect.'); // Usa message de Error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <button onClick={handleConnect} disabled={isLoading}>
                    Connect Wallet
                </button>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default WalletConnect;
