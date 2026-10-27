"use client";
import React from 'react';
import styles from './herobanner.module.scss';

const SLOPE_BEAMS = [
  {
    id: 'leftMain',
    d: 'M -40 40 L 390 620',
    dotPath: 'M -40 40 L 390 620',
    dur: '3.6s',
    delay: '0s',
    strokeWidth: 1,
    gradientId: 'leftMainGrad'
  },
  {
    id: 'leftSub',
    d: 'M 30 380 L 310 820',
    dotPath: 'M 30 380 L 310 820',
    dur: '4.2s',
    delay: '1.4s',
    strokeWidth: 1,
    gradientId: 'leftSubGrad'
  },
  {
    id: 'rightMain',
    d: 'M 1480 40 L 1050 620',
    dotPath: 'M 1480 40 L 1050 620',
    dur: '3.8s',
    delay: '0.6s',
    strokeWidth: 0.2,
    gradientId: 'rightMainGrad'
  },
  {
    id: 'rightSub',
    d: 'M 1410 380 L 1130 820',
    dotPath: 'M 1410 380 L 1130 820',
    dur: '4.4s',
    delay: '1.8s',
    strokeWidth: 1.5,
    gradientId: 'rightSubGrad'
  }
];

export default React.memo(function HeroSlopeLasers() {
  return (
    <div className={styles.slopeLasersWrapper} aria-hidden="true">
      <svg
        className={styles.slopeLasersSvg}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="leftMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#18C98B" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#6EE7B7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#18C98B" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="leftSubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#18C98B" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="rightMainGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#18C98B" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#6EE7B7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#18C98B" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="rightSubGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#18C98B" stopOpacity="0.05" />
          </linearGradient>

          <filter id="slopeLaserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="slopeParticleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {SLOPE_BEAMS.map((beam) => (
          <g key={beam.id} className={styles.slopeBeamGroup}>
            {/* 1. Subtle Guideline Track */}
            <path
              d={beam.d}
              fill="none"
              stroke="rgba(24, 201, 139, 0.18)"
              strokeWidth={beam.strokeWidth}
              strokeDasharray="4 6"
              className={styles.slopeTrackLine}
            />

            {/* 2. Fast Flowing Laser Beam Segment */}
            <path
              d={beam.d}
              fill="none"
              stroke={`url(#${beam.gradientId})`}
              strokeWidth={beam.strokeWidth + 1}
              strokeLinecap="round"
              filter="url(#slopeLaserGlow)"
              className={styles.slopeActiveBeam}
              style={{
                animationDuration: beam.dur,
                animationDelay: beam.delay
              }}
            />

            {/* 3. High-Intensity Moving Pulse Head */}
            <circle
              r="4"
              fill="#FFFFFF"
              filter="url(#slopeParticleGlow)"
              className={styles.slopeLeadingParticle}
            >
              <animateMotion
                dur={beam.dur}
                begin={beam.delay}
                repeatCount="indefinite"
                path={beam.dotPath}
                calcMode="linear"
              />
              <animate
                attributeName="opacity"
                values="0;0.9;1;0.9;0"
                dur={beam.dur}
                begin={beam.delay}
                repeatCount="indefinite"
              />
            </circle>

            {/* 4. Secondary Trailing Flare */}
            <circle
              r="6"
              fill="none"
              stroke="#6EE7B7"
              strokeWidth="1.5"
              className={styles.slopeTrailingFlare}
            >
              <animateMotion
                dur={beam.dur}
                begin={beam.delay}
                repeatCount="indefinite"
                path={beam.dotPath}
                calcMode="linear"
              />
              <animate
                attributeName="r"
                values="2;7;3"
                dur={beam.dur}
                begin={beam.delay}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.7;0.8;0"
                dur={beam.dur}
                begin={beam.delay}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
});
