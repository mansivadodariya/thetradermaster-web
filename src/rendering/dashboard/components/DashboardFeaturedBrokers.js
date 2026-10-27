'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { fetchBrokers } from '@/lib/brokersData';
import BrokerCard from '@/components/brokerCard';
import { BrokerCardSkeleton } from '@/components/brokerSkeleton';
import styles from '../dashboard.module.scss';

export default function DashboardFeaturedBrokers() {
    const { t } = useLanguage();
    const [brokers, setBrokers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function load() {
            try {
                const data = await fetchBrokers();
                if (isMounted) {
                    setBrokers(Array.isArray(data) ? data.filter((b) => b && b.is_active !== false) : []);
                }
            } catch (err) {
                console.error('Failed to fetch brokers:', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        load();
        return () => { isMounted = false; };
    }, []);

    if (!isLoading && brokers.length === 0) {
        return null;
    }

    return (
        <div className={styles.featuredBrokersSection}>
            {/* Header: Quick Action style Icon Badge + Title + View All Link */}
            <div className={styles.featuredBrokersHeader}>
                <div className={styles.featuredBrokersHeaderLeft}>
                    <div className={styles.featuredBrokersIcon}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18M3 10h18M12 3l9 4.5H3L12 3z" />
                            <path d="M6 10v7M10 10v7M14 10v7M18 10v7" />
                        </svg>
                    </div>
                    <h3 className={styles.featuredBrokersTitle}>
                        {t('nav.broker', 'Associated Brokers')}
                    </h3>
                </div>

                <Link href="/brokers" className={styles.viewAllBrokersLink}>
                    <span>{t('dashboard.viewAllBrokers', 'View all brokers')}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </Link>
            </div>

            {/* Dynamic Brokers Grid using exact BrokerCard component */}
            <div className={styles.featuredBrokersGrid}>
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <BrokerCardSkeleton key={idx} showHighlights={false} showDescription={true} />
                    ))
                ) : (
                    brokers.slice(0, 4).map((b) => (
                        <BrokerCard
                            key={b.id}
                            broker={b}
                            detailHref={`/brokers/${b.id}`}
                            showHighlights={false}
                            showDescription={true}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
