'use client';
import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './stepthree.module.scss';
import { useLanguage } from '@/context/LanguageContext';

// High-Definition Official Currency Flag and Asset Vector Icons
const EurUsdIcon = () => (
    <div className={styles.flagPairContainer}>
        {/* EU Flag Disc */}
        <div className={styles.flagDisc}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <rect width="32" height="32" rx="16" fill="#003399" />
                {/* 12 Gold Stars in circle */}
                <g fill="#FFCC00" transform="translate(16,16) scale(0.65)">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                        <circle
                            key={angle}
                            cx={14 * Math.cos((angle * Math.PI) / 180)}
                            cy={14 * Math.sin((angle * Math.PI) / 180)}
                            r="1.6"
                        />
                    ))}
                </g>
            </svg>
        </div>
        {/* US Flag Disc */}
        <div className={`${styles.flagDisc} ${styles.flagDiscOverlap}`}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="usClip1">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#usClip1)">
                    <rect width="32" height="32" fill="#B22234" />
                    {[3.5, 8.5, 13.5, 18.5, 23.5, 28.5].map((y, i) => (
                        <rect key={i} y={y} width="32" height="2.5" fill="#FFFFFF" />
                    ))}
                    <rect width="15" height="15" fill="#3C3B6E" />
                    <circle cx="4" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="7.5" cy="7.5" r="1.1" fill="#FFFFFF" />
                    <circle cx="4" cy="11" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="11" r="1.1" fill="#FFFFFF" />
                </g>
            </svg>
        </div>
    </div>
);

const GbpUsdIcon = () => (
    <div className={styles.flagPairContainer}>
        {/* UK Union Jack Disc */}
        <div className={styles.flagDisc}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="ukClip1">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#ukClip1)">
                    <rect width="32" height="32" fill="#012169" />
                    <path d="M0,0 L32,32 M32,0 L0,32" stroke="#FFFFFF" strokeWidth="4.5" />
                    <path d="M0,0 L32,32 M32,0 L0,32" stroke="#C8102E" strokeWidth="2.5" />
                    <path d="M16,0 V32 M0,16 H32" stroke="#FFFFFF" strokeWidth="7" />
                    <path d="M16,0 V32 M0,16 H32" stroke="#C8102E" strokeWidth="4.2" />
                </g>
            </svg>
        </div>
        {/* US Flag Disc */}
        <div className={`${styles.flagDisc} ${styles.flagDiscOverlap}`}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="usClip2">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#usClip2)">
                    <rect width="32" height="32" fill="#B22234" />
                    {[3.5, 8.5, 13.5, 18.5, 23.5, 28.5].map((y, i) => (
                        <rect key={i} y={y} width="32" height="2.5" fill="#FFFFFF" />
                    ))}
                    <rect width="15" height="15" fill="#3C3B6E" />
                    <circle cx="4" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="7.5" cy="7.5" r="1.1" fill="#FFFFFF" />
                    <circle cx="4" cy="11" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="11" r="1.1" fill="#FFFFFF" />
                </g>
            </svg>
        </div>
    </div>
);

const UsdJpyIcon = () => (
    <div className={styles.flagPairContainer}>
        {/* US Flag Disc */}
        <div className={styles.flagDisc}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="usClip3">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#usClip3)">
                    <rect width="32" height="32" fill="#B22234" />
                    {[3.5, 8.5, 13.5, 18.5, 23.5, 28.5].map((y, i) => (
                        <rect key={i} y={y} width="32" height="2.5" fill="#FFFFFF" />
                    ))}
                    <rect width="15" height="15" fill="#3C3B6E" />
                    <circle cx="4" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="7.5" cy="7.5" r="1.1" fill="#FFFFFF" />
                    <circle cx="4" cy="11" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="11" r="1.1" fill="#FFFFFF" />
                </g>
            </svg>
        </div>
        {/* Japan Hinomaru Disc */}
        <div className={`${styles.flagDisc} ${styles.flagDiscOverlap}`}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <rect width="32" height="32" rx="16" fill="#FFFFFF" />
                <circle cx="16" cy="16" r="7.5" fill="#BC002D" />
            </svg>
        </div>
    </div>
);

const GoldIcon = () => (
    <div className={styles.goldBullionBadge}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            {/* 3D Stacked Gold Ingots */}
            <path d="M10 5L15 2H23L28 5L23 8H15L10 5Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.2" />
            <path d="M15 8H23L28 5V7.5L23 10.5H15L10 7.5V5L15 8Z" fill="#D97706" />
            <path d="M4 14L9 11H19L24 14L19 17H9L4 14Z" fill="#FDE047" stroke="#FBBF24" strokeWidth="1.2" />
            <path d="M9 17H19L24 14V17L19 20H9L4 17V14L9 17Z" fill="#D97706" />
            <path d="M12 21L17 18H27L31 21L27 24H17L12 21Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
            <path d="M17 24H27L31 21V24L27 27H17L12 24V21L17 24Z" fill="#92400E" />
        </svg>
    </div>
);

const GbpJpyIcon = () => (
    <div className={styles.flagPairContainer}>
        {/* UK Union Jack Disc */}
        <div className={styles.flagDisc}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="ukClip2">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#ukClip2)">
                    <rect width="32" height="32" fill="#012169" />
                    <path d="M0,0 L32,32 M32,0 L0,32" stroke="#FFFFFF" strokeWidth="4.5" />
                    <path d="M0,0 L32,32 M32,0 L0,32" stroke="#C8102E" strokeWidth="2.5" />
                    <path d="M16,0 V32 M0,16 H32" stroke="#FFFFFF" strokeWidth="7" />
                    <path d="M16,0 V32 M0,16 H32" stroke="#C8102E" strokeWidth="4.2" />
                </g>
            </svg>
        </div>
        {/* Japan Hinomaru Disc */}
        <div className={`${styles.flagDisc} ${styles.flagDiscOverlap}`}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <rect width="32" height="32" rx="16" fill="#FFFFFF" />
                <circle cx="16" cy="16" r="7.5" fill="#BC002D" />
            </svg>
        </div>
    </div>
);

const AudUsdIcon = () => (
    <div className={styles.flagPairContainer}>
        {/* Australia Flag Disc */}
        <div className={styles.flagDisc}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="audClip1">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#audClip1)">
                    <rect width="32" height="32" fill="#00008B" />
                    <rect width="14" height="13" fill="#012169" />
                    <path d="M0,0 L14,13 M14,0 L0,13" stroke="#FFFFFF" strokeWidth="2.8" />
                    <path d="M0,0 L14,13 M14,0 L0,13" stroke="#C8102E" strokeWidth="1.4" />
                    <path d="M7,0 V13 M0,6.5 H14" stroke="#FFFFFF" strokeWidth="4.4" />
                    <path d="M7,0 V13 M0,6.5 H14" stroke="#C8102E" strokeWidth="2.5" />
                    <circle cx="7" cy="22" r="2.4" fill="#FFFFFF" />
                    <circle cx="23" cy="8" r="1.5" fill="#FFFFFF" />
                    <circle cx="26" cy="14" r="1.3" fill="#FFFFFF" />
                    <circle cx="23" cy="23" r="1.5" fill="#FFFFFF" />
                    <circle cx="19" cy="16" r="1.3" fill="#FFFFFF" />
                </g>
            </svg>
        </div>
        {/* US Flag Disc */}
        <div className={`${styles.flagDisc} ${styles.flagDiscOverlap}`}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="usClipAud">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#usClipAud)">
                    <rect width="32" height="32" fill="#B22234" />
                    {[3.5, 8.5, 13.5, 18.5, 23.5, 28.5].map((y, i) => (
                        <rect key={i} y={y} width="32" height="2.5" fill="#FFFFFF" />
                    ))}
                    <rect width="15" height="15" fill="#3C3B6E" />
                    <circle cx="4" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="7.5" cy="7.5" r="1.1" fill="#FFFFFF" />
                    <circle cx="4" cy="11" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="11" r="1.1" fill="#FFFFFF" />
                </g>
            </svg>
        </div>
    </div>
);

const UsdCadIcon = () => (
    <div className={styles.flagPairContainer}>
        {/* US Flag Disc */}
        <div className={styles.flagDisc}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="usClipCad">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#usClipCad)">
                    <rect width="32" height="32" fill="#B22234" />
                    {[3.5, 8.5, 13.5, 18.5, 23.5, 28.5].map((y, i) => (
                        <rect key={i} y={y} width="32" height="2.5" fill="#FFFFFF" />
                    ))}
                    <rect width="15" height="15" fill="#3C3B6E" />
                    <circle cx="4" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="7.5" cy="7.5" r="1.1" fill="#FFFFFF" />
                    <circle cx="4" cy="11" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="11" r="1.1" fill="#FFFFFF" />
                </g>
            </svg>
        </div>
        {/* Canada Flag Disc */}
        <div className={`${styles.flagDisc} ${styles.flagDiscOverlap}`}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="cadClip1">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#cadClip1)">
                    <rect width="32" height="32" fill="#FF0000" />
                    <rect x="8" width="16" height="32" fill="#FFFFFF" />
                    <path d="M16 7.5l1.6 3.5 3.2-.8-1.6 3.2 3.2 1.9-4 1.3.8 3.2-3.2-1.6-.8 3.2-.8-3.2-3.2 1.6.8-3.2-4-1.3 3.2-1.9-1.6-3.2 3.2.8z" fill="#FF0000" />
                </g>
            </svg>
        </div>
    </div>
);

const UsdChfIcon = () => (
    <div className={styles.flagPairContainer}>
        {/* US Flag Disc */}
        <div className={styles.flagDisc}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <clipPath id="usClipChf">
                    <circle cx="16" cy="16" r="16" />
                </clipPath>
                <g clipPath="url(#usClipChf)">
                    <rect width="32" height="32" fill="#B22234" />
                    {[3.5, 8.5, 13.5, 18.5, 23.5, 28.5].map((y, i) => (
                        <rect key={i} y={y} width="32" height="2.5" fill="#FFFFFF" />
                    ))}
                    <rect width="15" height="15" fill="#3C3B6E" />
                    <circle cx="4" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="4" r="1.1" fill="#FFFFFF" />
                    <circle cx="7.5" cy="7.5" r="1.1" fill="#FFFFFF" />
                    <circle cx="4" cy="11" r="1.1" fill="#FFFFFF" />
                    <circle cx="11" cy="11" r="1.1" fill="#FFFFFF" />
                </g>
            </svg>
        </div>
        {/* Switzerland Flag Disc */}
        <div className={`${styles.flagDisc} ${styles.flagDiscOverlap}`}>
            <svg viewBox="0 0 32 32" width="22" height="22">
                <rect width="32" height="32" rx="16" fill="#D52B1E" />
                <rect x="13" y="7" width="6" height="18" fill="#FFFFFF" rx="1" />
                <rect x="7" y="13" width="18" height="6" fill="#FFFFFF" rx="1" />
            </svg>
        </div>
    </div>
);

const getMarketOptions = (t) => [
    {
        id: 'eur_usd',
        title: 'EUR / USD',
        category: t('onboarding.step4.categories.forexMajor', 'FOREX MAJOR'),
        desc: 'Euro vs. US Dollar',
        icon: EurUsdIcon,
    },
    {
        id: 'gbp_usd',
        title: 'GBP / USD',
        category: t('onboarding.step4.categories.forexMajor', 'FOREX MAJOR'),
        desc: 'British Pound vs. US Dollar',
        icon: GbpUsdIcon,
    },
    {
        id: 'usd_jpy',
        title: 'USD / JPY',
        category: t('onboarding.step4.categories.forexMajor', 'FOREX MAJOR'),
        desc: 'US Dollar vs. Japanese Yen',
        icon: UsdJpyIcon,
    },
    {
        id: 'xau_usd',
        title: 'XAU / USD (Gold)',
        category: t('onboarding.step4.tabs.commodities', 'COMMODITIES'),
        desc: 'Spot Gold vs. US Dollar',
        icon: GoldIcon,
    },
    {
        id: 'gbp_jpy',
        title: 'GBP / JPY',
        category: t('onboarding.step4.forexCross', 'FOREX CROSS'),
        desc: 'British Pound vs. Japanese Yen',
        icon: GbpJpyIcon,
    },
    {
        id: 'aud_usd',
        title: 'AUD / USD',
        category: t('onboarding.step4.categories.forexMajor', 'FOREX MAJOR'),
        desc: 'Australian Dollar vs. US Dollar',
        icon: AudUsdIcon,
    },
    {
        id: 'usd_cad',
        title: 'USD / CAD',
        category: t('onboarding.step4.categories.forexMajor', 'FOREX MAJOR'),
        desc: 'US Dollar vs. Canadian Dollar',
        icon: UsdCadIcon,
    },
    {
        id: 'usd_chf',
        title: 'USD / CHF',
        category: t('onboarding.step4.categories.forexMajor', 'FOREX MAJOR'),
        desc: 'US Dollar vs. Swiss Franc',
        icon: UsdChfIcon,
    },
];

export default function Stepthree({ selectedOptions: controlledOptions, onToggleOption }) {
    const { t } = useLanguage();
    const [internalOptions, setInternalOptions] = useState([]);
    const selectedOptions = controlledOptions !== undefined ? controlledOptions : internalOptions;
    const marketOptions = React.useMemo(() => getMarketOptions(t), [t]);

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
                    <span>{t('onboarding.step4.badge', 'WATCHLIST SETUP · STEP 04')}</span>
                </div>
                <h1 className={styles.mainTitle}>
                    {t('onboarding.step4.title', 'Which markets do you')} <span className={styles.accentText}>{t('onboarding.step4.titleAccent', 'trade most often?')}</span>
                </h1>
                <p className={styles.subtitle}>
                    {t('onboarding.step4.subtitle', 'Select your core asset classes and preferred pairs for real-time telemetry prioritization.')}
                </p>
            </div>

            {/* 8 Grid Market Pairs */}
            <div className={styles.marketsGrid}>
                {marketOptions.map((opt) => {
                    const isSelected = selectedOptions.includes(opt.id);
                    const IconComponent = opt.icon;

                    return (
                        <div
                            key={opt.id}
                            className={classNames(styles.marketCard, isSelected && styles.selected)}
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
                                    <span className={styles.categoryBadge}>{opt.category}</span>
                                    <div className={classNames(styles.checkbox, isSelected && styles.checked)}>
                                        {isSelected && (
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.marketTitle}>{opt.title}</h3>
                                <p className={styles.marketDesc}>{opt.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Preference Notice */}
            <div className={styles.preferenceNotice}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>{t('onboarding.step4.notice', 'You can customize your watched instruments anytime from Dashboard Settings.')}</span>
            </div>
        </div>
    );
}
