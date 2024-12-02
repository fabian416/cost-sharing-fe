import { useEnsName } from 'wagmi';
import { ethers } from 'ethers';
import { useUser } from '../utils/UserContext'; 

export const useENS = (address: string) => {
  const { aliases } = useUser();

  // Validar si el input es una dirección Ethereum
  const isValidAddress = ethers.utils.isAddress(address);
  const normalizedAddress = isValidAddress ? address.toLowerCase() : '';

  // Hook de Wagmi para resolver ENS
  const { data: ensName, isLoading: loadingENS } = useEnsName({
    address: isValidAddress ? (address as `0x${string}`) : undefined,
    chainId: 11155111, // Sepolia Testnet o Mainnet (1) si es necesario
  });

  // Resolver Alias si no hay ENS
  const resolvedAlias = aliases[normalizedAddress] || null;

  // Resolver Dirección Abreviada como última opción
  const abbreviatedAddress = isValidAddress
    ? `${address.substring(0, 6)}...${address.slice(-4)}`
    : 'Invalid Address';

  // Decidir la prioridad
  const resolvedName =
    ensName || resolvedAlias || abbreviatedAddress;

  return {
    resolvedName,
    isLoading: loadingENS,
  };
};