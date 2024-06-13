import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { APPLICATION_CONFIGURATION } from '../consts/contracts';

interface Debt {
  debtor: string;
  creditor: string;
  amount: ethers.BigNumber;
}

export const useSettleDebts = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const SQUARY_V2_CONTRACT_ADDRESS = APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address;
  const SQUARY_V2_CONTRACT_ABI = APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi;

  const settleDebtsWithSignatures = async (groupId: string, debts: Debt[], signatures: string[]) => {
    if (!walletProvider || !SQUARY_V2_CONTRACT_ABI) {
      console.error('Wallet provider or ABI is missing');
      return;
    }

    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider as ethers.providers.ExternalProvider);
      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(SQUARY_V2_CONTRACT_ADDRESS, SQUARY_V2_CONTRACT_ABI, signer);

      console.log('Debts:', debts);
      console.log('Signatures:', signatures);

      if (debts.length === 0) {
        console.error('No debts provided');
        return;
      }

      const tx = await contract.settleDebtsWithSignatures(groupId, debts, signatures);
      const receipt = await tx.wait();
      console.log('Settle debts transaction successful:', receipt);
    } catch (error) {
      console.error('Error executing settleDebtsWithSignatures:', error);
    }
  };

  return settleDebtsWithSignatures;
};
