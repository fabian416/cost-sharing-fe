import { useEnsName } from 'wagmi';
import { ethers } from 'ethers';
import { useUser } from '../utils/UserContext'; 

export const useENS = (address: string) => {
  const { aliases } = useUser();

  // Validar y normalizar la dirección
  const isValidAddress = ethers.utils.isAddress(address);
  const normalizedAddress = isValidAddress ? address.toLowerCase() : '';

  // Resolver ENS usando Wagmi
  const { data: ensName, isLoading: loadingENS } = useEnsName({
    address: isValidAddress ? (address as `0x${string}`) : undefined,
    chainId: 11155111, // Sepolia Testnet o Mainnet (1)
  });

  // Normalizar alias para comparaciones consistentes
  const normalizedAliases = Object.keys(aliases).reduce((acc, key) => {
    acc[key.toLowerCase()] = aliases[key];
    return acc;
  }, {} as Record<string, string>);

  // Resolver Alias si no hay ENS
  const resolvedAlias = normalizedAliases[normalizedAddress] || null;

  // Resolver Dirección Abreviada como última opción
  const abbreviatedAddress = isValidAddress
    ? `${address.substring(0, 6)}...${address.slice(-4)}`
    : 'Invalid Address';

  // Decidir la prioridad
  const resolvedName = ensName || resolvedAlias || abbreviatedAddress;

  console.log("resolved name triggered: ", resolvedName);

  return {
    resolvedName,
    isLoading: loadingENS,
  };
};