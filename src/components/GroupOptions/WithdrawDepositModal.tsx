import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './SettleModal/SettleModal.module.css'; // Usar los mismos estilos del SettleModal para mantener consistencia
import { ethers } from 'ethers';

interface WithdrawDepositModalProps {
  show: boolean;
  handleClose: () => void;
  actionType: 'Withdraw' | 'Deposit'; // Define el tipo de acción
  handleAction: (amount: number) => void; // Función para ejecutar la acción
}

const WithdrawDepositModal: React.FC<WithdrawDepositModalProps> = ({
  show,
  handleClose,
  actionType,
  handleAction,
}) => {
  const [amount, setAmount] = useState<string>(''); // Manejamos el monto ingresado como string para validarlo

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount); // Convertir a número
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount'); // Validación básica
      return;
    }
    handleAction(parsedAmount); // Ejecutar la acción (retirar o depositar)
    handleClose(); // Cerrar el modal después de la acción
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={handleClose}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
    >
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{actionType} Funds</h2>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
      </div>
      <div className={styles.modalBody}>
        <label htmlFor="amount" style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'rgb(90, 90, 90)' }}>
          Enter the amount to {actionType.toLowerCase()}:
        </label>
        <input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1.2rem',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        />
        <button className={styles.proposeButton} onClick={handleSubmit}>
          {actionType}
        </button>
      </div>
    </Modal>
  );
};

export default WithdrawDepositModal;