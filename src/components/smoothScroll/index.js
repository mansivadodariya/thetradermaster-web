'use client';
import React, { useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScrollProvider({ children }) {
  // Sync GSAP ScrollTrigger with Lenis
  useLenis(ScrollTrigger.update);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothTouch: false }}>
      {children}
    </ReactLenis>
  );
}
