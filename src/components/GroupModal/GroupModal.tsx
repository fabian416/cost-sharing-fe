// components/GroupModal.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { useGroupModal } from './useGroupModal';
import './GroupModal.css';

const GroupModal = ({ closeModal }) => {
  const { invitations, addInvitation, handleInvitationChange, handleSubmit } = useGroupModal();

  // La lógica de renderización del modal va aquí
  return ReactDOM.createPortal(
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Group</h2>
        </div>
        <div className="modal-body">
          {/* All content of the modal, including the form and confirmation button */}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="groupName">Name of the Group:</label>
              <input type="text" id="groupName" name="groupName" required />
            </div>
            <div>
              <label htmlFor="groupDescription">Description (optional):</label>
              <input
                type="text"
                id="groupDescription"
                name="groupDescription"
              />
            </div>
            {invitations.map((invite, index) => (
              <div key={index}>
                <label htmlFor={`aliasOrWallet-${index}`}>
                  Alias or Wallet to invite:
                </label>
                <input
                  type="text"
                  id={`aliasOrWallet-${index}`}
                  value={invite.aliasOrWallet}
                  onChange={(e) =>
                    handleInvitationChange(
                      index,
                      'aliasOrWallet',
                      e.target.value,
                    )
                  }
                  placeholder="Ej: @alias o 0x123..."
                />
                <label htmlFor={`email-${index}`}>
                  Email to invite (optional if the alias or wallet is valid):
                </label>
                <input
                  type="email"
                  id={`email-${index}`}
                  value={invite.email}
                  onChange={(e) =>
                    handleInvitationChange(index, 'email', e.target.value)
                  }
                  placeholder="Ej: usuario@email.com"
                />
              </div>
            ))}
            <button
              className="add-member-button"
              type="button"
              onClick={addInvitation}
            >
              + Add another member
            </button>
            <div>
              <label htmlFor="signingMethod">Configuration of Signers:</label>
              <select
                id="signingMethod"
                value={signingMethod}
                onChange={(e) => {
                  const value = e.target.value
                  if (
                    value === 'majority' ||
                    value === 'all' ||
                    value === 'custom'
                  ) {
                    setSigningMethod(value)
                  } else {
                    console.error('Invalid value for signingMethod')
                  }
                }}
              >
                <option value="majority">More than 50%</option>
                <option value="all">Everybody</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {signingMethod === 'custom' && (
              <div>
                <label htmlFor="customThreshold">
                  Number of Signers required:
                </label>
                <input
                  type="number"
                  id="customThreshold"
                  min="1"
                  max={updatedOwnerAddresses.length}
                  onChange={(e) => setCustomThreshold(Number(e.target.value))}
                  value={customThreshold || ''}
                />
              </div>
            )}
            {/* Mover el botón de confirmación aquí dentro */}
            <button className="submit-button" type="submit">
              Confirm
            </button>
            <div ref={endOfListRef} />
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
};

export default GroupModal;
