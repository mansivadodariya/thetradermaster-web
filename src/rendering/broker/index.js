'use client';

import React from 'react';
import styles from './broker.module.scss';
import NeweraCreditsModal from '@/components/neweraCreditsModal';
import { getStoredUserId } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';
import { getBidiProps } from '@/lib/bidi';

export default function BrokerPage() {
    const { t } = useLanguage();
    const userId = getStoredUserId();

    return (
        <div className={styles.brokerPage}>
            {/* Hero Banner */}
            <div className={styles.heroBanner}>
                <div {...getBidiProps(t('broker.hubBadge', 'Broker & Platform Hub'), styles.badge)}>
                    {t('broker.hubBadge', 'Broker & Platform Hub')}
                </div>
                <h1 {...getBidiProps(t('broker.title', 'Integrated Brokerage & Trading Infrastructure'))}>
                    {t('broker.title', 'Integrated Brokerage & Trading Infrastructure')}
                </h1>
                <p {...getBidiProps(t('broker.subtitle', 'Connect your MT5 account, view verified broker partners from our sliding marquee stack, and earn AI credits automatically through your daily trading volume.'))}>
                    {t('broker.subtitle', 'Connect your MT5 account, view verified broker partners from our sliding marquee stack, and earn AI credits automatically through your daily trading volume.')}
                </p>
            </div>

            {/* Embedded Dynamic Broker Credits System */}
            <NeweraCreditsModal
                userId={userId}
                isInline={true}
            />
        </div>
    );
}
