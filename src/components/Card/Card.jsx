import React from 'react';
import styles from './Card.module.css';

const Card = ({ card, isFlipped, isMatched, isError, onClick, disabled }) => {
  return (
    <div 
      className={`${styles.cardWrapper} ${isFlipped ? styles.flipped : ''} ${isMatched ? styles.matched : ''} ${isError ? styles.error : ''}`}
      onClick={disabled ? null : onClick}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          {/* Back of the card (what you see before you flip) */}
          <div className={styles.pattern} />
        </div>
        <div className={styles.cardBack}>
          {/* Front of the card (what you see when flipped) */}
          {card.type === 'flag' ? (
            <img src={card.value} alt="country flag" className={styles.flagImage} />
          ) : (
            <span className={styles.countryName}>{card.value}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
