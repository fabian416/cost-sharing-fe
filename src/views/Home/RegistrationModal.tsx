import React, { useState } from 'react';
import styles from './RegistrationModal.module.css'

// Definir una interfaz para las props del componente
interface RegistrationModalProps {
  isOpen: boolean;               // Tipo booleano para isOpen
  onClose: () => void;            // Función sin parámetros y sin retorno
  onRegister: (nickname: string, email: string) => void;  // Función que toma dos strings
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onRegister }) => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {  // Añadir tipo al evento
    event.preventDefault();
    onRegister(nickname, email);
    onClose(); // Cerrar el modal tras el registro
  };
  // Definir handleBackgroundClick para cerrar el modal al hacer clic fuera del contenido
const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  if (event.target === event.currentTarget) {
    onClose();
  }
};

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackground} onClick={handleBackgroundClick}> // Error aquí, función no definida
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <span className={styles.close} onClick={onClose}>&times;</span>
            <form onSubmit={handleSubmit}>
                <label>
                    Nickname:
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                </label>
                <label>
                    Email (opcional):
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    </div>
  );
};

export default RegistrationModal;
