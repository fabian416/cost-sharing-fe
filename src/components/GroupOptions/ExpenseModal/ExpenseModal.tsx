import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './ExpenseModal.module.css';
import { useEnsName } from 'wagmi';
import { useUser } from '../../../utils/UserContext';
import { sepolia } from 'viem/chains';

interface ExpenseModalProps {
  show: boolean;
  handleClose: () => void;
  addExpense: (amount: number, description: string, sharedWith: string[], paidBy: string) => void;
  groupMembers: string[];
  paidBy: string; // Dirección del miembro que propone el gasto
}

// Componente auxiliar para resolver nombres con prioridad ENS > Alias > Dirección abreviada
const ENSName: React.FC<{ address: string }> = ({ address }) => {
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: sepolia.id, // Sepolia o Mainnet
  });
  const { aliases } = useUser();

  const resolveName = (): string => {
    if (ensName) return ensName; // Si hay ENS
    if (aliases[address.toLowerCase()]) return aliases[address.toLowerCase()]; // Si hay alias
    return `${address.substring(0, 6)}...${address.slice(-4)}`; // Dirección abreviada
  };

  return <>{resolveName()}</>;
};

const ExpenseModal: React.FC<ExpenseModalProps> = ({ show, handleClose, addExpense, groupMembers, paidBy }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [payer, setPayer] = useState(paidBy);

  // Inicializa el estado al abrir el modal
  useEffect(() => {
    if (show) {
      setPayer(paidBy); // Inicializa el pagador
      setSelectedMembers(groupMembers.filter(member => member !== paidBy)); // Excluye al pagador de los miembros compartidos
    }
  }, [show, groupMembers, paidBy]);

  // Maneja el cambio de pagador
  const handlePayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPayer = e.target.value;
    setPayer(newPayer);
    // Actualiza los miembros compartidos excluyendo al nuevo pagador
    setSelectedMembers(groupMembers.filter(member => member !== newPayer));
  };

  // Maneja la selección de miembros con quienes compartir
  const handleMemberSelect = (member: string) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter(m => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  // Maneja cambios en el campo de descripción
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d+$/.test(value) || value === '') {
      setDescription(value);
    } else {
      alert('Description cannot be only numbers.');
    }
  };

  // Maneja cambios en el campo de cantidad
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };

  // Maneja la validación y el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!description || /^\d+$/.test(description)) {
      alert('Description cannot be empty or only numbers.');
      return;
    }

    if (!parsedAmount || parsedAmount <= 0 || selectedMembers.length === 0) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    addExpense(parsedAmount, description, selectedMembers, payer); // Incluye el pagador en el gasto
    handleClose();
  };

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
            onChange={handleDescriptionChange}
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
          <label>Paid By:</label>
          <select value={payer} onChange={handlePayerChange}>
            {groupMembers.map((member, index) => (
              <option key={index} value={member}>
                <ENSName address={member} />
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Share With:</label>
          <div className={styles.membersList}>
            {groupMembers.filter(member => member !== payer).map((member, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.memberButton} ${selectedMembers.includes(member) ? styles.selected : ''}`}
                onClick={() => handleMemberSelect(member)}
              >
                <ENSName address={member} />
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className={styles.addButton}
          disabled={!description || /^\d+$/.test(description) || parseFloat(amount) <= 0 || selectedMembers.length === 0}
        >
          Add Expense
        </button>
      </form>
    </Modal>
  );
};

export default ExpenseModal;