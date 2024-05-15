import React from 'react';
import { useParams } from 'react-router-dom';
import GroupOptions from '../../components/GroupOptions/GroupOptions';
import GroupSection1 from '../../components/GroupOptions/GroupSection1/GroupSection1';
import GroupSection2 from '../../components/GroupOptions/GroupSection2/GroupSection2';
import styles from './GroupDetails.module.css';

const GroupDetails = () => {
  const { groupId } = useParams();

  const group = {
    name: `Group ${groupId}`,
    members: ["John Doe", "Jane Smith"] // Puedes ajustar esto según los datos reales del grupo
  };

  return (
    <div className={styles.groupDetails}>
      <GroupOptions groupId={groupId} />
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <GroupSection1 groupId={groupId} />
        <GroupSection2 groupId={groupId} />
      </div>
      <div>
        <h2>Group Details</h2>
        <p>Name: {group.name}</p>
        <ul>
          {group.members.map(member => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupDetails;
