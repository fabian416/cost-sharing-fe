import React from 'react';
import styles from './GeneralPanel.module.css';

const GeneralPanel = () => {
  // Ejemplo de datos para mostrar en el panel general
  const summary = {
    totalMembers: 150,
    activeProjects: 10,
    upcomingEvents: 5
  };

  return (
    <div className={styles.generalPanel}>
      <h1>Dashboard Summary</h1>
      <div className={styles.summaryBox}>
        <p>Total Members: {summary.totalMembers}</p>
        <p>Active Projects: {summary.activeProjects}</p>
        <p>Upcoming Events: {summary.upcomingEvents}</p>
      </div>
    </div>
  );
};

export default GeneralPanel;
