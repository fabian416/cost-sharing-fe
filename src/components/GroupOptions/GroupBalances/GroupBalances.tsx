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
  groupId: string;
  member: string;
  balance: string; // Se usa string para manejar BigNumber
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

  return (
    <div className={styles.container}>
      <div className={styles.groupContainer}>
        <h2 className={styles.subTitle}>Simplified Debts</h2>
        <h3 className={styles.subTitle}>Status: On-chain</h3>
        <ul className={styles.debtsList}>
          {balances.length > 0 ? (
            balances.map((balance) => {
              const amount = parseFloat(ethers.utils.formatUnits(balance.balance, 18)); // Formatear BigNumber
              return (
                <li key={balance.id} className={styles.debtCard}>
                  <span className={styles.member}>{balance.member}</span> has a balance of: 
                  <span className={styles.amount}>${amount.toFixed(2)}</span>
                </li>
              );
            })
          ) : (
            <p>No debts found for this group.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupBalances;