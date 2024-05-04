import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import GeneralPanel from './views/GeneralPanel';
import GroupDetails from './views/GroupDetails';
import FriendDetails from './views/FriendDetails';
import RegistrationModal from './views/Home/RegistrationModal';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, // Directo a la Landing Page
  },
  {
    path: "dashboard",
    element: <Dashboard />, // Envoltorio para todo el dashboard incluyendo la sidebar
    children: [
      { index: true, element: <GeneralPanel /> }, // La página inicial del dashboard
      { path: "grupos/:groupId", element: <GroupDetails /> }, // Detalles de un grupo específico
      { path: "amigos/:friendId", element: <FriendDetails /> }, // Detalles de un amigo específico
    ],
  },
]);

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegistrationSuccess = () => {
    // Aquí puedes poner la lógica que se ejecutará tras un registro exitoso
    setIsRegistered(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRegister={handleRegistrationSuccess} 
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
