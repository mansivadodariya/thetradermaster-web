"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to detect when an element is in the viewport
 * Useful for lazy-loading animations or heavy components
 *
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Margin around the root
 * @param {boolean} options.triggerOnce - Only trigger once
 * @returns {[React.RefObject, boolean]} - [ref, isInView]
 */
export function useInView(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  const setRef = useCallback((node) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [setRef, isInView];
}

/**
 * Hook to lazily enable animations only when element is visible
 * Combines reduced motion detection with viewport detection
 *
 * @param {Object} options - Options for both useReducedMotion and useInView
 * @returns {Object} - { ref, shouldAnimate, isInView, prefersReducedMotion }
 */
import { useReducedMotion } from './useReducedMotion';

export function useLazyAnimation(options = {}) {
  const prefersReducedMotion = useReducedMotion();
  const [setRef, isInView] = useInView(options);

  // Only animate if in view AND user doesn't prefer reduced motion
  const shouldAnimate = isInView && !prefersReducedMotion;

  return {
    ref: setRef,
    shouldAnimate,
    isInView,
    prefersReducedMotion
  };
}

export default useInView;