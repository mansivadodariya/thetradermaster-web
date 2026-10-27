'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/strategyStudio.module.scss';
import {
    CoinsCapitalIcon,
    AlertTriangleIcon,
    RefreshResetIcon,
    SparklesMagicIcon,
} from './StudioIcons';
import { renderFormattedMarkdown } from '../utils/markdownRenderer';
import { useStreamingText } from '../utils/streamingRenderer';

export function StreamingAiBubble({ text, shouldStream, onStreamComplete, onStreamProgress }) {
    const { displayedText, isStreaming, skipToEnd } = useStreamingText(text, {
        msPerChar: 14,
        enabled: Boolean(shouldStream),
        onComplete: onStreamComplete,
        onProgress: onStreamProgress
    });

    const activeText = shouldStream ? displayedText : text;
    const isClickable = Boolean(shouldStream && isStreaming);

    return (
        <div
            className={`${styles.bubble} ${styles.aiBubble}`}
            onClick={isClickable ? skipToEnd : undefined}
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
            title={isClickable ? 'Click to reveal immediately' : undefined}
        >
            {renderFormattedMarkdown(activeText)}
        </div>
    );
}

export function CircuitStrategyDivider() {
    return (
        <div className={styles.circuitStrategyDivider}>
            <div className={styles.circuitLineLeft}>
                <svg className={styles.circuitSvg} viewBox="0 0 160 18" fill="none">
                    <path d="M 4 15 L 38 6 L 160 6" stroke="url(#circuitGradGreenLeft)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="4" cy="15" r="2.5" fill="#18C98B" />
                    <defs>
                        <linearGradient id="circuitGradGreenLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#18C98B" stopOpacity="0.8" />
                            <stop offset="40%" stopColor="#18C98B" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#18C98B" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className={styles.circuitBadge}>
                <span>Strategy</span>
            </div>
            <div className={styles.circuitLineRight}>
                <svg className={styles.circuitSvg} viewBox="0 0 160 18" fill="none">
                    <path d="M 0 6 L 122 6 L 156 1" stroke="url(#circuitGradGreenRight)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="156" cy="1" r="2.5" fill="#18C98B" />
                    <defs>
                        <linearGradient id="circuitGradGreenRight" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#18C98B" stopOpacity="1" />
                            <stop offset="60%" stopColor="#18C98B" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#18C98B" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}

const THINKING_STAGES = [
    'Analyzing market conditions & volatility structure...',
    'Synthesizing indicators & technical signals...',
    'Formulating quantitative strategy blueprint...',
    'Optimizing entry triggers and risk parameters (SL/TP)...',
    'Compiling algorithmic strategy execution rules...',
    'Calibrating statistical edge & probability...',
    'Evaluating liquidity depth & institutional spreads...'
];

export function DynamicThinkingLoader() {
    const [stageIdx, setStageIdx] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setStageIdx((prev) => (prev + 1) % THINKING_STAGES.length);
        }, 1800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.msgThinking} role="status" aria-live="polite">
            <div className={styles.thinkingPulseWrap}>
                <span className={styles.thinkingMiniDot} />
                <span className={styles.thinkingMiniDot} />
                <span className={styles.thinkingMiniDot} />
            </div>
            <span key={stageIdx} className={styles.thinkingText}>
                {THINKING_STAGES[stageIdx]}
            </span>
        </div>
    );
}

export { InteractiveErrorBubble } from '@/components/interactiveError';

