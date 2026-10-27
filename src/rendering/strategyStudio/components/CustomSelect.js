'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import { ChevronDownIcon } from './StudioIcons';

export default function CustomSelect({
    value,
    onChange,
    options = [],
    groups = null,
    placeholder = 'Select option...',
    width = 'auto',
    align = 'left',
    searchable = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    // Normalize flat options
    const normalizedOptions = useMemo(() => {
        if (groups && groups.length > 0) {
            return groups.flatMap((g) =>
                (g.indicators || g.options || []).map((opt) => {
                    if (typeof opt === 'string') return { value: opt, label: opt, group: g.group };
                    return {
                        value: opt.value ?? opt.name,
                        label: opt.label ?? opt.name,
                        group: g.group,
                    };
                })
            );
        }
        return (options || []).map((opt) => {
            if (typeof opt === 'string') {
                return { value: opt, label: opt };
            }
            return {
                value: opt.value,
                label: opt.label || String(opt.value),
            };
        });
    }, [options, groups]);

    const selectedOption = normalizedOptions.find(
        (opt) => String(opt.value) === String(value)
    ) || {
        value,
        label: value != null && value !== '' ? String(value) : placeholder,
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleMenuWheel = (e) => {
        e.stopPropagation();
        if (menuRef.current) {
            menuRef.current.scrollTop += e.deltaY;
        }
    };

    const handleSelect = (val) => {
        onChange?.(val);
        setIsOpen(false);
        setSearchTerm('');
    };

    const hasSearch = searchable || (groups && groups.length > 0) || normalizedOptions.length > 10;
    const lowerSearch = searchTerm.trim().toLowerCase();

    // Filtered items when searching
    const filteredGroups = useMemo(() => {
        if (!groups || groups.length === 0) return null;
        if (!lowerSearch) return groups;
        return groups
            .map((g) => ({
                ...g,
                items: (g.indicators || g.options || []).filter((opt) => {
                    const l = (opt.label || opt.name || opt.value || '').toLowerCase();
                    const v = String(opt.value || opt.name || '').toLowerCase();
                    return l.includes(lowerSearch) || v.includes(lowerSearch);
                }),
            }))
            .filter((g) => (g.items && g.items.length > 0) || (g.indicators && g.indicators.length > 0));
    }, [groups, lowerSearch]);

    const filteredFlatOptions = useMemo(() => {
        if (groups && groups.length > 0) return [];
        if (!lowerSearch) return normalizedOptions;
        return normalizedOptions.filter((opt) => {
            const l = (opt.label || '').toLowerCase();
            const v = String(opt.value || '').toLowerCase();
            return l.includes(lowerSearch) || v.includes(lowerSearch);
        });
    }, [groups, normalizedOptions, lowerSearch]);

    return (
        <div
            className={styles.customSelectContainer}
            ref={dropdownRef}
            style={{ width }}
        >
            <button
                type="button"
                className={`${styles.customSelectTrigger} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={styles.customSelectValue}>
                    {selectedOption.label || placeholder}
                </span>
                <span className={`${styles.customSelectChevron} ${isOpen ? styles.rotate : ''}`}>
                    <ChevronDownIcon size={13} />
                </span>
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={`${styles.customSelectMenu} ${align === 'right' ? styles.alignRight : ''}`}
                    onWheel={handleMenuWheel}
                    role="listbox"
                    tabIndex={-1}
                >
                    {hasSearch && (
                        <input
                            type="text"
                            className={styles.customSelectSearch}
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    )}

                    {/* Grouped rendering */}
                    {filteredGroups ? (
                        filteredGroups.length === 0 ? (
                            <div style={{ padding: '8px 12px', fontSize: '11px', color: '#94a3b8' }}>
                                No matching options
                            </div>
                        ) : (
                            filteredGroups.map((g, gIdx) => (
                                <div key={gIdx} className={styles.customSelectGroup}>
                                    <div className={styles.customSelectGroupLabel}>{g.group}</div>
                                    {(g.items || g.indicators || g.options || []).map((opt) => {
                                        const optVal = opt.value ?? opt.name;
                                        const optLabel = opt.label ?? opt.name;
                                        const isSelected = String(optVal) === String(value);
                                        return (
                                            <div
                                                key={optVal}
                                                className={`${styles.customSelectOption} ${isSelected ? styles.selected : ''}`}
                                                onClick={() => handleSelect(optVal)}
                                                role="option"
                                                aria-selected={isSelected}
                                            >
                                                <span>{optLabel}</span>
                                                {isSelected && <span className={styles.selectedDot} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )
                    ) : (
                        /* Flat list rendering */
                        filteredFlatOptions.length === 0 ? (
                            <div style={{ padding: '8px 12px', fontSize: '11px', color: '#94a3b8' }}>
                                No matching options
                            </div>
                        ) : (
                            filteredFlatOptions.map((opt) => {
                                const isSelected = String(opt.value) === String(value);
                                return (
                                    <div
                                        key={opt.value}
                                        className={`${styles.customSelectOption} ${isSelected ? styles.selected : ''}`}
                                        onClick={() => handleSelect(opt.value)}
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && <span className={styles.selectedDot} />}
                                    </div>
                                );
                            })
                        )
                    )}
                </div>
            )}
        </div>
    );
}
