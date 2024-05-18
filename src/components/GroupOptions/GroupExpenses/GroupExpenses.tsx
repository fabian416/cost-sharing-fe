import React, { useState } from 'react';
import styles from './GroupExpenses.module.css';

const GroupExpenses = ({ groupId }) => {
  const [expenses, setExpenses] = useState([]);

  // Aquí agregarías lógica para traer los gastos del backend usando groupId

  return (
    <div className={styles.container}>
      <div className={styles.groupContainer}>
        <h2 className={styles.title}>Group {groupId} Expenses</h2>
        <ul className={styles.expensesList}>
          {expenses.map((expense, index) => (
          <li key={index}>
            {expense.description}: {expense.amount} paid by {expense.paidBy}
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupExpenses;
