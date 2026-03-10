import React, { useEffect, useState } from 'react';
import { useAtlasLogic } from '../../hooks/useAtlasLogic';
import Card from '../Card/Card';
import Menu from '../Menu/Menu';
import Credits from '../Credits/Credits';
import styles from './Atlas.module.css';

const Atlas = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'playing' | 'credits'
  const [difficulty, setDifficulty] = useState(8);

  const { cards, flippedIds, matchedIds, turns, streak, timeSeconds, grade, handleCardClick, resetGame, isWin, isLocked } = useAtlasLogic(difficulty);

  // Dynamic Background UX: The higher the streak, the warmer the background gets
  // But now we just add an explicit overlay or effect since we have a new premium background coming soon
  // Let's just keep the tint for extra effect
  useEffect(() => {
    if (gameState === 'playing' && streak > 1) {
      document.body.style.backgroundColor = `rgba(212, 163, 115, ${streak * 0.05})`; // Tint with var(--accent)
    } else {
      document.body.style.backgroundColor = 'transparent'; // Let the animated body CSS shine through
    }

    // Cleanup on unmount or state change
    return () => { document.body.style.backgroundColor = 'transparent'; }
  }, [streak, gameState]);

  // Handle Win State Route Transition
  useEffect(() => {
    if (isWin) {
      const timer = setTimeout(() => {
        setGameState('credits');
      }, 2500); // Wait for them to see "Mastered!" then roll credits
      return () => clearTimeout(timer);
    }
  }, [isWin]);

  const handleStartGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    resetGame();
  };

  const handleReturnToMenu = () => {
    setGameState('menu');
    resetGame();
  };

  if (gameState === 'menu') {
    return <Menu onStart={handleStartGame} />;
  }

  if (gameState === 'credits') {
    return <Credits onMainMenu={handleReturnToMenu} grade={grade} time={timeSeconds} turns={turns} />;
  }

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getLevelName = (diff) => {
    if (diff === 6) return 'Beginner';
    if (diff === 10) return 'Medium';
    if (diff === 15) return 'Hard';
    return 'Level';
  };

  return (
    <div className={styles.container}>
      <div className={styles.hud}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Atlas</h1>
          <p className={styles.subtitle}>
            {getLevelName(difficulty)}
          </p>
        </div>

        <div className={styles.stats}>
          {streak > 1 && (
            <div className={`${styles.statBox} ${styles.streakAnim}`}>
              <span className={styles.statLabel}>STREAK</span>
              <span className={styles.statValueActive}>{streak}x🔥</span>
            </div>
          )}
          <div className={styles.statBox}>
            <span className={styles.statLabel}>TIME</span>
            <span className={styles.statValue}>{formatTime(timeSeconds)}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>TURNS</span>
            <span className={styles.statValue}>{turns}</span>
          </div>
          <button className={styles.resetBtn} onClick={() => { resetGame(); setGameState('menu'); }}>
            Menu
          </button>
        </div>
      </div>

      <div className={styles.gridWrapper}>
        <div
          className={`${styles.grid} ${isWin ? styles.winMode : ''} ${styles[`grid${difficulty}`]}`}
        >
          {cards.map(card => {
            const isFlipped = flippedIds.includes(card.uuid);
            const isMatched = matchedIds.includes(card.countryId);
            const isError = flippedIds.length === 2 && isFlipped && !isMatched;

            return (
              <Card
                key={card.uuid}
                card={card}
                isFlipped={isFlipped || isMatched}
                isMatched={isMatched}
                isError={isError}
                onClick={() => handleCardClick(card.uuid, card.countryId)}
                disabled={isLocked || isFlipped || isMatched}
              />
            );
          })}

          {isWin && (
            <div className={styles.winOverlay}>
              <div className={styles.winMessage}>
                <h2>Mastered!</h2>
                <p>Completed in {turns} turns.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Atlas;
