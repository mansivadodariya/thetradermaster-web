'use client';
import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import styles from './stepTwo.module.scss';
import { useLanguage } from '@/context/LanguageContext';

// SVG Vector Icons
const AnalyzeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20V14M9 20V11M14 20V7M19 20V4" stroke="#18C98B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M13 5L19 3M19 3V9M19 3L11 11" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AskAiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="7" width="16" height="13" rx="4" stroke="#18C98B" strokeWidth="2" />
        <path d="M12 3V7" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="3" r="1.2" fill="#18C98B" />
        <circle cx="9" cy="12" r="1.5" fill="#18C98B" />
        <circle cx="15" cy="12" r="1.5" fill="#18C98B" />
        <path d="M9 16C10 17 14 17 15 16" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const BrainIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 4C7.5 4 6 5.5 6 7.5C6 8.2 6.2 8.8 6.6 9.3C5.1 9.8 4 11.3 4 13C4 14.8 5.2 16.3 6.8 16.8C6.9 18.6 8.4 20 10.2 20C11.2 20 12 19.5 12.5 18.8C13 19.5 13.8 20 14.8 20C16.6 20 18.1 18.6 18.2 16.8C19.8 16.3 21 14.8 21 13C21 11.3 19.9 9.8 18.4 9.3C18.8 8.8 19 8.2 19 7.5C19 5.5 17.5 4 15.5 4C14.7 4 14 4.3 13.5 4.8C13 4.3 12.3 4 11.5 4H9.5Z" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4V20" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 9H12M12 12H8.5M12 15H9.5M12 9H15M12 12H15.5M12 15H14.5" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const FlaskIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3H15" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 3V8L4.5 18.5C3.8 19.8 4.7 21 6.2 21H17.8C19.3 21 20.2 19.8 19.5 18.5L14 8V3" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16H17" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 3" />
        <circle cx="10" cy="18" r="0.8" fill="#18C98B" />
        <circle cx="14" cy="17.5" r="0.8" fill="#18C98B" />
    </svg>
);

const ShieldLeakIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MarketScannerIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="#18C98B" strokeWidth="2" />
        <path d="M21 21L16.65 16.65" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 8V14M8 11H14" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const getHelpOptions = (t) => [
    {
        id: 'analyze_trades',
        title: t('onboarding.step3.scanner.title', 'AI Chart Scanner'),
        desc: t('onboarding.step3.scanner.desc', 'Upload chart screenshots for instant institutional level detection, order block analysis, and conviction scoring.'),
        icon: AnalyzeIcon,
        tag: t('onboarding.step3.scanner.tag', 'Vision OCR & ML Model'),
    },
    {
        id: 'ask_ai',
        title: t('onboarding.step3.assistant.title', 'AI Market Assistant'),
        desc: t('onboarding.step3.assistant.desc', 'Conversational strategy validation grounded in live market feeds, scanner telemetry, and zero false confidence.'),
        icon: AskAiIcon,
        tag: t('onboarding.step3.assistant.tag', 'Grounded Live Telemetry'),
    },
    {
        id: 'build_strategies',
        title: t('onboarding.step3.signals.title', 'AI Trading Signal'),
        desc: t('onboarding.step3.signals.desc', 'Design, configure, and automate rule-based confluence triggers across multi-timeframe cascades.'),
        icon: BrainIcon,
        tag: t('onboarding.step3.signals.tag', 'Algorithmic Rules'),
    },
    {
        id: 'backtest_strategies',
        title: t('onboarding.step3.backtest.title', 'Historical Backtesting'),
        desc: t('onboarding.step3.backtest.desc', 'Stress test your setups across years of verified tick-level market data before risking capital.'),
        icon: FlaskIcon,
        tag: t('onboarding.step3.backtest.tag', 'Sub-ms Simulation'),
    },
    {
        id: 'leak_detection',
        title: t('onboarding.step3.journal.title', 'AI Past Trade Analyzer'),
        desc: t('onboarding.step3.journal.desc', 'Analyze closed trading journals to pinpoint psychological leaks, revenge trading, and expectancy drag.'),
        icon: ShieldLeakIcon,
        tag: t('onboarding.step3.journal.tag', 'Behavioral Diagnostics'),
    },
    {
        id: 'realtime_scanner',
        title: t('onboarding.step3.terminal.title', 'Signal Terminal'),
        desc: t('onboarding.step3.terminal.desc', 'Filter 1,000+ instruments for high-probability liquidity grabs, fair value gaps, and momentum breakouts.'),
        icon: MarketScannerIcon,
        tag: t('onboarding.step3.terminal.tag', 'Zero-Lag Feeds'),
    },
];

export default function StepTwo({ selectedOptions: controlledOptions, onToggleOption }) {
    const { t } = useLanguage();
    const [internalOptions, setInternalOptions] = useState([]);
    const selectedOptions = controlledOptions !== undefined ? controlledOptions : internalOptions;
    const helpOptions = useMemo(() => getHelpOptions(t), [t]);

    const handleToggle = (id) => {
        if (onToggleOption) {
            onToggleOption(id);
        } else {
            setInternalOptions((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            );
        }
    };

    return (
        <div className={styles.stepContainer}>
            {/* Header Title Section */}
            <div className={styles.headerSection}>
                <div className={styles.tagBadge}>
                    <span className={styles.tagDot} />
                    <span>{t('onboarding.step3.badge', 'CAPABILITIES · STEP 03')}</span>
                </div>
                <h1 className={styles.mainTitle}>
                    {t('onboarding.step3.title', 'How would you like')} <span className={styles.accentText}>{t('onboarding.step3.titleAccent', 'TraderMaster to help?')}</span>
                </h1>
                <p className={styles.subtitle}>
                    {t('onboarding.step3.subtitle', 'Choose the AI toolsets and workflows you want tailored to your trading terminal.')}
                </p>
            </div>

            {/* 6 Grid Platform Goals Cards */}
            <div className={styles.optionsGrid}>
                {helpOptions.map((opt) => {
                    const isSelected = selectedOptions.includes(opt.id);
                    const IconComponent = opt.icon;

                    return (
                        <div
                            key={opt.id}
                            className={classNames(styles.optionCard, isSelected && styles.selected)}
                            onClick={() => handleToggle(opt.id)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleToggle(opt.id);
                                }
                            }}
                        >
                            <div className={styles.cardHeaderRow}>
                                <div className={styles.iconBox}>
                                    <IconComponent />
                                </div>
                                <div className={styles.badgeAndCheckbox}>
                                    <span className={styles.featureTag}>{opt.tag}</span>
                                    <div className={classNames(styles.checkbox, isSelected && styles.checked)}>
                                        {isSelected && (
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.optionTitle}>{opt.title}</h3>
                                <p className={styles.optionDesc}>{opt.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
