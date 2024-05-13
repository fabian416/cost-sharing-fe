import React from 'react';
import styles from './AdditionalSection1.module.css';  // Asegúrate de crear este archivo CSS

const AdditionalSection1 = () => {
  return (
    <div className={styles.container}>
    <div className={styles.additionalContainer}>
      <h2 className={styles.subTitle}>Additional Section 1</h2>
      <p>Content for the first additional section goes here...</p>
    </div>
    </div>
  );
}

export default AdditionalSection1;
