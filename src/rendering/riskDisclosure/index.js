'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './riskDisclosure.module.scss';

export default function RiskDisclosure() {
    const { t } = useLanguage();

    return (
        <div className={styles.riskDisclosure}>
            <div className='container-xs'>
                <div className={styles.header}>
                    <h1>{t('riskDisclosure.title', 'Risk Disclosure Statement')}</h1>
                    <p>{t('riskDisclosure.lastUpdated', 'Last Updated: May 2026')}</p>
                </div>
                <div className={styles.content}>
                    <section>
                        <h2>{t('riskDisclosure.sec1Title', '1. High-Risk Investment Warning')}</h2>
                        <p>{t('riskDisclosure.sec1P1', 'Trading in financial instruments, including foreign exchange (Forex), commodities, indices, and derivatives, involves a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade or invest in financial markets, you should carefully consider your investment objectives, level of experience, risk appetite, and financial situation.')}</p>
                        <p>{t('riskDisclosure.sec1P2', 'There is a possibility that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with financial market trading and seek advice from an independent financial advisor if you have any doubts.')}</p>
                    </section>

                    <section>
                        <h2>{t('riskDisclosure.sec2Title', '2. Informational and Educational Purpose Only')}</h2>
                        <p>{t('riskDisclosure.sec2P1', 'TraderMaster is an artificial intelligence-driven research, market analysis, and educational platform. All content, market commentary, automated chart analysis, algorithmic indicators, strategy signals, chatbot responses, and tools provided by TraderMaster are strictly for educational and informational purposes only.')}</p>
                        <p>{t('riskDisclosure.sec2P2', 'Nothing on this platform constitutes, or is intended to constitute, financial advice, investment recommendations, endorsement, solicitation, or a recommendation to buy, sell, or hold any financial instrument or engage in any specific investment strategy.')}</p>
                    </section>

                    <section>
                        <h2>{t('riskDisclosure.sec3Title', '3. Artificial Intelligence and Algorithmic Limitations')}</h2>
                        <p>{t('riskDisclosure.sec3P1', 'TraderMaster employs machine learning models, statistical neural networks, and technical indicators to analyze market structures and detect chart patterns. While these algorithms are engineered for high precision, financial markets are influenced by unpredictable geopolitical events, market sentiment, macroeconomic shifts, and institutional order flows.')}</p>
                        <p>{t('riskDisclosure.sec3P2', 'AI-generated analysis may contain delays, calculation variances, or false signals. TraderMaster does not guarantee the accuracy, completeness, timeliness, or profitability of any signal, indicator, or automated insight generated on the platform.')}</p>
                    </section>

                    <section>
                        <h2>{t('riskDisclosure.sec4Title', '4. Leverage and Volatility Risks')}</h2>
                        <p>{t('riskDisclosure.sec4Content', 'Leveraged trading carries substantial risk. Minor price fluctuations in underlying currency pairs or digital assets can result in significant margin calls or total account liquidations. High volatility during macroeconomic announcements, central bank interest rate decisions, or unexpected global events can cause slippage, spread widening, and order execution delays outside the control of analytical software.')}</p>
                    </section>

                    <section>
                        <h2>{t('riskDisclosure.sec5Title', '5. Past Performance Disclaimer')}</h2>
                        <p>{t('riskDisclosure.sec5Content', 'Past performance, backtesting results, historical trade simulations, and hypothetical track records are not indicative of future results. No representation is being made that any account will or is likely to achieve profits or losses similar to those shown in historical demonstrations or strategy models.')}</p>
                    </section>

                    <section>
                        <h2>{t('riskDisclosure.sec6Title', '6. Third-Party Integrations and Broker Disclaimer')}</h2>
                        <p>{t('riskDisclosure.sec6Content', 'TraderMaster does not operate as a broker, custodian, fund manager, or exchange. TraderMaster does not hold customer funds, accept deposits, or execute financial transactions. Any connectivity with third-party brokers, MT5 bridges, or liquidity providers is facilitated solely at the user\'s discretion. Users are responsible for evaluating the regulatory compliance, solvency, and security of any broker they select.')}</p>
                    </section>

                    <section>
                        <h2>{t('riskDisclosure.sec7Title', '7. User Responsibility and Risk Management')}</h2>
                        <p>{t('riskDisclosure.sec7Content', 'You acknowledge that you are solely responsible for all trading decisions, position sizing, stop-loss configurations, risk parameters, and financial outcomes. You agree that TraderMaster, its developers, founders, affiliates, and partners shall not be held liable for any direct, indirect, incidental, or consequential trading losses or damages resulting from the use of the platform.')}</p>
                    </section>

                    <section>
                        <h2>{t('riskDisclosure.sec8Title', '8. Contact for Inquiries')}</h2>
                        <p>{t('riskDisclosure.sec8P1', 'If you have any questions regarding this Risk Disclosure Statement, please reach out to our legal and compliance desk at:')}</p>
                        <p><strong>{(t('riskDisclosure.sec8Email', 'Email:') || 'Email:').replace(/support@TraderMaster\.com/gi, '').trim() || 'Email:'}</strong> <a href="mailto:support@thetradermaster.com">support@thetradermaster.com</a></p>
                    </section>
                </div>
            </div>
        </div>
    );
}
