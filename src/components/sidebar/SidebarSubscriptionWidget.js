'use client';

import React from 'react';
import Link from 'next/link';
import styles from './sidebarSubscriptionWidget.module.scss';
import { useSubscription } from '@/context/SubscriptionContext';
import { useLanguage } from '@/context/LanguageContext';

const CrownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function SidebarSubscriptionWidget({ isCollapsed, onNavigate }) {
  const { t } = useLanguage();
  const { subscription, hasActivePlan } = useSubscription();

  const isPlanActive = hasActivePlan && subscription && subscription.status === 'ACTIVE';

  let daysLeft = 0;
  let hoursLeft = 0;
  let isExpired = true;
  let progressPercent = 0;
  let planDisplayName = t('sidebar.starterPlan', 'Starter Plan');

  if (isPlanActive && subscription.end_date) {
    const now = Date.now();
    const end = new Date(subscription.end_date).getTime();
    const start = subscription.start_date ? new Date(subscription.start_date).getTime() : (end - 30 * 86400000);
    const totalDuration = Math.max(86400000, end - start);
    const msLeft = end - now;

    if (msLeft > 0) {
      isExpired = false;
      daysLeft = Math.ceil(msLeft / 86400000);
      hoursLeft = Math.max(1, Math.floor(msLeft / 3600000));
      progressPercent = Math.min(100, Math.max(6, Math.round((msLeft / totalDuration) * 100)));
    }

    const rawName = subscription.plan_name || subscription.plan_id || 'Starter';
    planDisplayName = rawName.toLowerCase().includes('plan') ? rawName : `${rawName} Plan`;
  }

  // ACTIVE PLAN: SHOW PROPER UI WITH METRICS & PROGRESS BAR
  if (!isExpired && isPlanActive) {
    return !isCollapsed ? (
      <Link
        href="/subscription-plans"
        className={styles.widgetCard}
        onClick={onNavigate}
        title={`${planDisplayName} • ${daysLeft} days remaining. Click to manage or renew.`}
      >
        {/* Row 1: Plan Title & Action Arrow */}
        <div className={styles.headerRow}>
          <div className={styles.identityGroup}>
            <div className={styles.iconBadge}>
              <CrownIcon />
              <span className={styles.pulseDot} />
            </div>
            <div className={styles.nameBlock}>
              <span className={styles.planName}>{planDisplayName}</span>
            </div>
          </div>

          <div className={styles.metaActionGroup}>
            <div className={styles.arrowBtn} aria-hidden="true">
              <ArrowRightIcon />
            </div>
          </div>
        </div>

        {/* Row 2: Clean Progress Bar */}
        <div className={styles.progressTrack} role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Row 3: Active Status & Cycle Subtext */}
        <div className={styles.footerRow}>
          <span className={styles.statusText}>
            <span className={styles.greenDot} />
            {daysLeft > 1 ? `${daysLeft} ${t('sidebar.daysActive', 'Days Active')}` : t('sidebar.expiringToday', 'Expiring Today')}
          </span>
          <span className={styles.cycleText}>
            {progressPercent}% {t('sidebar.cycle', 'cycle')}
          </span>
        </div>
      </Link>
    ) : (
      <div className={styles.compactBox}>
        <Link
          href="/subscription-plans"
          className={styles.compactBtn}
          onClick={onNavigate}
          aria-label={`${planDisplayName} (${daysLeft}${t('sidebar.daysLeft', 'd left')})`}
        >
          <span className={styles.compactPulseDot} />
          <CrownIcon />
          <span className={styles.tooltip}>
            {`${planDisplayName} • ${daysLeft}${t('sidebar.daysLeft', 'd left')}`}
          </span>
        </Link>
      </div>
    );
  }

  // EXPIRED OR NO ACTIVE PLAN: DEFAULT "UPGRADE TO PRO ACCOUNT"
  return !isCollapsed ? (
    <Link
      href="/subscription-plans"
      className={styles.fallbackCard}
      onClick={onNavigate}
    >
      <div className={styles.fallbackIconBox}>
        <CrownIcon />
      </div>
      <div className={styles.fallbackText}>
        <span className={styles.fallbackSub}>{t('sidebar.upgradeTo', 'Upgrade to')}</span>
        <span className={styles.fallbackMain}>{t('sidebar.proAccount', 'Pro Account')}</span>
      </div>
      <div className={styles.arrowBtn} aria-hidden="true">
        <ArrowRightIcon />
      </div>
    </Link>
  ) : (
    <div className={styles.compactBox}>
      <Link
        href="/subscription-plans"
        className={styles.compactBtn}
        onClick={onNavigate}
        aria-label={t('sidebar.upgradeToPro', 'Upgrade to Pro')}
      >
        <CrownIcon />
        <span className={styles.tooltip}>
          {t('sidebar.upgradeToPro', 'Upgrade to Pro')}
        </span>
      </Link>
    </div>
  );
}
