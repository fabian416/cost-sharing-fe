import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import SquaryV2ABI from '../abi/dev/SQUARY.json'; // Asegúrate de tener la ABI correcta

const SQUARY_V2_CONTRACT_ADDRESS = '0xYourContractAddressHere';

export const useCreateGroup = () => {
  const { walletProvider } = useWeb3ModalProvider();

  const createGroup = async (groupName: string, members: string[], tokenAddress: string, signatureThreshold: string) => {
    if (!walletProvider || !SquaryV2ABI) {
      console.error('Wallet provider or ABI is missing');
      return;
    }

    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(SQUARY_V2_CONTRACT_ADDRESS, SquaryV2ABI, signer);
      
      const tx = await contract.createGroup(members, signatureThreshold, tokenAddress);
      await tx.wait(); // Esperar a que la transacción sea confirmada
      console.log('Grupo creado con éxito:', tx);
    } catch (error) {
      console.error('Error al crear el grupo:', error);
    }
  };

  return createGroup;
};
