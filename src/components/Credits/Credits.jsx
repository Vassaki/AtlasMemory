import React, { useEffect, useState } from 'react';
import styles from './Credits.module.css';

const Credits = ({ onMainMenu, grade, time, turns }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Reveal everything after animation
    const timer = setTimeout(() => setShowContent(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={styles.creditsContainer}>
      <div className={styles.cinematicRoll}>
        <h2 className={styles.role}>FINAL GRADE</h2>
        <h1 className={`${styles.gradeScore} ${styles[`grade${grade}`]}`}>
          {grade}
        </h1>
        <p className={styles.stats}>Time: {formatTime(time)} • Turns: {turns}</p>
        
        <div className={styles.spacer} />

        <h2 className={styles.role}>Created By</h2>
        <h1 className={styles.name}>Vasia Tsetso</h1>
        
        <div className={styles.spacer} />
        <p className={styles.thankYou}>Thank you for playing.</p>
      </div>

      {showContent && (
        <button className={styles.returnBtn} onClick={onMainMenu}>
          Return to Menu
        </button>
      )}
    </div>
  );
};

export default Credits;
