"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0,
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: delay,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert(); // Cleanup for React Strict Mode
  }, [delay]);

  return (
    <div ref={sectionRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export function AnimatedCard({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const directions = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { x: 50, y: 0 },
      right: { x: -50, y: 0 },
      none: { x: 0, y: 0 },
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { 
          opacity: 0, 
          x: directions[direction].x, 
          y: directions[direction].y,
          scale: 0.97
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: duration,
          delay: delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [direction, delay, duration]);

  return (
    <div ref={cardRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

