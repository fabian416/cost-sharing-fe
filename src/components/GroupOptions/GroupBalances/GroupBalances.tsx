import React from 'react';
import styles from './GroupBalances.module.css';
import SimplifiedDebts from './SimplifiedDebts/SimplifiedDebts';

interface GroupSection2Props {
  groupId: string;
}

const GroupBalances: React.FC<GroupSection2Props> = ({ groupId }) => {
  return (
    <div className={styles.container}>
      <div className={styles.groupContainer}>
        <h2 className={styles.subTitle}>Balances</h2>
        <SimplifiedDebts groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupBalances;
