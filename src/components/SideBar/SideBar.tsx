import React from 'react';
import styles from './SideBar.module.css'; // Asegúrate de tener la ruta correcta
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate

const Sidebar = () => {
  const navigate = useNavigate();

  const handlePanelClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.logo}>Squary</h1>
      <div className={styles.section}>
        <div className={`${styles.sectionTitle} ${styles.sectionTitleButton}`} onClick={handlePanelClick}>Dashboard</div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Groups</div>
        <div className={styles.subSection}>+</div>
        <ul>
          <li>Group 1</li>
          <li>Group 2</li>
          <li>Group 3</li>
          <li>Group 4</li>
          <li>Group 5</li>
          <li>Group 6</li>
          <li>Group 7</li>
          <li>Group 8</li>
          {/* Agrega más grupos según sea necesario */}
        </ul>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Friends</div>
        <div className={styles.subSection}>+</div>
      </div>
    </div>
  );
}

export default Sidebar;
