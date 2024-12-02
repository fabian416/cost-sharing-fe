import React, { useEffect, useState } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, onSnapshot, DocumentData, QuerySnapshot, Timestamp } from 'firebase/firestore';
import styles from './GroupExpenses.module.css';
import { useUser } from '../../../utils/UserContext';

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
  const { aliases } = useUser(); // Accede a los aliases desde el contexto

  const getAliasOrShortAddress = (address: string): string => {
    if (!address) return 'Unknown';
    const normalizedAddress = address.toLowerCase();
    const normalizedAliases = Object.keys(aliases).reduce((acc, key) => {
      acc[key.toLowerCase()] = aliases[key];
      return acc;
    }, {} as Record<string, string>);
    return normalizedAliases[normalizedAddress] || `${address.substring(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const expensesRef = collection(firestore, 'groups', groupId, 'expenses');
    const unsubscribe = onSnapshot(expensesRef, (snapshot: QuerySnapshot<DocumentData>) => {
      const fetchedExpenses: Expense[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          amount: data.amount,
          description: data.description,
          paidBy: getAliasOrShortAddress(data.paidBy), // Convertir dirección a alias o abreviación
          sharedWith: data.sharedWith
            .map((member: string) => getAliasOrShortAddress(member)) // Convertir cada miembro a alias o abreviación
            .filter((member: string) => member !== data.paidBy), // Filtrar al pagador
          settled: data.settled,
          timestamp: data.timestamp,
        } as Expense;
      });

      // Filtrar los gastos que ya han sido settleados
      const unsettledExpenses = fetchedExpenses.filter(expense => !expense.settled);
      setExpenses(unsettledExpenses);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [groupId, aliases]); // Asegúrate de que el efecto se dispare cuando los aliases cambien

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.expensesTitle}>Expenses</h2>
        <span className={styles.pendingStatus}>• Pending</span>
      </div>
      <div className={styles.groupContainer}>
        <ul className={styles.expensesList}>
          {expenses.map((expense, index) => (
            <li key={index} className={styles.expenseItem}>
              <div className={styles.expenseHeader}>
                <span className={styles.expenseDescription}>{expense.description}</span>
                <span className={styles.expenseAmount}> ${expense.amount}</span>
              </div>
              <div className={styles.expenseDetails}>
                <span> Paid by: {expense.paidBy}</span>
                <span> Shared with: {expense.sharedWith.join(', ')}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupExpenses;