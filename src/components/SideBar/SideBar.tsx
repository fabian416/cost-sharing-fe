import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import GroupModal from '../GroupModal/GroupModal';
import './SideBar.css';

interface Group {
  id: number;
  name: string;
}

const Sidebar: React.FC<{ groups: Group[] }> = ({ groups }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="sidebar">
      <h2>Squary</h2>

      {/* Sección Panel General */}
      <div className="sidebar-section">
        <NavLink to="/dashboard">Panel General</NavLink>
      </div>
      
      {/* Sección Grupos */}
      <div className="sidebar-section">
        <h3>Groups</h3>
        {/* Símbolo + para agregar grupos, abre el modal */}
        <button onClick={toggleModal}>+</button>
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <NavLink to={`/dashboard/grupos/${group.id}`}>{group.name}</NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Sección Amigos (placeholder, sin funcionalidad por ahora) */}
      <div className="sidebar-section">
        <h3>Friends</h3>
        <ul>
          {/* Placeholder para futuros amigos */}
          <li>Amigo 1 (ejemplo)</li>
          <li>Amigo 2 (ejemplo)</li>
        </ul>
      </div>

      {/* Modal para agregar nuevos grupos */}
      {isModalOpen && <GroupModal closeModal={toggleModal} />}
    </div>
  );
};

export default Sidebar;
