'use client';
import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import styles from './step.module.scss';
import { useLanguage } from '@/context/LanguageContext';

const SproutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22V12M12 12C12 7 6.5 5.5 3 6.5C3 11 6.5 14 12 12ZM12 12C12 5.5 17.5 4 21 5C21 9.5 17.5 12.5 12 12Z" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 22H17" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const GrowthChartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="14" width="4" height="7" rx="1" stroke="#18C98B" strokeWidth="1.8" />
        <rect x="10" y="10" width="4" height="11" rx="1" stroke="#18C98B" strokeWidth="1.8" />
        <rect x="17" y="5" width="4" height="16" rx="1" stroke="#18C98B" strokeWidth="1.8" />
        <path d="M3 10L10 6L17 3L21 2M21 2H17M21 2V6" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LightningIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TrophyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4H18V11C18 14.3137 15.3137 17 12 17C8.68629 17 6 14.3137 6 11V4Z" stroke="#18C98B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M6 7H3C2.44772 7 2 7.44772 2 8V9C2 10.6569 3.34315 12 5 12H6" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 7H21C21.5523 7 22 7.44772 22 8V9C22 10.6569 20.6569 12 19 12H18" stroke="#18C98B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 17V20M8 22H16" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const getExperienceOptions = (t) => [
    {
        id: 'beginner',
        badge: t('onboarding.step1.beginner.badge', 'LEVEL 01'),
        title: t('onboarding.step1.beginner.title', 'Beginner'),
        desc: t('onboarding.step1.beginner.desc', 'New to Forex or financial markets. Looking for guided trade validation & learning.'),
        tag: t('onboarding.step1.beginner.tag', 'Guided AI Analysis'),
        icon: SproutIcon,
    },
    {
        id: 'intermediate',
        badge: t('onboarding.step1.intermediate.badge', 'LEVEL 02'),
        title: t('onboarding.step1.intermediate.title', 'Intermediate'),
        desc: t('onboarding.step1.intermediate.desc', '1–3 years active trading experience. Looking to sharpen edge and verify setups.'),
        tag: t('onboarding.step1.intermediate.tag', 'Scanner & Key Levels'),
        icon: GrowthChartIcon,
    },
    {
        id: 'advanced',
        badge: t('onboarding.step1.advanced.badge', 'LEVEL 03'),
        title: t('onboarding.step1.advanced.title', 'Advanced'),
        desc: t('onboarding.step1.advanced.desc', 'Consistent trader utilizing technical models, price action, and orderflow confluence.'),
        tag: t('onboarding.step1.advanced.tag', 'Cascade Timeframes'),
        icon: LightningIcon,
    },
    {
        id: 'professional',
        badge: t('onboarding.step1.professional.badge', 'INSTITUTIONAL'),
        title: t('onboarding.step1.professional.title', 'Professional'),
        desc: t('onboarding.step1.professional.desc', 'Prop firm funded or full-time market participant focused on algorithmic precision.'),
        tag: t('onboarding.step1.professional.tag', 'MT5 Sub-ms Sync'),
        icon: TrophyIcon,
    },
];

export default function Step({ selectedLevel: controlledLevel, onSelectLevel }) {
    const { t } = useLanguage();
    const [internalLevel, setInternalLevel] = useState('');
    const selectedLevel = controlledLevel !== undefined ? controlledLevel : internalLevel;
    const experienceOptions = useMemo(() => getExperienceOptions(t), [t]);

    const handleSelect = (id) => {
        if (onSelectLevel) {
            onSelectLevel(id);
        } else {
            setInternalLevel(id);
        }
    };

    return (
        <div className={styles.stepContainer}>
            {/* Header Title Section */}
            <div className={styles.headerSection}>
                <div className={styles.tagBadge}>
                    <span className={styles.tagDot} />
                    <span>{t('onboarding.step1.badge', 'EXPERIENCE PROFILE · STEP 01')}</span>
                </div>
                <h1 className={styles.mainTitle}>
                    {t('onboarding.step1.title', 'What is your')} <span className={styles.accentText}>{t('onboarding.step1.titleAccent', 'trading experience?')}</span>
                </h1>
                <p className={styles.subtitle}>
                    {t('onboarding.step1.subtitle', 'ChronosX calibrates its AI advisor, risk telemetry, and scanner thresholds to your exact experience level.')}
                </p>
            </div>

            {/* 4 Professional Experience Cards Grid */}
            <div className={styles.cardsGrid}>
                {experienceOptions.map((opt) => {
                    const isSelected = selectedLevel === opt.id;
                    const IconComponent = opt.icon;

                    return (
                        <div
                            key={opt.id}
                            className={classNames(styles.experienceCard, isSelected && styles.selected)}
                            onClick={() => handleSelect(opt.id)}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleSelect(opt.id);
                                }
                            }}
                        >
                            {/* Card Top Row: Icon + Level Badge + Selection Indicator */}
                            <div className={styles.cardTopRow}>
                                <div className={styles.iconBox}>
                                    <IconComponent />
                                </div>
                                <div className={styles.badgeAndRadio}>
                                    <span className={styles.levelBadge}>{opt.badge}</span>
                                    <div className={classNames(styles.radioCircle, isSelected && styles.checked)}>
                                        {isSelected && <div className={styles.radioCore} />}
                                    </div>
                                </div>
                            </div>

                            {/* Center Content */}
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>{opt.title}</h3>
                                <p className={styles.cardDesc}>{opt.desc}</p>
                            </div>

                            {/* Bottom Feature Tag */}
                            <div className={styles.cardFooter}>
                                <span className={styles.featurePill}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {opt.tag}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
