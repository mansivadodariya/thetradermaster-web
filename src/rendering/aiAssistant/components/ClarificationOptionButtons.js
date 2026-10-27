'use client';

import React from 'react';
import {
    TechnicalStructureIcon,
    FundamentalMacroIcon,
    IntradayScalpIcon,
    MediumTermIcon,
    SwingPositionIcon,
    CompleteProIcon
} from '@/icons/clarificationIcons';
import styles from '../aiAssistant.module.scss';

export const CLARIFICATION_BUTTONS = [
    { label: 'Technical Structure',    icon: TechnicalStructureIcon, sub: 'Pivots, RSI, MAs & Levels' },
    { label: 'Fundamental & Macro',    icon: FundamentalMacroIcon, sub: 'Central Bank & News Drivers' },
    { label: 'Intraday Scalp Setup',   icon: IntradayScalpIcon, sub: '15m/1H Quick Entry & Tight SL' },
    { label: 'Medium Term Setup',      icon: MediumTermIcon, sub: '1H/4H Weekly Trend Setup' },
    { label: 'Swing Position Setup',   icon: SwingPositionIcon, sub: '4H/Daily Multi-Day Setup' },
    { label: 'Complete Pro Setup',     icon: CompleteProIcon, sub: 'Full Tech + Macro + SL/TP' },
];

export default function ClarificationOptionButtons({ onSelect }) {
    return (
        <div className={styles.clarificationOptionsGrid}>
            {CLARIFICATION_BUTTONS.map((btn) => {
                const IconComponent = btn.icon;
                return (
                    <button
                        key={btn.label}
                        type="button"
                        onClick={() => onSelect(btn.label)}
                        className={styles.clarificationOptionBtn}
                    >
                        <span className={styles.clarificationOptionIcon}>
                            <IconComponent size={18} />
                        </span>
                        <div className={styles.clarificationOptionText}>
                            <span className={styles.clarificationOptionLabel}>
                                {btn.label}
                            </span>
                            {btn.sub && (
                                <span className={styles.clarificationOptionSub}>
                                    {btn.sub}
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
