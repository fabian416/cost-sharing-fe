import React from 'react';
import StatusBar from '../components/StatusBar';

function Home() {
  return (
    <div className="home-container">
      {/* StatusBar se incluye aquí para permitir la conexión de la wallet */}
      <StatusBar />
      
      <div className="container">
        {/* Contenido adicional de tu HomePage */}
        <h1>Bienvenido a [Squary. Donde de los gastos, nos encargamos nosotros!]</h1>
        <p>Conecta tu wallet para empezar a usar la aplicación.</p>
        {/* Aquí puedes añadir más secciones o información relevante */}
      </div>
    </div>
  );
}

export default Home;
