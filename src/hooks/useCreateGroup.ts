import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { APPLICATION_CONFIGURATION } from '../consts/contracts'; 

export const useCreateGroup = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const SQUARY_V2_CONTRACT_ADDRESS = APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address;
  const SQUARY_V2_CONTRACT_ABI = APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi;

  const createGroup = async (groupName: string, members: string[], tokenAddress: string, signatureThreshold: string) => {
    if (!walletProvider || !SQUARY_V2_CONTRACT_ABI) {
      console.error('Wallet provider or ABI is missing');
      return;
    }

    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(SQUARY_V2_CONTRACT_ADDRESS, SQUARY_V2_CONTRACT_ABI, signer);

      // Asegúrate de incluir el nombre del grupo en la llamada al contrato si el contrato lo soporta.
      const tx = await contract.createGroup(groupName, members, signatureThreshold, tokenAddress);
      await tx.wait(); // Esperar a que la transacción sea confirmada
      console.log('Grupo creado con éxito:', tx);
    } catch (error) {
      console.error('Error al crear el grupo:', error);
    }
  };

  return createGroup;
};
