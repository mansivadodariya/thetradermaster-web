'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../whiteLabel.module.scss';

export default function WhiteLabelCustomSelect({
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option...',
    hasError = false,
    icon = null,
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    // Normalize options format
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

    const handleMenuWheel = (e) => {
        e.stopPropagation();
        if (menuRef.current) {
            menuRef.current.scrollTop += e.deltaY;
        }
    };

    const handleSelect = (val) => {
        if (disabled) return;
        onChange({ target: { name, value: val } });
        setIsOpen(false);
    };

    return (
        <div
            className={`${styles.customSelectWrapper} ${disabled ? styles.selectDisabled : ''}`}
            ref={dropdownRef}
        >
            <button
                type="button"
                className={`${styles.customSelectBtn} ${icon ? styles.withIcon : ''} ${isOpen ? styles.selectBtnOpen : ''} ${hasError ? styles.inputError : ''}`}
                onClick={() => !disabled && setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                disabled={disabled}
            >
                {icon && <span className={styles.fieldIcon}>{icon}</span>}

                <span className={selectedOption ? styles.selectValueText : styles.selectPlaceholderText}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <span className={`${styles.selectChevron} ${isOpen ? styles.chevronOpen : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={styles.customSelectDropdown}
                    onWheel={handleMenuWheel}
                >
                    <ul className={styles.selectOptionsList} role="listbox">
                        {normalizedOptions.map((opt) => {
                            const isSelected = selectedOption && selectedOption.value === opt.value;
                            return (
                                <li
                                    key={opt.value}
                                    className={`${styles.selectOptionItem} ${isSelected ? styles.optionSelected : ''}`}
                                    onClick={() => handleSelect(opt.value)}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <span>{opt.label}</span>
                                    {isSelected && (
                                        <svg className={styles.optionCheckIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
