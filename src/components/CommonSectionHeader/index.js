'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './commonSectionHeader.module.scss';
import {
    MyBotsIcon,
    AiBotSparkIcon,
    CustomBotIcon,
    BotLibraryIcon,
} from '@/icons/sidebarIcons';

const PATH_ICON_MAP = {
    '/my-bots': <MyBotsIcon width={28} height={28} />,
    '/ai-bot-builder': <AiBotSparkIcon width={28} height={28} />,
    '/bot-builder': <AiBotSparkIcon width={28} height={28} />,
    '/manual-bot-builder': <CustomBotIcon width={28} height={28} />,
    '/custom-bot-builder': <CustomBotIcon width={28} height={28} />,
    '/bot-library': <BotLibraryIcon width={28} height={28} />,
    '/browse-bots': <BotLibraryIcon width={28} height={28} />,
};

export default function CommonSectionHeader({
    badge = 'TRADERMASTER AI TRADING DESK',
    badgeIcon = null,
    icon,
    title,
    title1,
    title2,
    highlightText,
    emoji,
    subtitle,
    tabs = [],
    activeTab,
    onTabChange,
    rightAction,
    isCard = true,
    className = '',
    children,
    as,
    asTag,
    headingTag
}) {
    const pathname = usePathname();
    const resolvedIcon = icon !== undefined 
        ? icon 
        : (pathname ? PATH_ICON_MAP[pathname] || null : null);
    const HeadingTag = as || asTag || headingTag || 'h2';

    const renderHeadline = () => {
        if (title1 && title2) {
            return (
                <HeadingTag className={styles.headline}>
                    {title1}{' '}
                    <span className={styles.highlight}>{title2}</span>
                    {emoji && <span className={styles.emoji}>{emoji}</span>}
                </HeadingTag>
            );
        }

        if (title && highlightText) {
            return (
                <HeadingTag className={styles.headline}>
                    {title}{' '}
                    <span className={styles.highlight}>{highlightText}</span>
                    {emoji && <span className={styles.emoji}>{emoji}</span>}
                </HeadingTag>
            );
        }

        if (typeof title === 'string' && title.trim()) {
            const words = title.trim().split(/\s+/);
            if (words.length >= 2) {
                const midpoint = Math.ceil(words.length / 2);
                const firstHalf = words.slice(0, midpoint).join(' ');
                const secondHalf = words.slice(midpoint).join(' ');
                return (
                    <HeadingTag className={styles.headline}>
                        {firstHalf}{' '}
                        <span className={styles.highlight}>{secondHalf}</span>
                        {emoji && <span className={styles.emoji}>{emoji}</span>}
                    </HeadingTag>
                );
            }
            return (
                <HeadingTag className={styles.headline}>
                    {title}
                    {emoji && <span className={styles.emoji}>{emoji}</span>}
                </HeadingTag>
            );
        }

        if (title) {
            return (
                <HeadingTag className={styles.headline}>
                    {title}
                    {emoji && <span className={styles.emoji}>{emoji}</span>}
                </HeadingTag>
            );
        }

        return null;
    };

    return (
        <div className={`${styles.sectionHeaderCard} ${!isCard ? styles.inlineHeader : ''} ${className}`}>
            <div className={styles.headerLayoutRow}>
                {resolvedIcon && (
                    <div className={styles.bigIconBox}>
                        {resolvedIcon}
                    </div>
                )}

                <div className={styles.headerContentCol}>
                    {/* Main Row: Title, Subtitle, Badge, and Actions */}
                    <div className={styles.headerMainRow}>
                        <div className={styles.textGroup}>
                            {renderHeadline()}
                            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                        </div>

                        {(badge || rightAction) && (
                            <div className={styles.headerTopRow}>
                                {badge && (
                                    <div className={styles.badgePill}>
                                        {badgeIcon && (
                                            <span className={styles.badgeIconWrap}>
                                                {badgeIcon}
                                            </span>
                                        )}
                                        <span>{badge}</span>
                                    </div>
                                )}

                                {rightAction && (
                                    <div className={styles.rightActions}>
                                        {rightAction}
                                    </div>
                                )}
                            </div>
                        )}

                        {tabs && tabs.length > 0 && (
                            <div className={styles.tabBar}>
                                {tabs.map((tab) => {
                                    const tabId = typeof tab === 'string' ? tab : tab.id;
                                    const tabLabel = typeof tab === 'string' ? tab : tab.label;
                                    const isActive = activeTab === tabId;
                                    return (
                                        <button
                                            key={tabId}
                                            type="button"
                                            className={`${styles.tabBtn} ${isActive ? styles.activeTab : ''}`}
                                            onClick={() => onTabChange && onTabChange(tabId)}
                                        >
                                            {tabLabel}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Optional Embedded Children (Chart, Metrics, etc.) */}
            {children}
        </div>
    );
}
