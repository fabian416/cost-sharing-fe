import React, { useState } from 'react';
import ExpenseModal from './ExpenseModal/ExpenseModal';
import styles from './GroupOptions.module.css';

interface GroupOptionsProps {
  groupId: string;
  groupName: string;
  groupMembers: string[]; // Agregar prop para los miembros del grupo
}

const GroupOptions: React.FC<GroupOptionsProps> = ({ groupId, groupName, groupMembers }) => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const handleOpenExpenseModal = () => setShowExpenseModal(true);
  const handleCloseExpenseModal = () => setShowExpenseModal(false);

  const handleAddExpense = (amount: number, description: string, sharedWith: string[]) => {
    console.log(`Adding expense: ${amount}, ${description}, shared with: ${sharedWith}`);
    // Aquí agregar lógica para añadir el gasto al backend o smart contract
  };

  return (
    <div className={styles.groupOptions}>
      <h1 className={styles.title}>{groupName} Options</h1>
      <div className={styles.buttonsContainer}>
        <button className={`${styles.button} ${styles.addExpense}`} onClick={handleOpenExpenseModal}>Add Expense</button>
        <button className={`${styles.button} ${styles.settleUp}`} onClick={() => console.log("Settle Up Clicked")}>Settle up</button>
      </div>
      <ExpenseModal
        show={showExpenseModal}
        handleClose={handleCloseExpenseModal}
        addExpense={handleAddExpense}
        groupMembers={groupMembers}
      />
    </div>
  );
};

export default GroupOptions;
