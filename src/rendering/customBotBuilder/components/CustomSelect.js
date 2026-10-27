'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../customBotBuilder.module.scss';
import { PairDualIcon, TimeframeIcon } from './PairIcons';

export default function CustomSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Select option...',
    hasError = false,
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    // Normalize options format: array of strings or { value, label, category, desc }
    const normalizedOptions = options.map((opt) => {
        if (typeof opt === 'string') {
            return { value: opt, label: opt };
        }
        return opt;
    });

    const selectedOption = normalizedOptions.find(
        (opt) => opt.value === value || String(opt.value) === String(value)
    );

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Auto-scroll selected item into view when dropdown opens
    useEffect(() => {
        if (isOpen && menuRef.current) {
            const selectedEl = menuRef.current.querySelector(`.${styles.optionSelected}`);
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [isOpen]);

    const handleMenuWheel = (e) => {
        // Ensure seamless mouse wheel scrolling on the dropdown menu
        e.stopPropagation();
        if (menuRef.current) {
            menuRef.current.scrollTop += e.deltaY;
        }
    };

    const handleSelect = (val) => {
        if (disabled) return;
        onChange(val);
        setIsOpen(false);
    };

    const renderOptionIcon = (opt) => {
        if (!opt) return null;
        if (opt.icon) return <span className={styles.optionCustomIcon}>{opt.icon}</span>;

        // Check if value/label is a trading pair
        const isPair = ['EUR/USD', 'GBP/USD', 'GBP/JPY', 'EUR/JPY', 'USD/CAD', 'XAU/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF', 'BTC/USD', 'ETH/USD', 'US30', 'NAS100'].some(
            (p) => String(opt.value).startsWith(p) || String(opt.label).startsWith(p)
        );
        if (isPair) {
            return <PairDualIcon pairKey={opt.value || opt.label} size={18} />;
        }

        // Check if value is a timeframe
        const isTimeframe = ['1m', '5m', '15m', '1h', '4h', '1d'].includes(String(opt.value).toLowerCase());
        if (isTimeframe) {
            return <TimeframeIcon size={16} />;
        }

        return null;
    };

    const getCategoryBadgeClass = (category) => {
        if (!category) return '';
        const catLower = String(category).toLowerCase();
        if (catLower.includes('forex')) return styles.badgeForex;
        if (catLower.includes('crypto')) return styles.badgeCrypto;
        if (catLower.includes('commodit') || catLower.includes('gold')) return styles.badgeCommodities;
        if (catLower.includes('indic')) return styles.badgeIndices;
        return '';
    };

    return (
        <div
            className={`${styles.customSelectContainer} ${disabled ? styles.selectDisabled : ''}`}
            ref={dropdownRef}
        >
            <button
                type="button"
                className={`${styles.customSelectTrigger} ${isOpen ? styles.selectOpen : ''} ${hasError ? styles.selectError : ''}`}
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
            >
                <span className={selectedOption ? styles.customSelectValue : styles.customSelectPlaceholder}>
                    {selectedOption && renderOptionIcon(selectedOption)}
                    <span>{selectedOption ? selectedOption.label : placeholder}</span>
                </span>

                <span className={`${styles.customSelectChevron} ${isOpen ? styles.chevronRotate : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={styles.customSelectMenu}
                    onWheel={handleMenuWheel}
                    role="listbox"
                    tabIndex={-1}
                >
                    {normalizedOptions.length === 0 ? (
                        <div className={styles.emptyOptions}>No options available</div>
                    ) : (
                        normalizedOptions.map((opt) => {
                            const isSelected = selectedOption && (opt.value === value || String(opt.value) === String(value));
                            const badgeClass = getCategoryBadgeClass(opt.category);

                            return (
                                <div
                                    key={opt.value}
                                    className={`${styles.customSelectOption} ${isSelected ? styles.optionSelected : ''}`}
                                    onClick={() => handleSelect(opt.value)}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <div className={styles.optionContent}>
                                        {renderOptionIcon(opt)}
                                        <span className={styles.optionLabel}>{opt.label}</span>
                                        {opt.category && (
                                            <span className={`${styles.optionCategoryBadge} ${badgeClass}`}>
                                                {opt.category}
                                            </span>
                                        )}
                                    </div>

                                    {isSelected && (
                                        <span className={styles.selectedCheck}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
