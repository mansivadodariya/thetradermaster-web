"use client";
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preserve 100% native momentum scrolling on mobile & touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches) {
      return;
    }

    // Skip Lenis entirely if user prefers reduced motion
    if (prefersReducedMotion) {
      document.documentElement.classList.add('lenis-reduced-motion');
      return;
    }

    const lenis = new Lenis({
      duration: 0.8,        // Slightly longer for smoother feel
      lerp: 0.12,           // Lower lerp = smoother, less jittery
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5, // Better touch handling
      smoothWheel: true,
      syncTouch: true,      // Sync touch for better mobile feel
      infinite: false,
      gestureOrientation: 'vertical',
      smoothTouch: false,   // Let native handle touch
    });

    window.lenis = lenis;

    let animationFrameId = null;
    let isRunning = true;

    function raf(time) {
      if (!isRunning) return;
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(raf);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (e) => {
      if (e.matches) {
        lenis.destroy();
        document.documentElement.classList.add('lenis-reduced-motion');
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        document.documentElement.classList.remove('lenis-reduced-motion');
        // Re-initialize would need a remount - skip for simplicity
      }
    };
    mediaQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      isRunning = false;
      document.removeEventListener('visibilitychange', handleVisibility);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete window.lenis;
      document.documentElement.classList.remove('lenis-reduced-motion');
    };
  }, []);

  return <>{children}</>;
}
