import { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react'
import { ethers } from 'ethers';
//import { useEventListener } from "./hooks/useEventListener";
import  LandingPage  from './views/LandingPage';
import Dashboard from './views/Dashboard';
import GeneralPanel from './views/GeneralPanel';
import GroupDetails from './views/GroupDetails';
import FriendDetails from './views/FriendDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
  const { isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
 // useEventListener();
  useEffect(() => {
    const switchToMumbai = async () => {
      if (walletProvider && isConnected && walletProvider.request) { // Asegurarse de que walletProvider y su método request existan
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const network = await provider.getNetwork();
        const chainIdNumber = network.chainId;
        
        // Comprueba si el chainId actual no es el de Mumbai (80001)
        if (chainIdNumber !== 80001) {
          try {
            // Solicita el cambio de red a Mumbai usando el método correcto para convertir el chainId a hexadecimal
            await walletProvider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: ethers.utils.hexValue(80001) }], // Corregido para convertir correctamente 80001 a hexadecimal
            });
          } catch (switchError) {
            console.error("Switch network error:", switchError);
          }
        }
      }
    };
    
      // Uso del hook fuera de useEffect
      switchToMumbai();
 
  }, [isConnected, chainId, walletProvider]);

  return (
    <RouterProvider router={router} />
  );

}

export default App;