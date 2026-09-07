"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const AiTradeAnalysis = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '40px 20px',
            gap: '16px',
        }}>
            <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            </div>
            <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                margin: 0,
                color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
            }}>
                {t('aiTradeAnalysis.title', 'AI Trade Analysis')}
            </h1>
            <p style={{
                fontSize: '1rem',
                color: theme === 'dark' ? '#94a3b8' : '#64748b',
                maxWidth: '420px',
                margin: 0,
                lineHeight: 1.6,
            }}>
                {t('aiTradeAnalysis.comingSoon', 'This feature is coming soon. Stay tuned for AI-powered trade analysis insights.')}
            </p>
            <div style={{
                padding: '8px 20px',
                borderRadius: '8px',
                background: theme === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
                fontSize: '0.875rem',
                fontWeight: 600,
            }}>
                {t('aiTradeAnalysis.badge', 'Coming Soon')}
            </div>
        </div>
    );
};

export default AiTradeAnalysis;
