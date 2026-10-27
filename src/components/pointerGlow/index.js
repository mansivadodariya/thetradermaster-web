'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './pointerGlow.module.scss';

/**
 * Reusable Cursor/Pointer Move Emerald Glow Component
 * Follows the user's mouse pointer with smooth 60fps interpolation.
 * Optimized to pause animation loop when mouse is stationary to save CPU/GPU.
 * Respects prefers-reduced-motion.
 */
export default function PointerGlow({
    color = 'rgba(24, 201, 139, 0.35)',
    size = 560,
    contained = false,
    className = '',
    enabled = true // Allow disabling entirely
}) {
    const glowRef = useRef(null);
    const posRef = useRef({ currentX: -1000, currentY: -1000, targetX: -1000, targetY: -1000, isVisible: false, isAnimating: false });
    const rafIdRef = useRef(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Check reduced motion preference
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handler = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Disable entirely if reduced motion or not enabled
    if (prefersReducedMotion || !enabled) {
        return null;
    }

    useEffect(() => {
        const glowEl = glowRef.current;
        if (!glowEl) return;

        // Force GPU acceleration
        glowEl.style.willChange = 'transform, opacity';
        glowEl.style.transform = 'translate3d(-1000px, -1000px, 0) translate(-50%, -50%)';

        const animate = () => {
            const { currentX, currentY, targetX, targetY, isVisible } = posRef.current;

            const dx = targetX - currentX;
            const dy = targetY - currentY;

            // Use a threshold to stop animation when close enough
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                posRef.current.currentX = targetX;
                posRef.current.currentY = targetY;
                if (glowEl && isVisible) {
                    glowEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
                }
                posRef.current.isAnimating = false;
                rafIdRef.current = null;
                return;
            }

            // Slightly higher ease for more responsive feel
            const ease = 0.18;
            const newX = currentX + dx * ease;
            const newY = currentY + dy * ease;

            posRef.current.currentX = newX;
            posRef.current.currentY = newY;

            if (glowEl && isVisible) {
                // Use translate3d for GPU acceleration
                glowEl.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate(-50%, -50%)`;
            }

            rafIdRef.current = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (!posRef.current.isAnimating) {
                posRef.current.isAnimating = true;
                if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = requestAnimationFrame(animate);
            }
        };

        const handlePointerMove = (e) => {
            let clientX = e.clientX;
            let clientY = e.clientY;

            if (contained && glowEl.parentElement) {
                const rect = glowEl.parentElement.getBoundingClientRect();
                clientX = e.clientX - rect.left;
                clientY = e.clientY - rect.top;
            }

            posRef.current.targetX = clientX;
            posRef.current.targetY = clientY;
            if (!posRef.current.isVisible) {
                posRef.current.isVisible = true;
                glowEl.style.opacity = '1';
            }
            startAnimation();
        };

        const handlePointerLeave = () => {
            posRef.current.isVisible = false;
            glowEl.style.opacity = '0';
        };

        const target = contained && glowEl.parentElement ? glowEl.parentElement : window;
        target.addEventListener('pointermove', handlePointerMove, { passive: true });
        target.addEventListener('pointerleave', handlePointerLeave, { passive: true });

        return () => {
            target.removeEventListener('pointermove', handlePointerMove);
            target.removeEventListener('pointerleave', handlePointerLeave);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [contained, enabled]);

    return (
        <div
            ref={glowRef}
            className={`${styles.pointerGlow} ${contained ? styles.contained : styles.global} ${className}`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                background: `radial-gradient(circle at center, ${color} 0%, rgba(24, 201, 139, 0.18) 32%, rgba(16, 185, 129, 0.05) 55%, transparent 72%)`,
                willChange: 'transform, opacity'
            }}
            aria-hidden="true"
        />
    );
}
