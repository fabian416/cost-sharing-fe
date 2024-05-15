import React from 'react';
import styles from './GroupSection2.module.css';

const GroupSection2 = ({ groupId }) => {
  return (
    <div className={styles.container}>
      <div className={styles.groupContainer}>
        <h2 className={styles.subTitle}>Group {groupId} Section 2</h2>
        {/* Otros elementos específicos para GroupDetails */}
      </div>
    </div>
  );
};

export default GroupSection2;
