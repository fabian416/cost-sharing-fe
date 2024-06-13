import { ethers, providers } from 'ethers';
import { APPLICATION_CONFIGURATION } from '../../consts/contracts';

export const fetchGroupDetails = async (groupId: string, walletProvider: providers.ExternalProvider | providers.JsonRpcFetchFunc) => {
  if (!walletProvider) {
    console.error('No wallet provider found');
    return null;
  }

  const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
  const contract = new ethers.Contract(
    APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address,
    APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi,
    ethersProvider
  );

  try {
    const details = await contract.getGroupDetails(groupId);
    return {
      name: details[0],
      members: details[1]
    };
  } catch (error) {
    console.error('Error fetching group details:', error);
    return null;
  }
};
