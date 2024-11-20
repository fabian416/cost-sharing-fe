import React, { useState, useEffect } from 'react';
import ExpenseModal from './ExpenseModal/ExpenseModal';
import SettleModal from './SettleModal/SettleModal';
import { firestore } from '../../firebaseConfig';
import { doc, getDoc, collection, addDoc, onSnapshot, setDoc, Timestamp, getDocs } from 'firebase/firestore';
import styles from './GroupOptions.module.css';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { fetchGroupDetails } from './contractInteractions';
import { providers } from 'ethers';

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

interface Expense {
  amount: number;
  description: string;
  paidBy: string;
  sharedWith: string[];
  settled: boolean;
  timestamp: Timestamp;
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
  const { address } = useWeb3ModalAccount();

  useEffect(() => {
    if (address) {
      setCurrentUser(address);
    }
  }, [address]);

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

  // Llamar a la función para obtener los detalles del grupo desde el contrato inteligente
  useEffect(() => {
    const verifyGroupMembers = async () => {
      const details = await fetchGroupDetails(groupId, walletProvider as providers.ExternalProvider);
      if (details) {
        console.log('Members from contract:', details.members);
        console.log('Members from Firestore:', groupMembers);
      }
    };

    verifyGroupMembers();
  }, [groupId, groupMembers, walletProvider]);

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
      timestamp: Timestamp.fromDate(new Date())
    };
    await addDoc(collection(firestore, 'groups', groupId, 'expenses'), newExpense);
  };

  return (
    <div className={styles.groupOptions}>
      <h1 className={styles.title}>{groupName}</h1>
      <div className={styles.buttonsContainer}>
        <button className={`${styles.button} ${styles.addExpense}`} onClick={handleOpenExpenseModal}>Add Expense</button>
        <button className={`${styles.button} ${styles.settleUp}`} onClick={handleOpenSettleModal}>
          {hasActiveProposal ? (userHasSigned ? 'Signed' : 'Sign') : 'Start Settle'}
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
