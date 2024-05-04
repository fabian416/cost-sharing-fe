import React, { useState } from 'react';

const RegistrationModal = ({ isOpen, onClose, onRegister }) => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister(nickname, email);
    onClose(); // Cerrar el modal tras el registro
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
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
