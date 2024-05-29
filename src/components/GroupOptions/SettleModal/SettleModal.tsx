import React from 'react';
import Modal from 'react-modal';
import styles from './SettleModal.module.css';
import { addDoc, updateDoc, doc, arrayUnion, collection } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { ethers } from 'ethers';
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";

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
  hasActiveProposal: boolean;
  userHasSigned: boolean;
  settleProposalId: string;
}

Modal.setAppElement('#root');

const SettleModal: React.FC<SettleModalProps> = ({
  show,
  handleClose,
  groupId,
  debts,
  currentUser,
  hasActiveProposal,
  userHasSigned,
  settleProposalId
}) => {
  const { walletProvider } = useWeb3ModalProvider();

  const handleProposeSettle = async () => {
    if (!walletProvider) {
      console.error('No wallet provider found');
      return;
    }

    const formattedDebts = debts.map(debt => [
      ethers.utils.getAddress(debt.debtor),
      ethers.utils.getAddress(debt.creditor),
      ethers.utils.parseUnits(debt.amount.toString(), 18).toString()
    ]);

    const actionHash = ethers.utils.solidityKeccak256(
      ['bytes32', 'tuple(address,address,uint256)[]', 'string'],
      [ethers.utils.id(groupId), formattedDebts, 'settleDebts']
    );

    const ethersProvider = new ethers.providers.Web3Provider(walletProvider as ethers.providers.ExternalProvider);
    const signer = ethersProvider.getSigner();
    const signature = await signer.signMessage(ethers.utils.arrayify(actionHash));

    if (!hasActiveProposal) {
      const settleProposal = {
        groupId,
        debts,
        proposer: currentUser,
        signatures: [{ signer: currentUser, signature }]
      };

      await addDoc(collection(firestore, 'groups', groupId, 'settleProposals'), settleProposal);
      console.log('Settle proposal created and signed successfully');
    } else if (!userHasSigned) {
      await updateDoc(doc(firestore, 'groups', groupId, 'settleProposals', settleProposalId), {
        signatures: arrayUnion({ signer: currentUser, signature })
      });
      console.log('Signed settle proposal successfully');
    }

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
        <ul className={styles.debtsList}>
          {debts.map((debt, index) => (
            <li key={index} className={styles.debtItem}>
              {debt.debtor} owes {debt.creditor}: ${debt.amount.toFixed(2)}
            </li>
          ))}
        </ul>
        <button className={styles.proposeButton} onClick={handleProposeSettle} disabled={hasActiveProposal && userHasSigned}>
          {hasActiveProposal ? (userHasSigned ? 'Signed' : 'Sign') : 'Propose Settle'}
        </button>
      </div>
    </Modal>
  );
};

export default SettleModal;
