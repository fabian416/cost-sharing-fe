import React from 'react';
import styles from './SideBar.module.css'; // Importa correctamente el módulo CSS

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h1>Logo</h1>
      <ul>
        <li>Inicio</li>
        <li>Perfil</li>
        <li>Ajustes</li>
        <li>Salir</li>
      </ul>
    </div>
  );
};

export default Sidebar;
