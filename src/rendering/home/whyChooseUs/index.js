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
            title: t('home.whyNoSub', 'Turn Charts Into Clear Insights'),
            description: t('home.whyNoSubDesc', 'Upload a chart and let AI analyze market structure, key levels, momentum, and potential setups. Get structured insights instead of spending hours manually studying every detail.'),
        },
        {
            icon: <Mt5Icon />,
            title: t('home.whyMt5', 'Ask. Analyze. Build.'),
            description: t('home.whyMt5Desc', 'Use AI Trade for chart analysis, AI Chat for market questions and trading discussions, and AI Strategy to create structured strategies based on your trading style.'),
        },
        {
            icon: <DataIcon />,
            title: t('home.whyData', 'Structured, Data-Driven Analysis'),
            description: t('home.whyDataDesc', 'Instead of overwhelming you with information, Trader Master organizes its analysis into clear sections so you can better understand market structure, technical conditions, setups, and risk considerations.'),
        },
        {
            icon: <AiIcon />,
            title: t('home.whyRealtime', 'Built Around Your Trading Journey'),
            description: t('home.whyRealtimeDesc', "Whether you're learning the fundamentals or already trading actively, Trader Master gives you AI-powered tools that can support different stages of your trading workflow."),
        },
        {
            icon: <ShieldIcon />,
            title: t('home.whyPrivacy', 'One Connected Trading Experience'),
            description: t('home.whyPrivacyDesc', "Trader Master is designed to work around your MT5 trading environment, creating a more connected experience between your trading activity and AI-powered analysis."),
        },
        {
            icon: <RepeatIcon />,
            title: t('home.whyCredit', 'Strategy Creation Made Simpler'),
            description: t('home.whyCreditDesc', "Describe the way you want to trade and use AI Strategy to turn your ideas into structured trading rules, filters, and backtesting workflows."),
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
