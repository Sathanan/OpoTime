'use client';
import React from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.logoAnimation}>
          <svg
            className={styles.logoSvg}
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className={styles.logoCircle}
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
            />
            <path
              className={styles.logoPath}
              d="M 50 5 L 50 95"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              className={styles.logoPath}
              d="M 5 50 L 95 50"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className={styles.loadingText}>
          <span className={styles.letter}>L</span>
          <span className={styles.letter}>a</span>
          <span className={styles.letter}>d</span>
          <span className={styles.letter}>e</span>
          <span className={styles.letter}>&nbsp;</span>
          <span className={styles.letter}>P</span>
          <span className={styles.letter}>r</span>
          <span className={styles.letter}>o</span>
          <span className={styles.letter}>f</span>
          <span className={styles.letter}>i</span>
          <span className={styles.letter}>l</span>
          <span className={styles.letter}>.</span>
          <span className={styles.letter}>.</span>
          <span className={styles.letter}>.</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        <div className={styles.loadingPulse}></div>
      </div>
    </div>
  );
};

export default LoadingScreen; 