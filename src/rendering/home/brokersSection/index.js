"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { fetchBrokers, brokerList } from '@/lib/brokersData';
import SectionHeader from '@/components/sectionHeader';
import BrokerCard from '@/components/brokerCard';
import { BrokerCardSkeleton } from '@/components/brokerSkeleton';
import styles from './brokersSection.module.scss';

export default function BrokersSection() {
    const { t } = useLanguage();
    const [brokers, setBrokers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function load() {
            try {
                const data = await fetchBrokers();
                if (isMounted) {
                    const fallbackList = brokerList.filter((b) => b && b.is_active !== false);
                    const source = (data && data.length > 0) ? data : fallbackList;
                    setBrokers(source.filter((b) => b && b.is_active !== false));
                }
            } catch (err) {
                if (isMounted) {
                    setBrokers(brokerList.filter((b) => b && b.is_active !== false));
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, []);

    const displayedBrokers = brokers.slice(0, 3);

    return (
        <section id="ecosystem" className={styles.brokersSection} aria-label="Supported Broker Ecosystem">
            <div className={styles.ambientGlow} aria-hidden="true" />
            
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <SectionHeader
                        align="center"
                        badge={t('homeSections.brokers.badge', 'BROKER ECOSYSTEM')}
                        title1={t('homeSections.brokers.title1', 'Trade Seamlessly With')}
                        title2={t('homeSections.brokers.title2', 'Regulated Global Brokers.')}
                        description={t('homeSections.brokers.desc', 'Connect your existing brokerage accounts with zero-latency API bridging. Enjoy institutional liquidity, raw spreads from 0.0 pips, and segregated fund security.')}
                    />
                </motion.div>

                {/* Brokers Grid */}
                <div className={styles.brokersGrid}>
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <BrokerCardSkeleton key={idx} showHighlights={true} showDescription={true} />
                        ))
                    ) : (
                        displayedBrokers.map((broker, idx) => (
                            <motion.div
                                key={broker.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <BrokerCard
                                    broker={broker}
                                    detailHref={`/supported-brokers/${broker.id}`}
                                    showHighlights={true}
                                    showDescription={true}
                                    isPublic={true}
                                />
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Footer Action */}
                <motion.div 
                    className={styles.footerActionRow}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link href="/supported-brokers" className={styles.viewAllBtn}>
                        <span>{t('homeSections.brokers.viewAll', 'Explore All Supported Brokers')}</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
