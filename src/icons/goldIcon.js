'use client';
import React from 'react';

export default function GoldIcon({ size = 20, className = '' }) {
  const id = React.useId().replace(/:/g, '');
  const topGradId = `goldTop-${id}`;
  const frontGradId = `goldFront-${id}`;
  const sideGradId = `goldSide-${id}`;
  const shineGradId = `goldShine-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={topGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="25%" stopColor="#FDE68A" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id={frontGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id={sideGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="60%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id={shineGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Bottom-Left Gold Ingot */}
      <g>
        <polygon points="2,14 4.5,11 11,11 8.5,14" fill={`url(#${topGradId})`} />
        <polygon points="2,14 8.5,14 8.5,18 2,18" fill={`url(#${frontGradId})`} />
        <polygon points="8.5,14 11,11 11,15 8.5,18" fill={`url(#${sideGradId})`} />
        <line x1="2.2" y1="14" x2="8.3" y2="14" stroke={`url(#${shineGradId})`} strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* Bottom-Right Gold Ingot */}
      <g>
        <polygon points="11.5,14 14,11 20.5,11 18,14" fill={`url(#${topGradId})`} />
        <polygon points="11.5,14 18,14 18,18 11.5,18" fill={`url(#${frontGradId})`} />
        <polygon points="18,14 20.5,11 20.5,15 18,18" fill={`url(#${sideGradId})`} />
        <line x1="11.7" y1="14" x2="17.8" y2="14" stroke={`url(#${shineGradId})`} strokeWidth="0.8" strokeLinecap="round" />
      </g>

      {/* Top Stacked Gold Ingot */}
      <g>
        <polygon points="6.75,9 9.25,6 15.75,6 13.25,9" fill={`url(#${topGradId})`} />
        <polygon points="6.75,9 13.25,9 13.25,13 6.75,13" fill={`url(#${frontGradId})`} />
        <polygon points="13.25,9 15.75,6 15.75,10 13.25,13" fill={`url(#${sideGradId})`} />
        <line x1="7" y1="9" x2="13" y2="9" stroke={`url(#${shineGradId})`} strokeWidth="0.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}
