'use client';

import React from 'react';
import styles from '../aiStrategy.module.scss';

export default function StrategyGridSkeleton({ count = 4 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className={`${styles.pairCard} ${styles.strategySkeletonCard}`}
                >
                    {/* Header: Pair Full Name & Market (Left) + Price (Right) */}
                    <div className={styles.pairCardHead}>
                        <div className={styles.cardHeaderLeft}>
                            <div className={`${styles.skeletonPulse} ${styles.stratSkelTitle}`} />
                        </div>
                        <div className={styles.cardHeaderRight}>
                            <div className={`${styles.skeletonPulse} ${styles.stratSkelPrice}`} />
                        </div>
                    </div>

                    {/* Body: Left Levels & Right Chart */}
                    <div className={styles.cardBodyRow}>
                        {/* Left Column: Quantitative Parameter Rows */}
                        <div className={styles.leftLevelsColumn}>
                            {Array.from({ length: 8 }).map((__, rIdx) => (
                                <div key={rIdx} className={styles.stratSkelParamRow}>
                                    <div className={`${styles.skeletonPulse} ${styles.stratSkelParamLabel}`} />
                                    <div className={`${styles.skeletonPulse} ${styles.stratSkelParamValue}`} />
                                </div>
                            ))}
                        </div>

                        {/* Vertical Separator Divider */}
                        <div className={styles.verticalSeparator} />

                        {/* Right Column: Chart Shimmer Canvas */}
                        <div className={styles.rightGraphColumn}>
                            <div className={`${styles.skeletonPulse} ${styles.stratSkelChart}`} />
                        </div>
                    </div>

                    {/* Footer: Tags (Left) + Button (Right) */}
                    <div className={styles.pairCardFoot}>
                        <div className={`${styles.skeletonPulse} ${styles.stratSkelTag}`} />
                        <div className={`${styles.skeletonPulse} ${styles.stratSkelBtn}`} />
                    </div>
                </div>
            ))}
        </>
    );
}
