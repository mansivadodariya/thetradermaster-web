"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { navigateFeature } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';
import styles from './cardList.module.scss';
import RightIcon from '@/icons/rightIcon';

export default function CardList() {
    const router = useRouter();
    const { t } = useLanguage();

    const gridData = [
        {
            icon: '/assets/icons/signals.svg',
            title: t('header.products.chartScanner.title', 'AI CHART SCANNER'),
            desc: t('homeSections.hero.cards.analysisDesc', 'Multi-timeframe technical pattern detection & neural OCR chart vision.'),
            publicPath: '/ai-chart-scanner',
            dashboardPath: '/chart-scanner'
        },
        {
            icon: '/assets/icons/chat-square.svg',
            title: t('header.products.marketAssistant.title', 'AI MARKET ASSISTANT'),
            desc: t('header.products.marketAssistant.desc', 'Ask AI about markets, strategies, signals, and trading decisions.'),
            publicPath: '/ai-market-assistant',
            dashboardPath: '/market-assistant'
        },
        {
            icon: '/assets/icons/strategy-builder.svg',
            title: t('header.products.signalTerminal.title', 'SIGNAL TERMINAL'),
            desc: t('header.products.signalTerminal.desc', 'Real-time breakout scanner, momentum radar & algorithmic signals.'),
            publicPath: '/live-market-scanner',
            dashboardPath: '/signal-terminal'
        },
        {
            icon: '/assets/icons/strategy-builder.svg',
            title: t('header.products.strategyHub.title', 'AI TRADING SIGNAL'),
            desc: t('header.products.strategyHub.desc', 'Build, backtest, and deploy algorithmic trading playbooks with AI.'),
            publicPath: '/ai-trading-signal',
            dashboardPath: '/trading-signal'
        },
        {
            icon: '/assets/icons/analysis.svg',
            title: t('header.tradingTools.tradeAudit.title', 'AI PAST TRADE ANALYZER'),
            desc: t('header.tradingTools.tradeAudit.desc', 'Deep algorithmic trade audit, performance review, and leak elimination.'),
            publicPath: '/ai-trade-advisor',
            dashboardPath: '/trade-advisor'
        }
    ];

    const handleCardClick = (item) => {
        router.push(item.publicPath);
    };

    return (
        <div className={styles.cardList}>
            <div className='container'>
                <div className={styles.grid}>
                    {gridData.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            onClick={() => handleCardClick(item)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleCardClick(item);
                                }
                            }}
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.7,
                                delay: 0.3 + index * 0.15,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                        >
                            <div className={styles.iconWrapper}>
                                <img src={item.icon} alt={item.title} />
                            </div>
                            <div className={styles.cardInfo}>
                                <h3>{item.title}</h3>
                                <div className={styles.line}></div>
                                <p>{item.desc}</p>
                            </div>
                            <button 
                                type="button"
                                className={styles.arrowBtn}
                                aria-label={`Navigate to ${item.title}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(item);
                                }}
                            >
                                <RightIcon />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
