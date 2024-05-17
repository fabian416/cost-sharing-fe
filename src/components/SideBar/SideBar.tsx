import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SideBar.module.css';
import GroupModal from '../GroupModal/GroupModal';
import { useUserGroups } from '../../hooks/useUserGroups'; // Importa tu hook

interface SidebarProps {
  createGroup: (groupName: string, members: string[], tokenAddress: string, signatureThreshold: string) => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({ createGroup }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { groups, fetchGroups } = useUserGroups(); // Usa tu hook para obtener los grupos

  useEffect(() => {
    fetchGroups(); // Carga los grupos cuando el componente se monta
  }, [fetchGroups]);

  const handlePanelClick = () => {
    navigate('/dashboard');
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGroupCreated = () => {
    fetchGroups(); // Actualiza la lista de grupos cuando se crea un nuevo grupo
  };

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.logo}>Squary</h1>
      <div className={styles.section}>
        <div className={`${styles.sectionTitle} ${styles.sectionTitleButton}`} onClick={handlePanelClick}>Dashboard</div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Groups</div>
        <div className={styles.subSection} onClick={handleOpenModal}>+</div>
        <ul>
          {groups.map(group => (
            <li key={group.id}>
              <Link to={`/dashboard/grupos/${group.id}`}>{group.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Friends</div>
        <div className={styles.subSection}>+</div>
      </div>
      <GroupModal show={showModal} handleClose={handleCloseModal} createGroup={createGroup} onGroupCreated={handleGroupCreated} />
    </div>
  );
};

export default Sidebar;
