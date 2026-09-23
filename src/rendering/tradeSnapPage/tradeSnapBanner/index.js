"use client";
import React from 'react'
import { motion } from 'framer-motion';
import styles from './tradeSnapBanner.module.scss';
import LineText from '@/components/lineText';
import Button from '@/components/button';
import AiIcon from '@/icons/aiIcon';
import WinIcon from '@/icons/winIcon';
import StructureIcon from '@/icons/structureIcon';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';

const UploadIcon = '/assets/icons/upload-xs.svg';
const PlayIcon = '/assets/icons/play.svg';
const SnapImage = '/assets/images/ai-trade-main.png';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 110,
            damping: 18
        }
    }
};

const imageVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.95, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 90,
            damping: 20,
            delay: 0.25
        }
    }
};

export default function TradeSnapBanner() {
    const router = useRouter();
    const { t } = useLanguage();

    const handleAnalyzeClick = () => {
        authNavigate(router, '/trade-snap');
    };

    const handleLearnMoreClick = () => {
        const el = document.getElementById('how-it-works');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            authNavigate(router, '/trade-snap');
        }
    };

    return (
        <div className={styles.tradeSnapBanner}>
            <div className={styles.widthFull}>
                <div className='container-xs'>
                    <div className={styles.grid}>
                        <motion.div
                            className={styles.leftContent}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={itemVariants} className={styles.badgeWrapper}>
                                <LineText text={t('nav.aiTrade', 'AI Chart Scanner')} start />
                            </motion.div>
                            <motion.div className={styles.title} variants={itemVariants}>
                                <h1>
                                    {t('tradeSnap.title', 'AI CHART SCANNER')}
                                </h1>
                                <p>
                                    {t('tradeSnap.subtitle', 'Capture your screen, analyze chart movements, and get AI trade insights with single or multi-timeframe views.')}
                                </p>
                            </motion.div>
                            <motion.div className={styles.buttonAlignment} variants={itemVariants}>
                                <Button text={t('tradeSnap.analyzeBtn', 'Analyze Chart')} icon={UploadIcon} onClick={handleAnalyzeClick} />
                                <Button outline text={t('common.learnMore', 'Learn More')} icon={PlayIcon} onClick={handleLearnMoreClick} />
                            </motion.div>
                            <motion.div className={styles.tagAlignment} variants={itemVariants}>
                                <motion.button
                                    className={styles.tagBtn}
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <span className={styles.tagIcon}><AiIcon /></span>
                                    <span>{t('tradeSnap.aiAnalysisTag', 'AI Powered Analysis')}</span>
                                </motion.button>
                                <motion.button
                                    className={styles.tagBtn}
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <span className={styles.tagIcon}><WinIcon /></span>
                                    <span>{t('tradeSnap.riskTag', 'Smart Risk Detection')}</span>
                                </motion.button>
                                <motion.button
                                    className={styles.tagBtn}
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <span className={styles.tagIcon}><StructureIcon /></span>
                                    <span>{t('tradeSnap.structureTag', 'Structure & Liquidity')}</span>
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className={styles.imageColumn}
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className={styles.imageCard}>
                                <img src={SnapImage} alt="AI Trade Showcase" className={styles.tradeImage} />
                                <div className={styles.imageGlow} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}


