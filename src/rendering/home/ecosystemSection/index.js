'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import styles from './ecosystemSection.module.scss';
import LineText from '@/components/lineText';
import BrokerCard from '@/components/brokerCard';
import { BrokerCardSkeleton } from '@/components/brokerSkeleton';
import { fetchBrokers, brokerList } from '@/lib/brokersData';
import { useLanguage } from '@/context/LanguageContext';

function AnimatedNumber({ value, prefix = '', suffix = '', duration = 2.5 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (inView) {
            const controls = animate(0, value, {
                duration: duration,
                ease: [0.16, 1, 0.3, 1],
                onUpdate(val) {
                    setDisplayValue(Math.floor(val));
                }
            });
            return controls.stop;
        }
    }, [inView, value, duration]);

    return (
        <span ref={ref}>
            {prefix}{displayValue}{suffix}
        </span>
    );
}

export default function EcosystemSection() {
    const { t } = useLanguage();
    const [brokers, setBrokers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function loadBrokers() {
            try {
                const data = await fetchBrokers();
                if (isMounted) {
                    let displayList = data && data.length > 0 ? [...data] : [...brokerList];
                    displayList = displayList.filter(b => b.id !== 'newera' && !b.name?.toLowerCase().includes('newera'));
                    setBrokers(displayList);
                }
            } catch (_) {
                if (isMounted) setBrokers(brokerList.filter(b => b.id !== 'newera' && !b.name?.toLowerCase().includes('newera')));
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadBrokers();
        return () => { isMounted = false; };
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
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

    return (
        <section className={styles.ecosystemSection} id="ecosystem">
            <div className="container-xs">
                <LineText text={t('home.ecosystemLine', 'Ecosystem & Partners')} />
                <div className={styles.title}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {t('home.ecosystemTitlePrefix', 'Powered by')} <span>{t('home.ecosystemTitleHighlight', 'Industry-Leading')}</span> {t('home.ecosystemTitleSuffix', 'Brokers & Platforms')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {t('home.ecosystemSubtitle', "Seamlessly trade with top-tier regulated brokers, quant execution engines, and prop firms directly connected to Trader Master's AI suite.")}
                    </motion.p>
                </div>

                {isLoading ? (
                    <div className={styles.grid}>
                        <BrokerCardSkeleton />
                        <BrokerCardSkeleton />
                        <BrokerCardSkeleton />
                    </div>
                ) : (
                    <motion.div
                        className={styles.grid}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {brokers.map((broker) => (
                            <motion.div
                                key={broker.id}
                                variants={cardVariants}
                            >
                                <BrokerCard
                                    broker={broker}
                                    detailHref={`/brokers/${broker.id}`}
                                    isDarkTheme={true}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Ecosystem Stats Footer Strip */}
                <motion.div 
                    className={styles.ecosystemStats}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>
                            <AnimatedNumber value={1} />
                        </span>
                        <span className={styles.statLabel}>{t('home.ecoStat1', 'Regulated Partners')}</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>
                            <AnimatedNumber value={100} prefix="< " suffix="ms" duration={2} />
                        </span>
                        <span className={styles.statLabel}>{t('home.ecoStat2', 'Execution Latency')}</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>MT4 / MT5</span>
                        <span className={styles.statLabel}>{t('home.ecoStat3', 'Native AI Bridge')}</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>
                            <AnimatedNumber value={50} prefix="$" suffix="M+" duration={3} />
                        </span>
                        <span className={styles.statLabel}>{t('home.ecoStat4', 'Monthly Volume')}</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

