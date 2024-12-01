import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './ExpenseModal.module.css';

interface ExpenseModalProps {
  show: boolean;
  handleClose: () => void;
  addExpense: (amount: number, description: string, sharedWith: string[]) => void;
  groupMembers: string[];
  paidBy: string; // Añadir la dirección de la persona que propone el gasto
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ show, handleClose, addExpense, groupMembers, paidBy }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) { // Permitir solo números
      setAmount(value);
    }
  };

  const handleMemberSelect = (member: string) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter(m => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || !parsedAmount || parsedAmount <= 0 || selectedMembers.length === 0) {
      alert('Please fill in all fields with valid values.');
      return;
    }
    addExpense(parsedAmount, description, selectedMembers);
    handleClose();
  };
  
  useEffect(() => {
    if (show) {
      // Inicializa los miembros seleccionados con todos los miembros excepto el pagador
      setSelectedMembers(groupMembers.filter(member => member !== paidBy));
    }
  }, [show, groupMembers, paidBy]);

  return (
    <Modal
      isOpen={show}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={false}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>Add Expense</h2>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
      </div>
      <form onSubmit={handleSubmit} className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
        </div>
        <div className={styles.formGroup}>
          <label>Amount:</label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
            />
        </div>
        <div className={styles.formGroup}>
          <label>Share With:</label>
          <div className={styles.membersList}>
            {groupMembers.filter(member => member !== paidBy).map((member, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.memberButton} ${selectedMembers.includes(member) ? styles.selected : ''}`}
                onClick={() => handleMemberSelect(member)}
              >
                {member}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className={styles.addButton}>Add Expense</button>
      </form>
    </Modal>
  );
};

export default ExpenseModal;
