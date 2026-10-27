import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CopyIcon, SparkleIcon, ExternalLinkIcon } from './AffiliateIcons';

export function MarketingKitTab({ styles, t, handleCopyText }) {
    return (
        <div className={styles.marketingKitGrid}>
            <div className={styles.marketingPitchCard}>
                <div className={styles.pitchHeader}>
                    <h4>{t('affiliate.pitch1Title', 'Pitch 1: AI Precision & Speed')}</h4>
                    <button
                        type="button"
                        className={styles.copyPitchBtn}
                        onClick={() => handleCopyText(
                            t('affiliate.pitch1Copy', "Stop guessing your trades. I've been using ChronosX AI-powered real-time chart analysis and high-probability signals. Sign up with my link and unlock lifetime pro insights: ")
                        )}
                    >
                        <CopyIcon />
                        <span>{t('affiliate.copyScript', 'Copy Script')}</span>
                    </button>
                </div>
                <p className={styles.pitchText}>
                    &ldquo;{t('affiliate.pitch1Text', "Stop guessing your trades. I've been using ChronosX AI-powered real-time chart analysis and high-probability signals. Sign up with my link and unlock lifetime pro insights!")}&rdquo;
                </p>
                <div className={styles.pitchFooter}>
                    <span className={styles.channelTag}>{t('affiliate.tagTwitter', 'X (Twitter) / Telegram')}</span>
                    <span className={styles.pitchLength}>{t('affiliate.shortForm', 'Short Form')}</span>
                </div>
            </div>

            <div className={styles.marketingPitchCard}>
                <div className={styles.pitchHeader}>
                    <h4>{t('affiliate.pitch2Title', 'Pitch 2: Trade-Snap & Strategy')}</h4>
                    <button
                        type="button"
                        className={styles.copyPitchBtn}
                        onClick={() => handleCopyText(
                            t('affiliate.pitch2Copy', "Upload any trading chart screenshot and get instant institutional breakdown, risk-to-reward metrics, and multi-factor validation with ChronosX. Try it here: ")
                        )}
                    >
                        <CopyIcon />
                        <span>{t('affiliate.copyScript', 'Copy Script')}</span>
                    </button>
                </div>
                <p className={styles.pitchText}>
                    &ldquo;{t('affiliate.pitch2Text', "Upload any trading chart screenshot and get instant institutional breakdown, risk-to-reward metrics, and multi-factor validation with ChronosX. Try it here!")}&rdquo;
                </p>
                <div className={styles.pitchFooter}>
                    <span className={styles.channelTag}>{t('affiliate.tagDiscord', 'Discord / Reddit / Forums')}</span>
                    <span className={styles.pitchLength}>{t('affiliate.featureFocus', 'Feature Focus')}</span>
                </div>
            </div>

            <div className={styles.marketingPitchCard}>
                <div className={styles.pitchHeader}>
                    <h4>{t('affiliate.pitch3Title', 'Pitch 3: Influencer / Community Leader')}</h4>
                    <button
                        type="button"
                        className={styles.copyPitchBtn}
                        onClick={() => handleCopyText(
                            t('affiliate.pitch3Copy', "Empower your community with institutional AI trading tools. Partner with ChronosX and access premium multi-timeframe analytics: ")
                        )}
                    >
                        <CopyIcon />
                        <span>{t('affiliate.copyScript', 'Copy Script')}</span>
                    </button>
                </div>
                <p className={styles.pitchText}>
                    &ldquo;{t('affiliate.pitch3Text', "Empower your community with institutional AI trading tools. Partner with ChronosX and access premium multi-timeframe analytics.")}&rdquo;
                </p>
                <div className={styles.pitchFooter}>
                    <span className={styles.channelTag}>{t('affiliate.tagYoutube', 'YouTube / Newsletter')}</span>
                    <span className={styles.pitchLength}>{t('affiliate.longForm', 'Long Form')}</span>
                </div>
            </div>
        </div>
    );
}
