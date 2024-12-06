import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ethers } from 'ethers';
import styles from './GroupBalances.module.css';
import { useEnsName } from 'wagmi';
import { useUser } from '../../../utils/UserContext';
import { sepolia } from 'viem/chains';

// Apollo Client setup
const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/49377/balances/v0.0.2',
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
  balances: Balance[]; // La lista de balances será pasada como prop
}

interface Balance {
  id: string;
  member: string;
  balance: string; // Manejo como string para BigNumber
}

// Nuevo tipo extendido para incluir las propiedades calculadas
interface ProcessedBalance extends Balance {
  rawBalance: number;
  available: number;
}

export const fetchBalances = async (groupId: string): Promise<Balance[]> => {

  try {
    const result = await client.query({
      query: GET_BALANCES,
      variables: { groupId },
      fetchPolicy: "no-cache",
    });

    const balances = result.data.balances || [];
    console.log('Fetched balances from subgraph:', balances);
    return balances;
  } catch (error) {
    console.error('Error fetching on-chain balances:', error);
    return [];
  }
};

const calculateNetAvailable = (balances: Balance[], memberAddress: string): number => {
  console.log(`Calculating net available for member: ${memberAddress}`);

  const userBalance = balances.find((b) => b.member === memberAddress)?.balance || '0';
  const userDeposits = parseFloat(ethers.formatUnits(userBalance, 6));

  const debtsOwedByUser = balances
    .filter((b) => parseFloat(ethers.formatUnits(b.balance, 6)) < 0)
    .reduce((sum, debt) => {
      const debtAmount = Math.abs(parseFloat(ethers.formatUnits(debt.balance, 6)));
      return sum + debtAmount;
    }, 0);

  const netAvailable = Math.max(userDeposits - debtsOwedByUser, 0);
  return netAvailable;
};

// Componente auxiliar para resolver nombres con prioridad ENS > Alias > Dirección abreviada
const ENSName: React.FC<{ address: string }> = ({ address }) => {
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: sepolia.id, // Sepolia o Mainnet
  });
  const { aliases } = useUser();

  const resolveName = (): string => {
    if (ensName) return ensName; // Si hay ENS
    if (aliases[address.toLowerCase()]) return aliases[address.toLowerCase()]; // Si hay alias
    return `${address.substring(0, 6)}...${address.slice(-4)}`; // Dirección abreviada
  };

  return <>{resolveName()}</>;
};

const GroupBalances: React.FC<GroupBalancesProps> = ({ balances }) => {
  const [processedBalances, setProcessedBalances] = useState<ProcessedBalance[]>([]);

  useEffect(() => {
    console.log("Balances received in GroupBalances:", balances);
    const formattedBalances = balances.map((balance) => {
      const rawBalance = parseFloat(ethers.formatUnits(balance.balance, 6));
      const available = calculateNetAvailable(balances, balance.member);
      return {
        ...balance,
        rawBalance,
        available,
      };
    });
    setProcessedBalances(formattedBalances);
    console.log("Processed balances updated:", formattedBalances);
  }, [balances]);

  const owingBalances = processedBalances.filter((b) => b.rawBalance < 0).map((debtor) => {
    const creditor = processedBalances.find(
      (b) => b.rawBalance > 0 && b.member !== debtor.member
    );
    return {
      ...debtor,
      creditor: creditor?.member || 'Unknown',
    };
  });

  const availableBalances = processedBalances.filter((b) => b.available > 0);
  
  return (
  <div className={styles.container}>
    <div className={styles.header}>
      <h2 className={styles.title}>Balances</h2>
      <span className={styles.status}>• Confirmed</span>
    </div>
    <div className={styles.groupContainer}>
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
              <span className={styles.member}>
                <ENSName address={balance.member} />
              </span>{' '}
              owes{' '}
              <span className={styles.amount}>
                ${Math.abs(balance.rawBalance).toFixed(2)}
              </span>{' '}
              to{' '}
              <span className={styles.creditor}>
                {balance.creditor && <ENSName address={balance.creditor} />}
              </span>
            </li>
          ))
        ) : (
          <p>No debts found for this group.</p>
        )}
      </ul>
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
              <span className={styles.member}>
                <ENSName address={balance.member} />
              </span>{' '}
              available{' '}
              <span className={styles.amount}>
                ${balance.available.toFixed(2)}
              </span>
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