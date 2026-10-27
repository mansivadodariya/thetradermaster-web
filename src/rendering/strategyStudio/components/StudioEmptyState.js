import React from 'react';
import styles from '../styles/strategyStudio.module.scss';
import {
    AiBotSparkIcon,
    SlidersTuneIcon,
    ShieldCheckIcon,
    RocketRunIcon,
} from './StudioIcons';

export default function StudioEmptyState() {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
                <AiBotSparkIcon size={44} color="#18C98B" />
            </div>
            <h2>Algorithmic Strategy Backtester</h2>
            <p>
                Formulate your trading hypothesis using the AI Advisor. Once formulated, click &quot;Run Backtest Now&quot; to inspect performance curves, win rates, and individual round-trip trades.
            </p>
            <div className={styles.flowSteps}>
                <div className={styles.stepBox}>
                    <div className={styles.stepIconWrap}>
                        <SlidersTuneIcon size={16} color="#18C98B" />
                    </div>
                    <h4>Formulate Strategy</h4>
                    <p>Use AI Advisor chat to configure entry rules and indicators.</p>
                </div>
                <div className={styles.stepBox}>
                    <div className={styles.stepIconWrap}>
                        <ShieldCheckIcon size={16} color="#18C98B" />
                    </div>
                    <h4>Validate & Inspect</h4>
                    <p>Review entry rules, stop loss, and target conditions.</p>
                </div>
                <div className={styles.stepBox}>
                    <div className={styles.stepIconWrap}>
                        <RocketRunIcon size={16} color="#18C98B" />
                    </div>
                    <h4>Simulate & Audit</h4>
                    <p>Run backtest across historical candles with 1-click execution.</p>
                </div>
            </div>
        </div>
    );
}
