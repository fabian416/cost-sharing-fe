import React, { useEffect } from 'react';
import Sidebar from '../../components/SideBar/SideBar';
import ConnectButton from '../../components/ConnectButton/ConnectButton';
import { Outlet } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { useNavigate } from 'react-router-dom';
import { useCreateGroup } from '../../hooks/useCreateGroup';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isConnected } = useWeb3ModalAccount();  // Obtiene el estado de conexión desde useWeb3Modal
  const createGroup = useCreateGroup();  // Aquí llamamos al hook useCreateGroup

  useEffect(() => {
    if (!isConnected) {  // Si isConnected es false, navega al login
      navigate('/');
    }
  }, [isConnected, navigate]);  // Dependencias del efecto

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar createGroup={createGroup} />
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
          <ConnectButton />
        </div>
        <Outlet /> {/* Aquí se renderizarán los componentes GeneralPanel, GroupDetails, etc. */}
      </div>
    </div>
  );
};

export default Dashboard;

