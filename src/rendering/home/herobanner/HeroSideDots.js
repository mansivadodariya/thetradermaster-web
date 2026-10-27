"use client";
import React from 'react';
import styles from './herobanner.module.scss';

const LEFT_DOTS = [
  { id: 'ld1', left: '4%', top: '24%', size: 5, delay: '0s', duration: '5.2s' },
  { id: 'ld3', left: '17%', top: '26%', size: 4, delay: '2.1s', duration: '4.7s' },
  { id: 'ld4', left: '7%', top: '56%', size: 6, delay: '0.7s', duration: '7.3s' },
  { id: 'ld5', left: '14%', top: '70%', size: 5, delay: '2.8s', duration: '5.9s' },
  { id: 'ld6', left: '21%', top: '46%', size: 4, delay: '1.1s', duration: '6.2s' },
  { id: 'ld7', left: '9%', top: '82%', size: 6, delay: '3.4s', duration: '5.5s' },
];

const RIGHT_DOTS = [
  { id: 'rd1', right: '4%', top: '22%', size: 6, delay: '0.8s', duration: '6.1s' },
  { id: 'rd2', right: '12%', top: '35%', size: 4, delay: '2.3s', duration: '5.4s' },
  { id: 'rd3', right: '18%', top: '46%', size: 7, delay: '1.0s', duration: '7.0s' },
  { id: 'rd4', right: '8%', top: '62%', size: 5, delay: '3.1s', duration: '4.9s' },
  { id: 'rd5', right: '15%', top: '74%', size: 6, delay: '1.7s', duration: '6.5s' },
  { id: 'rd6', right: '22%', top: '50%', size: 4, delay: '2.6s', duration: '5.8s' },
  { id: 'rd7', right: '10%', top: '84%', size: 5, delay: '0.3s', duration: '6.4s' },
];

export default React.memo(function HeroSideDots() {
  return (
    <div className={styles.sideDotsWrapper} aria-hidden="true">
      {/* Left side floating glowing dots */}
      <div className={styles.sideDotsLeft}>
        {LEFT_DOTS.map((dot) => (
          <span
            key={dot.id}
            className={styles.ambientPulseDot}
            style={{
              left: dot.left,
              top: dot.top,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              animationDelay: dot.delay,
              animationDuration: dot.duration
            }}
          />
        ))}
      </div>

      {/* Right side floating glowing dots */}
      <div className={styles.sideDotsRight}>
        {RIGHT_DOTS.map((dot) => (
          <span
            key={dot.id}
            className={styles.ambientPulseDot}
            style={{
              right: dot.right,
              top: dot.top,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              animationDelay: dot.delay,
              animationDuration: dot.duration
            }}
          />
        ))}
      </div>
    </div>
  );
});
