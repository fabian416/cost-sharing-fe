import React from 'react';
import styles from './PanelOptions.module.css'; // Asegúrate de que el archivo CSS está correctamente vinculado

const PanelOptions = () => {
  return (
    <div className={styles.panelOptions}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.buttonsContainer}>
        <button className={`${styles.button} ${styles.addExpense}`} onClick={() => console.log("Add Expense Clicked")}>Add Expense</button>
        <button className={`${styles.button} ${styles.settleUp}`} onClick={() => console.log("Settle Up Clicked")}>Settle Up</button>
      </div>
    </div>
  );
}

export default PanelOptions;
