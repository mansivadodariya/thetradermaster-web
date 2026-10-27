'use client';

import React from 'react';
import styles from './publicNews.module.scss';
import MarketNews from '@/rendering/news';
import CommonCta from '@/components/commonCta';

export default function PublicMarketNews() {
    return (
        <div className={styles.publicNewsWrapper}>
            <div className={styles.container}>
                <MarketNews />
            </div>

            {/* Public Conversion CTA Banner */}
            <CommonCta
                badge="REAL-TIME GLOBAL FLOWS"
                title1="Turn Market Breaking News into"
                title2="Actionable Trade Signals"
                description="Harness institutional AI sentiment models, live economic indicators, and real-time tick feeds."
                primaryBtnText="GET STARTED FREE"
                primaryBtnAction="/signup"
            />
        </div>
    );
}

