'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './termsAndConditions.module.scss';

export default function TermsAndConditions() {
    const { t } = useLanguage();

    return (
        <div className={styles.termsAndConditions}>
            <div className='container-xs'>
                <div className={styles.header}>
                    <h1>{t('termsAndConditions.title', 'Terms and Conditions')}</h1>
                    <p>{t('termsAndConditions.lastUpdated', 'Last Updated: May 2026')}</p>
                </div>
                <div className={styles.content}>
                    <section>
                        <h2>{t('termsAndConditions.sec1Title', 'Acceptance of Terms')}</h2>
                        <p>{t('termsAndConditions.sec1Content', 'These Terms and Conditions constitute a legally binding agreement between you and The Trader Master ("TraderMaster", registered in Dubai Silicon Oasis, IFZA Business Park, Building A1, Dubai, UAE, Reg No: FZ-LLC-2024-CX8901) governing your access to and use of our website, applications, AI-powered services, trading tools, educational resources, market analysis features, economic calendar services, and related products. By accessing or using TraderMaster, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec2Title', 'Description of Services')}</h2>
                        <p>{t('termsAndConditions.sec2P1', 'TraderMaster provides AI-powered trading analysis, educational resources, economic calendar information, market commentary, currency pair insights, chart analysis tools, trading-related content, and other informational services designed to help users better understand financial markets.')}</p>
                        <p>{t('termsAndConditions.sec2P2', 'All services provided through TraderMaster are intended solely for informational and educational purposes and should not be interpreted as personalized financial, investment, legal, tax, or professional advice.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec3Title', 'No Financial Advice')}</h2>
                        <p>{t('termsAndConditions.sec3P1', 'TraderMaster does not provide investment advice, financial advice, portfolio management services, brokerage services, tax advice, legal advice, or recommendations regarding the purchase, sale, or holding of financial instruments. All content, market analysis, AI-generated responses, educational materials, charts, forecasts, and insights are provided solely for informational and educational purposes.')}</p>
                        <p>{t('termsAndConditions.sec3P2', 'Users are solely responsible for evaluating information, conducting independent research, and making their own financial decisions.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec4Title', 'Risk Disclosure')}</h2>
                        <p>{t('termsAndConditions.sec4P1', 'Trading and investing in financial markets, including foreign exchange, stocks, commodities, futures, options, and other financial instruments, involves substantial risk and may result in the loss of some or all invested capital.')}</p>
                        <p>{t('termsAndConditions.sec4P2', 'Past performance does not guarantee future results. Market conditions can change rapidly and unpredictably. Users acknowledge that all trading and investment decisions are made entirely at their own discretion and risk.')}</p>
                        <p>{t('termsAndConditions.sec4P3', 'TraderMaster shall not be responsible for any losses, damages, costs, expenses, or liabilities arising from trading activities, investment decisions, or reliance on information provided through the platform.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec5Title', 'AI-Generated Content Disclaimer')}</h2>
                        <p>{t('termsAndConditions.sec5P1', 'TraderMaster utilizes artificial intelligence technologies to generate market analysis, trading insights, educational content, and chatbot responses. AI-generated content may occasionally contain inaccuracies, incomplete information, outdated data, technical errors, or incorrect interpretations of market conditions.')}</p>
                        <p>{t('termsAndConditions.sec5P2', 'Users acknowledge that AI-generated content should not be relied upon as the sole basis for any financial, trading, or investment decision and should always be independently verified before use.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec6Title', 'User Accounts')}</h2>
                        <p>{t('termsAndConditions.sec6P1', 'Users may be required to create an account to access certain features of the platform. Users are responsible for maintaining the confidentiality of account credentials and for all activities conducted under their accounts.')}</p>
                        <p>{t('termsAndConditions.sec6P2', 'Users agree to provide accurate, complete, and current information during registration and to promptly update such information when necessary.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec7Title', 'Acceptable Use')}</h2>
                        <p>{t('termsAndConditions.sec7P1', 'Users agree to use TraderMaster only for lawful purposes and in compliance with all applicable laws and regulations. Users shall not engage in activities that interfere with platform functionality, compromise security, violate intellectual property rights, or adversely affect other users.')}</p>
                        <p>{t('termsAndConditions.sec7P2', 'Users may not attempt to reverse engineer, copy, scrape, distribute, reproduce, modify, exploit, or create derivative works based on any part of the platform without prior written authorization.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec8Title', 'Intellectual Property Rights')}</h2>
                        <p>{t('termsAndConditions.sec8P1', 'All content, software, source code, trademarks, logos, graphics, designs, databases, algorithms, AI systems, text, images, reports, analyses, and other materials available through TraderMaster are owned by or licensed to TraderMaster and are protected by applicable intellectual property laws.')}</p>
                        <p>{t('termsAndConditions.sec8P2', 'No rights, ownership, or licenses are transferred to users except as expressly permitted under these Terms and Conditions.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec9Title', 'Third-Party Services and Content')}</h2>
                        <p>{t('termsAndConditions.sec9P1', 'TraderMaster may provide access to third-party services, data providers, market feeds, advertisements, external websites, integrations, or content for convenience and informational purposes. We do not control, endorse, or assume responsibility for third-party services or content.')}</p>
                        <p>{t('termsAndConditions.sec9P2', 'Users access third-party services entirely at their own risk and subject to the terms and policies of the respective providers.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec10Title', 'Limitation of Liability')}</h2>
                        <p>{t('termsAndConditions.sec10P1', 'To the fullest extent permitted by applicable law, TraderMaster, its affiliates, directors, employees, contractors, licensors, partners, and service providers shall not be liable for any indirect, incidental, consequential, special, exemplary, or punitive damages arising from or relating to the use of the platform.')}</p>
                        <p>{t('termsAndConditions.sec10P2', 'This limitation includes, without limitation, losses resulting from trading decisions, investment outcomes, lost profits, lost opportunities, market fluctuations, service interruptions, inaccurate information, AI-generated content, technical failures, data loss, security incidents, or reliance on platform materials.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec11Title', 'Maximum Liability')}</h2>
                        <p>{t('termsAndConditions.sec11Content', 'To the maximum extent permitted by law, the total liability of TraderMaster for any claim arising out of or relating to the use of the platform shall not exceed the amount paid by the user, if any, for services during the twelve (12) months immediately preceding the event giving rise to the claim.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec12Title', 'Indemnification')}</h2>
                        <p>{t('termsAndConditions.sec12Content', 'Users agree to defend, indemnify, and hold harmless TraderMaster and its affiliates, officers, employees, contractors, licensors, and partners from and against any claims, liabilities, damages, losses, costs, expenses, and legal fees arising from their use of the platform, violation of these Terms and Conditions, infringement of intellectual property rights, or violation of applicable laws.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec13Title', 'Suspension and Termination')}</h2>
                        <p>{t('termsAndConditions.sec13Content', 'TraderMaster reserves the right to suspend, restrict, or terminate user accounts or access to services at any time, with or without notice, if a user violates these Terms and Conditions, engages in unlawful conduct, compromises platform security, or otherwise acts in a manner that may harm TraderMaster or its users.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec14Title', 'Modifications to Services and Terms')}</h2>
                        <p>{t('termsAndConditions.sec14Content', 'TraderMaster reserves the right to modify, suspend, discontinue, or update any aspect of the platform, services, content, pricing, features, or these Terms and Conditions at any time. Continued use of the platform following such changes constitutes acceptance of the updated Terms and Conditions.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec15Title', 'Governing Law')}</h2>
                        <p>{t('termsAndConditions.sec15Content', 'These Terms and Conditions shall be governed by and interpreted in accordance with the applicable laws of the jurisdiction in which TraderMaster operates, without regard to conflict of law principles.')}</p>
                    </section>

                    <section>
                        <h2>{t('termsAndConditions.sec16Title', 'Contact Information & Registered Office')}</h2>
                        <p>{t('termsAndConditions.sec16P1', 'For legal inquiries, questions regarding these Terms and Conditions, or requests related to the platform, please contact:')}</p>
                        <p><strong>{t('termsAndConditions.sec16LegalEntity', 'The Trader Master')}</strong></p>
                        <p>{t('termsAndConditions.sec16RegNo', 'Reg No: FZ-LLC-2024-CX8901')}</p>
                        <p>{t('termsAndConditions.sec16Address', 'Dubai Silicon Oasis, IFZA Business Park, Building A1, Dubai, UAE')}</p>
                        <p><strong>{(t('termsAndConditions.sec16Email', 'Email:') || 'Email:').replace(/support@TraderMaster\.com/gi, '').trim() || 'Email:'}</strong> <a href="mailto:support@thetradermaster.com">support@thetradermaster.com</a></p>
                        <p>{t('termsAndConditions.sec16SupportDesk', 'Global Support Desk: Available 24/5 (Sun 22:00 GMT – Fri 22:00 GMT)')}</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
