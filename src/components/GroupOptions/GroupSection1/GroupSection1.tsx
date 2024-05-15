import React from 'react';
import styles from './GroupSection1.module.css';

const GroupSection1 = ({ groupId }) => {
  return (
    <div className={styles.container}>
      <div className={styles.groupContainer}>
        <h2 className={styles.subTitle}>Group {groupId} Section 1</h2>
        {/* Otros elementos específicos para GroupDetails */}
      </div>
    </div>
  );
};

export default GroupSection1;
