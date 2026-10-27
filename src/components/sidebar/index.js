"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import styles from "./sidebar.module.scss";
import {
  ChevronLeftIcon,
  LogoutIcon,
  LandingHomeIcon,
  ProfileUserIcon,
} from '@/icons/sidebarIcons';
import { clearAuthSession, getStoredUser, getStoredUserId, hydrateUserFromProfile } from '@/lib/authSession';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { getBidiProps } from '@/lib/bidi';
import { fetchVisibleTabNames, getVisibleTabNamesSync, checkPermissionInSet } from '@/lib/useTabPermission';
import QuickJump from '@/components/QuickJump';
import SidebarSubscriptionWidget from './SidebarSubscriptionWidget';
import SidebarInstallButton from './SidebarInstallButton';
import NavItem from './SidebarNavItem';
import NavSkeleton from './SidebarNavSkeleton';
import {
  BrandDarkLogo,
  BrandLightLogo,
  SmallLogo,
  ChevronRightIcon,
  getNavSections,
  getLocalizedHref,
} from './sidebarNavConfig';

const Sidebar = ({ onClose, isCollapsed = false, onToggleCollapse }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const BrandTextLogo = theme === 'light' ? BrandDarkLogo : BrandLightLogo;

  const [isMounted, setIsMounted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [visibleTabNames, setVisibleTabNames] = useState(null);
  const [tabsLoading, setTabsLoading] = useState(true);
  const profileRef = useRef(null);
  const sidebarMenuRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    const syncTabs = getVisibleTabNamesSync();
    if (syncTabs) {
      setVisibleTabNames(syncTabs);
      setTabsLoading(false);
    }
    fetchVisibleTabNames()
      .then((names) => {
        if (names) setVisibleTabNames(names);
      })
      .finally(() => {
        setTabsLoading(false);
      });
  }, []);


  useEffect(() => {
    async function loadUser() {
      const stored = getStoredUser();
      if (stored) setUser(stored);

      const uid = getStoredUserId();
      if (uid && (!stored?.first_name && !stored?.last_name && !stored?.name)) {
        const hydrated = await hydrateUserFromProfile(uid, stored);
        if (hydrated) setUser(hydrated);
      }
    }
    loadUser();

    window.addEventListener('user:updated', loadUser);
    return () => window.removeEventListener('user:updated', loadUser);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || user?.name || user?.email || 'User Profile';

  const initials = (() => {
    if (firstName || lastName) {
      return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    }
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase() || 'U';
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  })();

  const handleNavigate = () => {
    onClose?.();
  };

  const doLogout = () => {
    clearAuthSession();
    router.replace('/login');
  };

  const ROUTE_TAB_MAP = {
    '/dashboard': 'Dashboard', '/chart-scanner': 'AI Chart Scanner', '/ai-chart-scanner': 'AI Chart Scanner',
    '/trade-audit': 'AI Past Trade Analyzer', '/ai-trade-audit': 'AI Past Trade Analyzer',
    '/trade-advisor': 'AI Past Trade Analyzer', '/ai-trade-advisor': 'AI Past Trade Analyzer',
    '/my-bots': 'My Bots', '/ai-bot-builder': 'AI Bot Builder', '/manual-bot-builder': 'Custom Bot Builder',
    '/custom-bot-builder': 'Custom Bot Builder', '/bot-library': 'Browse Bots Library', '/browse-bots': 'Browse Bots Library',
    '/bot-builder': 'AI Bot Builder', '/strategy-studio': 'AI Bot Builder', '/ai-strategy-studio': 'AI Bot Builder',
    '/backtest': 'Backtest', '/backtesting': 'Backtest', '/market-assistant': 'AI Market Assistant',
    '/ai-market-assistant': 'AI Market Assistant', '/trading-signal': 'AI Trading Signal', '/ai-trading-signal': 'AI Trading Signal',
    '/strategy-hub': 'AI Trading Signal', '/ai-strategy-hub': 'AI Trading Signal', '/strategy-core': 'AI Trading Signal',
    '/ai-strategy-core': 'AI Trading Signal', '/strategy-hub/live': 'Signal Terminal', '/strategy-hub/strategy': 'Strategy Signal',
    '/strategy-signal': 'Strategy Signal', '/predefined-strategies': 'Predefined Strategies',
    '/live-scanner': 'Signal Terminal', '/live-market-scanner': 'Signal Terminal', '/signal-terminal': 'Signal Terminal',
    '/tools': 'Tools', '/calendar': 'Economic Calendar', '/economic-calendar': 'Economic Calendar',
    '/calculator': 'Forex Calculator', '/forex-calculator': 'Forex Calculator', '/news': 'Market News',
    '/market-news': 'Market News', '/credit-history': 'Credit History', '/plans': 'Subscription Plans',
    '/subscription-plans': 'Subscription Plans', '/broker': 'Associated Brokers', '/brokers': 'Associated Brokers',
    '/affiliate': 'Affiliate', '/dashboard/affiliate': 'Affiliate', '/profile': 'Profile', '/settings': 'Profile',
    '/customer-support': 'Customer Support', '/technical-support': 'Customer Support', '/support': 'Customer Support',
  };

  const rawSections = getNavSections(t);
  const navSections = useMemo(() => {
    if (tabsLoading || !visibleTabNames) return [];

    const checkTabVisible = (tabLabel, routeHref) => {
      const lowerLabel = (tabLabel || '').toLowerCase().trim();
      const mapped = (ROUTE_TAB_MAP[routeHref] || '').toLowerCase().trim();

      // Affiliate & Education (Edufins external link) & Settings/Profile & Customer Support are always accessible
      if (lowerLabel.includes('affiliate') || mapped.includes('affiliate')) return true;
      if (lowerLabel.includes('education') || lowerLabel.includes('edufins') || routeHref?.includes('edufins')) return true;
      if (lowerLabel === 'profile' || lowerLabel === 'settings' || mapped === 'profile') return true;
      if (lowerLabel.includes('customer support') || lowerLabel.includes('technical support') || mapped.includes('customer support') || mapped.includes('technical support') || routeHref === '/customer-support' || routeHref === '/technical-support' || routeHref === '/support') return true;

      // Group parent container check: "AI Trading Bot" is shown if any of its sub-items is enabled
      if (routeHref === '/my-bots' || lowerLabel === 'ai trading bot' || mapped === 'ai trading bot') {
        return (
          checkPermissionInSet(visibleTabNames, 'my bots') ||
          checkPermissionInSet(visibleTabNames, 'ai bot builder') ||
          checkPermissionInSet(visibleTabNames, 'custom bot builder') ||
          checkPermissionInSet(visibleTabNames, 'browse bots library')
        );
      }

      // Group parent container check: "AI Trading Signal" is shown if any of its sub-items is enabled
      if (routeHref === '/trading-signal' || routeHref === '/strategy-hub' || lowerLabel === 'ai trading signal' || mapped === 'ai trading signal') {
        return (
          checkPermissionInSet(visibleTabNames, 'strategy signal') ||
          checkPermissionInSet(visibleTabNames, 'signal terminal') ||
          checkPermissionInSet(visibleTabNames, 'predefined strategies') ||
          checkPermissionInSet(visibleTabNames, 'ai trading signal')
        );
      }

      // Exact check against standardized dashboard_tabs permissions
      return (
        checkPermissionInSet(visibleTabNames, mapped) ||
        checkPermissionInSet(visibleTabNames, lowerLabel)
      );
    };

    return rawSections.map(section => {
      const filteredItems = section.items.map(item => {
        const parentTabName = (ROUTE_TAB_MAP[item.href] || item.label || '').toLowerCase();

        // If item has sub-items (Tools, AI Trading Signal), filter sub-items individually
        if (item.subItems && item.subItems.length > 0) {
          const isParentGroupEnabled = checkTabVisible(item.label, item.href);
          if (!isParentGroupEnabled) return null;

          const filteredSubItems = item.subItems.filter(sub => checkTabVisible(sub.label, sub.href));

          if (filteredSubItems.length > 0) {
            return { ...item, subItems: filteredSubItems };
          }
          return null;
        }

        // Settings/Profile & Customer Support are always accessible
        if (
          parentTabName.includes('profile') ||
          parentTabName.includes('settings') ||
          parentTabName.includes('affiliate') ||
          parentTabName.includes('customer support') ||
          parentTabName.includes('technical support') ||
          item.href === '/affiliate' ||
          item.href === '/dashboard/affiliate' ||
          item.href === '/customer-support' ||
          item.href === '/technical-support' ||
          item.href === '/support'
        ) return item;

        // Single menu item check
        return checkTabVisible(item.label, item.href) ? item : null;
      }).filter(Boolean);

      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);
  }, [rawSections, visibleTabNames, tabsLoading]);

  const hasPlansPermission = !tabsLoading && visibleTabNames && visibleTabNames.size > 0
    ? visibleTabNames.has('subscription plans')
    : false;

  const hasBrokerPermission = !tabsLoading && visibleTabNames && visibleTabNames.size > 0
    ? (visibleTabNames.has('associated brokers') || visibleTabNames.has('associated broker') || visibleTabNames.has('broker') || visibleTabNames.has('brokers'))
    : false;

  return (
    <>
      <aside 
        className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
        data-lenis-prevent="true"
        onWheel={(e) => {
          if (sidebarMenuRef.current) {
            sidebarMenuRef.current.scrollTop += e.deltaY;
          }
        }}
      >
        {/* Brand Logo Header */}
        <div className={styles.logoHeader}>
          {!isCollapsed ? (
            <div className={styles.logo} onClick={() => router.push('/')}>
              <img src={BrandTextLogo} alt="TraderMaster" />
            </div>
          ) : (
            <div className={styles.logoMark} onClick={() => router.push('/')}>
              <img src={SmallLogo} alt="TraderMaster" className={styles.smallLogoImg} />
              <span className={styles.tooltip}>TraderMaster</span>
            </div>
          )}
          {onToggleCollapse && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? t('sidebar.expand', 'Expand sidebar') : t('sidebar.collapse', 'Collapse sidebar')}
            >
              {language === 'ar'
                ? (isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />)
                : (isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />)
              }
              <span className={styles.tooltip}>
                {isCollapsed ? t('sidebar.expand', 'Expand sidebar') : t('sidebar.collapse', 'Collapse sidebar')}
              </span>
            </button>
          )}
        </div>

        {/* Quick Jump Search Button & Command Palette */}
        <div className={styles.quickJumpWrapper}>
          <QuickJump isCollapsed={isCollapsed} />
        </div>

        {/* Install App Button */}
        <SidebarInstallButton isCollapsed={isCollapsed} />

        {/* Navigation Menu List */}
        <div 
          className={styles.sidebarmenu} 
          ref={sidebarMenuRef}
          data-lenis-prevent="true"
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          {!isMounted || tabsLoading || !visibleTabNames ? (
            <NavSkeleton count={7} isCollapsed={isCollapsed} />
          ) : (
            navSections.map((section, sIndex) => (
              <div key={section.title || sIndex} className={styles.navSectionBlock}>
                {sIndex > 0 && !isCollapsed && (
                  <div className={styles.navSectionDivider} />
                )}
                {!isCollapsed && section.title ? (
                  <div className={styles.navSectionHeader}>
                    {section.title}
                  </div>
                ) : (
                  sIndex > 0 && isCollapsed && <div className={styles.collapsedDivider} />
                )}
                {section.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onNavigate={handleNavigate}
                    isCollapsed={isCollapsed}
                    language={language}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Bottom Section: Upgrade Card & Profile Card */}
        <div className={styles.bottomSection}>
          {/* Active Plan / Upgrade to Pro Widget */}
          {hasPlansPermission && (
            <SidebarSubscriptionWidget
              isCollapsed={isCollapsed}
              onNavigate={handleNavigate}
            />
          )}

          {/* User Profile Card */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <div
              className={`${styles.userProfileCard} ${isCollapsed ? styles.collapsedProfileCard : ''}`}
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              aria-expanded={profileDropdownOpen}
            >
              <div className={styles.avatarBox}>
                {user?.profile_picture ? (
                  <img src={user.profile_picture} alt={displayName} className={styles.avatarImg} />
                ) : (
                  <div className={styles.avatarInitials}>{initials}</div>
                )}
              </div>

              {!isCollapsed && (
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{displayName}</span>
                  <span className={styles.userSubtitle}>{t('sidebar.viewManage', 'View & Manage')}</span>
                </div>
              )}

              {!isCollapsed && (
                <div className={styles.chevronBox}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#18C98B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: profileDropdownOpen ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}

              {isCollapsed && (
                <span className={styles.tooltip}>{displayName}</span>
              )}
            </div>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  className={`${styles.profileMenuDropdown} ${isCollapsed ? styles.collapsedMenuDropdown : ''}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{displayName}</p>
                    {user?.email && <p className={styles.dropdownEmail}>{user.email}</p>}
                  </div>

                  <div className={styles.dropdownDivider} />

                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNavigate();
                      router.push('/profile');
                    }}
                  >
                    <ProfileUserIcon />
                    <span>{t('nav.profile', 'Settings')}</span>
                  </button>

                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNavigate();
                      router.push('/');
                    }}
                  >
                    <LandingHomeIcon width={18} height={18} />
                    <span>{t('nav.home', 'Home')}</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${styles.logoutOption}`}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setConfirmOpen(true);
                    }}
                  >
                    <LogoutIcon />
                    <span>{t('nav.logout', 'Log out')}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Confirm Logout Modal */}
      {confirmOpen && (
        <div className={styles.confirmOverlay} onClick={() => setConfirmOpen(false)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <h3>{t('topbar.logoutConfirmTitle', 'Log out?')}</h3>
            <p>{t('topbar.logoutConfirmMessage', 'Are you sure you want to log out?')}</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setConfirmOpen(false)}>{t('topbar.cancel', 'Cancel')}</button>
              <button type="button" className={styles.confirmLogoutBtn} onClick={doLogout}>{t('nav.logout', 'Log out')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
