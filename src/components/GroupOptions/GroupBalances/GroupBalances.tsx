import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ethers } from 'ethers';
import styles from './GroupBalances.module.css';

// Apollo Client setup
const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/49377/balances/0.0.2',
  cache: new InMemoryCache(),
});

const GET_BALANCES = gql`
  query GetBalances($groupId: Bytes!) {
    balances(where: { groupId: $groupId }) {
      id
      member
      balance
    }
  }
`;

interface GroupBalancesProps {
  groupId: string;
}

interface Balance {
  id: string;
  member: string;
  balance: string; // Manejo como string para BigNumber
}

const GroupBalances: React.FC<GroupBalancesProps> = ({ groupId }) => {
  const [balances, setBalances] = useState<Balance[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const result = await client.query({
          query: GET_BALANCES,
          variables: { groupId },
        });

        // Guardar los balances obtenidos
        setBalances(result.data.balances || []);
      } catch (error) {
        console.error('Error fetching on-chain balances:', error);
      }
    };

    fetchBalances();
  }, [groupId]);

  // Ajustar a 6 decimales para USDT/USDC
  const formatBalance = (balance: string): number => {
    return parseFloat(ethers.utils.formatUnits(balance, 6));
  };

  // Separar las deudas (negative balances) y saldos disponibles (positive balances)
  const owingBalances = balances.filter((balance) => formatBalance(balance.balance) < 0);
  const availableBalances = balances.filter((balance) => formatBalance(balance.balance) > 0);

  return (
    <div className={styles.container}>
      <div className={styles.groupContainer}>
        {/* Mostrar deudas */}
        <h2 className={styles.subTitle}>Debts</h2>
        <ul className={styles.debtsList}>
          {owingBalances.length > 0 ? (
            owingBalances.map((balance) => {
              const amount = Math.abs(formatBalance(balance.balance)).toFixed(2);
              return (
                <li
                  key={balance.id}
                  className={styles.debtCard}
                  style={{
                    border: '2px solid #c82333',
                    color: '#721c24',
                  }}
                >
                  <span className={styles.member}>{balance.member}</span>{' '}
                  owes <span className={styles.amount}>${amount}</span>
                </li>
              );
            })
          ) : (
            <p>No debts found for this group.</p>
          )}
        </ul>

        {/* Mostrar saldos disponibles */}
        <h2 className={styles.subTitle}>Available Balances</h2>
        <ul className={styles.debtsList}>
          {availableBalances.length > 0 ? (
            availableBalances.map((balance) => {
              const amount = formatBalance(balance.balance).toFixed(2);
              return (
                <li
                  key={balance.id}
                  className={styles.debtCard}
                  style={{
                    border: '2px solid #218838',
                    color: '#155724',
                  }}
                >
                  <span className={styles.member}>{balance.member}</span>{' '}
                  available <span className={styles.amount}>${amount}</span>
                </li>
              );
            })
          ) : (
            <p>No available balances for this group.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupBalances;