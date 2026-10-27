'use client';

import React, { useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import styles from './borderGlow.module.scss';

const BorderGlow = forwardRef(function BorderGlow(
  {
    children,
    className = '',
    edgeSensitivity = 30,
    glowColor = '#00FF88',
    backgroundColor = '#050d09',
    borderRadius = 24,
    glowRadius = 180,
    glowIntensity = 1,
    coneSpread = 30,
    animated = false,
    colors = ['#00FF88', '#00F0FF', '#10b981'],
    style = {},
    ...props
  },
  ref
) {
  const containerRef = useRef(null);
  useImperativeHandle(ref, () => containerRef.current);

  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate distance to nearest border edge
      const distLeft = x;
      const distRight = rect.width - x;
      const distTop = y;
      const distBottom = rect.height - y;
      const minEdgeDist = Math.min(distLeft, distRight, distTop, distBottom);

      let edgeFactor = 1;
      if (edgeSensitivity > 0) {
        if (minEdgeDist > edgeSensitivity) {
          // Smooth falloff inside card when cursor moves inward
          const excess = minEdgeDist - edgeSensitivity;
          edgeFactor = Math.max(0.35, 1 - excess / 90);
        }
      }

      // Angle calculation for cone animation or beam direction
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angleRad = Math.atan2(y - centerY, x - centerX);
      const angleDeg = (angleRad * 180) / Math.PI + 90;

      const el = containerRef.current;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
      el.style.setProperty('--mouse-angle', `${angleDeg}deg`);
      el.style.setProperty('--edge-factor', `${edgeFactor * glowIntensity}`);
    },
    [edgeSensitivity, glowIntensity]
  );

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const parseColor = (c) => {
    if (!c) return '#00FF88';
    if (typeof c !== 'string') return String(c);
    const trimmed = c.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('rgb') || trimmed.startsWith('hsl')) {
      return trimmed;
    }
    const parts = trimmed.split(/\s+/);
    if (parts.length === 3) {
      return `rgb(${parts.join(', ')})`;
    }
    return trimmed;
  };

  const mainColor = parseColor(glowColor);
  const colorArray =
    Array.isArray(colors) && colors.length > 0
      ? colors.map(parseColor)
      : [mainColor, '#00F0FF', '#10b981'];

  return (
    <div
      ref={containerRef}
      className={`${styles.glowWrapper} ${animated ? styles.animated : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        backgroundColor: backgroundColor,
        '--glow-color-1': colorArray[0] || mainColor,
        '--glow-color-2': colorArray[1] || colorArray[0] || mainColor,
        '--glow-color-3': colorArray[2] || colorArray[1] || mainColor,
        '--glow-radius': `${glowRadius}px`,
        '--glow-opacity': opacity,
        '--cone-spread': `${coneSpread}deg`,
        ...style,
      }}
      {...props}
    >
      {/* 1.5px glowing border following cursor */}
      <div className={styles.glowBorder} />

      {/* Outer ambient aura */}
      <div className={styles.glowAura} />

      {/* Content wrapper */}
      <div
        className={styles.glowInner}
        style={{
          borderRadius: typeof borderRadius === 'number' ? `${borderRadius - 1}px` : borderRadius,
        }}
      >
        {children}
      </div>
    </div>
  );
});

export default BorderGlow;
