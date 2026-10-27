'use client';

import React from 'react';
import styles from './publicCalculator.module.scss';
import ForexCalculator from '@/rendering/calculator';
import CommonCta from '@/components/commonCta';

export default function PublicForexCalculator() {
    return (
        <div className={styles.publicCalculatorWrapper}>
            <div className={styles.container}>
                {/* Embedded Core Institutional Calculator Suite */}
                <ForexCalculator />
            </div>

            {/* Public Conversion CTA Banner */}
            <CommonCta
                badge="PRECISE RISK & POSITION SIZING"
                title1="Ready for Institutional"
                title2="AI Execution?"
                description="Analyze charts with AI TradeSnap Vision, backtest algorithmic strategies & automate your trading workflow."
                primaryBtnText="GET STARTED FREE"
                primaryBtnAction="/signup"
            />
        </div>
    );
}

