import React from 'react';
import styles from './GroupDetails.module.css';

const GroupDetails = () => {
  // Supongamos que tenemos algunos datos del grupo
  const group = {
    name: "React Developers",
    members: ["John Doe", "Jane Smith"]
  };

  return (
    <div className={styles.groupDetails}>
      <h1>Group Details</h1>
      <p>Name: {group.name}</p>
      <ul>
        {group.members.map(member => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupDetails;
