import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SideBar.module.css';
import GroupModal from '../GroupModal/GroupModal'; 

interface SidebarProps {
  createGroup: (groupName: string, members: string[], tokenAddress: string, signatureThreshold: string) => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({ createGroup }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handlePanelClick = () => {
    navigate('/dashboard');
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Lista de grupos simulados (mocks)
  const groups = [
    { id: 1, name: "Group 1" },
    { id: 2, name: "Group 2" },
    { id: 3, name: "Group 3" },
    { id: 4, name: "Group 4" },
    { id: 5, name: "Group 5" },
    { id: 6, name: "Group 6" },
    { id: 7, name: "Group 7" },
    { id: 8, name: "Group 8" },
  ];

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
      <GroupModal show={showModal} handleClose={handleCloseModal} createGroup={createGroup} />
    </div>
  );
};

export default Sidebar;
