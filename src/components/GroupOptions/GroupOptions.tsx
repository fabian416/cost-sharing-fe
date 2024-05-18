import React from 'react';
import styles from './GroupOptions.module.css';

interface GroupOptionsProps {
  groupId: string;
  groupName: string;
}

const GroupOptions: React.FC<GroupOptionsProps> = ({ groupId, groupName }) => {

  return (
    <div className={styles.groupOptions}>
      <h1 className={styles.title}>{groupName} Options</h1>
      <div className={styles.buttonsContainer}>
        <button className={`${styles.button} ${styles.viewDetails}`} onClick={() => console.log("View Details Clicked")}>View Details</button>
        <button className={`${styles.button} ${styles.addMember}`} onClick={() => console.log("Add Member Clicked")}>Add Member</button>
      </div>
    </div>
  );
};

export default GroupOptions;
