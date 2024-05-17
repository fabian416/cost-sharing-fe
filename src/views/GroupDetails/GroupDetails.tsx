import React from 'react';
import { useParams } from 'react-router-dom';
import GroupOptions from '../../components/GroupOptions/GroupOptions';
import GroupSection1 from '../../components/GroupOptions/GroupSection1/GroupSection1';
import GroupSection2 from '../../components/GroupOptions/GroupSection2/GroupSection2';
import styles from './GroupDetails.module.css';

const GroupDetails = () => {
  const { groupId } = useParams();

  return (
    <div className={styles.groupDetails}>
      <GroupOptions groupId={groupId} />
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <GroupSection1 groupId={groupId} />
        <GroupSection2 groupId={groupId} />
      </div>
    </div>
  );
};

export default GroupDetails;