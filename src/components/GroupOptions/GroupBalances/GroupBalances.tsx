import React, { useEffect, useState } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ethers } from 'ethers';
import styles from './GroupBalances.module.css';

// Apollo Client setup
const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/49377/balances/v0.0.1',
  cache: new InMemoryCache(),
});

const GET_BALANCES = gql`
  query GetBalances($groupId: Bytes!) {
    balances(where: { groupId: $groupId }) {
      id
      groupId
      member
      balance
    }
  }
`;

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
  timestamp: any;
}

interface Balance {
  id: string;
  groupId: string;
  member: string;
  balance: string; // Asegúrate de que sea string para BigNumber
}

const GroupBalances: React.FC<GroupBalancesProps> = ({ groupId }) => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [unsubscribe, setUnsubscribe] = useState<() => void>(() => () => {});

  useEffect(() => {
    // Función para obtener balances on-chain del subgrafo
    const fetchOnChainBalances = async () => {
      const result = await client.query({
        query: GET_BALANCES,
        variables: { groupId },
      });

      const onChainBalances = result.data.balances;
      const onChainDebts: Debt[] = onChainBalances.map((balance: Balance) => ({
        debtor: balance.member,
        creditor: balance.groupId, // Ajustar esto según sea necesario
        amount: parseFloat(ethers.utils.formatUnits(balance.balance, 18)) // Convertir BigNumber a número
      }));

      return onChainDebts;
    };

    // Función para obtener gastos no settleados de Firestore y unificar con balances on-chain
    const fetchDebts = async (onChainDebts: Debt[]) => {
      const expensesRef = collection(firestore, 'groups', groupId, 'expenses');
      const unsubscribe = onSnapshot(expensesRef, (snapshot: QuerySnapshot<DocumentData>) => {
        const balances: { [key: string]: number } = {};

        snapshot.forEach(doc => {
          const data = doc.data();
          const expense: Expense = {
            amount: data.amount,
            description: data.description,
            paidBy: data.paidBy,
            sharedWith: data.sharedWith,
            settled: data.settled,
            timestamp: data.timestamp
          };

          if (!expense.settled) {
            const totalParticipants = expense.sharedWith.length + 1; // Incluye al pagador
            const share = expense.amount / totalParticipants;

            // Ajustar la deuda de los miembros compartidos
            expense.sharedWith.forEach((member: string) => {
              if (!balances[member]) {
                balances[member] = 0;
              }
              balances[member] -= share; // Cada miembro debe una parte del gasto
            });

            // Ajustar la deuda del pagador
            if (!balances[expense.paidBy]) {
              balances[expense.paidBy] = 0;
            }
            balances[expense.paidBy] += share * expense.sharedWith.length; // El pagador asume la parte restante
          }
        });

        const calculatedDebts: Debt[] = [];
        for (const [debtor, debt] of Object.entries(balances)) {
          if (debt < 0) {
            for (const [creditor, credit] of Object.entries(balances)) {
              if (credit > 0) {
                const amount = Math.min(-debt, credit);
                if (amount > 0) {
                  calculatedDebts.push({ debtor, creditor, amount });
                  balances[debtor] += amount;
                  balances[creditor] -= amount;
                }
              }
            }
          }
        }

        // Unificar onChainDebts y calculatedDebts
        const unifiedDebts = [...onChainDebts, ...calculatedDebts];
        setDebts(unifiedDebts);
      });

      setUnsubscribe(() => unsubscribe);
    };

    // Limpiar la suscripción anterior y el estado antes de cambiar de grupo
    unsubscribe();
    setDebts([]);

    // Llamar a las funciones para obtener datos y unificarlos
    fetchOnChainBalances().then(fetchDebts);

    // Limpiar la suscripción de Firestore cuando el componente se desmonte o el grupo cambie
    return () => {
      unsubscribe();
    };
  }, [groupId]);

  return (
    <div className={styles.container}>
      <div className={styles.groupContainer}>
        <h2 className={styles.subTitle}>Simplified Debts</h2>
        <ul className={styles.debtsList}>
          {debts.map((debt, index) => (
            <li key={index} className={styles.debtCard}>
              <span className={styles.debtor}>{debt.debtor}</span> owes <span className={styles.creditor}>{debt.creditor}</span>: 
              <span className={styles.amount}>${debt.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupBalances;
