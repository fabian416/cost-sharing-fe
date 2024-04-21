import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './views/Home'
import Dashboard from './views/Dashboard';
import GeneralPanel from './views/GeneralPanel';
import GroupDetails from './views/GroupDetails';
import FriendDetails from './views/FriendDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "", element: <GeneralPanel /> }, 
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