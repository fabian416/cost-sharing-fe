import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './routes/Layout';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import GeneralPanel from './views/GeneralPanel';
import GroupDetails from './views/GroupDetails';
import FriendDetails from './views/FriendDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },  // Home ahora también utiliza Layout
      { path: "/dashboard", element: <Dashboard /> },  // No cambia, sigue como estaba
      { path: "general", element: <GeneralPanel /> }, 
      { path: "grupos/:groupId", element: <GroupDetails /> },
      { path: "amigos/:friendId", element: <FriendDetails /> },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
