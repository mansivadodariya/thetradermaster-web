import React from 'react';
import styles from './herobanner.module.scss';

const RAYS_CONFIG = [
  { id: 'rayTop', x1: 250, y1: 44, x2: 250, y2: 175, dur: '2.2s', begin: '1.1s' },
  { id: 'rayTopRight', x1: 410, y1: 135, x2: 310, y2: 205, dur: '2.4s', begin: '1.2s' },
  { id: 'rayBottomRight', x1: 365, y1: 430, x2: 295, y2: 305, dur: '2.3s', begin: '1.15s' },
  { id: 'rayBottomLeft', x1: 135, y1: 430, x2: 205, y2: 305, dur: '2.3s', begin: '1.15s' },
  { id: 'rayTopLeft', x1: 90, y1: 135, x2: 190, y2: 205, dur: '2.4s', begin: '1.2s' },
];

export default function HudPentagonRays() {
  return (
    <svg className={styles.pentagonRaysSvg} viewBox="0 0 500 500" aria-hidden="true">
      <defs>
        <linearGradient id="rayTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22f7ab" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#18c98b" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="rayTopRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22f7ab" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#18c98b" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="rayBottomRight" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#22f7ab" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#18c98b" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="rayBottomLeft" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22f7ab" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#18c98b" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="rayTopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22f7ab" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#18c98b" stopOpacity="0.15" />
        </linearGradient>
        <filter id="hudNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {RAYS_CONFIG.map(({ id, x1, y1, x2, y2, dur, begin }) => {
        const path = `M ${x1} ${y1} L ${x2} ${y2}`;
        return (
          <g key={id}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${id})`} strokeWidth="1.5" strokeDasharray="3 4" strokeOpacity="0.6" className={styles.baseRayLine} />
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22f7ab" strokeWidth="2" strokeDasharray="10 26" className={styles.flowingBeam} />
            <circle r="3.5" fill="#22f7ab" filter="url(#hudNeonGlow)" className={styles.movingParticle}>
              <animateMotion dur={dur} repeatCount="indefinite" path={path} calcMode="linear" />
              <animate attributeName="opacity" values="0.3;1;1;0.3" dur={dur} repeatCount="indefinite" />
            </circle>
            <circle r="2" fill="#a7f3d0" opacity="0.9" className={styles.movingParticleSmall}>
              <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={path} calcMode="linear" />
              <animate attributeName="opacity" values="0.2;0.9;0.9;0.2" dur={dur} begin={begin} repeatCount="indefinite" />
            </circle>
            <circle cx={x2} cy={y2} r="4.5" fill="#18c98b" filter="url(#hudNeonGlow)" className={styles.centerTargetDot} />
            <circle cx={x2} cy={y2} r="4" fill="none" stroke="#22f7ab" strokeWidth="1.5" className={styles.targetPulseRing}>
              <animate attributeName="r" values="4;13" dur={dur} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur={dur} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
