"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './herobanner.module.scss';
import Header from '@/components/header';
import Button from '@/components/button';
import LineText from '@/components/lineText';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';

const ArrowIcon = '/assets/icons/arrow.svg';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 20
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

// SVG Icons for feature cards
const CameraIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

const ChatIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const StrategyIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
);

const AnalyzerIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export default function Herobanner() {
    const router = useRouter();
    const { language, t } = useLanguage();
    const [isBrainHovered, setIsBrainHovered] = React.useState(false);

    const featureCards = [
        {
            icon: <CameraIcon />,
            title: t('nav.aiTrade', 'AI Trade Assistance'),
            description: t('home.aiTradeCardDesc', 'Upload a chart screenshot and get instant structure analysis, key levels, and a graded setup with risk/reward.'),
            link: '/tradesnap',
        },
        {
            icon: <ChatIcon />,
            title: t('nav.aiChat', 'AI Chat'),
            description: t('home.aiChatCardDesc', 'Ask anything — pair commentary, session bias, news interpretation. Every prompt uses just one credit.'),
            link: '/ai-chat',
        },
        {
            icon: <StrategyIcon />,
            title: t('nav.aiStrategy', 'AI Strategy'),
            description: t('home.aiStrategyCardDesc', 'Describe your style, get a complete strategy with entry rules, filters, and an exportable backtest report.'),
            link: '/ai-strategy',
        },
        {
            icon: <AnalyzerIcon />,
            title: t('nav.pastTradeAnalyzer', 'AI Past Trade Analyzer'),
            description: t('home.aiPastTradeAnalyzerCardDesc', 'Upload MT4/MT5/cTrader broker statements to reveal execution leaks, win-rate edge, and AI trade playbooks.'),
            link: '/past-trade-analyzer',
        },
    ];

    return (
        <div className={`${styles.herobanner} ${isBrainHovered ? styles.brainActive : ''}`}>
            <Image
                src="/assets/images/new-hero-banner.webp"
                alt="Trader Master AI Hero"
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                quality={85}
                className={styles.heroBgImage}
            />
            <div className={styles.heroInner}>
                {/* Main hero content */}
                <div className="container-xs">
                    <div className={styles.grid}>
                        <div className={styles.contentLeft}>
                            <div className={styles.tagWrap}>
                                <LineText text={t('home.heroTag', 'AI-POWERED TRADING INTELLIGENCE')} start />
                            </div>

                            <h1>
                                {t('home.heroTitleLine1', 'READ THE MARKET.')} <br/>
                                <span className={styles.neonText}>{t('home.heroTitleLine2', 'BEFORE')}</span> {t('home.heroTitleLine3', 'IT MOVES.')}
                            </h1>

                            <p>
                                {t('home.heroSubtitle', 'Trader Master reads your charts, analyses your trades, and builds your strategies through a conversational prompt interface designed exclusively for Forex and MT5 traders.')}
                            </p>

                            <div className={styles.actionButtons}>
                                <Button 
                                    text={t('nav.explorePlatform', 'EXPLORE THE PLATFORM')}
                                    icon={ArrowIcon}
                                    onClick={() => authNavigate(router, '/dashboard')}
                                />
                            </div>
                        </div>

                        {/* Interactive Brain Hotspot (Over Background Image Brain) */}
                        <div 
                            className={styles.contentRight}
                            onMouseEnter={() => setIsBrainHovered(true)}
                            onMouseLeave={() => setIsBrainHovered(false)}
                        >
                            <div className={styles.brainWrapper}>
                                {/* Soft Emerald Neural Glow Aura */}
                                <div className={styles.brainNeuralAura} />

                                {/* Neural Synapse Firing Points */}
                                <div className={styles.synapseContainer}>
                                    <span className={`${styles.synapseDot} ${styles.s1}`} />
                                    <span className={`${styles.synapseDot} ${styles.s2}`} />
                                    <span className={`${styles.synapseDot} ${styles.s3}`} />
                                    <span className={`${styles.synapseDot} ${styles.s4}`} />
                                    <span className={`${styles.synapseDot} ${styles.s5}`} />
                                </div>

                                {/* Subtle Active Status Badge */}
                                {/* <div className={styles.activeBrainBadge}>
                                    <span className={styles.activeDot} />
                                    <span>AI Neural Engine Active</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Cards at the bottom */}
                <div className={styles.featureCardsSection}>
                    <div className="container-xs">
                        <motion.div 
                            className={styles.featureCardsGrid}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {featureCards.map((card, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.featureCard}
                                    variants={cardVariants}
                                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                    onClick={() => router.push(card.link)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={styles.cardIcon}>{card.icon}</div>
                                    <div className={styles.cardContent}>
                                        <h3>{card.title}</h3>
                                        <p>{card.description}</p>
                                    </div>
                                    <div className={styles.cardArrow}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
