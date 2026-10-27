"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get reduced motion state and a class name for conditional styling
 */
export function useReducedMotionClass() {
  const prefersReducedMotion = useReducedMotion();
  return {
    prefersReducedMotion,
    reducedMotionClass: prefersReducedMotion ? 'reduce-motion' : '',
    noAnimationsClass: prefersReducedMotion ? 'no-animations' : ''
  };
}

export default useReducedMotion;