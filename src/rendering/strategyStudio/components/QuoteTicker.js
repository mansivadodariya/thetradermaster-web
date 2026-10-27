'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/strategyStudio.module.scss';

const TRADING_QUOTES = [
    "The market rewards patience, not prediction.",
    "Trade the setup, not the emotion.",
    "Risk management comes before profit.",
    "Clarity comes from waiting for confirmation.",
    "Every trade is a decision, not a guarantee."
];

export default function QuoteTicker() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeState, setFadeState] = useState('visible'); // 'visible' | 'fading'
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setFadeState('fading');
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % TRADING_QUOTES.length);
                setFadeState('visible');
            }, 380);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused]);

    const handleNext = () => {
        setFadeState('fading');
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % TRADING_QUOTES.length);
            setFadeState('visible');
        }, 250);
    };

    return (
        <div 
            className={styles.quoteTickerBanner}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={handleNext}
            title="Click to view next quote"
        >
            <div className={`${styles.quoteTextContainer} ${fadeState === 'fading' ? styles.fadingOut : styles.fadingIn}`}>
                <span className={styles.quoteText}>
                    {TRADING_QUOTES[currentIndex]}
                </span>
            </div>
        </div>
    );
}
