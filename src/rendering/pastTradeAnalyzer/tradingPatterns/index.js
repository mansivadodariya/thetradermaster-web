'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './tradingPatterns.module.scss';

export default function TradingPatterns() {
    const patternList = [
        "Entering too early",
        "Chasing breakouts",
        "Moving stop-losses",
        "Taking trades without confirmation",
        "Ignoring higher-timeframe structure",
        "Using inconsistent risk",
        "Exiting winning trades too early",
    ];

    return (
        <section className={styles.tradingPatterns}>
            <div className="container-xs">
                <div className={styles.patternsBox}>
                    <h3 className={styles.patternsTitle}>Discover Your Trading Patterns</h3>
                    <p className={styles.patternsSub}>
                        One trade can teach you something. A collection of trades can reveal your habits. As you review more trades, you can start identifying patterns such as:
                    </p>
                    <div className={styles.patternPills}>
                        {patternList.map((pat, idx) => (
                            <motion.div
                                key={idx}
                                className={styles.pill}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                            >
                                <span>⚡</span> {pat}
                            </motion.div>
                        ))}
                    </div>
                    <div className={styles.patternGoalNote}>
                        The goal is not to judge the trader. The goal is to identify patterns that can help improve the trader.
                    </div>
                </div>

                <div className={styles.cycleBox}>
                    <h3>Build a Better Trading Process</h3>
                    <p>
                        Successful trading is not only about finding the next setup. It is also about improving the process behind every decision. Past Trade Analyzer helps you create a repeatable review cycle:
                    </p>
                    <div className={styles.cycleDiagram}>
                        <div className={styles.cycleNode}>
                            <div className={styles.nodeTitle}>TRADE</div>
                            <div className={styles.nodeDesc}>Strategy execution</div>
                        </div>
                        <span className={styles.cycleArrow}>→</span>
                        <div className={styles.cycleNode}>
                            <div className={styles.nodeTitle}>REVIEW</div>
                            <div className={styles.nodeDesc}>Analyze what happened</div>
                        </div>
                        <span className={styles.cycleArrow}>→</span>
                        <div className={styles.cycleNode}>
                            <div className={styles.nodeTitle}>IDENTIFY</div>
                            <div className={styles.nodeDesc}>Find mistakes & strengths</div>
                        </div>
                        <span className={styles.cycleArrow}>→</span>
                        <div className={styles.cycleNode}>
                            <div className={styles.nodeTitle}>ADJUST</div>
                            <div className={styles.nodeDesc}>Refine process</div>
                        </div>
                        <span className={styles.cycleArrow}>→</span>
                        <div className={styles.cycleNode}>
                            <div className={styles.nodeTitle}>REPEAT</div>
                            <div className={styles.nodeDesc}>Apply to future trades</div>
                        </div>
                    </div>
                    <div className={styles.cycleFormula}>
                        Trade → Review → Learn → Improve
                    </div>
                </div>
            </div>
        </section>
    );
}
