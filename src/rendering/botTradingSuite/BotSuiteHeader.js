'use client';

import React from 'react';
import CommonSectionHeader from '@/components/CommonSectionHeader';

export default function BotSuiteHeader({ title, subtitle, rightAction, badge = 'CHRONOSX AI TRADING BOT SUITE', ...rest }) {
    return (
        <CommonSectionHeader
            badge={badge}
            title={title}
            subtitle={subtitle}
            rightAction={rightAction}
            {...rest}
        />
    );
}
