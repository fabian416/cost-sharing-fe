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

// Función para calcular el balance neto disponible para un usuario
const calculateNetAvailable = (
  balances: Balance[],
  memberAddress: string
): number => {
  console.log(`Calculating net available for member: ${memberAddress}`);
  
  // Encuentra el balance bruto del usuario
  const userBalance = balances.find((b) => b.member === memberAddress)?.balance || '0';
  const userDeposits = parseFloat(ethers.utils.formatUnits(userBalance, 6));
  console.log(`Raw user balance: ${userBalance}, Deposits on-chain: ${userDeposits}`);

  // Calcular las deudas que el usuario tiene
  const debtsOwedByUser = balances
    .filter((b) => parseFloat(ethers.utils.formatUnits(b.balance, 6)) < 0) // Deudas (balances negativos)
    .reduce((sum, debt) => {
      const debtAmount = Math.abs(parseFloat(ethers.utils.formatUnits(debt.balance, 6)));
      console.log(`Debt owed by ${debt.member}: ${debtAmount}`);
      return sum + debtAmount;
    }, 0);

  console.log(`Total debts owed by user (${memberAddress}): ${debtsOwedByUser}`);

  // Balance neto disponible: depósitos - deudas del usuario
  const netAvailable = Math.max(userDeposits - debtsOwedByUser, 0);
  console.log(`Net available for user ${memberAddress}: ${netAvailable}`);
  
  return netAvailable;
};

const GroupBalances: React.FC<GroupBalancesProps> = ({ groupId }) => {
  const [balances, setBalances] = useState<Balance[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const result = await client.query({
          query: GET_BALANCES,
          variables: { groupId },
        });

        setBalances(result.data.balances || []);
        console.log('Fetched balances:', result.data.balances);
      } catch (error) {
        console.error('Error fetching on-chain balances:', error);
      }
    };

    fetchBalances();
  }, [groupId]);

  // Formatear el balance a 6 decimales para USDT/USDC
  const formatBalance = (balance: string): number => {
    return parseFloat(ethers.utils.formatUnits(balance, 6));
  };

  // Procesar balances para calcular disponible y deudas
  const processedBalances = balances.map((balance) => {
    const rawBalance = formatBalance(balance.balance); // Balance bruto
    const available = calculateNetAvailable(balances, balance.member); // Balance neto disponible
    return {
      ...balance,
      rawBalance,
      available,
    };
  });

  // Generar las relaciones de deudas (quién le debe a quién)
  const owingBalances = processedBalances
    .filter((b) => b.rawBalance < 0)
    .map((debtor) => {
      const creditor = processedBalances.find(
        (b) => b.rawBalance > 0 && b.member !== debtor.member
      );
      return {
        ...debtor,
        creditor: creditor?.member || 'Unknown',
      };
    });

  const availableBalances = processedBalances.filter((b) => b.available > 0); // Balances disponibles

  return (
    <div className={styles.container}>
  {/* Título y estado */}
  <div className={styles.header}>
    <h2 className={styles.title}>Balances</h2>
    <span className={styles.status}>• Confirmed</span>
  </div>
  
  {/* Contenedor interno */}
  <div className={styles.groupContainer}>
    {/* Sección de deudas */}
    <h3 className={styles.subTitle}>Debts</h3>
    <ul className={styles.debtsList}>
      {owingBalances.length > 0 ? (
        owingBalances.map((balance) => (
          <li
            key={balance.id}
            className={styles.debtCard}
            style={{
              border: '2px solid #c82333',
              color: '#721c24',
            }}
          >
            <span className={styles.member}>{balance.member}</span>{' '}
            owes <span className={styles.amount}>${Math.abs(balance.rawBalance).toFixed(2)}</span>{' '}
            to <span className={styles.creditor}>{balance.creditor}</span>
          </li>
        ))
      ) : (
        <p>No debts found for this group.</p>
      )}
    </ul>

    {/* Sección de balances disponibles */}
    <h3 className={styles.subTitle}>Available Balances</h3>
    <ul className={styles.debtsList}>
      {availableBalances.length > 0 ? (
        availableBalances.map((balance) => (
          <li
            key={balance.id}
            className={styles.debtCard}
            style={{
              border: '2px solid #218838',
              color: '#155724',
            }}
          >
            <span className={styles.member}>{balance.member}</span>{' '}
            available <span className={styles.amount}>${balance.available.toFixed(2)}</span>
          </li>
        ))
      ) : (
        <p>No available balances for this group.</p>
      )}
    </ul>
  </div>
</div>
  );
};

export default GroupBalances;