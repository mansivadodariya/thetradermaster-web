'use client'
import React from 'react'
import Link from 'next/link'
import styles from './aboutUs.module.scss'
import { useLanguage } from '@/context/LanguageContext'

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export default function AboutUs() {
    const { t } = useLanguage()

    const features = [
        {
            title: t('about.feature1Title', 'Ai Chart Scanner '),
            description: t('about.feature1Desc', 'Upload any chart screenshot and receive instant AI-powered technical analysis, pattern detection, and actionable trade setups — all within seconds.')
        },
        {
            title: t('about.feature2Title', 'AI Trade Assistant'),
            description: t('about.feature2Desc', 'Your personal market assistant. Ask questions about Forex pairs, market conditions, technical indicators, and trading concepts — get intelligent, context-aware responses.')
        },
        {
            title: t('about.feature3Title', 'AI Strategy'),
            description: t('about.feature3Desc', 'Generate, backtest, and refine algorithmic trading strategies powered by neural pattern recognition and multi-timeframe analysis engines.')
        },
        {
            title: t('about.featurePastTradeTitle', 'AI Past Trade Analyzer'),
            description: t('about.featurePastTradeDesc', 'Upload completed trade screenshots or logs to receive detailed AI feedback on execution quality, entry/exit precision, risk management, and potential psychological mistakes.')
        },
        {
            title: t('about.feature4Title', 'Economic Calendar'),
            description: t('about.feature4Desc', 'Stay ahead of high-impact market events with a real-time economic calendar that highlights key data releases, central bank decisions, and geopolitical events.')
        },
        {
            title: t('about.feature5Title', 'Broker Integration'),
            description: t('about.feature5Desc', 'Seamlessly connect with recommended brokers including Newera for a complete trading workflow — from analysis to execution.')
        }
    ]

    return (
        <div className={styles.aboutUs}>
            <div className='container-xs'>
                {/* Hero Section */}
                <div className={styles.header}>
                    <span className={styles.badge}>{t('about.badge', 'About Us')}</span>
                    <h1>{t('about.title', 'About Trader Master')}</h1>
                    <p className={styles.subtitle}>
                        {t('about.subtitle', 'AI-powered Forex intelligence for serious traders. Chart reading, trade analysis, and strategy generation — built around MT5 and the Newera brokerage stack.')}
                    </p>
                </div>

                {/* Who We Are */}
                <div className={styles.content}>
                    <section>
                        <h2>{t('about.whoWeAre', 'Who We Are')}</h2>
                        <p>{t('about.whoWeArePara1', 'Trader Master is an artificial intelligence technology and market research platform purpose-built for Forex and commodity traders. We combine cutting-edge AI models with institutional-grade market data to deliver real-time chart analysis, technical scoring, pattern recognition, and strategy generation.')}</p>
                        <p>{t('about.whoWeArePara2', 'Our platform is designed for traders who demand precision, speed, and depth in their market analysis — from beginners learning the fundamentals to experienced professionals seeking an analytical edge.')}</p>
                    </section>

                    {/* What We Offer */}
                    <section>
                        <h2>{t('about.whatWeOffer', 'What We Offer')}</h2>
                        <div className={styles.featureGrid}>
                            {features.map((feature, index) => (
                                <div key={index} className={styles.featureCard}>
                                    <div className={styles.featureIcon}>
                                        <CheckIcon />
                                    </div>
                                    <div className={styles.featureContent}>
                                        <h3>{feature.title}</h3>
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Our Mission */}
                    <section>
                        <h2>{t('about.ourMission', 'Our Mission')}</h2>
                        <p>{t('about.ourMissionPara', 'We believe that advanced trading intelligence should be accessible to every trader — not just institutions. Our mission is to democratize access to AI-driven market analysis, empowering individuals with the same caliber of tools and insights used by professional trading desks worldwide.')}</p>
                    </section>

                    {/* Technology */}
                    <section>
                        <h2>{t('about.ourTech', 'Our Technology')}</h2>
                        <p>{t('about.ourTechPara1', 'Trader Master\'s proprietary visual analytics architecture powers all interactive candlestick charts, multi-timeframe pattern recognition overlays, and technical indicator engines accessible on the platform.')}</p>
                        <p>{t('about.ourTechPara2', 'Market telemetry and price data across currencies, digital assets, and commodities are sourced from institutional data feeds for analytical screening. Our AI models are continuously trained and refined to deliver increasingly accurate pattern detection, sentiment analysis, and trade signal generation.')}</p>
                    </section>

                    {/* Partners */}
                    {/* <section>
                        <h2>{t('about.partners', 'Our Partners')}</h2>
                        <p>{t('about.partnersPara', 'We work closely with trusted partners in the trading ecosystem to provide a complete experience:')}</p>
                        <ul className={styles.partnerList}>
                            <li>
                                <strong>
                                    <a href="https://newera365.com/en" target="_blank" rel="noopener noreferrer">
                                        Newera
                                    </a>
                                </strong>
                                {' — '}{t('about.neweraPara', 'Our primary brokerage partner. Trader Master is built around the MT5 and Newera brokerage stack. All funds and trade execution are managed by Newera.')}
                            </li>
                            <li>
                                <strong>
                                    <a href="https://fundedmaster.com/" target="_blank" rel="noopener noreferrer">
                                        Funded Master
                                    </a>
                                </strong>
                                {' — '}{t('about.fundedMasterPara', 'A prop trading firm offering funded trading accounts for qualified traders.')}
                            </li>
                        </ul>
                    </section> */}

                    {/* Disclaimer */}
                    <section className={styles.disclaimerSection}>
                        <h2>{t('about.disclaimer', 'Important Notice')}</h2>
                        <p>{t('about.disclaimerPara', 'Trader Master operates exclusively as an artificial intelligence technology and market research platform. We are not a registered broker-dealer, financial custodian, exchange, or investment advisor. We do not hold client deposits, manage user capital, or execute orders on financial exchanges. All content provided on this platform is for informational and educational purposes only and should not be interpreted as financial advice.')}</p>
                        <p>
                            {t('about.disclaimerLegal', 'For full details, please review our ')}
                            <Link href="/privacy-policy">{t('about.privacyPolicy', 'Privacy Policy')}</Link>
                            {' '}{t('common.and', 'and')}{' '}
                            <Link href="/terms-and-conditions">{t('about.terms', 'Terms & Conditions')}</Link>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
