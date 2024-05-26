import React, { useEffect, useState } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, onSnapshot, DocumentData, QuerySnapshot, Timestamp } from 'firebase/firestore';
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
  timestamp: Timestamp; // Puedes usar Date si conviertes los timestamps a Date
}

const GroupExpenses: React.FC<GroupExpensesProps> = ({ groupId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const expensesRef = collection(firestore, 'groups', groupId, 'expenses');
    const unsubscribe = onSnapshot(expensesRef, (snapshot: QuerySnapshot<DocumentData>) => {
      const fetchedExpenses: Expense[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          amount: data.amount,
          description: data.description,
          paidBy: data.paidBy,
          sharedWith: data.sharedWith.filter((member: string) => member !== data.paidBy), // Filtrar la dirección del pagador
          settled: data.settled,
          timestamp: data.timestamp,
        } as Expense;
      });
      setExpenses(fetchedExpenses);
    });

    return () => unsubscribe(); // Cleanup on unmount
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
