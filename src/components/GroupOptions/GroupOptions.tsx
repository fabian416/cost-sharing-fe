import React, { useState, useEffect } from 'react';
import ExpenseModal from './ExpenseModal/ExpenseModal';
import SettleModal from './SettleModal/SettleModal';
import WithdrawDepositModal from './WithdrawDepositModal'; // Ensure this import exists
import { firestore } from '../../firebaseConfig';
import { doc, getDoc, collection, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import styles from './GroupOptions.module.css';
import { useEthersSigner } from '../../hooks/ethersHooks'; 
import { APPLICATION_CONFIGURATION } from '../../consts/contracts';
import { ethers } from 'ethers';

interface GroupOptionsProps {
  groupId: string;
  groupName: string;
  onBalancesUpdate?: () => void; // Agrega esta propiedad
}

interface Signature {
  signer: string;
  signature: string;
}

const GroupOptions: React.FC<GroupOptionsProps> = ({ groupId, groupName, onBalancesUpdate }) => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showWithdrawDepositModal, setShowWithdrawDepositModal] = useState(false); // Added state
  const [modalActionType, setModalActionType] = useState<'Deposit' | 'Withdraw'>('Deposit'); // Added state
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [hasActiveProposal, setHasActiveProposal] = useState<boolean>(false);
  const [userHasSigned, setUserHasSigned] = useState<boolean>(false);
  const [settleProposalId, setSettleProposalId] = useState<string>('');
  const signer = useEthersSigner(); // Signer desde Viem

   // Obtener miembros del grupo desde Firestore
   useEffect(() => {
    const fetchGroupMembers = async () => {
      const groupDoc = await getDoc(doc(firestore, 'groups', groupId));
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        if (groupData?.members) {
          setGroupMembers(groupData.members);
        }
      } else {
        console.error('Group does not exist');
      }
    };
    fetchGroupMembers();
  }, [groupId]);

  // Escuchar cambios en las propuestas de liquidación
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'groups', groupId, 'settleProposals'),
      (snapshot) => {
        if (!snapshot.empty) {
          const proposalDoc = snapshot.docs[0];
          const proposalData = proposalDoc.data();
          setHasActiveProposal(true);
          setSettleProposalId(proposalDoc.id);

          if (proposalData.signatures.some((sig: Signature) => sig.signer === signer?.address)) {
            setUserHasSigned(true);
          } else {
            setUserHasSigned(false);
          }
        } else {
          setHasActiveProposal(false);
          setUserHasSigned(false);
        }
      }
    );
    return () => unsubscribe();
  }, [groupId, signer]);

  const handleWithdrawFunds = async (amount: number) => {
    if (!signer) {
      console.error('No signer found. Please connect a wallet.');
      return;
    }
    try {
      const contract = new ethers.Contract(
        APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address,
        APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi,
        signer
      );
      const parsedAmount = ethers.parseUnits(amount.toString(), 6);
      const tx = await contract.withdrawFunds(groupId, parsedAmount);
      console.log('Withdraw transaction sent:', tx.hash);
      await tx.wait();
      console.log('Withdrawal confirmed.');
      onBalancesUpdate?.();
    } catch (error) {
      console.error('Error during withdrawal:', error);
    }
  };

  const handleDepositFunds = async (amount: number) => {
    if (!signer) {
      console.error('No signer found. Please connect a wallet.');
      return;
    }
    try {
      const erc20Contract = new ethers.Contract(
        APPLICATION_CONFIGURATION.contracts.USDT_CONTRACT.address,
        APPLICATION_CONFIGURATION.contracts.USDT_CONTRACT.abi,
        signer
      );
      const squaryContract = new ethers.Contract(
        APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address,
        APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi,
        signer
      );
      const parsedAmount = ethers.parseUnits(amount.toString(), 6);

      // Aprobar tokens para el contrato
      const approveTx = await erc20Contract.approve(
        APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address,
        parsedAmount
      );
      console.log('Approve transaction sent:', approveTx.hash);
      await approveTx.wait();

      // Depositar tokens en el contrato
      const depositTx = await squaryContract.depositFunds(groupId, parsedAmount);
      console.log('Deposit transaction sent:', depositTx.hash);
      await depositTx.wait();
      console.log('Deposit confirmed.');
      onBalancesUpdate?.();
    } catch (error) {
      console.error('Error during deposit:', error);
    }
  };

  const handleAction = async (amount: number) => {
    if (modalActionType === 'Withdraw') {
      await handleWithdrawFunds(amount);
    } else if (modalActionType === 'Deposit') {
      await handleDepositFunds(amount);
    }
  };
  const handleAddExpense = async (amount: number, description: string, sharedWith: string[], paidBy: string) => {
    const newExpense = {
      amount,
      description,
      paidBy,
      sharedWith,
      settled: false,
      timestamp: Timestamp.fromDate(new Date())
    };
    await addDoc(collection(firestore, 'groups', groupId, 'expenses'), newExpense);
  };

  // Modal Handlers
  const handleOpenExpenseModal = () => setShowExpenseModal(true);
  const handleCloseExpenseModal = () => setShowExpenseModal(false);

  const handleOpenSettleModal = () => {
    if (!hasActiveProposal || !userHasSigned) {
      setShowSettleModal(true);
    }
  };
  const handleCloseSettleModal = () => setShowSettleModal(false);

  return (
    <div className={styles.groupOptions}>
      <h1 className={styles.title}>{groupName}</h1>
      <div className={styles.buttonsContainer}>
        <button
          className={`${styles.button} ${styles.addExpense}`}
          onClick={handleOpenExpenseModal}
        >
          Add Expense
        </button>
        <button
          className={`${styles.button} ${styles.settleUp}`}
          onClick={handleOpenSettleModal}
        >
          {hasActiveProposal ? (userHasSigned ? 'Signed' : 'Sign') : 'Start Settle'}
        </button>
        <button
          className={`${styles.button} ${styles.deposit}`}
          onClick={() => {
            setModalActionType('Deposit');
            setShowWithdrawDepositModal(true);
          }}
        >
          Deposit
        </button>
        <button
          className={`${styles.button} ${styles.withdraw}`}
          onClick={() => {
            setModalActionType('Withdraw');
            setShowWithdrawDepositModal(true);
          }}
        >
          Withdraw
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
          currentUser={currentUser}
          hasActiveProposal={hasActiveProposal}
          userHasSigned={userHasSigned}
          settleProposalId={settleProposalId}
        />
      )}
      {showWithdrawDepositModal && (
        <WithdrawDepositModal
          show={showWithdrawDepositModal}
          handleClose={() => setShowWithdrawDepositModal(false)}
          actionType={modalActionType}
          handleAction={handleAction}
        />
      )}
    </div>
  );
};

export default GroupOptions;