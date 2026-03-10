import React from 'react';
import styles from './Menu.module.css';

const Menu = ({ onStart }) => {
  return (
    <div className={styles.menuContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Atlas</h1>
      </header>

      <div className={styles.settingsPanel}>
        <div className={styles.settingGroup}>
          <h3 className={styles.settingLabel}>CHOOSE DIFFICULTY</h3>
          <div className={styles.optionsWrapper}>
            <button 
              className={styles.optionBtn}
              onClick={() => onStart(6)}
            >
              Beginner
            </button>
            <button 
              className={styles.optionBtn}
              onClick={() => onStart(10)}
            >
              Medium
            </button>
            <button 
              className={styles.optionBtn}
              onClick={() => onStart(15)}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
