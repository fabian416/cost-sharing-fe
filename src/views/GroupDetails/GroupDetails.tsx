import React from 'react';
import { useParams } from 'react-router-dom';
import GroupOptions from '../../components/GroupOptions/GroupOptions';
import GroupExpenses from '../../components/GroupOptions/GroupExpenses/GroupExpenses';
import GroupBalances from '../../components/GroupOptions/GroupBalances/GroupBalances'
import styles from './GroupDetails.module.css';
import { getSimplifiedDebts } from '../../firebaseConfig';

const GroupDetails = () => {
  const { groupId, groupName } = useParams<{ groupId: string; groupName: string }>();

  if (!groupId || !groupName) {
    return <div>Error: No se encontró el ID o el nombre del grupo.</div>;
  }
  return (
    <div className={styles.groupDetails}>
      <GroupOptions groupId={groupId} groupName={groupName} />
      <div className={styles.sectionsContainer}>
        <GroupExpenses groupId={groupId} />
        <GroupBalances groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupDetails;