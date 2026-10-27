'use client';

import styles from '../tradeSnap.module.scss';
import { PlayIcon } from '@/icons/tradeSnapIcons';
import { useLanguage } from '@/context/LanguageContext';

export default function TradeSnapGuidePanel({ onStartSharing, t: parentT }) {
    const { t: localT } = useLanguage();
    const t = parentT || localT;

    const steps = [
        {
            num: '01',
            title: t('tradeSnap.guideStep1Title', 'Open Your Chart'),
            desc: t('tradeSnap.guideStep1Desc', 'Launch TradingView, MT4/MT5, Binance, or any brokerage chart on your screen.'),
            tags: ['TradingView', 'MT4 / MT5', 'Binance', 'cTrader'],
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <path d="M7 10l3 3 7-7" />
                </svg>
            )
        },
        {
            num: '02',
            title: t('tradeSnap.guideStep2Title', 'Share Screen or Window'),
            desc: t('tradeSnap.guideStep2Desc', 'Click "Start Sharing" and select your chart tab, browser window, or entire monitor.'),
            tags: [t('tradeSnap.tagFullScreen', 'Full Screen'), t('tradeSnap.tagChromeTab', 'Chrome Tab'), t('tradeSnap.tagAppWindow', 'App Window')],
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
            )
        },
        {
            num: '03',
            title: t('tradeSnap.guideStep3Title', 'Instant AI Technical Scan'),
            desc: t('tradeSnap.guideStep3Desc', 'Capture snapshots or enable Auto-Capture to get real-time pattern detection & trade setups.'),
            tags: [t('tradeSnap.tagSmc', 'SMC Order Blocks'), t('tradeSnap.tagEntry', 'Entry/SL/TP'), t('tradeSnap.tagBias', 'Bull/Bear Bias')],
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    <circle cx="12" cy="12" r="4" />
                </svg>
            )
        }
    ];

    const capabilities = [
        { label: t('tradeSnap.capOcr', 'Sub-Second OCR Vision'), desc: t('tradeSnap.capOcrDesc', 'Auto-reads price, pair & timeframe') },
        { label: t('tradeSnap.capSmc', 'SMC & Liquidity Mapping'), desc: t('tradeSnap.capSmcDesc', 'FVG, order blocks & breaker levels') },
        { label: t('tradeSnap.capAuto', 'Automated Auto-Intervals'), desc: t('tradeSnap.capAutoDesc', 'Hands-free scans every 1 to 120 mins') },
        { label: t('tradeSnap.capRisk', 'Confidence & Risk Scoring'), desc: t('tradeSnap.capRiskDesc', 'Dynamic R:R with invalidation zones') }
    ];

    return (
        <div className={styles.guidePanel}>
            {/* Header */}
            <div className={styles.guideHeader}>
                <div className={styles.guideBadgeRow}>
                    <span className={styles.guideEngineBadge}>
                        <span className={styles.pulsePoint} />
                        {t('tradeSnap.quickStartBadge', 'AI SCANNER QUICK START')}
                    </span>
                </div>
                <h3 className={styles.guideMainTitle}>
                    {t('tradeSnap.howItWorksTitle', 'How to Scan Your Chart in Real-Time')}
                </h3>
                <p className={styles.guideSubtitle}>
                    {t('tradeSnap.howItWorksSubtitle', 'Connect your live charting screen to run institutional neural OCR analysis in seconds.')}
                </p>
            </div>

            {/* Steps Container */}
            <div className={styles.guideStepsList}>
                {steps.map((step, idx) => (
                    <div key={step.num} className={styles.guideStepCard}>
                        <div className={styles.stepNumberCol}>
                            <div className={styles.stepIconBox}>
                                {step.icon}
                            </div>
                            {idx < steps.length - 1 && <div className={styles.stepConnectorLine} />}
                        </div>

                        <div className={styles.stepContentCol}>
                            <div className={styles.stepTopRow}>
                                <h4 className={styles.stepTitle}>{step.title}</h4>
                            </div>
                            <p className={styles.stepDesc}>{step.desc}</p>
                            <div className={styles.stepTagList}>
                                {step.tags.map((tag) => (
                                    <span key={tag} className={styles.stepTagItem}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Feature Highlights Grid */}
            <div className={styles.guideFeaturesGrid}>
                {capabilities.map((cap) => (
                    <div key={cap.label} className={styles.guideFeatureCard}>
                        <div className={styles.featureBullet} />
                        <div className={styles.featureTextWrap}>
                            <span className={styles.featureName}>{cap.label}</span>
                            <span className={styles.featureSub}>{cap.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pro Tip Callout & Quick Launch */}
            <div className={styles.guideFooterCallout}>
                <div className={styles.tipIconWrap}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                </div>
                <div className={styles.tipTextWrap}>
                    <p className={styles.tipText}>
                        <strong>{t('tradeSnap.proTipLabel', 'Pro Tip:')}</strong> {t('tradeSnap.proTipText', 'Ensure candles and axis labels are clearly visible. Works seamlessly with Dark and Light chart color templates.')}
                    </p>
                </div>
                {onStartSharing && (
                    <button
                        type="button"
                        className={styles.guideQuickStartBtn}
                        onClick={onStartSharing}
                    >
                        <PlayIcon />
                        {t('tradeSnap.startSharing', 'Start Sharing')}
                    </button>
                )}
            </div>
        </div>
    );
}
