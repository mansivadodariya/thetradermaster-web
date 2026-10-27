'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../calculator.module.scss';

export default function CustomDropdown({ options = [], value, onChange, placeholder = 'Select...' }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    // Normalize options into { value, label } format
    const normalizedOptions = options.map((opt) => {
        if (typeof opt === 'object' && opt !== null) {
            return {
                value: opt.value ?? opt.id ?? '',
                label: opt.label ?? opt.name ?? String(opt.value),
            };
        }
        return {
            value: String(opt),
            label: String(opt),
        };
    });

    const selectedOption = normalizedOptions.find((opt) => opt.value === value) || {
        value,
        label: value || placeholder,
    };

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
            const selectedEl = menuRef.current.querySelector(`.${styles.isSelected}`);
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [isOpen]);

    const handleSelect = (val) => {
        if (onChange) {
            onChange(val);
        }
        setIsOpen(false);
    };

    const handleMenuWheel = (e) => {
        // Ensure mouse wheel scrolling on the dropdown menu works seamlessly
        e.stopPropagation();
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        const currentIndex = normalizedOptions.findIndex((opt) => opt.value === value);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIdx = Math.min(currentIndex + 1, normalizedOptions.length - 1);
            if (nextIdx >= 0 && normalizedOptions[nextIdx]) {
                handleSelect(normalizedOptions[nextIdx].value);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIdx = Math.max(currentIndex - 1, 0);
            if (prevIdx >= 0 && normalizedOptions[prevIdx]) {
                handleSelect(normalizedOptions[prevIdx].value);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
        }
    };

    return (
        <div className={styles.customDropdown} ref={dropdownRef} onKeyDown={handleKeyDown}>
            <button
                type="button"
                className={`${styles.dropdownTrigger} ${isOpen ? styles.isOpen : ''}`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
            >
                <span className={styles.selectedLabel}>{selectedOption.label}</span>
                <svg
                    className={`${styles.chevronIcon} ${isOpen ? styles.rotated : ''}`}
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

            {isOpen && (
                <div
                    ref={menuRef}
                    className={styles.dropdownMenu}
                    onWheel={handleMenuWheel}
                    tabIndex={-1}
                >
                    {normalizedOptions.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                className={`${styles.dropdownItem} ${isSelected ? styles.isSelected : ''}`}
                                onClick={() => handleSelect(opt.value)}
                            >
                                <span>{opt.label}</span>
                                {isSelected && <span className={styles.checkMark}>✓</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
