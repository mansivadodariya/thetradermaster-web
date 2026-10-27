'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from './quickJump.module.scss';
import { supabase } from '@/lib/supabaseClient';
import { fetchVisibleTabNames, getVisibleTabNamesSync } from '@/lib/useTabPermission';
import { getQuickJumpSections, checkItemPermission } from './quickJumpItems';

export default function QuickJump({ isCollapsed = false }) {
    const { t } = useLanguage();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeCategoryKey, setActiveCategoryKey] = useState('all');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [visibleTabNames, setVisibleTabNames] = useState(() => getVisibleTabNamesSync());
    const inputRef = useRef(null);
    const itemRefs = useRef([]);
    const resultsListRef = useRef(null);

    useEffect(() => {
        fetchVisibleTabNames().then(set => {
            if (set) setVisibleTabNames(set);
        });
    }, [isOpen]);

    const sections = useMemo(() => getQuickJumpSections(t), [t]);

    const categories = useMemo(() => {
        const allItemsPermitted = sections.map((sec) => ({
            ...sec,
            items: sec.items.filter((item) => checkItemPermission(item, visibleTabNames))
        }));

        const availableKeys = new Set(allItemsPermitted.filter((s) => s.items.length > 0).map((s) => s.categoryKey));

        const baseCategories = [
            { key: 'all', label: t('quickJump.catAll', 'All') },
            { key: 'trading', label: t('quickJump.catTrading', 'Trading') },
            { key: 'bots', label: t('nav.aiTradingBot', 'AI Trading Bot') },
            { key: 'general', label: t('quickJump.catGeneral', 'General') },
            { key: 'copilot', label: t('quickJump.catCopilot', 'Copilot & AI') },
            { key: 'tools', label: t('quickJump.catTools', 'Tools & Insights') },
            { key: 'account', label: t('quickJump.catAccount', 'Account & Broker') },
        ];

        return baseCategories.filter((cat) => cat.key === 'all' || availableKeys.has(cat.key));
    }, [t, sections, visibleTabNames]);

    // Explicit mouse wheel scrolling support
    const handleListWheel = (e) => {
        if (resultsListRef.current) {
            resultsListRef.current.scrollTop += e.deltaY;
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Open/Close toggle
    const handleOpen = () => {
        setIsOpen(true);
        setQuery('');
        setActiveCategoryKey('all');
        setSelectedIndex(0);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    // Global Cmd+K / Ctrl+K listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filtered results by query AND activeCategoryKey with STRICT permission check
    const filteredSections = useMemo(() => {
        const q = query.trim().toLowerCase();

        return sections.map((section) => {
            // Check if section matches category filter
            if (activeCategoryKey !== 'all' && section.categoryKey !== activeCategoryKey) {
                return { ...section, items: [] };
            }

            const matchedItems = section.items.filter((item) => {
                // Strict permission check: only show if user has permission
                if (!checkItemPermission(item, visibleTabNames)) {
                    return false;
                }

                if (!q) return true;
                return (
                    item.title.toLowerCase().includes(q) ||
                    item.subtitle.toLowerCase().includes(q) ||
                    item.keywords.some((k) => k.toLowerCase().includes(q)) ||
                    section.category.toLowerCase().includes(q)
                );
            });

            return {
                ...section,
                items: matchedItems,
            };
        }).filter((section) => section.items.length > 0);
    }, [query, activeCategoryKey, sections, visibleTabNames]);

    // Flattened items list for keyboard selection
    const flatItems = useMemo(() => {
        return filteredSections.flatMap((sec) => sec.items);
    }, [filteredSections]);

    // Reset selected index when flat items change
    useEffect(() => {
        setSelectedIndex(0);
    }, [query, activeCategoryKey]);

    // Auto-focus input when modal opens & handle body overflow
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            if (typeof window !== 'undefined' && window.lenis) {
                window.lenis.stop();
            }
            setTimeout(() => {
                inputRef.current?.focus();
            }, 60);

            return () => {
                document.body.style.overflow = originalOverflow;
                if (typeof window !== 'undefined' && window.lenis) {
                    window.lenis.start();
                }
            };
        }
    }, [isOpen]);

    // Keyboard navigation inside modal
    const handleModalKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            handleClose();
            return;
        }

        if (flatItems.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % flatItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const target = flatItems[selectedIndex];
            if (target) {
                handleNavigate(target.href);
            }
        }
    };

    // Scroll active item into view
    useEffect(() => {
        if (itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [selectedIndex]);

    const handleNavigate = (href) => {
        handleClose();
        if (typeof href === 'string' && (href.startsWith('http://') || href.startsWith('https://'))) {
            window.open(href, '_blank', 'noopener,noreferrer');
        } else {
            router.push(href);
        }
    };

    // Modal portal content
    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.modalBackdrop} onClick={handleClose}>
                    <motion.div
                        className={styles.modalCard}
                        data-lenis-prevent="true"
                        onWheel={handleListWheel}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.94, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* 1. Search Header Area */}
                        <div className={styles.searchHeaderArea}>
                            <div className={styles.searchIconWrap}>
                                <svg
                                    className={styles.searchIcon}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                className={styles.searchInput}
                                placeholder={t('quickJump.inputPlaceholder', 'Type a page name, bot, or setting...')}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleModalKeyDown}
                            />
                            <div className={styles.headerActions}>
                                {query && (
                                    <button
                                        type="button"
                                        className={styles.clearBtn}
                                        onClick={() => setQuery('')}
                                        title={t('quickJump.clear', 'Clear')}
                                    >
                                        {t('quickJump.clear', 'Clear')}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className={styles.closeBtn}
                                    onClick={handleClose}
                                    title={t('quickJump.close', 'Close (Esc)')}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* 2. Quick Category Filter Chips */}
                        <div className={styles.filterBar}>
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    type="button"
                                    className={`${styles.filterChip} ${activeCategoryKey === cat.key ? styles.filterChipActive : ''}`}
                                    onClick={() => setActiveCategoryKey(cat.key)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* 3. Results / Options List */}
                        <div 
                                ref={resultsListRef} 
                                className={styles.resultsList}
                                onWheel={handleListWheel}
                                data-lenis-prevent="true"
                                tabIndex={0}
                            >
                            {flatItems.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <p>{t('quickJump.noResultsPrefix', 'No matching locations found for')} "{query}"</p>
                                    <span>{t('quickJump.searchHint', 'Try searching for "Trading", "Dashboard", "Strategy", or "Calendar"')}</span>
                                </div>
                            ) : (
                                (() => {
                                    let itemCounter = 0;
                                    return filteredSections.map((section) => (
                                        <div key={section.category} className={styles.sectionGroup}>
                                            <div className={styles.categoryHeader}>
                                                {section.category}
                                            </div>
                                            {section.items.map((item) => {
                                                const currentIndex = itemCounter++;
                                                const isSelected = selectedIndex === currentIndex;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        ref={(el) => (itemRefs.current[currentIndex] = el)}
                                                        className={`${styles.itemRow} ${isSelected ? styles.itemActive : ''}`}
                                                        onClick={() => handleNavigate(item.href)}
                                                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                    >
                                                        <div className={styles.itemLeft}>
                                                            <div className={styles.itemIconWrap}>
                                                                {item.icon}
                                                            </div>
                                                            <div className={styles.itemInfo}>
                                                                <span className={styles.itemTitle}>{item.title}</span>
                                                                <span className={styles.itemSubtitle}>{item.subtitle}</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.itemRight}>
                                                            <span className={styles.categoryTag}>{section.category}</span>
                                                            <div className={styles.actionBadge}>
                                                                <span>{t('quickJump.jump', 'Jump')}</span>
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ));
                                })()
                            )}
                        </div>

                        {/* 4. Footer with Keyboard Hints */}
                        <div className={styles.modalFooter}>
                            <div className={styles.footerHints}>
                                <span className={styles.hintItem}>
                                    <kbd>↑</kbd><kbd>↓</kbd> {t('quickJump.navigateHint', 'Navigate')}
                                </span>
                                <span className={styles.hintItem}>
                                    <kbd>↵</kbd> {t('quickJump.openHint', 'Open')}
                                </span>
                                <span className={styles.hintItem}>
                                    <kbd>esc</kbd> {t('quickJump.closeHint', 'Close')}
                                </span>
                            </div>
                            <div className={styles.footerRight}>
                                <span className={styles.resultsCount}>
                                    {flatItems.length} {flatItems.length === 1 ? t('quickJump.item', 'item') : t('quickJump.items', 'items')}
                                </span>
                                <span className={styles.traderMasterTag}>
                                    <span className={styles.pulsingDot}></span>
                                    TRADERMASTER
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            {/* 1. SIDEBAR TRIGGER BUTTON */}
            {!isCollapsed ? (
                <button
                    type="button"
                    className={styles.triggerBtn}
                    onClick={handleOpen}
                    title={t('quickJump.triggerShortcut', 'Quick jump (⌘K)')}
                >
                    <div className={styles.triggerLeft}>
                        <svg
                            className={styles.triggerIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <span className={styles.triggerText}>{t('quickJump.trigger', 'Quick jump...')}</span>
                    </div>
                    <span className={styles.shortcutBadge}>⌘ K</span>
                </button>
            ) : (
                <button
                    type="button"
                    className={styles.collapsedTriggerBtn}
                    onClick={handleOpen}
                    aria-label={t('quickJump.triggerShortcut', 'Quick jump (⌘K)')}
                >
                    <svg
                        className={styles.triggerIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span className={styles.tooltip}>{t('quickJump.triggerShortcut', 'Quick jump (⌘K)')}</span>
                </button>
            )}

            {/* 2. COMMAND PALETTE POPUP MODAL (RENDERED VIA PORTAL TO BODY FOR PERFECT CENTERING) */}
            {mounted && typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null}
        </>
    );
}
