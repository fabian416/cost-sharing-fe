import React, { useState, useEffect, useCallback } from 'react';
import ExpenseModal from './ExpenseModal/ExpenseModal';
import SettleModal from './SettleModal/SettleModal';
import { firestore } from '../../firebaseConfig';
import { doc, getDoc, collection, addDoc, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
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
    const fetchDebts = () => {
      const expensesRef = collection(firestore, 'groups', groupId, 'expenses');
      onSnapshot(expensesRef, (snapshot) => {
        const balances: { [key: string]: number } = {};

        snapshot.forEach(doc => {
          const data = doc.data();
          const expense: Expense = {
            amount: data.amount,
            description: data.description,
            paidBy: data.paidBy,
            sharedWith: data.sharedWith,
            settled: data.settled,
            timestamp: data.timestamp
          };

          if (!expense.settled) {
            const totalParticipants = expense.sharedWith.length + 1; // Incluye al pagador
            const share = expense.amount / totalParticipants;

            // Ajustar la deuda de los miembros compartidos
            expense.sharedWith.forEach((member: string) => {
              if (!balances[member]) {
                balances[member] = 0;
              }
              balances[member] -= share; // Cada miembro debe una parte del gasto
            });

            // Ajustar la deuda del pagador
            if (!balances[expense.paidBy]) {
              balances[expense.paidBy] = 0;
            }
            balances[expense.paidBy] += share * expense.sharedWith.length; // El pagador asume la parte restante
          }
        });

        const calculatedDebts: Debt[] = [];
        for (const [debtor, debt] of Object.entries(balances)) {
          if (debt < 0) {
            for (const [creditor, credit] of Object.entries(balances)) {
              if (credit > 0) {
                const amount = Math.min(-debt, credit);
                if (amount > 0) {
                  calculatedDebts.push({ debtor, creditor, amount });
                  balances[debtor] += amount;
                  balances[creditor] -= amount;
                }
              }
            }
          }
        }

        setDebts(calculatedDebts);

        // Almacenar las deudas simplificadas en Firestore
        setDoc(doc(firestore, 'groups', groupId), { debts: calculatedDebts }, { merge: true });
      });
    };

    fetchDebts();
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
