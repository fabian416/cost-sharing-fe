import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/SideBar/SideBar';
import GroupModal from '../components/GroupModal/GroupModal';
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import WalletConnect from '../components/WalletConnect/WalletConnect';

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
    <div className="dashboard">
      <Sidebar
        groups={groups}
        selectGroup={handleSelectGroup}
        openModal={toggleModal}
      />
      <WalletConnect />
      <div className="dashboard-content">
        <Outlet />
      </div>
      {isModalOpen && <GroupModal closeModal={toggleModal} />}
    </div>
  );
};

export default Dashboard;
