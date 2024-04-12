import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar/SideBar'; // Asegúrate de que la ruta sea correcta
import GroupModal from '../components/GroupModal/GroupModal'; // Asegúrate de que la ruta sea correcta


const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (userContext?.account) {
      fetchGroups(userContext.account).then(setGroups);
    }
  }, [userContext?.account]);

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

  // Opción de manejar la selección de grupo desde Sidebar y navegar a su detalle
  const handleSelectGroup = (groupId) => {
    navigate(`/dashboard/grupos/${groupId}`);
  };

  return (
    <div className="dashboard">
      <Sidebar
        groups={groups}
        selectGroup={handleSelectGroup}
        openModal={toggleModal}
      />
      <div className="dashboard-content">
        <Outlet />
      </div>
      {isModalOpen && <GroupModal closeModal={toggleModal} />}
    </div>
  );
};

export default Dashboard;
