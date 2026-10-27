'use client';
import React, { useState, useEffect, useMemo } from 'react';
import styles from './streamingText.module.scss';

/**
 * StreamingText - Smooth, fast, professional typewriter streaming effect.
 * Progressive word-by-word reveal with an animated caret during generation.
 * Once complete, the caret smoothly disappears.
 */
export default function StreamingText({
    text = '',
    speed = 22,
    delay = 0,
    onComplete,
    isActive = true,
    className = '',
    cursorColor = '#18C98B'
}) {
    const words = useMemo(() => (text ? text.split(' ') : []), [text]);
    const [wordCount, setWordCount] = useState(isActive ? 0 : words.length);
    const [isFinished, setIsFinished] = useState(!isActive);

    useEffect(() => {
        if (!isActive) {
            setWordCount(words.length);
            setIsFinished(true);
            return;
        }

        setWordCount(0);
        setIsFinished(false);

        if (words.length === 0) {
            setIsFinished(true);
            return;
        }

        let intervalId;
        const timeoutId = setTimeout(() => {
            let idx = 0;
            intervalId = setInterval(() => {
                idx++;
                setWordCount(idx);
                if (idx >= words.length) {
                    clearInterval(intervalId);
                    setIsFinished(true);
                    if (onComplete) onComplete();
                }
            }, speed);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [text, speed, delay, isActive, words.length]);

    return (
        <span className={`${styles.streamingTextWrapper} ${className}`}>
            {words.slice(0, wordCount).map((word, i) => (
                <span key={i} className={styles.wordSpan}>
                    {word}{' '}
                </span>
            ))}
            {!isFinished && (
                <span
                    className={styles.typewriterCursor}
                    style={{ color: cursorColor }}
                    aria-hidden="true"
                >
                    ▌
                </span>
            )}
        </span>
    );
}
