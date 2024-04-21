import React from 'react';
import Modal from 'react-modal';
import styles from './RegistrationModal.module.css';

interface RegistrationModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onRegistered: (wasRegistered: boolean) => void; 
    walletAddress?: string;  
    alias: string;
    setAlias: (alias: string) => void;
    email: string;
    setEmail: (email: string) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
    error: string;
}


const RegistrationModal: React.FC<RegistrationModalProps> = ({
    isOpen,
    onRequestClose,
    alias,
    setAlias,
    email,
    setEmail,
    handleSubmit,
    isSubmitting,
    error
}) => (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className={styles.modal}>
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                className={styles.input}
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Nickname"
                required
            />
            <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                type="email"
            />
            <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                Submit
            </button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
    </Modal>
);

export default RegistrationModal;
