// src/views/LandingPage.tsx
import './LandingPage.css';
import React from 'react';
import StatusBar from '../components/StatusBar';



const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* StatusBar se incluye aquí para permitir la conexión de la wallet */}
      <StatusBar />
      <div>
        {/* Contenido adicional de tu LandingPage */}
        <h1>Bienvenido a [Nombre de tu Aplicación]</h1>
        <p>Conecta tu wallet para empezar.</p>
        {/* Aquí puedes añadir más secciones o información relevante */}
      </div>
    </div>
  );
};

export default LandingPage;

