import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { APPLICATION_CONFIGURATION } from '../consts/contracts';
import { firestore } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

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

      // Crear el grupo en el smart contract
      const tx = await contract.createGroup(groupName, members, signatureThreshold, tokenAddress);
      const receipt = await tx.wait(); // Esperar a que la transacción sea confirmada
      console.log('Grupo creado con éxito en el smart contract:', receipt);

      // Obtener el ID del grupo del evento
      const event = receipt.events?.find((event: ethers.Event) => event.event === 'GroupCreated');
      if (!event || !event.args) {
        throw new Error('Event GroupCreated not found');
      }

      const groupId = event.args.id;

      // Crear el grupo en Firestore
      const groupData = {
        groupName,
        members,
        signatureThreshold,
        tokenAddress,
      };
      await setDoc(doc(firestore, "groups", groupId.toString()), groupData);
      console.log('Grupo creado con éxito en Firestore:', groupData);

    } catch (error) {
      console.error('Error al crear el grupo:', error);
    }
  };

  return createGroup;
};
