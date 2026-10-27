"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authNavigate, isUserLoggedIn } from '@/lib/authRedirect';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardGridIcon } from '@/icons/sidebarIcons';
import { useTheme } from '@/context/ThemeContext';
import styles from './header.module.scss';
import Button from '../button';
import ThemeToggle from '../themeToggle';
import LanguageToggle from '../languageToggle';
import { useTabPermission } from '@/lib/useTabPermission';

const DarkLogo = '/assets/logo/logo.png';
const LightLogo = '/assets/logo/darklogo.png';
const RightIcon = '/assets/icons/right.svg';

export default function Header() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const activeLogo = theme === 'light' ? LightLogo : DarkLogo;
    const router = useRouter();
    const pathname = usePathname();
    const hasPlansPermission = useTabPermission('Subscription Plans');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const updateAuth = () => {
            setIsLoggedIn(isUserLoggedIn());
        };
        updateAuth();
        window.addEventListener('user:updated', updateAuth);
        window.addEventListener('auth:logout', updateAuth);
        window.addEventListener('storage', updateAuth);
        window.addEventListener('focus', updateAuth);
        return () => {
            window.removeEventListener('user:updated', updateAuth);
            window.removeEventListener('auth:logout', updateAuth);
            window.removeEventListener('storage', updateAuth);
            window.removeEventListener('focus', updateAuth);
        };
    }, [pathname]);

    useEffect(() => {
        let ticking = false;
        let isScrolledState = false;

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                ticking = false;
                const isPastThreshold = window.scrollY > 20;
                if (isPastThreshold !== isScrolledState) {
                    isScrolledState = isPastThreshold;
                    setScrolled(isPastThreshold);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        setOpenMobileDropdown(null);
    }, [pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setMobileMenuOpen(false);
                setOpenMobileDropdown(null);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileDropdown = (label) => {
        setOpenMobileDropdown(prev => (prev === label ? null : label));
    };

    const productDropdownItems = useMemo(() => [
        {
            label: t('header.products.chartScanner.title', 'AI Chart Scanner'),
            desc: t('header.products.chartScanner.desc', 'Multi-timeframe technical pattern detection & neural OCR chart vision'),
            href: '/ai-chart-scanner',
            badge: t('header.products.chartScanner.badge', 'POPULAR'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    <path d="m7 14 3.5-3.5 3 3L18 9" />
                    <polyline points="14 9 18 9 18 13" />
                </svg>
            )
        },
        {
            label: t('header.products.marketAssistant.title', 'AI Market Assistant'),
            desc: t('header.products.marketAssistant.desc', 'Real-time conversational market intelligence & instant insights'),
            href: '/ai-market-assistant',
            badge: t('header.products.marketAssistant.badge', 'LIVE AI'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="7" width="18" height="13" rx="3" />
                    <path d="M12 2v5" />
                    <circle cx="12" cy="2" r="1" fill="currentColor" />
                    <circle cx="9" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                    <path d="M9 16c1 .75 2 .75 3 .75s2 0 3-.75" />
                    <line x1="1" y1="13" x2="3" y2="13" />
                    <line x1="21" y1="13" x2="23" y2="13" />
                </svg>
            )
        },
        {
            label: t('header.products.strategyHub.title', 'AI Strategy Core'),
            desc: t('header.products.strategyHub.desc', 'Algorithmic backtesting, quantitative playbooks & strategy signals'),
            href: '/ai-strategy-core',
            badge: t('header.products.strategyHub.badge', 'QUANT'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12h4l3-8 4 16 3-10 2 5 2-3h4" />
                    <circle cx="9" cy="4" r="1.2" fill="currentColor" />
                    <circle cx="13" cy="20" r="1.2" fill="currentColor" />
                </svg>
            )
        }
    ], [t]);

    const tradingToolsDropdownItems = useMemo(() => [
        {
            label: t('header.tradingTools.tradeAudit.title', 'AI Past Trade Analyzer'),
            desc: t('header.tradingTools.tradeAudit.desc', 'Review historical trading data to evaluate performance, pinpoint mistakes, and track win rates.'),
            href: '/ai-trade-advisor',
            badge: t('header.tradingTools.tradeAudit.badge', 'AI ADVISOR'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="m9 14 2 2 4-4" />
                    <path d="M8 18h8" />
                </svg>
            )
        },
        {
            label: t('header.tradingTools.strategyCreate.title', 'AI Trading Bot Builder'),
            desc: t('header.tradingTools.strategyCreate.desc', 'Build your strategy with AI in plain English or build custom rules step-by-step'),
            href: '/custom-bot-builder',
            badge: t('header.tradingTools.strategyCreate.badge', 'AI BOT'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                    <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" />
                    <line x1="9" y1="1" x2="9" y2="4" />
                    <line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" />
                    <line x1="15" y1="20" x2="15" y2="23" />
                    <line x1="20" y1="9" x2="23" y2="9" />
                    <line x1="20" y1="15" x2="23" y2="15" />
                    <line x1="1" y1="9" x2="4" y2="9" />
                    <line x1="1" y1="15" x2="4" y2="15" />
                </svg>
            )
        },
        {
            label: t('header.tradingTools.backtesting.title', 'Backtesting'),
            desc: t('header.tradingTools.backtesting.desc', 'High-speed historical simulation, win-rate metrics & Sharpe ratio'),
            href: '/backtesting',
            badge: t('header.tradingTools.backtesting.badge', 'SIMULATOR'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="m8 14 3-3 3 2 4-5" />
                </svg>
            )
        },

    ], [t]);

    const companyDropdownItems = useMemo(() => [
        {
            label: t('header.company.aboutUs.title', 'About Us'),
            desc: t('header.company.aboutUs.desc', 'Our mission, institutional AI infrastructure & executive leadership'),
            href: '/about-us',
            badge: t('header.company.aboutUs.badge', 'VISION'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        },
        {
            label: t('header.company.whiteLabel.title', 'White Label'),
            desc: t('header.company.whiteLabel.desc', 'Launch your own branded AI & quant trading platform'),
            href: '/white-label',
            badge: t('header.company.whiteLabel.badge', 'ENTERPRISE'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                </svg>
            )
        },
        {
            label: t('header.company.affiliate.title', 'Affiliate Program'),
            desc: t('header.company.affiliate.desc', 'Earn up to 20% recurring commissions sharing ChronosX'),
            href: '/affiliate-program',
            badge: t('header.company.affiliate.badge', 'EARN 20%'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 6v2m0 8v2" />
                </svg>
            )
        },
        {
            label: t('header.company.economicCalendar.title', 'Economic Calendar'),
            desc: t('header.company.economicCalendar.desc', 'Real-time global macro events, central bank rates & high-impact releases'),
            href: '/economic-calendar',
            badge: t('header.company.economicCalendar.badge', 'LIVE CALENDAR'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <circle cx="8" cy="14" r="1" fill="currentColor" />
                    <circle cx="12" cy="14" r="1" fill="currentColor" />
                    <circle cx="16" cy="14" r="1" fill="currentColor" />
                    <circle cx="8" cy="18" r="1" fill="currentColor" />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                </svg>
            )
        },
        {
            label: t('header.company.news.title', 'News'),
            desc: t('header.company.news.desc', 'Curated financial headlines, market updates & breaking economic catalysts'),
            href: '/market-news',
            badge: t('header.company.news.badge', 'DAILY'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8" />
                    <path d="M15 18h-5" />
                    <path d="M10 6h8v4h-8V6Z" />
                </svg>
            )
        },
        {
            label: t('header.company.forexCalculator.title', 'Forex Calculator'),
            desc: t('header.company.forexCalculator.desc', 'Precision pip value, position sizing, lot size & risk calculator'),
            href: '/forex-calculator',
            badge: t('header.company.forexCalculator.badge', 'UTILITY'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <line x1="16" y1="14" x2="16" y2="18" />
                    <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
                </svg>
            )
        },
        {
            label: t('header.company.blog.title', 'Blog'),
            desc: t('header.company.blog.desc', 'In-depth quant trading strategies, technical breakdowns & research'),
            href: '/blogs',
            badge: t('header.company.blog.badge', 'INSIGHTS'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            )
        },
        {
            label: t('header.company.support.title', 'Customer Support'),
            desc: t('header.company.support.desc', 'Get help from our customer support team for your account, orders and queries'),
            href: '/customer-support',
            badge: t('header.company.support.badge', 'HELP DESK'),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            )
        },

    ], [t]);

    const navItems = useMemo(() => {
        const items = [
            {
                label: t('header.productsTab', 'Products'),
                href: '/',
                hasDropdown: true,
                dropdownTag: t('header.aiTradingEcosystem', 'AI TRADING ECOSYSTEM'),
                dropdownFooter: t('header.aiTradingEcosystemDesc', 'Powered by ChronosX Real-Time Neural Engines'),
                dropdownItems: productDropdownItems
            },
            {
                label: t('header.tradingToolsTab', 'Trading Tools'),
                href: '/',
                hasDropdown: true,
                dropdownTag: t('header.quantExecutionSuite', 'QUANTITATIVE EXECUTION SUITE'),
                dropdownFooter: t('header.quantExecutionSuiteDesc', 'Multi-Broker Execution & Zero-Latency Routing'),
                dropdownItems: tradingToolsDropdownItems
            },
            {
                label: t('header.companyTab', 'Company'),
                href: '/about-us',
                hasDropdown: true,
                twoColumns: true,
                dropdownTag: t('header.companyResources', 'COMPANY & RESOURCES'),
                dropdownFooter: t('header.companyResourcesDesc', 'ChronosX Global Financial Intelligence Network'),
                dropdownItems: companyDropdownItems
            },
        ];

        if (hasPlansPermission) {
            items.push({ label: t('header.pricingTab', 'Pricing'), href: '/plans' });
        }

        items.push({ label: t('header.contactUsTab', 'Contact Us'), href: '/contact-us' });

        return items;
    }, [t, productDropdownItems, tradingToolsDropdownItems, companyDropdownItems, hasPlansPermission]);

    const isLinkActive = (item) => {
        if (!pathname) return false;
        // Strip locale prefix for comparison
        const pathParts = pathname.split('/').filter(Boolean);
        const locales = ['en', 'ar', 'ary', 'es', 'ru', 'zh', 'vi', 'id', 'fil', 'arabic', 'spanish', 'russian', 'chinese', 'vietnamese', 'indonesian', 'filipino', 'darija'];
        const strippedPath = pathParts.length > 0 && locales.includes(pathParts[0].toLowerCase())
            ? '/' + pathParts.slice(1).join('/')
            : pathname;
        const current = strippedPath.split('?')[0].replace(/\/$/, '') || '/';
        const target = (item.href || '').split('#')[0].replace(/\/$/, '') || '/';

        // For dropdown menus, only activate if user is visiting a specific non-root subpage
        if (item.hasDropdown && item.dropdownItems) {
            const isChildActive = item.dropdownItems.some(sub => {
                const subHref = (sub.href || '').split('#')[0].replace(/\/$/, '');
                if (!subHref || subHref === '/') return false;
                return current === subHref || current.startsWith(`${subHref}/`);
            });
            if (isChildActive) return true;
        }

        // If target is root '/' or hash anchor, do not activate as an active navigation tab on homepage
        if (target === '/' || item.href?.startsWith('/#') || item.href?.startsWith('#')) {
            return false;
        }

        return current === target || current.startsWith(`${target}/`);
    };

    return (
        <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
            <div className='container'>
                <div className={`${styles.headerAlignment} ${scrolled ? styles.alignmentScrolled : ''}`}>
                    {/* Brand Logo */}
                    <div className={styles.logo}>
                        <Link href="/" aria-label="ChronosX Home">
                            <img src={activeLogo} alt="ChronosX Logo" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className={styles.menu} aria-label="Main Navigation">
                        <ul>
                            {navItems.map((item) => {
                                const active = isLinkActive(item);
                                const isItemOpen = activeDropdown === item.label;

                                if (item.hasDropdown) {
                                    return (
                                        <li
                                            key={item.label}
                                            className={`${styles.dropdownParent} ${active ? styles.active : ''} ${isItemOpen ? styles.dropdownOpen : ''}`}
                                            onMouseEnter={() => setActiveDropdown(item.label)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <button
                                                type="button"
                                                className={styles.dropdownTrigger}
                                                aria-expanded={isItemOpen}
                                                onClick={() => setActiveDropdown(prev => prev === item.label ? null : item.label)}
                                            >
                                                <span>{item.label}</span>
                                                <svg
                                                    className={styles.chevron}
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </button>

                                            {/* Hover Dropdown Menu */}
                                            <div className={`${styles.dropdownMenu} ${item.twoColumns ? styles.twoColMenu : ''}`}>
                                                <div className={styles.dropdownCard}>
                                                    <div className={styles.dropdownHeaderTag}>
                                                        <span>{item.dropdownTag}</span>
                                                    </div>

                                                    <div className={`${styles.dropdownGrid} ${item.twoColumns ? styles.twoColGrid : ''}`}>
                                                        {item.dropdownItems.map((subItem) => (
                                                            <Link
                                                                key={subItem.label}
                                                                href={subItem.href}
                                                                className={styles.dropdownItem}
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                <div className={styles.itemIconBox}>
                                                                    {subItem.icon}
                                                                </div>
                                                                <div className={styles.itemContent}>
                                                                    <div className={styles.itemTitleRow}>
                                                                        <span className={styles.itemTitle}>{subItem.label}</span>
                                                                        {subItem.badge && (
                                                                            <span className={styles.itemBadge}>{subItem.badge}</span>
                                                                        )}
                                                                    </div>
                                                                    <p className={styles.itemDesc}>{subItem.desc}</p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>

                                                    <div className={styles.dropdownFooter}>
                                                        <span className={styles.footerGlowDot} />
                                                        <span>{item.dropdownFooter}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.label} className={active ? styles.active : ''}>
                                        <Link href={item.href}>
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Right Desktop CTA */}
                    <div className={styles.desktopAction}>
                        <LanguageToggle variant="headerNav" />
                        <ThemeToggle />
                        <Button
                            text={isLoggedIn ? t('nav.dashboard', 'Dashboard') : t('nav.getStarted', 'Get Started')}
                            icon={isLoggedIn ? DashboardGridIcon : RightIcon}
                            onClick={() => {
                                if (isLoggedIn) {
                                    router.push('/dashboard');
                                } else {
                                    authNavigate(router, '/dashboard');
                                }
                            }}
                        />
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        className={`${styles.hamburgerBtn} ${mobileMenuOpen ? styles.hamburgerActive : ''}`}
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span className={styles.line} />
                        <span className={styles.line} />
                        <span className={styles.line} />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className={styles.mobileDrawer}
                        initial={{ opacity: 0, y: -20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="container">
                            <div className={styles.drawerCard}>
                                <ul className={styles.drawerNavList}>
                                    {navItems.map((item) => {
                                        const active = isLinkActive(item);
                                        const isMobileOpen = openMobileDropdown === item.label;

                                        if (item.hasDropdown) {
                                            return (
                                                <li key={item.label} className={styles.mobileDropdownItem}>
                                                    <button
                                                        type="button"
                                                        className={`${styles.drawerLink} ${styles.mobileDropdownTrigger} ${active ? styles.drawerLinkActive : ''}`}
                                                        onClick={() => toggleMobileDropdown(item.label)}
                                                    >
                                                        <span>{item.label}</span>
                                                        <svg
                                                            className={`${styles.mobileChevron} ${isMobileOpen ? styles.mobileChevronOpen : ''}`}
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="6 9 12 15 18 9" />
                                                        </svg>
                                                    </button>

                                                    <AnimatePresence>
                                                        {isMobileOpen && (
                                                            <motion.div
                                                                className={styles.mobileSubList}
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                {item.dropdownItems.map((sub) => (
                                                                    <Link
                                                                        key={sub.label}
                                                                        href={sub.href}
                                                                        className={styles.mobileSubLink}
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                    >
                                                                        <div className={styles.subIconWrap}>{sub.icon}</div>
                                                                        <div className={styles.subContent}>
                                                                            <div className={styles.subTitleRow}>
                                                                                <span className={styles.subTitle}>{sub.label}</span>
                                                                                {sub.badge && (
                                                                                    <span className={`${styles.subBadge} ${sub.badge === 'COMING SOON' || sub.badge === 'قريباً' || sub.badge === 'MALAPIT NA' ? styles.comingSoonBadge : ''}`}>
                                                                                        {sub.badge}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <span className={styles.subDesc}>{sub.desc}</span>
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </li>
                                            );
                                        }

                                        return (
                                            <li key={item.label}>
                                                <Link
                                                    href={item.href}
                                                    className={`${styles.drawerLink} ${active ? styles.drawerLinkActive : ''}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <span>{item.label}</span>
                                                    {active && <span className={styles.activeDot} />}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className={styles.drawerDivider} />

                                <div className={styles.drawerToolsRow}>
                                    <LanguageToggle variant="headerNav" />
                                    <ThemeToggle />
                                </div>

                                <div className={styles.drawerCta}>
                                    <Button
                                        text={isLoggedIn ? t('nav.dashboard', 'Dashboard') : t('nav.getStarted', 'Get Started')}
                                        icon={isLoggedIn ? DashboardGridIcon : RightIcon}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            if (isLoggedIn) {
                                                router.push('/dashboard');
                                            } else {
                                                authNavigate(router, '/dashboard');
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
