import React from 'react';
import styles from './SettleModal.module.css';
import { addDoc, collection, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { ethers } from 'ethers';
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import Modal from 'react-modal';

// Configura el elemento principal de la aplicación para React Modal
Modal.setAppElement('#root');

interface Debt {
  debtor: string;
  creditor: string;
  amount: number;
}

interface SettleModalProps {
  show: boolean;
  handleClose: () => void;
  groupId: string;
  debts: Debt[];
  currentUser: string;
  groupMembers: string[];
}

const SettleModal: React.FC<SettleModalProps> = ({ show, handleClose, groupId, debts, currentUser }) => {
  const { walletProvider } = useWeb3ModalProvider();

  const handleProposeSettle = async () => {
    if (!walletProvider) {
      console.error('No wallet provider found');
      return;
    }

    // Crear la propuesta de settle
    const settleProposal = {
      groupId,
      debts,
      proposer: currentUser,
      signatures: []
    };

    const docRef = await addDoc(collection(firestore, 'groups', groupId, 'settleProposals'), settleProposal);

    const formattedDebts = debts.map(debt => [
      ethers.utils.getAddress(debt.debtor),
      ethers.utils.getAddress(debt.creditor),
      ethers.utils.parseUnits(debt.amount.toString(), 18).toString()
    ]);

    const actionHash = ethers.utils.solidityKeccak256(
      ['bytes32', 'tuple(address,address,uint256)[]', 'string'],
      [ethers.utils.formatBytes32String(groupId), formattedDebts, 'settleDebts']
    );

    const ethersProvider = new ethers.providers.Web3Provider(walletProvider as ethers.providers.ExternalProvider);
    const signer = ethersProvider.getSigner();
    const signature = await signer.signMessage(ethers.utils.arrayify(actionHash));

    await updateDoc(doc(firestore, 'groups', groupId, 'settleProposals', docRef.id), {
      signatures: arrayUnion({ signer: currentUser, signature })
    });

    console.log('Settle proposal created and signed successfully');
    handleClose();
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>Settle Debts</h2>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
      </div>
      <div className={styles.modalBody}>
        <ul>
          {debts.map((debt, index) => (
            <li key={index}>
              {debt.debtor} owes {debt.creditor}: ${debt.amount.toFixed(2)}
            </li>
          ))}
        </ul>
        <button className={styles.proposeButton} onClick={handleProposeSettle}>
          Propose Settle
        </button>
      </div>
    </Modal>
  );
};

export default SettleModal;

