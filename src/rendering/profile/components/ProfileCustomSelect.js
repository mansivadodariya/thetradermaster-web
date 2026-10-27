'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../profile.module.scss';

export default function ProfileCustomSelect({
    value,
    onChange,
    options = [],
    placeholder = 'Select option...',
    className = '',
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    // Normalize options format: array of strings or { value, label }
    const normalizedOptions = options.map((opt) => {
        if (typeof opt === 'string') {
            return { value: opt, label: opt };
        }
        return opt;
    });

    const selectedOption = normalizedOptions.find(
        (opt) => opt.value === value || String(opt.value) === String(value)
    ) || {
        value,
        label: value || placeholder
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            dropdownRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
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
        if (disabled) return;
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div
            className={`${styles.customSelectWrapper} ${className} ${disabled ? styles.disabled : ''}`}
            ref={dropdownRef}
        >
            <button
                type="button"
                className={`${styles.customSelectTrigger} ${isOpen ? styles.open : ''}`}
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
            >
                <span className={styles.customSelectLabel}>
                    {selectedOption.label || placeholder}
                </span>
                <span className={`${styles.customSelectChevron} ${isOpen ? styles.rotate : ''}`}>
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
                    {normalizedOptions.map((opt) => {
                        const isSelected = opt.value === value || String(opt.value) === String(value);
                        return (
                            <div
                                key={opt.value}
                                className={`${styles.customSelectOption} ${isSelected ? styles.selected : ''}`}
                                onClick={() => handleSelect(opt.value)}
                                role="option"
                                aria-selected={isSelected}
                            >
                                <span>{opt.label}</span>
                                {isSelected && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
