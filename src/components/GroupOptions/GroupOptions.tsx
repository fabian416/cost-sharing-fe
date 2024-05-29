import React, { useState, useEffect } from 'react';
import ExpenseModal from './ExpenseModal/ExpenseModal';
import SettleModal from './SettleModal/SettleModal';
import { firestore } from '../../firebaseConfig';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
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

const GroupOptions: React.FC<GroupOptionsProps> = ({ groupId, groupName }) => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false); // Estado para mostrar el SettleModal
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]); // Estado para las deudas simplificadas
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

  const handleOpenSettleModal = () => setShowSettleModal(true); // Abrir el SettleModal
  const handleCloseSettleModal = () => setShowSettleModal(false); // Cerrar el SettleModal

  const handleAddExpense = async (amount: number, description: string, sharedWith: string[]) => {
    console.log(`Adding expense: ${amount}, ${description}, shared with: ${sharedWith}`);
    // Añadir el gasto a Firestore
    const newExpense = {
      amount,
      description,
      paidBy: currentUser,
      sharedWith,
      settled: false,
      timestamp: new Date()
    };
    await addDoc(collection(firestore, 'groups', groupId, 'expenses'), newExpense);

    console.log('Expense added to Firestore');
  };

  // Calcula las deudas simplificadas aquí y guarda el resultado en el estado `debts`
  useEffect(() => {
    // Aquí calculas las deudas simplificadas y las guardas en `debts`
  }, [groupId]);

  return (
    <div className={styles.groupOptions}>
      <h1 className={styles.title}>{groupName} Options</h1>
      <div className={styles.buttonsContainer}>
        <button className={`${styles.button} ${styles.addExpense}`} onClick={handleOpenExpenseModal}>Add Expense</button>
        <button className={`${styles.button} ${styles.settleUp}`} onClick={handleOpenSettleModal}>Settle up</button> {/* Botón para abrir el SettleModal */}
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
          groupMembers={groupMembers} // Pasa los miembros del grupo al SettleModal
        />
      )}
    </div>
  );
};

export default GroupOptions;
