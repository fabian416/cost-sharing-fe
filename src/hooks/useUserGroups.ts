import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { APPLICATION_CONFIGURATION } from '../consts/contracts';

export const useUserGroups = () => {
  const { address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const SQUARY_V2_CONTRACT_ADDRESS = APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address;
  const SQUARY_V2_CONTRACT_ABI = APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi;
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);

  const fetchGroups = useCallback(async () => {
    if (!walletProvider || !SQUARY_V2_CONTRACT_ABI || !address) {
      console.error('Provider, ABI or account is missing');
      return;
    }

    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const contract = new ethers.Contract(SQUARY_V2_CONTRACT_ADDRESS, SQUARY_V2_CONTRACT_ABI, ethersProvider);
      const groupIds = await contract.getUserGroups(address);
      const groupDetails = await Promise.all(
        groupIds.map(async (groupId: string) => {
          const [name] = await contract.getGroupDetails(groupId);
          return { id: groupId, name };
        })
      );
      setGroups(groupDetails);
    } catch (error) { 
      console.error('Error fetching groups:', error);
    }
  }, [walletProvider, SQUARY_V2_CONTRACT_ABI, address, SQUARY_V2_CONTRACT_ADDRESS]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, fetchGroups };
};
