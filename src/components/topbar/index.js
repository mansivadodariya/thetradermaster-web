'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './topbar.module.scss';
import { dashboardApi } from '@/lib/api';
import { getStoredUser, getStoredUserId, hydrateUserFromProfile } from '@/lib/authSession';
import { CREDITS_UPDATED_EVENT } from '@/lib/credits';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/languageToggle';
import ThemeToggle from '@/components/themeToggle';
import NotificationsModal from '@/components/notificationsModal';
import { getUnreadCount } from '@/services/notificationService';
import { fetchVisibleTabNames, getVisibleTabNamesSync, checkPermissionInSet } from '@/lib/useTabPermission';
import { CreditCardIcon } from '@/icons/creditIcon';

const ROUTE_TITLE_MAP = {
  '/dashboard': 'nav.dashboard|Dashboard',
  '/chart-scanner': 'nav.chartScanner|AI Chart Scanner',
  '/ai-chart-scanner': 'nav.chartScanner|AI Chart Scanner',
  '/trade-audit': 'nav.tradeAudit|AI Past Trade Analyzer',
  '/ai-trade-audit': 'nav.tradeAudit|AI Past Trade Analyzer',
  '/trade-advisor': 'nav.tradeAudit|AI Past Trade Analyzer',
  '/my-bots': 'nav.myBots|My Bots',
  '/ai-bot-builder': 'nav.aiBotBuilder|AI Bot Builder',
  '/manual-bot-builder': 'nav.customBotBuilder|Custom Bot Builder',
  '/custom-bot-builder': 'nav.customBotBuilder|Custom Bot Builder',
  '/ai-trading-bot-builder': 'nav.customBotBuilder|Custom Bot Builder',
  '/bot-library': 'nav.botLibrary|Browse Bots Library',
  '/browse-bots': 'nav.botLibrary|Browse Bots Library',
  '/bot-builder': 'nav.aiBotBuilder|AI Bot Builder',
  '/strategy-studio': 'nav.aiBotBuilder|AI Bot Builder',
  '/ai-strategy-studio': 'nav.aiBotBuilder|AI Bot Builder',
  '/backtest': 'nav.backtest|Backtest',
  '/market-assistant': 'nav.marketAssistant|AI Market Assistant',
  '/ai-market-assistant': 'nav.marketAssistant|AI Market Assistant',
  '/live-scanner': 'nav.liveMarketScanner|Signal Terminal',
  '/live-market-scanner': 'nav.liveMarketScanner|Signal Terminal',
  '/signal-terminal': 'nav.liveMarketScanner|Signal Terminal',
  '/trading-signal': 'nav.strategyHub|AI Trading Signal',
  '/ai-trading-signal': 'nav.strategyHub|AI Trading Signal',
  '/strategy-hub': 'nav.strategyHub|AI Trading Signal',
  '/ai-strategy-hub': 'nav.strategyHub|AI Trading Signal',
  '/strategy-core': 'nav.strategyHub|AI Trading Signal',
  '/ai-strategy-core': 'nav.strategyHub|AI Trading Signal',
  '/strategy-hub/live': 'nav.liveMarketScanner|Signal Terminal',
  '/strategy-hub/strategy': 'nav.strategyPlaybooks|Strategy Signal',
  '/strategy-signal': 'nav.strategyPlaybooks|Strategy Signal',
  '/predefined-strategies': 'nav.predefinedStrategies|Predefined Strategies',
  '/tools': 'nav.tools|Tools',
  '/calendar': 'nav.economicCalendar|Economic Calendar',
  '/economic-calendar': 'nav.economicCalendar|Economic Calendar',
  '/calculator': 'nav.forexCalculator|Forex Calculator',
  '/forex-calculator': 'nav.forexCalculator|Forex Calculator',
  '/news': 'nav.marketNews|Market News',
  '/market-news': 'nav.marketNews|Market News',
  '/credit-history': 'nav.creditHistory|Credit History',
  '/plans': 'nav.plans|Subscription Plans',
  '/subscription-plans': 'nav.plans|Subscription Plans',
  '/broker': 'nav.broker|Associated Brokers',
  '/brokers': 'nav.broker|Associated Brokers',
  '/profile': 'nav.profile|Profile',
  '/settings': 'nav.settings|Settings',
  '/customer-support': 'nav.customerSupport|Customer Support',
  '/technical-support': 'nav.customerSupport|Customer Support',
  '/support': 'nav.customerSupport|Customer Support',
};

const Topbar = ({ onMenuClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [visibleTabNames, setVisibleTabNames] = useState(() => getVisibleTabNamesSync());

  const currentEntry = Object.entries(ROUTE_TITLE_MAP).find(([route]) =>
    pathname === route || pathname?.startsWith(`${route}/`)
  );

  const pageTitle = (() => {
    if (!currentEntry) return '';
    const [tKey, defaultVal] = currentEntry[1].split('|');
    return t(tKey, defaultVal);
  })();

  const fetchCredits = async (uid) => {
    if (!uid) return;
    try {
      const res = await dashboardApi.getStats(uid);
      setCredits(res?.data?.available_credits ?? 0);
    } catch (err) {
      if (!err?.message?.includes('Session expired')) { /* skip */ }
    }
  };

  const refreshUnreadCount = async (uid) => {
    if (visibleTabNames && !checkPermissionInSet(visibleTabNames, 'notifications')) return;
    const targetUid = uid || userId;
    if (!targetUid) return;
    try {
      const count = await getUnreadCount(targetUid);
      setUnreadCount(count || 0);
    } catch (_) {}
  };

  useEffect(() => {
    fetchVisibleTabNames().then((set) => {
      if (set) setVisibleTabNames(set);
    });
    const onTabPerms = (e) => {
      if (e?.detail) setVisibleTabNames(e.detail);
    };
    window.addEventListener('tab_permissions:updated', onTabPerms);
    return () => window.removeEventListener('tab_permissions:updated', onTabPerms);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const parsed = getStoredUser();
        const uid = getStoredUserId();
        if (!parsed && !uid) {
          router.replace('/login');
          return;
        }
        setUserId(uid);
        await hydrateUserFromProfile(uid, parsed || { id: uid, user_id: uid });
        await fetchCredits(uid);
        if (!visibleTabNames || checkPermissionInSet(visibleTabNames, 'notifications')) {
          await refreshUnreadCount(uid);
        }
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    init();
    window.addEventListener('user:updated', init);
    const onNotifSync = () => {
      const uid = getStoredUserId();
      if (uid) refreshUnreadCount(uid);
    };
    window.addEventListener('notification:updated', onNotifSync);
    return () => {
      window.removeEventListener('user:updated', init);
      window.removeEventListener('notification:updated', onNotifSync);
    };
  }, [router, visibleTabNames]);

  useEffect(() => {
    const onCreditsUpdated = (e) => {
      const next = e?.detail?.available_credits;
      if (next !== undefined && next !== null) {
        setCredits(next);
      }
    };
    window.addEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
    return () => window.removeEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated);
  }, []);

  const hasPlansPermission = checkPermissionInSet(visibleTabNames, 'subscription plans');
  const hasNotificationsPermission = !visibleTabNames || checkPermissionInSet(visibleTabNames, 'notifications');

  if (loading) {
    return (
      <div className={styles.topbar}>
        <div className={styles.left}>
          <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          {pageTitle && <h1 className={styles.pageTitle}>{pageTitle}</h1>}
        </div>
        <div className={styles.right}>
          <div className={styles.skeletonCredits} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.left}>
          <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          {pageTitle && <h1 className={styles.pageTitle}>{pageTitle}</h1>}
        </div>

        <div className={styles.right}>
          {/* Notification Bell */}
          {hasNotificationsPermission && (
            <button
              type="button"
              className={styles.bellBtn}
              onClick={() => setIsNotificationsOpen(true)}
              title={t('topbar.notifications', 'Notifications')}
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className={styles.bellBadge}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Language Selector */}
          <LanguageToggle />

          {/* Light / Dark Theme Toggle */}
          <ThemeToggle />

          {/* Credits Badge */}
          <div
            className={styles.credits}
            onClick={() => {
              if (hasPlansPermission) {
                router.push('/subscription-plans');
              }
            }}
            role="button"
            tabIndex={0}
            title={hasPlansPermission ? t('topbar.clickToUpgrade', 'View subscription plans') : ''}
          >
            <CreditCardIcon />
            <span>{credits ?? 0} {t('topbar.credits', 'credits')}</span>
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      {hasNotificationsPermission && (
        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          userId={userId}
          onUnreadCountChanged={() => refreshUnreadCount(userId)}
        />
      )}
    </>
  );
};

export default Topbar;
