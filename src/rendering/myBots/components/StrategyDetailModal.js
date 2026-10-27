'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../myBots.module.scss';

export default function StrategyDetailModal({ strategy, onClose, onSimulate, onRunBacktest }) {
    const { t } = useLanguage();

    if (!strategy) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.strategyModalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div>
                        <div className={styles.botMetaRow}>
                            <span className={styles.symbolBadge}>{strategy.symbol}</span>
                            <span className={styles.timeframeBadge}>{strategy.timeframe}</span>
                            <span className={`${styles.directionBadge} ${strategy.direction?.toLowerCase() === 'short' ? styles.shortBadge : styles.longBadge}`}>
                                {strategy.direction}
                            </span>
                            <span className={`${styles.creationTypeBadge} ${strategy.creationType === 'ai' ? styles.creationBadgeAi : styles.creationBadgeManual}`}>
                                {strategy.creationType === 'ai' ? t('myBots.filterAi', 'AI Bots') : t('myBots.filterManual', 'Manual / Custom Bots')}
                            </span>
                        </div>
                        <h3 className={styles.modalStratTitle}>{strategy.name}</h3>
                    </div>
                    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className={styles.strategyModalBody}>
                    {strategy.description && (
                        <div className={styles.detailBlock}>
                            <span className={styles.detailLabel}>{t('myBots.rationale', 'RATIONALE & ARCHETYPE')}</span>
                            <p className={styles.detailText}>{strategy.description}</p>
                        </div>
                    )}

                    {strategy.rawStrategy?.trade_reasoning?.rule_summary && (
                        <div className={styles.detailBlock}>
                            <span className={styles.detailLabel}>{t('myBots.ruleSummary', 'EXECUTION RULE SUMMARY')}</span>
                            <p className={styles.detailText}>{strategy.rawStrategy.trade_reasoning.rule_summary}</p>
                        </div>
                    )}

                    {strategy.rawStrategy?.trade_reasoning?.market_regime && (
                        <div className={styles.detailBlock}>
                            <span className={styles.detailLabel}>{t('myBots.marketRegime', 'MARKET REGIME & CONTEXT')}</span>
                            <p className={styles.detailText}>{strategy.rawStrategy.trade_reasoning.market_regime}</p>
                        </div>
                    )}

                    <div className={styles.specGrid}>
                        <div className={styles.specItem}>
                            <span>{t('myBots.takeProfit', 'Take Profit')}</span>
                            <strong>{strategy.tp}</strong>
                        </div>
                        <div className={styles.specItem}>
                            <span>{t('myBots.stopLoss', 'Stop Loss')}</span>
                            <strong>{strategy.sl}</strong>
                        </div>
                        <div className={styles.specItem}>
                            <span>{t('myBots.riskReward', 'Risk / Reward')}</span>
                            <strong>{strategy.riskReward}</strong>
                        </div>
                        <div className={styles.specItem}>
                            <span>{t('myBots.positionSizing', 'Position Sizing')}</span>
                            <strong>{strategy.lots} {t('myBots.lots', 'Lots')}</strong>
                        </div>
                    </div>
                </div>

                {onRunBacktest && (
                    <div className={styles.modalFooterRow}>
                        <button
                            type="button"
                            className={styles.botActionBtn}
                            style={{ width: '100%', padding: '12px 20px', justifyContent: 'center' }}
                            onClick={() => {
                                onRunBacktest(strategy);
                                onClose();
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                            </svg>
                            <span>{t('myBots.runBacktest', 'Run Backtest')}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
