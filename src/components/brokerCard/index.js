'use client';

import React from 'react';
import Link from 'next/link';
import styles from './brokerCard.module.scss';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useLogoLuminance } from '@/lib/useLogoLuminance';

const ExternalLinkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const LinkHighlightIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const ServerHighlightIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
        <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
    </svg>
);

const ShieldHighlightIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

export default function BrokerCard({ broker, detailHref, showHighlights = true, showDescription = true, isPublic = false }) {
    const { t, tDynamic, language } = useLanguage();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const isDarkLogo = useLogoLuminance(broker);
    if (!broker) return null;

    const href = detailHref || (isPublic ? `/supported-brokers/${broker.id}` : `/brokers/${broker.id}`);

    const renderHighlightIcon = (type, index) => {
        if (type === 'server' || index === 1) return <ServerHighlightIcon />;
        if (type === 'shield' || index === 2) return <ShieldHighlightIcon />;
        return <LinkHighlightIcon />;
    };

    const name = tDynamic(broker, 'name') || broker.name;
    const subtitle = tDynamic(broker, 'subtitle') || broker.subtitle;
    const description = tDynamic(broker, 'description') || broker.description;

    // 1. Gather valid highlights
    const validHighlights = (Array.isArray(broker.highlights) ? broker.highlights : [])
        .map((hl, idx) => {
            if (typeof hl === 'string') {
                const str = hl.trim();
                return str ? { title: str, sub: '', type: idx === 0 ? 'link' : idx === 1 ? 'server' : 'shield' } : null;
            }
            if (typeof hl === 'object' && hl !== null) {
                const title = (tDynamic(hl, 'title', 'title_ar', 'title_ph') || hl.title || hl.name || hl.text || hl.label || hl.feature || '').trim();
                const sub = (tDynamic(hl, 'sub', 'sub_ar', 'sub_ph') || hl.sub || hl.desc || hl.description || '').trim();
                if (title || sub) {
                    return {
                        title: title || sub,
                        sub: title ? sub : '',
                        type: hl.type || (idx === 0 ? 'link' : idx === 1 ? 'server' : 'shield')
                    };
                }
            }
            return null;
        })
        .filter(Boolean);

    // 2. Gather valid features
    const rawFeatures = (language === 'ph' && Array.isArray(broker.features_ph) && broker.features_ph.length > 0)
        ? broker.features_ph
        : (language === 'ar' && Array.isArray(broker.features_ar) && broker.features_ar.length > 0)
        ? broker.features_ar
        : (Array.isArray(broker.features) ? broker.features : []);

    const validFeatures = rawFeatures
        .map((f, idx) => {
            if (typeof f === 'string') {
                const str = f.trim();
                return str ? { title: str, sub: '', type: idx === 0 ? 'link' : idx === 1 ? 'server' : 'shield' } : null;
            }
            if (typeof f === 'object' && f !== null) {
                const title = (tDynamic(f, 'title', 'title_ar', 'title_ph') || f.title || f.name || f.text || f.label || f.feature || '').trim();
                const sub = (tDynamic(f, 'sub', 'sub_ar', 'sub_ph') || f.sub || f.desc || f.description || '').trim();
                if (title || sub) {
                    return {
                        title: title || sub,
                        sub: title ? sub : '',
                        type: f.type || (idx === 0 ? 'link' : idx === 1 ? 'server' : 'shield')
                    };
                }
            }
            return null;
        })
        .filter(Boolean);

    // 3. Always ensure 3 distinct items are displayed
    const combinedItems = [];
    const seenTitles = new Set();
    const sourceList = (validFeatures.length >= 3) ? validFeatures : [...validHighlights, ...validFeatures];

    for (let i = 0; i < sourceList.length; i++) {
        const item = sourceList[i];
        const key = (item.title || '').toLowerCase();
        if (key && !seenTitles.has(key)) {
            seenTitles.add(key);
            combinedItems.push({
                ...item,
                type: combinedItems.length === 0 ? 'link' : combinedItems.length === 1 ? 'server' : 'shield'
            });
        }
        if (combinedItems.length >= 3) break;
    }

    const displayItems = combinedItems;

    return (
        <div
            className={`${styles.brokerCard} ${isLight ? styles.isLightCard : ''}`}
            data-component="broker-card"
        >

            <div className={`${styles.bannerHeader} ${isDarkLogo ? styles.hasLightBg : styles.hasDarkBg}`}>
                {broker.logo ? (
                    <div className={styles.logoWrapper}>
                        <img src={broker.logo} alt={name || 'Broker Logo'} />
                    </div>
                ) : (
                    <div className={styles.logoWrapper}>
                        <span className={styles.fallbackLogoText}>{name}</span>
                    </div>
                )}
                <svg className={styles.chartGraphic} viewBox="0 0 400 120" fill="none" preserveAspectRatio="none">
                    <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(24,201,139,0.08)" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(24,201,139,0.08)" strokeDasharray="3 3" />
                    <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(24,201,139,0.08)" strokeDasharray="3 3" />

                    <rect x="220" y="50" width="4" height="25" fill="#10B981" opacity="0.6" />
                    <line x1="222" y1="40" x2="222" y2="85" stroke="#10B981" strokeWidth="1.5" opacity="0.6" />

                    <rect x="240" y="40" width="4" height="30" fill="#18C98B" opacity="0.7" />
                    <line x1="242" y1="30" x2="242" y2="80" stroke="#18C98B" strokeWidth="1.5" opacity="0.7" />

                    <rect x="260" y="55" width="4" height="20" fill="#6EE7B7" opacity="0.6" />
                    <line x1="262" y1="45" x2="262" y2="85" stroke="#6EE7B7" strokeWidth="1.5" opacity="0.6" />

                    <rect x="280" y="35" width="4" height="40" fill="#18C98B" opacity="0.8" />
                    <line x1="282" y1="20" x2="282" y2="85" stroke="#18C98B" strokeWidth="1.5" opacity="0.8" />

                    <rect x="300" y="45" width="4" height="25" fill="#10B981" opacity="0.7" />
                    <line x1="302" y1="35" x2="302" y2="80" stroke="#10B981" strokeWidth="1.5" opacity="0.7" />

                    <rect x="320" y="25" width="4" height="45" fill="#18C98B" opacity="0.9" />
                    <line x1="322" y1="15" x2="322" y2="80" stroke="#18C98B" strokeWidth="1.5" opacity="0.9" />

                    <rect x="340" y="35" width="4" height="30" fill="#6EE7B7" opacity="0.8" />
                    <line x1="342" y1="25" x2="342" y2="75" stroke="#6EE7B7" strokeWidth="1.5" opacity="0.8" />

                    <rect x="360" y="15" width="4" height="50" fill="#18C98B" opacity="0.95" />
                    <line x1="362" y1="5" x2="362" y2="75" stroke="#18C98B" strokeWidth="1.5" opacity="0.95" />

                    <path d="M 200 80 Q 240 60, 270 45 T 330 25 T 380 10" fill="none" stroke="#18C98B" strokeWidth="2.5" />
                    <path d="M 200 80 Q 240 60, 270 45 T 330 25 T 380 10 L 380 120 L 200 120 Z" fill={`url(#brokerGrad_${broker.id || 'def'})`} opacity="0.25" />
                    
                    <defs>
                        <linearGradient id={`brokerGrad_${broker.id || 'def'}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#18C98B" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Title & Description */}
            <div className={styles.cardBody}>
                {name && <h3 className={styles.cardTitle}>{name}</h3>}
                {subtitle && <span className={styles.subtitleTag}>{subtitle}</span>}
                {showDescription && description && <p className={styles.cardDescription}>{description}</p>}
            </div>

            {/* Mini Highlights / Features Grid (Strictly 3 items) */}
            {showHighlights && displayItems.length > 0 && (
                <div className={styles.highlightsGrid}>
                    {displayItems.map((item, idx) => (
                        <div key={idx} className={styles.highlightItem}>
                            <div className={styles.iconBox}>
                                {renderHighlightIcon(item.type, idx)}
                            </div>
                            <div className={styles.highlightText}>
                                {item.title && <span className={styles.hlTitle}>{item.title}</span>}
                                {item.sub && <span className={styles.hlSub}>{item.sub}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Action Buttons */}
            <div className={styles.cardFooter}>
                {broker.websiteUrl && (
                    <a
                        href={broker.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.visitSiteBtn}
                    >
                        <ExternalLinkIcon />
                        <span>{t('broker.visitSite', 'Visit Site')}</span>
                    </a>
                )}

                <Link href={href} className={styles.viewDetailsBtn}>
                    <span className={styles.btnLabel}>{t('broker.viewDetails', 'View Details')}</span>
                    <ChevronRightIcon />
                </Link>
            </div>
        </div>
    );
}
