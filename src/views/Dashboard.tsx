import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/SideBar/SideBar';
import GroupModal from '../components/GroupModal/GroupModal';
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import WalletConnect from '../components/WalletConnect/WalletConnect';
import styles from './Dashboard.module.css'; // Asegúrate de importar correctamente los estilos

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const { address: account } = useWeb3ModalAccount();

  useEffect(() => {
    if (account) {
      fetchGroups(account).then(setGroups);
    }
  }, [account]);

  const fetchGroups = async (account) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/groups/getUserGroups/${account}`);
      return response.data.groups;
    } catch (error) {
      console.error("Failed to fetch groups", error);
      return [];
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSelectGroup = (groupId) => {
    navigate(`/dashboard/grupos/${groupId}`);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar
        groups={groups}
        selectGroup={handleSelectGroup}
        openModal={toggleModal}
      />
      <WalletConnect />
      <div className="dashboard-content">
      <div className="top-section">
        <div className="top-left">Contenido de prueba 1</div>
        <div className="top-right">Contenido de prueba 2</div>
      </div>
      <div className="main-section">
        Contenido de prueba principal
 
      </div>
    </div>
    <Outlet />
      {isModalOpen && <GroupModal closeModal={toggleModal} />}
    </div>
  );
};

export default Dashboard;
