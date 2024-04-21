import React, { FormEvent } from 'react';
import Modal from 'react-modal';
import styles from './RegistrationModal.module.css'; 

interface RegistrationModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;

  }
  // Estilos personalizados para el modal
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#f2f2f2',
      padding: '20px',
      borderRadius: '10px'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  };
  

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onRequestClose,
  handleSubmit
}) => {
  return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        contentLabel="Registration Form"
        ariaHideApp={false}
    >
        <form onSubmit={handleSubmit} className={styles.form}>
            <input className={styles.input} name="alias" type="text" placeholder="Alias" required />
            <input className={styles.input} name="email" type="email" placeholder="Email (opcional)" />
            <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
    </Modal>
  );
}

export default RegistrationModal;
