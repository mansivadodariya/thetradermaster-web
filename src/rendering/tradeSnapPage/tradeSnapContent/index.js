"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './tradeSnapContent.module.scss';
import LineText from '@/components/lineText';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';

const UploadIcon = '/assets/icons/upload-xs.svg';

const StructureIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

const KeyLevelsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
        <circle cx="8" cy="6" r="2" fill="currentColor"></circle>
        <circle cx="16" cy="12" r="2" fill="currentColor"></circle>
        <circle cx="12" cy="18" r="2" fill="currentColor"></circle>
    </svg>
);

const MomentumIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const SetupIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const RiskRewardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18"></path>
        <path d="M3 7.5L12 3l9 4.5"></path>
        <path d="M3 16.5L12 21l9-4.5"></path>
    </svg>
);

const ConfluenceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);

const FrictionIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const PerspectiveIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const ExecutionIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

const ConsistencyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6"></path>
        <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
    </svg>
);

const LearningIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

const ConfidenceIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M9 12l2 2 4-4"></path>
    </svg>
);

export default function TradeSnapContent() {
    const router = useRouter();
    const { t } = useLanguage();

    const handleStartAnalysis = () => {
        authNavigate(router, '/trade-snap');
    };

    const whatWeAnalyze = [
        {
            title: t('tradeSnap.what1Title', 'Market Structure'),
            description: t('tradeSnap.what1Desc', 'Understand how price is moving across the chart and identify the structure behind the current setup.'),
            icon: <StructureIcon />
        },
        {
            title: t('tradeSnap.what2Title', 'Key Levels'),
            description: t('tradeSnap.what2Desc', 'Identify important price areas visible on your chart that may influence the setup.'),
            icon: <KeyLevelsIcon />
        },
        {
            title: t('tradeSnap.what3Title', 'Price Action & Momentum'),
            description: t('tradeSnap.what3Desc', 'TradeSnap examines the movement and behavior of price to help you understand the current market context.'),
            icon: <MomentumIcon />
        },
        {
            title: t('tradeSnap.what4Title', 'Trade Setup'),
            description: t('tradeSnap.what4Desc', 'Turn your chart into a structured setup analysis instead of manually piecing together multiple indicators and observations.'),
            icon: <SetupIcon />
        },
        {
            title: t('tradeSnap.what5Title', 'Risk & Reward'),
            description: t('tradeSnap.what5Desc', 'Review the potential risk/reward relationship of the setup and understand how the trade can be evaluated before execution.'),
            icon: <RiskRewardIcon />
        },
        {
            title: t('tradeSnap.what6Title', 'Indicator & Trend Confluence'),
            description: t('tradeSnap.what6Desc', 'Evaluate how technical indicators, chart patterns, and price trends align together to validate your setup.'),
            icon: <ConfluenceIcon />
        }
    ];

    const structuredQuestions = [
        t('tradeSnap.q1', 'What is happening in the market?'),
        t('tradeSnap.q2', 'Where are the important levels?'),
        t('tradeSnap.q3', 'What does the current structure suggest?'),
        t('tradeSnap.q4', 'Does the chart show a potential setup worth investigating?'),
        t('tradeSnap.q5', 'What does the risk/reward picture look like?')
    ];

    const whyTradersUse = [
        {
            title: t('tradeSnap.why1Title', 'Reduce Analysis Friction'),
            description: t('tradeSnap.why1Desc', 'Spend less time manually reviewing every visible component of a chart.'),
            icon: <FrictionIcon />
        },
        {
            title: t('tradeSnap.why2Title', 'Get a Second Perspective'),
            description: t('tradeSnap.why2Desc', 'Use AI analysis as another perspective when reviewing a potential setup.'),
            icon: <PerspectiveIcon />
        },
        {
            title: t('tradeSnap.why3Title', 'Analyze Before You Execute'),
            description: t('tradeSnap.why3Desc', 'Review the structure and risk/reward characteristics of a setup before making a trading decision.'),
            icon: <ExecutionIcon />
        },
        {
            title: t('tradeSnap.why4Title', 'Build a More Consistent Process'),
            description: t('tradeSnap.why4Desc', 'Use the same structured analysis workflow across different chart setups.'),
            icon: <ConsistencyIcon />
        },
        {
            title: t('tradeSnap.why5Title', 'Learn From Your Charts'),
            description: t('tradeSnap.why5Desc', 'Seeing a structured breakdown of price action can also help you better understand how different elements of a trade setup come together.'),
            icon: <LearningIcon />
        },
        {
            title: t('tradeSnap.why6Title', 'Objective & Unbiased Confidence'),
            description: t('tradeSnap.why6Desc', 'Eliminate emotional bias with clear, data-driven technical validation before entering any trade.'),
            icon: <ConfidenceIcon />
        }
    ];

    const guideSteps = [
        {
            stepNum: '01',
            title: t('tradeSnap.step1Title', 'Upload Your Chart'),
            description: t('tradeSnap.step1Desc', 'Capture your chart from your preferred trading or charting platform and upload the screenshot.')
        },
        {
            stepNum: '02',
            title: t('tradeSnap.step2Title', 'Let AI Read the Setup'),
            description: t('tradeSnap.step2Desc', 'TradeSnap processes the visible chart and examines price action, structure, momentum, and important levels.')
        },
        {
            stepNum: '03',
            title: t('tradeSnap.step3Title', 'Review the Analysis'),
            description: t('tradeSnap.step3Desc', 'Receive structured AI-generated insights that help you understand the setup and evaluate the trade from a clearer perspective.')
        },
        {
            stepNum: '04',
            title: t('tradeSnap.step4Title', 'Make Your Own Decision'),
            description: t('tradeSnap.step4Desc', 'Use the analysis as a decision-support tool alongside your own trading plan, risk management, and market knowledge.')
        }
    ];

    return (
        <div className={styles.tradeSnapContent} id="how-it-works">
            <div className="container-xs">
                <div className={styles.container}>
                    
                    {/* Section 1: Overview */}
                    <div className={styles.overviewSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.badgeCenter}>
                                <LineText text={t('tradeSnap.badgeOverview', 'Understand Price Action')} />
                            </div>
                            <h2>
                                {t('tradeSnap.overviewTitlePart1', 'See More in Every Chart With')}{' '}
                                <span className={styles.highlightText}>
                                    {t('tradeSnap.overviewTitlePart2', 'AI Chart Scanner')}
                                </span>
                            </h2>
                            <p>
                                {t('tradeSnap.overviewSubtitle', 'A chart can show you what happened. TradeSnap helps you understand what the price action may be showing.')}
                            </p>
                        </div>

                        <motion.div 
                            className={styles.overviewCard}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className={styles.overviewGrid}>
                                <div className={styles.overviewText}>
                                    <p>
                                        {t('tradeSnap.overviewPara1', 'Simply upload a screenshot of your trading chart and let Trader Master analyze the setup. TradeSnap examines the visible price action, market structure, momentum, and key levels to turn a chart image into a structured trading analysis.')}
                                    </p>
                                    <p>
                                        {t('tradeSnap.overviewPara2', 'Whether you are reviewing a potential entry or checking a setup before placing a trade, TradeSnap gives you a clearer view of the chart so you can make decisions based on analysis instead of guesswork.')}
                                    </p>
                                </div>
                                <div className={styles.overviewFeatureBox}>
                                    <div className={styles.featureHeader}>
                                        <div className={styles.iconCircle}>
                                            <SetupIcon />
                                        </div>
                                        <h3>{t('tradeSnap.featureBoxTitle', 'Structured Chart Analytics')}</h3>
                                    </div>
                                    <p>
                                        {t('tradeSnap.featureBoxDesc', 'Transforms unstructured chart visuals into structured technical breakdowns including R:R ratio, trend structure, key support/resistance zones, and graded setup quality.')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Section 2: What Does TradeSnap Analyze? */}
                    <div className={styles.sectionHeader}>
                        <div className={styles.badgeCenter}>
                            <LineText text={t('tradeSnap.badgeAnalyze', 'Comprehensive Analysis')} />
                        </div>
                        <h2>
                            {t('tradeSnap.analyzeTitlePart1', 'What Does TradeSnap')}{' '}
                            <span className={styles.highlightText}>
                                {t('tradeSnap.analyzeTitlePart2', 'Analyze?')}
                            </span>
                        </h2>
                    </div>

                    <div className={styles.cardsGrid}>
                        {whatWeAnalyze.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                className={styles.cyberCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <div className={styles.cardIconCircle}>
                                    {item.icon}
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Section 3: Structured Trade Analysis */}
                    <div className={styles.questionsSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.badgeCenter}>
                                <LineText text={t('tradeSnap.badgeStructured', 'Intelligent Insights')} />
                            </div>
                            <h2>
                                {t('tradeSnap.structuredTitlePart1', 'Turn a Chart Screenshot Into a')}{' '}
                                <span className={styles.highlightText}>
                                    {t('tradeSnap.structuredTitlePart2', 'Structured Trade Analysis')}
                                </span>
                            </h2>
                            <p>
                                {t('tradeSnap.structuredSubtitle', 'Instead of staring at a chart and trying to connect every signal yourself, TradeSnap organizes the analysis into a clearer format. Upload your chart and get AI-generated insights designed to help you answer important trading questions:')}
                            </p>
                        </div>

                        <div className={styles.questionsWrapper}>
                            <div className={styles.questionsList}>
                                {structuredQuestions.map((q, idx) => (
                                    <motion.div 
                                        key={idx}
                                        className={styles.questionPill}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                                    >
                                        <div className={styles.qNumber}>?</div>
                                        <span>{q}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <div className={styles.conclusionNote}>
                                {t('tradeSnap.questionsConclusion', 'TradeSnap brings these observations together so you can review the setup from a more structured perspective.')}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Built for the Way You Already Trade */}
                    <div className={styles.workflowSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.badgeCenter}>
                                <LineText text={t('tradeSnap.badgeWorkflow', 'Zero Workflow Disruption')} />
                            </div>
                            <h2>
                                {t('tradeSnap.workflowTitlePart1', 'Built for the Way You')}{' '}
                                <span className={styles.highlightText}>
                                    {t('tradeSnap.workflowTitlePart2', 'Already Trade')}
                                </span>
                            </h2>
                        </div>

                        <div className={styles.workflowCard}>
                            <p className={styles.workflowText}>
                                {t('tradeSnap.workflowDesc', 'You do not need to rebuild your trading workflow. Take a screenshot from your existing charting platform, upload it to TradeSnap, and let AI analyze the image. The current Trader Master workflow is designed around screenshot-based chart analysis, making it easy to use alongside the tools you already trade with.')}
                            </p>

                            <div className={styles.workflowSteps}>
                                <div className={styles.stepItem}>
                                    <div className={styles.stepTag}>STEP 01</div>
                                    <div className={styles.stepLabel}>{t('tradeSnap.wf1', 'Capture')}</div>
                                </div>
                                <div className={styles.stepItem}>
                                    <div className={styles.stepTag}>STEP 02</div>
                                    <div className={styles.stepLabel}>{t('tradeSnap.wf2', 'Upload')}</div>
                                </div>
                                <div className={styles.stepItem}>
                                    <div className={styles.stepTag}>STEP 03</div>
                                    <div className={styles.stepLabel}>{t('tradeSnap.wf3', 'Analyze')}</div>
                                </div>
                                <div className={styles.stepItem}>
                                    <div className={styles.stepTag}>STEP 04</div>
                                    <div className={styles.stepLabel}>{t('tradeSnap.wf4', 'Review')}</div>
                                </div>
                            </div>

                            <div className={styles.workflowFooter}>
                                {t('tradeSnap.workflowFooterText', 'No complicated setup. No need to manually describe every detail of the chart.')}
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Why Traders Use TradeSnap */}
                    <div className={styles.sectionHeader}>
                        <div className={styles.badgeCenter}>
                            <LineText text={t('tradeSnap.badgeWhy', 'Proven Advantages')} />
                        </div>
                        <h2>
                            {t('tradeSnap.whyTitlePart1', 'Why Traders Use')}{' '}
                            <span className={styles.highlightText}>
                                {t('tradeSnap.whyTitlePart2', 'TradeSnap')}
                            </span>
                        </h2>
                    </div>

                    <div className={styles.cardsGrid}>
                        {whyTradersUse.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                className={styles.cyberCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <div className={styles.cardIconCircle}>
                                    {item.icon}
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Section 6: From Screenshot to Insight in Seconds */}
                    <div className={styles.guideSection}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.badgeCenter}>
                                <LineText text={t('tradeSnap.badgeGuide', 'Simple 4-Step Process')} />
                            </div>
                            <h2>
                                {t('tradeSnap.guideTitlePart1', 'From Screenshot to Insight in')}{' '}
                                <span className={styles.highlightText}>
                                    {t('tradeSnap.guideTitlePart2', 'Seconds')}
                                </span>
                            </h2>
                            <p>
                                {t('tradeSnap.guideSubtitle', 'TradeSnap turns your chart image into an AI-powered analysis workflow:')}
                            </p>
                        </div>

                        <div className={styles.guideGrid}>
                            {guideSteps.map((step, idx) => (
                                <motion.div 
                                    key={idx}
                                    className={styles.guideCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <div className={styles.cardHeader}>
                                        <span className={styles.stepBadge}>STEP {step.stepNum}</span>
                                    </div>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Section 7: One Screenshot Quote Callout */}
                    <motion.div 
                        className={styles.highlightBox}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3>{t('tradeSnap.quoteTitle', 'One Screenshot. A Deeper Look at Your Trade.')}</h3>
                        <p>
                            {t('tradeSnap.quotePara', 'Trading decisions can become complicated when you are trying to evaluate multiple elements at once. TradeSnap simplifies the first step. Upload the chart. Let AI break down what it sees. Then review the setup with a more structured perspective.')}
                        </p>
                        <div className={styles.neonTagline}>
                            {t('tradeSnap.neonTagline', 'Your chart stays the same. Your way of understanding it gets smarter.')}
                        </div>
                    </motion.div>

                    {/* Section 8: Final Call to Action CTA */}
                    <div className={styles.ctaSection}>
                        <motion.div 
                            className={styles.ctaCard}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h3>{t('tradeSnap.ctaTitle', 'TradeSnap Is Your AI-Powered Chart Analysis Assistant')}</h3>
                            <p>
                                {t('tradeSnap.ctaDesc', 'From identifying market structure to reviewing key levels and risk/reward, TradeSnap helps turn a simple chart screenshot into actionable analysis. It is not a replacement for your trading plan. It is a tool designed to help you analyze the market more efficiently and approach each setup with a clearer process.')}
                            </p>

                            <div className={styles.ctaBox}>
                                <h4>{t('tradeSnap.ctaBoxTitle', 'Try TradeSnap')}</h4>
                                <span>{t('tradeSnap.ctaBoxSubtitle', 'Upload your first chart and see what Trader Master finds.')}</span>
                                <div className={styles.analyzeBtn}>
                                    <Button text={t('tradeSnap.analyzeBtn', 'Analyze Chart')} icon={UploadIcon} onClick={handleStartAnalysis} />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
