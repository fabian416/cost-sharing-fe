import React from 'react';
import './Sidebar.css'; // Asegúrate de importar los estilos

const Sidebar = () => {
  return (
    <div className="sidebar">
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
