'use client';

import React from 'react';
import styles from './publicCalendar.module.scss';
import EconomicCalendar from '@/rendering/economicCalendar';
import CommonCta from '@/components/commonCta';

export default function PublicEconomicCalendar() {
    return (
        <div className={styles.publicCalendarWrapper}>
            <div className={styles.container}>
                {/* Embedded TradingView Economic Calendar Core Component */}
                <EconomicCalendar />
            </div>

            {/* Public Conversion CTA Banner */}
            <CommonCta
                badge="REAL-TIME MACRO DATA"
                title1="Automate Your Trading Strategy Around"
                title2="High-Impact News Events"
                description="Analyze pre-news chart patterns with AI TradeSnap Vision, track central bank interest rates, and trade with quantitative clarity."
                primaryBtnText="GET STARTED FREE"
                primaryBtnAction="/signup"
            />
        </div>
    );
}

