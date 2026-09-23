'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { motion } from 'framer-motion';
import styles from './tradeSetup.module.scss';
import LineText from '@/components/lineText';
import Button from '@/components/button';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRightIcon } from '@/rendering/aiStrategy/icons';

const SnapImage = '/assets/images/snap-image.png';
const ArrowRight ='/assets/icons/arrow.svg';

const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

const ProcessAiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
    </svg>
);

const InsightsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default function TradeSetup() {
    const router = useRouter();
    const { t } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 35 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        },
        hover: {
            y: -6,
            transition: { duration: 0.3 }
        }
    };

    const arrowVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 }
        },
    };

    return (
        <div id="how-it-works" className={styles.tradeSetup}>
            <div className='container-xs'>
                <LineText text={t('home.tradeSetupLine', 'How It Works')} />
                
                <div className={styles.title}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {t('home.tradeSetupTitlePart1', 'Analyze Any Trade Setup In')}{' '}
                        <span className={styles.neonText}>
                            {t('home.tradeSetupTitlePart2', '3 Simple Steps')}
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        {t('home.tradeSetupSubtitle', 'Upload a chart and let AI uncover the setup behind the price action.')}
                    </motion.p>
                </div>

                <motion.div
                    className={styles.stepGrid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Step 1 */}
                    <motion.div
                        className={styles.stepCard}
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.stepBadge}>01</div>
                            <div className={styles.iconBox}><UploadIcon /></div>
                        </div>
                        <h3>{t('home.stepUploadTitle', 'Upload Screenshot')}</h3>
                        <p>{t('home.stepUploadDesc', 'Drop your chart image from any platform.')}</p>
                    </motion.div>

                    {/* Arrow 1 */}
                    <motion.div className={styles.connectorArrow} variants={arrowVariants}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                        className={styles.stepCard}
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.stepBadge}>02</div>
                            <div className={styles.iconBox}><ProcessAiIcon /></div>
                        </div>
                        <h3>{t('home.stepProcessTitle', 'AI Process the chart')}</h3>
                        <p>{t('home.stepProcessDesc', 'AI Trade scans price action structure and momentum.')}</p>
                    </motion.div>

                    {/* Arrow 2 */}
                    <motion.div className={styles.connectorArrow} variants={arrowVariants}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div
                        className={styles.stepCard}
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.stepBadge}>03</div>
                            <div className={styles.iconBox}><InsightsIcon /></div>
                        </div>
                        <h3>{t('home.stepInsightsTitle', 'Receive Smart Insights')}</h3>
                        <p>{t('home.stepInsightsDesc', 'Get a complete AI generated trading setup instantly.')}</p>
                    </motion.div>
                </motion.div>

                {/* Showcase Banner Box */}
                <div className={styles.showcaseBanner}>
                    <div className={styles.bannerGrid}>
                        <div className={styles.bannerContent}>
                            <LineText text={t('nav.aiTrade', 'AI Trade Assistance')} start />
                            <h3>
                                {t('home.turnScreenshotTitlePart1', 'Turn Screenshot Into')}{' '}
                                <span className={styles.neonText}>
                                    {t('home.turnScreenshotTitlePart2', 'Trading Opportunities')}
                                </span>
                            </h3>
                            <p>
                                {t('home.turnScreenshotDesc', 'Upload a chart and let AI uncover the setup behind the price action.')}
                            </p>

                            {/* Feature Checklist */}
                            <div className={styles.featureList}>
                                <div className={styles.featureItem}>
                                    <div className={styles.checkIcon}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span>{t('home.featureCheck1', 'Instant Support, Resistance & Pattern Detection')}</span>
                                </div>
                                <div className={styles.featureItem}>
                                    <div className={styles.checkIcon}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span>{t('home.featureCheck2', 'Smart Entry, Stop-Loss & Take-Profit Targets')}</span>
                                </div>
                                <div className={styles.featureItem}>
                                    <div className={styles.checkIcon}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span>{t('home.featureCheck3', 'Multi-Timeframe Risk/Reward Scoring')}</span>
                                </div>
                            </div>

                            {/* Stat Chips */}
                            <div className={styles.statChips}>
                                <div className={styles.chip}>
                                    <span className={styles.chipVal}>&lt; 3s</span>
                                    <span className={styles.chipLbl}>{t('home.statSpeed', 'AI Speed')}</span>
                                </div>
                                <div className={styles.chipDivider}></div>
                                <div className={styles.chip}>
                                    <span className={styles.chipVal}>98.4%</span>
                                    <span className={styles.chipLbl}>{t('home.statPrecision', 'Accuracy')}</span>
                                </div>
                                <div className={styles.chipDivider}></div>
                                <div className={styles.chip}>
                                    <span className={styles.chipVal}>All Markets</span>
                                    <span className={styles.chipLbl}>{t('home.statAssets', 'Forex, Crypto, Stocks')}</span>
                                </div>
                            </div>

                            <div className={styles.ctaWrapper}>
                                <Button 
                                    icon={ArrowRight} 
                                    text={t('home.tryAiTradeNow', 'Try AI Trade Assistance Now')} 
                                    onClick={() => authNavigate(router, '/trade-snap')} 
                                />
                            </div>
                        </div>

                        <div className={styles.bannerVisual}>
                            <div className={styles.glassWindow}>
                                <div className={styles.windowBar}>
                                    <div className={styles.dots}>
                                        <span className={styles.red}></span>
                                        <span className={styles.yellow}></span>
                                        <span className={styles.green}></span>
                                    </div>
                                    <span className={styles.windowTitle}>AI Trade Assistance Preview</span>
                                </div>
                                <div className={styles.imageWrapper}>
                                    <img src={SnapImage} alt="AI Trade Assistance Chart Analysis Showcase" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
