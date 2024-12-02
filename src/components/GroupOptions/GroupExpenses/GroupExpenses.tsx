import React, { useEffect, useState } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, onSnapshot, DocumentData, QuerySnapshot, Timestamp } from 'firebase/firestore';
import styles from './GroupExpenses.module.css';
import { useEnsName } from 'wagmi';
import { useUser } from '../../../utils/UserContext';
import { sepolia } from 'viem/chains';

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

const ENSName: React.FC<{ address: string }> = ({ address }) => {
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: sepolia.id, // Sepolia
  });
  const { aliases } = useUser();
  // Resolver con prioridad: ENS > Alias > Dirección abreviada
  const resolveName = (): string => {
    const normalizedAddress = address.toLowerCase().trim(); // Normalizamos la dirección
    console.log("Resolviendo nombre para:", normalizedAddress);
    console.log("ENS encontrado:", ensName);
    console.log("Alias encontrado:", aliases[normalizedAddress]);
  
    if (ensName) return ensName; // Si hay ENS, retorna el ENS
    if (aliases[normalizedAddress]) return aliases[normalizedAddress]; // Si hay alias, retorna el alias
    return `${normalizedAddress.substring(0, 6)}...${normalizedAddress.slice(-4)}`; // Dirección abreviada
  };

  return <>{resolveName()}</>;
};

const GroupExpenses: React.FC<GroupExpensesProps> = ({ groupId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Obtener gastos desde Firestore
  useEffect(() => {
    const expensesRef = collection(firestore, 'groups', groupId, 'expenses');
    const unsubscribe = onSnapshot(expensesRef, (snapshot: QuerySnapshot<DocumentData>) => {
      const fetchedExpenses: Expense[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          amount: data.amount,
          description: data.description,
          paidBy: data.paidBy,
          sharedWith: data.sharedWith,
          settled: data.settled,
          timestamp: data.timestamp,
        } as Expense;
      });

      // Filtrar los gastos no settleados
      setExpenses(fetchedExpenses.filter((expense) => !expense.settled));
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [groupId]);

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
                <span> Paid by: <ENSName address={expense.paidBy} /> </span>
                <span>
                   Shared with: {' '}
                  {expense.sharedWith.map((member) => (
                    <span key={member}>
                      <ENSName address={member} />
                    </span>
                  ))}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupExpenses;