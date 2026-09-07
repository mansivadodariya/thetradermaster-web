'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './whyChooseUs.module.scss'
import LineText from '@/components/lineText'
import { useLanguage } from '@/context/LanguageContext'

const CreditIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H11.5v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.65c.09 1.71 1.37 2.66 2.85 2.97V19h1.72v-1.67c1.52-.29 2.72-1.16 2.72-2.74 0-2.21-1.86-2.97-3.63-3.45z" fill="#0B56DB" />
    </svg>
)

const Mt5Icon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z" fill="#0B56DB" />
    </svg>
)

const DataIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="#0B56DB" />
    </svg>
)

const AiIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.49 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z" fill="#0B56DB" />
    </svg>
)

const ShieldIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="#0B56DB" />
    </svg>
)

const RepeatIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" fill="#0B56DB" />
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
            boxShadow: '0 12px 30px 0 rgba(11, 86, 219, 0.08)',
            borderColor: 'rgba(11, 86, 219, 0.2)',
            transition: { duration: 0.3 },
        },
    }

    return (
        <section className={styles.whyChooseUs}>
            <div className="container">
                <LineText text={t('home.whyChooseLine', 'Why Choose Us')} />
                <div className={styles.title}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {t('home.whyChooseTitle', 'Why traders choose Trader Master')}
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
