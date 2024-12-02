import { firestore } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { ethers } from 'ethers';
import { APPLICATION_CONFIGURATION } from '../consts/contracts';

const SQUARY_V2_CONTRACT_ADDRESS = APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address;
const SQUARY_V2_CONTRACT_ABI = APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi;

export const fetchSimplifiedDebts = async (groupId: string) => {
  const debtsCollectionRef = collection(firestore, 'groups', groupId, 'simplifiedDebts');
  const debtsSnapshot = await getDocs(debtsCollectionRef);
  const debts = debtsSnapshot.docs.map(doc => doc.data() as { debtor: string, creditor: string, amount: number });
  return debts;
};

export const settleDebts = async (walletProvider: ethers.providers.ExternalProvider, groupId: string, signatures: string[]) => {
  const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
  const signer = ethersProvider.getSigner();
  const contract = new ethers.Contract(SQUARY_V2_CONTRACT_ADDRESS, SQUARY_V2_CONTRACT_ABI, signer);

  const debts = await fetchSimplifiedDebts(groupId);

  const tx = await contract.settleDebtsWithSignatures(groupId, debts, signatures);
  await tx.wait();
  console.log('Debts settled successfully');
};