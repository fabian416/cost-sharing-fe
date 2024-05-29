import React, { useState, useEffect } from 'react';
import ExpenseModal from './ExpenseModal/ExpenseModal';
import SettleModal from './SettleModal/SettleModal';
import { firestore } from '../../firebaseConfig';
import { doc, getDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import styles from './GroupOptions.module.css';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';

interface Debt {
  debtor: string;
  creditor: string;
  amount: number;
}

interface GroupOptionsProps {
  groupId: string;
  groupName: string;
}

interface Signature {
  signer: string;
  signature: string;
}

const GroupOptions: React.FC<GroupOptionsProps> = ({ groupId, groupName }) => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [hasActiveProposal, setHasActiveProposal] = useState<boolean>(false);
  const [userHasSigned, setUserHasSigned] = useState<boolean>(false);
  const [settleProposalId, setSettleProposalId] = useState<string>('');
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (walletProvider) {
        const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        setCurrentUser(address);
      }
    };

    fetchCurrentUser();
  }, [walletProvider]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      const groupDoc = await getDoc(doc(firestore, 'groups', groupId));
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        if (groupData && groupData.members) {
          setGroupMembers(groupData.members);
        }
      } else {
        console.error('Group does not exist');
      }
    };

    fetchGroupMembers();
  }, [groupId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'groups', groupId, 'settleProposals'), (snapshot) => {
      if (!snapshot.empty) {
        const proposalDoc = snapshot.docs[0];
        const proposalData = proposalDoc.data();

        setHasActiveProposal(true);
        setSettleProposalId(proposalDoc.id);

        if (proposalData.signatures.some((sig: Signature) => sig.signer === currentUser)) {
          setUserHasSigned(true);
        } else {
          setUserHasSigned(false);
        }
      } else {
        setHasActiveProposal(false);
        setUserHasSigned(false);
      }
    });

    return () => unsubscribe();
  }, [groupId, currentUser]);


  const handleOpenExpenseModal = () => setShowExpenseModal(true);
  const handleCloseExpenseModal = () => setShowExpenseModal(false);

  const handleOpenSettleModal = () => {
    if (!hasActiveProposal || !userHasSigned) {
      setShowSettleModal(true);
    }
  };
  const handleCloseSettleModal = () => setShowSettleModal(false);

  const handleAddExpense = async (amount: number, description: string, sharedWith: string[]) => {
    const newExpense = {
      amount,
      description,
      paidBy: currentUser,
      sharedWith,
      settled: false,
      timestamp: new Date()
    };
    await addDoc(collection(firestore, 'groups', groupId, 'expenses'), newExpense);
  };

  return (
    <div className={styles.groupOptions}>
      <h1 className={styles.title}>{groupName} Options</h1>
      <div className={styles.buttonsContainer}>
        <button className={`${styles.button} ${styles.addExpense}`} onClick={handleOpenExpenseModal}>Add Expense</button>
        <button className={`${styles.button} ${styles.settleUp}`} onClick={handleOpenSettleModal}>
          {hasActiveProposal ? (userHasSigned ? 'Signed' : 'Sign') : 'Settle up'}
        </button>
      </div>
      {showExpenseModal && (
        <ExpenseModal
          show={showExpenseModal}
          handleClose={handleCloseExpenseModal}
          addExpense={handleAddExpense}
          groupMembers={groupMembers}
          paidBy={currentUser}
        />
      )}
      {showSettleModal && (
        <SettleModal
          show={showSettleModal}
          handleClose={handleCloseSettleModal}
          groupId={groupId}
          debts={debts}
          currentUser={currentUser}
          groupMembers={groupMembers}
          hasActiveProposal={hasActiveProposal}
          userHasSigned={userHasSigned}
          settleProposalId={settleProposalId}
        />
      )}
    </div>
  );
};

export default GroupOptions;
