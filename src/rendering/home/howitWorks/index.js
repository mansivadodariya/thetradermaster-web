'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import styles from './howitWorks.module.scss';
import LineText from '@/components/lineText';
import { useLanguage } from '@/context/LanguageContext';

const Step1 = '/assets/images/step1-new.png';
const Step2 = '/assets/images/step2-new.png';
const Step3 = '/assets/images/step3-new.png';
const Step4 = '/assets/images/step4-new.png';

const UserAddIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="17" y1="11" x2="23" y2="11"></line>
    </svg>
);

const LinkIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
);

const SparklesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const RefreshTradeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
);

export default function HowitWorks() {
    const { t } = useLanguage();
    const [activeStep, setActiveStep] = useState(0);

    const stepsData = [
        {
            id: 1,
            stepNum: '01',
            badge: 'STEP 01',
            shortLabel: t('home.step1Tab', '1. Create Account'),
            title: t('home.step1Title', 'Create your account'),
            subtitle: t('home.step1Subtitle', 'Instant access to Trader Master AI platform with zero subscription fees.'),
            description: t('home.step1Desc', 'Sign up on Trader Master using your email address to access your trading dashboard instantly. No credit card or upfront deposit required.'),
            highlights: [
                'Free instant registration',
                'No credit card or payment upfront',
                'Immediate access to AI modules'
            ],
            image: Step1,
            icon: <UserAddIcon />
        },
        {
            id: 2,
            stepNum: '02',
            badge: 'STEP 02',
            shortLabel: t('home.step2Tab', '2. Link Newera'),
            title: t('home.step2Title', 'Link Newera account'),
            subtitle: t('home.step2Subtitle', 'Connect your MT5 brokerage account to synchronize credits seamlessly.'),
            description: t('home.step2Desc', 'Connect your Newera trading account by entering your registered Newera email address to claim your initial AI credits.'),
            highlights: [
                'Seamless MT5 account integration',
                'Automatic credit synchronization',
                '100% private & secure connection'
            ],
            image: Step2,
            icon: <LinkIcon />
        },
        {
            id: 3,
            stepNum: '03',
            badge: 'STEP 03',
            shortLabel: t('home.step3Tab', '3. Ask the AI'),
            title: t('home.step3Title', 'Ask the AI'),
            subtitle: t('home.step3Subtitle', 'Real-time chart reading, AI chat commentary, and automated strategy generator.'),
            description: t('home.step3Desc', 'Analyze MT5 screenshots with AI Trade, consult the AI Chat for market session analysis, or generate complete backtested strategies with AI Strategy.'),
            highlights: [
                'Graded MT5 trade setups with R:R',
                '24/7 Market pair commentary',
                'Automated strategy generation & backtest'
            ],
            image: Step3,
            icon: <SparklesIcon />
        },
        {
            id: 4,
            stepNum: '04',
            badge: 'STEP 04',
            shortLabel: t('home.step4Tab', '4. Trade & Replenish'),
            title: t('home.step4Title', 'Trade & replenish'),
            subtitle: t('home.step4Subtitle', 'Your active trading volume automatically powers your AI insights cycle.'),
            description: t('home.step4Desc', 'Every completed trade cycle on your linked Newera account automatically replenishes your credits, giving you an uninterrupted self-sustaining AI access.'),
            highlights: [
                'Trade volume auto-replenishes credits',
                'Zero recurring subscription fees',
                'Self-sustaining trading ecosystem'
            ],
            image: Step4,
            icon: <RefreshTradeIcon />
        }
    ];

    const currentData = stepsData[activeStep];

    return (
        <div className={styles.howitWorks}>
            <div className='container-xs'>
                <LineText text={t('home.howItWorksLine', 'How It Works')} />
                
                <div className={styles.title}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {t('home.howItWorksTitlePart1', 'From Signup to AI Insight in')}{' '}
                        <span className={styles.neonText}>
                            {t('home.howItWorksTitlePart2', 'Four Simple Steps')}
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {t('home.howItWorksSubtitle', 'No subscription, no card upfront. Your trading activity is what powers your AI access.')}
                    </motion.p>
                </div>

                {/* Cyber Pipeline Stepper Track Header */}
                <div className={styles.pipelineStepper}>
                    <div className={styles.stepperProgressTrack}>
                        <div 
                            className={styles.activeProgressFill} 
                            style={{ width: `${((activeStep + 1) / stepsData.length) * 100}%` }}
                        />
                    </div>

                    <div className={styles.stepperTabs}>
                        {stepsData.map((step, idx) => (
                            <button
                                key={step.id}
                                className={`${styles.stepperTab} ${activeStep === idx ? styles.active : ''}`}
                                onClick={() => setActiveStep(idx)}
                            >
                                <div className={styles.stepNumBubble}>{step.stepNum}</div>
                                <span className={styles.stepTitleLabel}>{step.shortLabel}</span>
                                {activeStep === idx && (
                                    <motion.div 
                                        className={styles.activeGlowIndicator}
                                        layoutId="activeGlow"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Interactive Cyber Showcase Workspace */}
                <div className={styles.showcaseWorkspace}>
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={currentData.id}
                            className={styles.workspaceGrid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Left Details Panel */}
                            <div className={styles.detailsPanel}>
                                <div className={styles.panelHeader}>
                                    <span className={styles.badgePill}>{currentData.badge}</span>
                                    <div className={styles.iconCircle}>
                                        {currentData.icon}
                                    </div>
                                </div>

                                <h3>{currentData.title}</h3>
                                <h4>{currentData.subtitle}</h4>
                                <p>{currentData.description}</p>

                                <div className={styles.highlightsList}>
                                    {currentData.highlights.map((item, i) => (
                                        <div key={i} className={styles.highlightItem}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Step Navigation Controls */}
                                <div className={styles.stepControls}>
                                    <button 
                                        className={styles.navBtn}
                                        disabled={activeStep === 0}
                                        onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                        <span>Previous Step</span>
                                    </button>

                                    <button 
                                        className={`${styles.navBtn} ${styles.nextBtn}`}
                                        disabled={activeStep === stepsData.length - 1}
                                        onClick={() => setActiveStep(prev => Math.min(stepsData.length - 1, prev + 1))}
                                    >
                                        <span>Next Step</span>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Right 3D Visual Frame Showcase */}
                            <div className={styles.visualFramePanel}>
                                <div className={styles.cyberGlassWindow}>
                                    <div className={styles.windowHeader}>
                                        <div className={styles.windowDots}>
                                            <span className={styles.redDot}></span>
                                            <span className={styles.yellowDot}></span>
                                            <span className={styles.greenDot}></span>
                                        </div>
                                        <span className={styles.windowTitle}>Trader Master Step {currentData.stepNum}</span>
                                    </div>
                                    <div className={styles.imageBox}>
                                        <img src={currentData.image} alt={currentData.title} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
