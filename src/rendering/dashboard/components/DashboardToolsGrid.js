'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { fetchVisibleTabNames, getVisibleTabNamesSync } from '@/lib/useTabPermission';
import styles from '../dashboard.module.scss';

export default function DashboardToolsGrid() {
    const { t } = useLanguage();
    const [visibleTabNames, setVisibleTabNames] = useState(() => getVisibleTabNamesSync());

    useEffect(() => {
        fetchVisibleTabNames().then(set => {
            if (set) setVisibleTabNames(set);
        });
    }, []);

    const tools = useMemo(() => [
        {
            id: 'strategyStudio',
            title: t('dashboard.toolStrategyStudio', 'AI Bot Builder'),
            desc: t('dashboard.strategyStudioDesc', 'Conversational strategy builder & algorithmic backtester'),
            badge: 'QUANT LAB',
            cta: t('dashboard.launchStudio', 'Launch Builder'),
            href: '/ai-bot-builder',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            )
        },
        {
            id: 'terminal',
            title: t('dashboard.toolLiveScanner', 'Signal Terminal'),
            desc: t('dashboard.terminalDesc', 'Live institutional setups & order flow triggers'),
            badge: 'LIVE TERMINAL',
            cta: t('dashboard.openTerminal', 'Open Terminal'),
            href: '/signal-terminal',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                </svg>
            )
        },
        {
            id: 'strategySignal',
            title: t('nav.strategySignal', 'Strategy Signal'),
            desc: t('dashboard.strategySignalDesc', 'Automated algorithmic playbooks & execution signals'),
            badge: 'PLAYBOOKS',
            cta: t('dashboard.viewSignals', 'View Signals'),
            href: '/strategy-signal',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                </svg>
            )
        },
        {
            id: 'advisor',
            title: t('dashboard.toolTradeAudit', 'AI Past Trade Analyzer'),
            desc: t('dashboard.advisorDesc', 'Statistical win-rate, R:R & performance audit'),
            badge: 'TRADE AUDIT',
            cta: t('dashboard.auditStatements', 'Audit Statements'),
            href: '/trade-advisor',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M7 16l4-5 4 3 6-8" />
                    <polyline points="15 6 21 6 21 12" />
                </svg>
            )
        },
        {
            id: 'calculators',
            title: t('nav.forexCalculator', 'Forex Calculator'),
            desc: t('dashboard.calculatorsDesc', 'Lot sizing, position risk & margin calculator'),
            badge: 'RISK DESK',
            cta: t('dashboard.openCalculators', 'Open Calculators'),
            href: '/calculator',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="3" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <line x1="8" y1="10" x2="10" y2="10" />
                    <line x1="14" y1="10" x2="16" y2="10" />
                    <line x1="8" y1="14" x2="10" y2="14" />
                    <line x1="14" y1="14" x2="16" y2="14" />
                    <line x1="8" y1="18" x2="16" y2="18" />
                </svg>
            )
        },
        {
            id: 'calendar',
            title: t('dashboard.toolEconomicCalendar', 'Economic Calendar'),
            desc: t('dashboard.calendarDesc', 'High-impact macroeconomic data releases'),
            badge: 'MACRO NEWS',
            cta: t('dashboard.viewCalendar', 'View Calendar'),
            href: '/calendar',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="17" rx="3" />
                    <path d="M16 2v4M8 2v4M3 9h18" />
                    <circle cx="8" cy="13" r="1" fill="currentColor" />
                    <circle cx="12" cy="13" r="1" fill="currentColor" />
                    <circle cx="16" cy="13" r="1" fill="currentColor" />
                    <circle cx="8" cy="17" r="1" fill="currentColor" />
                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
            )
        }
    ], [t]);

    const displayedTools = useMemo(() => {
        if (!visibleTabNames || visibleTabNames.size === 0) return tools;
        return tools.filter(tool => {
            if (tool.id === 'strategyStudio' || tool.href === '/ai-bot-builder') {
                return visibleTabNames.has('ai bot builder');
            }
            if (tool.id === 'terminal' || tool.href === '/signal-terminal') {
                return visibleTabNames.has('signal terminal');
            }
            if (tool.id === 'strategySignal' || tool.href === '/strategy-signal') {
                return visibleTabNames.has('strategy signal');
            }
            if (tool.id === 'advisor' || tool.href === '/trade-advisor') {
                return (
                    visibleTabNames.has('ai past trade analyzer') ||
                    visibleTabNames.has('past trade analyzer') ||
                    visibleTabNames.has('ai trade advisor') ||
                    visibleTabNames.has('trade advisor') ||
                    visibleTabNames.has('ai trade audit') ||
                    visibleTabNames.has('trade audit') ||
                    visibleTabNames.has('ai trade analysis')
                );
            }
            if (tool.id === 'calculators' || tool.href === '/calculator') {
                return visibleTabNames.has('forex calculator');
            }
            if (tool.id === 'calendar' || tool.href === '/calendar') {
                return visibleTabNames.has('economic calendar');
            }
            return true;
        });
    }, [tools, visibleTabNames]);

    return (
        <div className={styles.quickHubColumn}>
            <div className={styles.hubHeader}>
                <div className={styles.hubHeaderLeft}>
                    <div className={styles.hubHeaderIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                    <h3>{t('dashboard.quickActionsTitle', 'Quick Actions & AI Suite')}</h3>
                </div>
            </div>

            <div className={styles.toolsGrid2x3}>
                {displayedTools.map((tool) => (
                    <Link key={tool.id} href={tool.href} className={styles.modernToolCard}>
                        {/* Top: Icon + Badge */}
                        <div className={styles.toolCardTop}>
                            <div className={styles.toolIconBadge}>
                                {tool.icon}
                            </div>
                            <span className={styles.toolBadgeTag}>{tool.badge}</span>
                        </div>

                        {/* Mid: Title & Description */}
                        <div className={styles.toolCardBody}>
                            <h4 className={styles.toolTitle}>{tool.title}</h4>
                            <p className={styles.toolDescription}>{tool.desc}</p>
                        </div>

                        {/* Bottom: Interactive CTA with Arrow */}
                        <div className={styles.toolCardFooter}>
                            <span className={styles.toolCtaText}>{tool.cta}</span>
                            <div className={styles.toolCtaArrow}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
