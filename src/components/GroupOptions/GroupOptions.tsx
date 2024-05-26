import React, { useState, useEffect } from 'react';
import ExpenseModal from './ExpenseModal/ExpenseModal';
import { firestore } from '../../firebaseConfig';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import styles from './GroupOptions.module.css';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';

interface GroupOptionsProps {
  groupId: string;
  groupName: string;
}

const GroupOptions: React.FC<GroupOptionsProps> = ({ groupId, groupName }) => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const { walletProvider } = useWeb3ModalProvider();
  const [currentUser, setCurrentUser] = useState<string>('');

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

  const handleOpenExpenseModal = () => setShowExpenseModal(true);
  const handleCloseExpenseModal = () => setShowExpenseModal(false);

  const handleAddExpense = async (amount: number, description: string, sharedWith: string[]) => {
    console.log(`Adding expense: ${amount}, ${description}, shared with: ${sharedWith}`);
    // Añadir el gasto a Firestore
    const newExpense = {
      amount,
      description,
      sharedWith,
      paidBy: currentUser, // Agregar el campo paidBy
      settled: false,
      timestamp: new Date()
    };
    await addDoc(collection(firestore, 'groups', groupId, 'expenses'), newExpense);
  
    console.log('Expense added');
  };
  

  return (
    <div className={styles.groupOptions}>
      <h1 className={styles.title}>{groupName} Options</h1>
      <div className={styles.buttonsContainer}>
        <button className={`${styles.button} ${styles.addExpense}`} onClick={handleOpenExpenseModal}>Add Expense</button>
        <button className={`${styles.button} ${styles.settleUp}`} onClick={() => console.log("Settle Up Clicked")}>Settle up</button>
      </div>
      {showExpenseModal && (
        <ExpenseModal
          show={showExpenseModal}
          handleClose={handleCloseExpenseModal}
          addExpense={handleAddExpense}
          groupMembers={groupMembers}
          currentUser={currentUser} // Pasamos el usuario actual como prop
        />
      )}
    </div>
  );
};

export default GroupOptions;
