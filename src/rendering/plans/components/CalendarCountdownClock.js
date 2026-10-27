'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from '../styles/calendarCountdownClock.module.scss';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Single Flip Card with 3D Half-Height Falling Calendar Leaf Animation
 */
function FlipCardItem({ value, label, isSeconds = false }) {
    const [displayVal, setDisplayVal] = useState(value);
    const [prevVal, setPrevVal] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);
    const prevRef = useRef(value);

    useEffect(() => {
        if (value !== prevRef.current) {
            setPrevVal(prevRef.current);
            setDisplayVal(value);
            setIsFlipping(true);
            prevRef.current = value;

            const timer = setTimeout(() => {
                setIsFlipping(false);
            }, 560);

            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <div className={styles.cardCol}>
            <div className={`${styles.flipCard} ${isSeconds ? styles.secondsCard : ''}`}>
                {/* 1. Static Upper Half (shows incoming value) */}
                <div className={`${styles.halfCard} ${styles.upperCard}`}>
                    <span className={styles.digit}>{displayVal}</span>
                </div>

                {/* 2. Static Lower Half (shows previous value until covered) */}
                <div className={`${styles.halfCard} ${styles.lowerCard}`}>
                    <span className={styles.digit}>{isFlipping ? prevVal : displayVal}</span>
                </div>

                {/* 3. Half-Height Falling Leaves */}
                {isFlipping && (
                    <>
                        {/* Top leaf hinges at midline (half height) and falls forward/down */}
                        <div className={`${styles.halfCard} ${styles.fallingTopLeaf}`}>
                            <span className={styles.digit}>{prevVal}</span>
                        </div>
                        {/* Bottom leaf folds in flat onto lower half */}
                        <div className={`${styles.halfCard} ${styles.fallingBottomLeaf}`}>
                            <span className={styles.digit}>{displayVal}</span>
                        </div>
                    </>
                )}

                {/* Left & Right Half-Height Hinge Notches */}
                <div className={styles.notchLeft} aria-hidden="true" />
                <div className={styles.notchRight} aria-hidden="true" />

                {/* Crisp Horizontal Split Seam at 50% (Half Height) */}
                <div className={styles.splitLine} aria-hidden="true" />
            </div>
            <span className={styles.unitLabel}>{label}</span>
        </div>
    );
}

export default function CalendarCountdownClock({ subscription }) {
    const { t } = useLanguage();

    // Calculate target timestamp (in ms)
    const targetTimestamp = useMemo(() => {
        if (!subscription) return Date.now() + 30 * 24 * 60 * 60 * 1000;

        const rawEnd = subscription.end_date || subscription.expires_at;
        if (rawEnd) {
            const parsed = new Date(rawEnd).getTime();
            if (!isNaN(parsed) && parsed > Date.now()) {
                return parsed;
            }
        }

        const days = typeof subscription.days_remaining === 'number'
            ? Math.max(0, subscription.days_remaining)
            : 29;

        return Date.now() + days * 24 * 60 * 60 * 1000;
    }, [subscription?.end_date, subscription?.expires_at, subscription?.days_remaining]);

    const calculateTime = (target) => {
        const now = Date.now();
        const diff = Math.max(0, target - now);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return {
            total: diff,
            days: String(days).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
        };
    };

    const [timeLeft, setTimeLeft] = useState(() => calculateTime(targetTimestamp));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTimeLeft(calculateTime(targetTimestamp));

        const intervalId = setInterval(() => {
            setTimeLeft(calculateTime(targetTimestamp));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [targetTimestamp]);

    const targetDate = useMemo(() => new Date(targetTimestamp), [targetTimestamp]);

    const formattedEndDate = useMemo(() => {
        try {
            return targetDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch (_) {
            return 'Oct 9, 2026';
        }
    }, [targetDate]);

    // Total cycle progress percentage synced with actual subscription lifecycle
    const progressPercent = useMemo(() => {
        const now = Date.now();
        const end = targetTimestamp;
        const start = subscription?.start_date ? new Date(subscription.start_date).getTime() : (end - 30 * 86400000);
        const totalDuration = Math.max(86400000, end - start);
        const msLeft = Math.max(0, end - now);
        return Math.min(100, Math.max(1, Math.round((msLeft / totalDuration) * 100)));
    }, [subscription?.start_date, targetTimestamp]);

    const daysVal = mounted ? timeLeft.days : '29';
    const hoursVal = mounted ? timeLeft.hours : '01';
    const minutesVal = mounted ? timeLeft.minutes : '44';
    const secondsVal = mounted ? timeLeft.seconds : '08';

    return (
        <div className={styles.clockWrapper}>
            {/* Flip Clock Row — rendered directly on parent card canvas */}
            <div className={styles.clockCardsRow}>
                <FlipCardItem value={daysVal} label={t('plans.days', 'DAYS')} />
                <div className={styles.colonSeparator}>:</div>
                <FlipCardItem value={hoursVal} label={t('plans.hours', 'HOURS')} />
                <div className={styles.colonSeparator}>:</div>
                <FlipCardItem value={minutesVal} label={t('plans.minutes', 'MINUTES')} />
                <div className={styles.colonSeparator}>:</div>
                <FlipCardItem value={secondsVal} label={t('plans.seconds', 'SECONDS')} isSeconds={true} />
            </div>

            {/* Slim progress bar + cycle info */}
            <div className={styles.progressContainer}>
                <div className={styles.progressBarTrack}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <span className={styles.progressMeta}>
                    {progressPercent}% remaining
                </span>
            </div>
        </div>
    );
}
