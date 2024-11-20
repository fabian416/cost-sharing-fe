import React, { useState, useEffect } from 'react';
import ExpenseModal from './ExpenseModal/ExpenseModal';
import SettleModal from './SettleModal/SettleModal';
import WithdrawDepositModal from './WithdrawDepositModal'; // Ensure this import exists
import { firestore } from '../../firebaseConfig';
import { doc, getDoc, collection, addDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import styles from './GroupOptions.module.css';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { APPLICATION_CONFIGURATION } from '../../consts/contracts';
import { ethers, providers } from 'ethers';
import { fetchGroupDetails } from './contractInteractions';

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
  const [showWithdrawDepositModal, setShowWithdrawDepositModal] = useState(false); // Added state
  const [modalActionType, setModalActionType] = useState<'Deposit' | 'Withdraw'>('Deposit'); // Added state
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [hasActiveProposal, setHasActiveProposal] = useState<boolean>(false);
  const [userHasSigned, setUserHasSigned] = useState<boolean>(false);
  const [settleProposalId, setSettleProposalId] = useState<string>('');
  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  // Current User Management
  useEffect(() => {
    if (address) {
      setCurrentUser(address);
    }
  }, [address]);

  // Fetch Group Members from Firestore
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

  // Listen for changes in settle proposals
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, 'groups', groupId, 'settleProposals'),
      (snapshot) => {
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
      }
    );

    return () => unsubscribe();
  }, [groupId, currentUser]);

  // Verify Group Details from Contract
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

  const handleWithdrawFunds = async (amount: number) => {
    if (!walletProvider) {
      console.error('No wallet provider found');
      return;
    }

    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const contract = new ethers.Contract(
        APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address,
        APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi,
        ethersProvider.getSigner()
      );

      const tx = await contract.withdrawFunds(groupId, ethers.utils.parseUnits(amount.toString(), 18));
      console.log('Withdraw transaction sent:', tx.hash);

      await tx.wait();
      console.log('Withdraw transaction confirmed.');
    } catch (error) {
      console.error('Error during withdrawal:', error);
    }
  };

  const handleDepositFunds = async (amount: number) => {
    if (!walletProvider) {
      console.error('No wallet provider found');
      return;
    }

    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const contract = new ethers.Contract(
        APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.address,
        APPLICATION_CONFIGURATION.contracts.SQUARY_CONTRACT.abi,
        ethersProvider.getSigner()
      );
      const amountToString =  amount.toString();
      console.log("amount to string is ;:", amountToString)
      const tx = await contract.depositFunds(groupId, ethers.utils.parseUnits(amountToString, 6));
      console.log("TX:", tx);
      console.log('Deposit transaction sent:', tx.hash);

      await tx.wait();
      console.log('Deposit transaction confirmed.');
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
      <h1 className={styles.title}>{groupName} Options</h1>
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