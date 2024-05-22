import React, { useState, useEffect } from 'react';
import ExpenseModal from './ExpenseModal/ExpenseModal';
import GroupBalances from './GroupBalances/GroupBalances'; // Importa el componente GroupBalances
import { firestore } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import styles from './GroupOptions.module.css';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import { simplifyDebts } from '../../utils/simplifiedDebts';

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
    // Lógica para añadir el gasto al backend o smart contract
    // Llamar a la función de simplificación después de añadir el gasto
    await simplifyDebts(groupId);
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
      <GroupBalances groupId={groupId} /> {/* Mostrar deudas simplificadas */}
    </div>
  );
};

export default GroupOptions;
