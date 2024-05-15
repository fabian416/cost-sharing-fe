import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './views/Home/Home';
import Dashboard from './views/Dashboard/Dashboard';
import GeneralPanel from './views/GeneralPanel/GeneralPanel';
import GroupDetails from './views/GroupDetails/GroupDetails';
import FriendDetails from './views/FriendDetails/FriendDetails';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />, 
  },
  {
    path: 'dashboard',
    element: <Dashboard />, // Pasar createGroup directamente aquí
    children: [
      { index: true, element: <GeneralPanel /> }, // La página inicial del dashboard
      { path: 'grupos/:groupId', element: <GroupDetails /> }, // Detalles de un grupo específico
      { path: 'amigos/:friendId', element: <FriendDetails /> }, // Detalles de un amigo específico
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

