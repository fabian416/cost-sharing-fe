// GroupExpenses.tsx
import React, { useState, useEffect } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import styles from './GroupExpenses.module.css';

interface GroupExpensesProps {
  groupId: string;
}

interface Expense {
  amount: number;
  description: string;
  paidBy: string;
  sharedWith: string[];
  settled: boolean;
  timestamp: Timestamp;
}

const GroupExpenses: React.FC<GroupExpensesProps> = ({ groupId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const expensesSnapshot = await getDocs(collection(firestore, 'groups', groupId, 'expenses'));
      const fetchedExpenses = expensesSnapshot.docs.map(doc => doc.data() as Expense);
      setExpenses(fetchedExpenses);
    };

    fetchExpenses();
  }, [groupId]);

  return (
    <div className={styles.container}>
      <div className={styles.groupContainer}>
        <h2 className={styles.subTitle}>Group Expenses</h2>
        <ul className={styles.expensesList}>
          {expenses.map((expense, index) => (
            <li key={index}>
              {expense.description}: {expense.amount} paid by {expense.paidBy}, shared with {expense.sharedWith.join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupExpenses;
