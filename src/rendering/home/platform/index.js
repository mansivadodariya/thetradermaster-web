"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './platform.module.scss';
import { useRouter } from 'next/navigation';
import { navigateFeature } from '@/lib/authRedirect';
import Textbutton from '@/components/textbutton';

const AiChat = '/assets/images/ai-chat.png';
const AiTrade = '/assets/images/ai-trade.png';
const AiStrategy = '/assets/images/ai-strategy.png';

const platformData = [
    {
        topIcon: '/assets/icons/chart-square.svg',
        image: AiTrade,
        title: 'AI CHART SCANNER',
        publicPath: '/ai-chart-scanner',
        dashboardPath: '/chart-scanner',
        desc: 'Multi-timeframe technical pattern\ndetection & chart vision.',
        features: [
            { icon: '/assets/icons/market-analysis.svg', text: 'Market\nAnalysis' },
            { icon: '/assets/icons/smart-signals.svg', text: 'Smart Trade\nSignals' },
            { icon: '/assets/icons/real-time.svg', text: 'Real-time\nInsights' },
        ]
    },
    {
        topIcon: '/assets/icons/chat-square.svg',
        image: AiChat,
        title: 'AI MARKET ASSISTANT',
        publicPath: '/ai-market-assistant',
        dashboardPath: '/market-assistant',
        desc: 'Ask AI about markets, strategies,\nsignals, and trading decisions.',
        features: [
            { icon: '/assets/icons/ai-conv.svg', text: 'AI-Powered\nConversations' },
            { icon: '/assets/icons/market-knowledge.svg', text: 'Market\nKnowledge' },
            { icon: '/assets/icons/instant-answers.svg', text: 'Instant\nAnswers' },
        ]
    },
    {
        topIcon: '/assets/icons/shield-square.svg',
        image: AiStrategy,
        title: 'AI TRADING SIGNAL',
        publicPath: '/ai-trading-signal',
        dashboardPath: '/trading-signal',
        desc: 'Build and analyze smarter trading\nstrategies with AI.',
        features: [
            { icon: '/assets/icons/strategy-builder.svg', text: 'Strategy\nBuilder' },
            { icon: '/assets/icons/performance.svg', text: 'Performance\nAnalysis' },
            { icon: '/assets/icons/risk-mgt.svg', text: 'Risk\nManagement' },
        ]
    }
];

export default function Platform() {
    const router = useRouter();
    return (
        <div className={styles.platform}>
            {/* Animated Cyber Gold Top Border */}
            <div className={styles.topBorderSvgWrapper}>
                <svg
                    viewBox="0 0 1440 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="goldBaseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#18c98b" stopOpacity="0.1" />
                            <stop offset="20%" stopColor="#18c98b" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#6EE7B7" stopOpacity="0.6" />
                            <stop offset="80%" stopColor="#18c98b" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#18c98b" stopOpacity="0.1" />
                        </linearGradient>

                        <linearGradient id="goldBeamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#18c98b" stopOpacity="0" />
                            <stop offset="30%" stopColor="#18c98b" stopOpacity="0.6" />
                            <stop offset="70%" stopColor="#6EE7B7" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                        </linearGradient>

                        <filter id="goldGlowFilter" x="-20%" y="-300%" width="140%" height="700%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Base Solid Gold 1px Border Line */}
                    <path
                        d="M 0 1 H 220 L 250 31 H 1190 L 1220 1 H 1440"
                        stroke="url(#goldBaseGradient)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                    />

                    {/* Animated Traveling Light Beam along the exact border path */}
                    <motion.path
                        d="M 0 1 H 220 L 250 31 H 1190 L 1220 1 H 1440"
                        stroke="url(#goldBeamGradient)"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        filter="url(#goldGlowFilter)"
                        initial={{ pathLength: 0.22, pathOffset: -0.22 }}
                        animate={{ pathOffset: [-0.22, 1.0] }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </svg>
            </div>

            <div className='container'>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div
                        className={styles.badge}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Textbutton text="THE PLATFORM" />
                    </motion.div>

                    <h2>
                        ONE PLATFORM. EVERY <br />
                        <span>TRADING TOOL</span> YOU NEED
                    </h2>

                    <p>
                        Everything from AI trading signals and market intelligence to strategy creation,<br />
                        risk analysis, and more — all in one powerful platform.
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {platformData.map((card, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            onClick={() => router.push(card.publicPath)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    router.push(card.publicPath);
                                }
                            }}
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.7,
                                delay: 0.2 + index * 0.15,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                        >
                            <div className={styles.topIcon}>
                                <img src={card.topIcon} alt="Icon" />
                            </div>

                            <motion.div
                                className={styles.mainImage}
                                whileHover={{ scale: 1.04 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <img src={card.image} alt={card.title} />
                            </motion.div>

                            <div className={styles.cardContent}>
                                <h3>{card.title}</h3>
                                <p dangerouslySetInnerHTML={{ __html: card.desc.replace(/\n/g, '<br />') }}></p>

                                <div className={styles.features}>
                                    {card.features.map((feat, i) => (
                                        <React.Fragment key={i}>
                                            <div className={styles.featureItem}>
                                                <img src={feat.icon} alt="Feature" />
                                                <span dangerouslySetInnerHTML={{ __html: feat.text.replace(/\n/g, '<br />') }}></span>
                                            </div>
                                            {i < card.features.length - 1 && <div className={styles.divider}></div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
