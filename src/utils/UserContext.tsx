import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { fetchAliases } from '../utils/fireBaseService';

interface UserContextType {
  currentUser: string | null; // Dirección de la wallet (o null si no está conectada)
  isConnected: boolean;
  aliases: Record<string, string>; // Alias cargados desde Firebase
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  isConnected: false,
  aliases: {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [aliases, setAliases] = useState<Record<string, string>>({});
  const { address, isConnected: walletConnected } = useWeb3ModalAccount();

  useEffect(() => {
    if (walletConnected && address) {
      setCurrentUser(address);
      setIsConnected(true);

      // Cargar alias para el usuario conectado
      const loadAliases = async () => {
        try {
          const aliasData = await fetchAliases(address);
          console.log("alias data succesfully got it: ", aliasData);
          setAliases(aliasData);
        } catch (error) {
          console.error('Error fetching aliases:', error);
        }
      };

      loadAliases();
    } else {
      setCurrentUser(null);
      setIsConnected(false);
      setAliases({}); // Reinicia alias cuando no hay conexión
    }
  }, [address, walletConnected]);

  return (
    <UserContext.Provider value={{ currentUser, isConnected, aliases }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);