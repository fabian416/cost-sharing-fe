import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GroupOptions from '../../components/GroupOptions/GroupOptions';
import GroupExpenses from '../../components/GroupOptions/GroupExpenses/GroupExpenses';
import GroupBalances, { fetchBalances } from '../../components/GroupOptions/GroupBalances/GroupBalances';
import styles from './GroupDetails.module.css';

interface Balance {
  id: string;
  member: string;
  balance: string; // Manejo como string para BigNumber
}

const GroupDetails = () => {
  const { groupId, groupName } = useParams<{ groupId: string; groupName: string }>();
  const [balances, setBalances] = useState<Balance[]>([]); // Define el tipo explícito aquí

  if (!groupId || !groupName) {
    return <div>Error: No se encontró el ID o el nombre del grupo.</div>;
  }

  const updateBalances = async () => {
    try {
      const fetchedBalances: Balance[] = await fetchBalances(groupId); // Asegúrate de que `fetchBalances` devuelve un `Balance[]`
      setBalances(fetchedBalances); // Ahora TypeScript sabe que `setBalances` espera un `Balance[]`
      console.log('Balances actualizados en GroupDetails:', fetchedBalances);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  useEffect(() => {
    updateBalances();
  }, [groupId]);

  return (
    <div className={styles.groupDetails}>
      <GroupOptions groupId={groupId} groupName={groupName} onBalancesUpdate={updateBalances} />
      <div className={styles.sectionsContainer}>
        <GroupExpenses groupId={groupId} />
        <GroupBalances balances={balances} />
      </div>
    </div>
  );
};

export default GroupDetails;