import React, { useEffect, useState } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, onSnapshot, DocumentData, QuerySnapshot, Timestamp } from 'firebase/firestore';
import styles from './GroupBalances.module.css';

interface GroupBalancesProps {
  groupId: string;
}

interface Debt {
  debtor: string;
  creditor: string;
  amount: number;
}

interface Expense {
  amount: number;
  description: string;
  paidBy: string;
  sharedWith: string[];
  settled: boolean;
  timestamp: Timestamp;
}

const GroupBalances: React.FC<GroupBalancesProps> = ({ groupId }) => {
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    const fetchExpensesAndSimplifyDebts = () => {
      console.log(`Fetching expenses for group: ${groupId}`);
      const expensesRef = collection(firestore, 'groups', groupId, 'expenses');
      onSnapshot(expensesRef, (snapshot: QuerySnapshot<DocumentData>) => {
        const balances: { [key: string]: number } = {};

        snapshot.forEach(doc => {
          const data = doc.data();
          const expense: Expense = {
            amount: data.amount,
            description: data.description,
            paidBy: data.paidBy,
            sharedWith: data.sharedWith,
            settled: data.settled,
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp : Timestamp.fromDate(new Date(data.timestamp))
          };
          console.log('Processing expense: ', expense);
          if (!expense.settled) {
            const share = expense.amount / expense.sharedWith.length;
            expense.sharedWith.forEach((member: string) => {
              if (member !== expense.paidBy) {
                if (!balances[member]) {
                  balances[member] = 0;
                }
                balances[member] -= share;
              }
            });
            if (!balances[expense.paidBy]) {
              balances[expense.paidBy] = 0;
            }
            balances[expense.paidBy] += expense.amount;
          }
        });

        console.log('Balances: ', balances);

        const calculatedDebts: Debt[] = [];
        for (const [debtor, debt] of Object.entries(balances)) {
          for (const [creditor, credit] of Object.entries(balances)) {
            if (debt < 0 && credit > 0) {
              const amount = Math.min(-debt, credit);
              calculatedDebts.push({ debtor, creditor, amount });
              balances[debtor] += amount;
              balances[creditor] -= amount;
            }
          }
        }

        console.log('Calculated Simplified Debts: ', calculatedDebts);
        setDebts(calculatedDebts);
      });
    };

    fetchExpensesAndSimplifyDebts();
  }, [groupId]);

  return (
    <div className={styles.container}>
      <div className={styles.groupContainer}>
        <h2 className={styles.subTitle}>Simplified Debts</h2>
        <ul>
          {debts.map((debt, index) => (
            <li key={index}>
              {debt.debtor} owes {debt.creditor}: {debt.amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupBalances;
