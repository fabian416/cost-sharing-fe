import { useEffect } from 'react';
import Sidebar from '../../components/SideBar/SideBar';
import { DynamicWidget } from "@dynamic-labs/sdk-react-core"; // Import DynamicWidget
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useUser } from '../../utils/UserContext'; // Importa el UserContext
import { useCreateGroup } from '../../hooks/useCreateGroup';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isConnected, currentUser } = useUser(); // Usa el contexto para obtener el estado de conexión y el usuario actual
  const createGroup = useCreateGroup(); // Hook para manejar la creación de grupos

  useEffect(() => {
    if (!isConnected) {
      navigate('/'); // Navega al login si no está conectado
    }
  }, [isConnected, navigate]);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar createGroup={createGroup} currentUser={currentUser} /> {/* Pasa currentUser desde el contexto */}
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
        <DynamicWidget />
        </div>
        <Outlet /> {/* Renderiza componentes hijos del Dashboard */}
      </div>
    </div>
  );
};

export default Dashboard;

