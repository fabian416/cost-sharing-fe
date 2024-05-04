import React from 'react';
import Sidebar from '../../components/SideBar/SideBar';
import { Outlet } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.content}>
        <Outlet /> {/* Aquí se renderizarán los componentes GeneralPanel, GroupDetails, etc. */}
      </div>
    </div>
  );
};

export default Dashboard;
DG