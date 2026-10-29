'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getMyBotsText } from '../utils/myBotsTranslations';
import styles from '../myBots.module.scss';

export default function MyBotCard({
    bot,
    onToggleStatus,
    onRunBacktest,
    onSelectDetail,
    onSelectDelete
}) {
    const { t, language } = useLanguage();

    return (
        <div className={styles.botCard}>
            <div className={styles.botCardHeader}>
                <div className={styles.headerInfo}>
                    <div className={styles.botMetaRow}>
                        <span className={styles.symbolBadge}>{bot.symbol || 'BTCUSD'}</span>
                        <span className={styles.timeframeBadge}>{bot.timeframe || '15m'}</span>
                        <span className={`${styles.directionBadge} ${bot.direction?.toLowerCase() === 'short' ? styles.shortBadge : styles.longBadge}`}>
                            {getMyBotsText(bot.direction || 'Long', language)}
                        </span>
                        <span className={`${styles.creationTypeBadge} ${bot.creationType === 'ai' ? styles.creationBadgeAi : styles.creationBadgeManual}`}>
                            {bot.creationType === 'ai' ? t('myBots.filterAi', 'AI Bots') : t('myBots.filterManual', 'Manual')}
                        </span>
                        <span className={styles.typeBadge}>{getMyBotsText(bot.type || 'MANUAL BACKTEST', language)}</span>
                    </div>
                    <h3 className={styles.botName} title={bot.name}>{getMyBotsText(bot.name, language)}</h3>
                    {bot.pattern && (
                        <p className={styles.botPatternText}>{getMyBotsText(bot.pattern, language)}</p>
                    )}
                </div>
                <button
                    type="button"
                    className={`${styles.statusToggle} ${bot.status === 'active' ? styles.statusActive : styles.statusPaused}`}
                    onClick={() => onToggleStatus(bot.id)}
                    title="Toggle live / paused"
                >
                    {bot.status === 'active' ? t('myBots.live', '● LIVE') : t('myBots.paused', '○ PAUSED')}
                </button>
            </div>

            {bot.description && (
                <p className={styles.botDesc}>{getMyBotsText(bot.description, language)}</p>
            )}

            <div className={styles.statsGrid}>
                <div className={`${styles.metricCardBox} ${styles.statBoxTarget}`}>
                    <span className={styles.metricCardIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>
                    </span>
                    <span className={styles.metricCardValue}>{bot.tp || '50 pts'}</span>
                    <span className={styles.metricCardLabel}>{t('myBots.targetLabel', 'Target')}</span>
                </div>

                <div className={`${styles.metricCardBox} ${styles.statBoxSl}`}>
                    <span className={styles.metricCardIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                            <polyline points="17 18 23 18 23 12" />
                        </svg>
                    </span>
                    <span className={styles.metricCardValue}>{bot.sl || '25 pts'}</span>
                    <span className={styles.metricCardLabel}>{t('myBots.slLabel', 'Stop Loss')}</span>
                </div>

                <div className={`${styles.metricCardBox} ${styles.statBoxWr}`}>
                    <span className={styles.metricCardIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    </span>
                    <span className={styles.metricCardValue}>{bot.winRate || '0%'}</span>
                    <span className={styles.metricCardLabel}>{t('myBots.winRateLabel', 'Win Rate')}</span>
                </div>

                <div className={`${styles.metricCardBox} ${styles.statBoxPnl}`}>
                    <span className={styles.metricCardIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </span>
                    <span className={styles.metricCardValue}>{bot.totalPnl || bot.profitFactor || '1.85'}</span>
                    <span className={styles.metricCardLabel}>{t('myBots.estPnlLabel', 'Est. PnL')}</span>
                </div>
            </div>

            <div className={styles.winRateSection}>
                <div className={styles.winRateHeader}>
                    <span className={styles.winRateLabel}>{t('myBots.winRateLabel', 'Win Rate')}</span>
                    <span className={styles.winRatePct}>{bot.winRate || '0%'}</span>
                </div>
                <div className={styles.progressTrack}>
                    <div
                        className={styles.progressFill}
                        style={{
                            width: `${Math.min(100, Math.max(0, parseFloat(String(bot.winRate || '0').replace(/[^0-9.]/g, '')) || 0))}%`
                        }}
                    />
                </div>
            </div>

            <div className={styles.botCardActions}>
                <button
                    type="button"
                    className={styles.botActionBtn}
                    onClick={() => onRunBacktest(bot)}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    </svg>
                    <span>{t('myBots.runBacktest', 'Run Backtest')}</span>
                </button>
                <button
                    type="button"
                    className={styles.detailsActionBtn}
                    onClick={() => onSelectDetail(bot)}
                    title="View Full Rules"
                >
                    <span>{t('myBots.rules', 'Rules')}</span>
                </button>
                <button
                    type="button"
                    className={styles.deleteAction}
                    onClick={() => onSelectDelete(bot)}
                    title="Delete Strategy"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
