"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import styles from './countUp.module.scss';

export default function CountUp({
    to,
    from = 0,
    duration = 2.2,
    decimals = 0,
    prefix = '',
    suffix = '',
}) {
    const [count, setCount] = useState(from);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-40px' });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isInView || hasAnimated.current) return;
        hasAnimated.current = true;
        let startTime = null;
        let animationFrameId;

        const startVal = from;
        const endVal = typeof to === 'number' ? to : parseFloat(to) || 0;

        // Smooth cubic ease-out
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const easedProgress = easeOutCubic(progress);
            const currentVal = startVal + (endVal - startVal) * easedProgress;

            setCount(currentVal);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            } else {
                setCount(endVal);
            }
        };

        animationFrameId = requestAnimationFrame(step);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isInView, from, to, duration]);

    const formattedNumber = count.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    return (
        <span ref={ref} className={styles.countUpWrapper}>
            {prefix}{formattedNumber}{suffix}
        </span>
    );
}
