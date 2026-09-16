'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './whyChooseUs.module.scss'
import LineText from '@/components/lineText'
import { useLanguage } from '@/context/LanguageContext'

const CreditIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
    </svg>
)

const Mt5Icon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
)

const DataIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
)

const AiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
)

const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
)

const RepeatIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
)

export default function WhyChooseUs() {
    const { t } = useLanguage()

    const features = [
        {
            icon: <CreditIcon />,
            title: t('home.whyNoSub', 'No Subscription Required'),
            description: t('home.whyNoSubDesc', 'Pay with your trading volume, not your wallet. Every completed trade cycle on Newera replenishes your AI credits automatically.'),
        },
        {
            icon: <Mt5Icon />,
            title: t('home.whyMt5', 'Built Exclusively for MT5'),
            description: t('home.whyMt5Desc', 'Unlike generic AI tools, Trader Master is purpose-built for MetaTrader 5 traders with deep integration into the MT5 ecosystem.'),
        },
        {
            icon: <DataIcon />,
            title: t('home.whyData', 'Institutional-Grade Data'),
            description: t('home.whyDataDesc', 'Market telemetry and price data across currencies, commodities, and indices sourced from institutional data feeds for professional-level accuracy.'),
        },
        {
            icon: <AiIcon />,
            title: t('home.whyRealtime', 'Real-Time AI Analysis'),
            description: t('home.whyRealtimeDesc', 'Get instant chart readings, pattern detection, and trade setups within seconds — not minutes. AI that matches your trading speed.'),
        },
        {
            icon: <ShieldIcon />,
            title: t('home.whyPrivacy', 'Complete Privacy'),
            description: t('home.whyPrivacyDesc', 'We never access your brokerage account, hold client deposits, or execute trades on your behalf. Your trading data stays yours.'),
        },
        {
            icon: <RepeatIcon />,
            title: t('home.whyCredit', 'Trade More, Analyze More'),
            description: t('home.whyCreditDesc', 'A unique credit system that rewards active traders. The more you trade, the more AI analysis credits you earn — creating a self-sustaining cycle.'),
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
        hover: {
            y: -6,
            transition: { duration: 0.3 },
        },
    }

    return (
        <section className={styles.whyChooseUs}>
            <div className="container-xs">
                <LineText text={t('home.whyChooseLine', 'Why Choose Us')} />
                
                <div className={styles.title}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {t('home.whyChooseTitlePart1', 'Why Traders Choose')}{' '}
                        <span className={styles.neonText}>
                            {t('home.whyChooseTitlePart2', 'Trader Master')}
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {t('home.whyChooseSubtitle', 'Purpose-built AI trading intelligence with a unique credit model that aligns our platform with your trading success.')}
                    </motion.p>
                </div>

                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <div className={styles.iconWrap}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
