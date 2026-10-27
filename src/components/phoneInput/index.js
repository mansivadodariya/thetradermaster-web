'use client';
import React, { useState, useRef, useEffect } from 'react';
import PhoneInputLib, { getCountryCallingCode } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'libphonenumber-js/min';
import 'react-phone-number-input/style.css';
import { useLanguage } from '@/context/LanguageContext';
import styles from './phoneInput.module.scss';

/**
 * Custom Country Select Component with modern TraderMaster dropdown UI
 */
const CustomCountrySelect = ({ value, onChange, options, disabled, iconComponent: FlagIcon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const handleWheelScroll = (e) => {
        if (listRef.current) {
            listRef.current.scrollTop += e.deltaY;
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        } else {
            setSearch('');
        }
    }, [isOpen]);

    const filteredOptions = (options || []).filter((opt) => {
        if (!opt.value) return false;
        const name = opt.label || '';
        let callingCode = '';
        try {
            callingCode = getCountryCallingCode(opt.value);
        } catch {
            callingCode = '';
        }
        const query = search.toLowerCase().trim();
        if (!query) return true;
        return (
            name.toLowerCase().includes(query) ||
            callingCode.includes(query) ||
            opt.value.toLowerCase().includes(query)
        );
    });

    return (
        <div className={styles.customCountryPicker} ref={containerRef}>
            <button
                type="button"
                className={styles.countryTrigger}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                title="Select Country"
            >
                <div className={styles.triggerFlag}>
                    {FlagIcon && value ? <FlagIcon country={value} label={value} /> : null}
                </div>
                <svg
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M1 1L5 5L9 1"
                        stroke="#18C98B"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className={styles.countryDropdownMenu}
                    role="listbox"
                    onWheel={handleWheelScroll}
                >
                    <div className={styles.searchBox}>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#18C98B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={t('components.phone.searchCountryOrCode', 'Search country or code...')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                            autoComplete="off"
                        />
                        {search && (
                            <button
                                type="button"
                                className={styles.clearSearchBtn}
                                onClick={() => setSearch('')}
                                title={t('components.phone.clear', 'Clear')}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div
                        className={styles.countryList}
                        ref={listRef}
                        onWheel={handleWheelScroll}
                    >
                        {filteredOptions.length === 0 ? (
                            <div className={styles.noResults}>{t('components.phone.noCountriesFound', 'No countries found')}</div>
                        ) : (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value === value;
                                let callingCode = '';
                                try {
                                    callingCode = getCountryCallingCode(opt.value);
                                } catch {
                                    callingCode = '';
                                }

                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={`${styles.countryItem} ${isSelected ? styles.countryItemSelected : ''}`}
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        <div className={styles.itemFlag}>
                                            {FlagIcon ? <FlagIcon country={opt.value} label={opt.label} /> : null}
                                        </div>
                                        <span className={styles.countryName}>{opt.label}</span>
                                        {callingCode && (
                                            <span className={styles.callingCode}>+{callingCode}</span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * PhoneInput — webapp version
 */
export default function PhoneInput({

    label,
    value,
    onChange,
    error,
    placeholder = 'Phone number',
    disabled = false,
    defaultCountry = 'AE',
    maxLength = 20,
    limitMaxLength = true,
    numberInputProps,
    ...rest
}) {
    const [country, setCountry] = useState(defaultCountry || 'AE');
    const [internalError, setInternalError] = useState('');

    function handleChange(val) {
        if (internalError) setInternalError('');
        onChange(val);
    }

    function handleBlur() {
        if (!value) return;
        const valid = isValidPhoneNumber(value);
        if (!valid) {
            setInternalError('Enter a valid phone number for the selected country');
        }
    }

    const displayError = error || internalError;

    return (
        <div className={styles.phoneField}>
            {label && <label className={styles.label}>{label}</label>}
            <div
                className={`${styles.wrapper} ${displayError ? styles.hasError : ''} ${disabled ? styles.disabled : ''}`}
            >
                <PhoneInputLib
                    international
                    limitMaxLength={limitMaxLength}
                    defaultCountry={defaultCountry}
                    country={country}
                    onCountryChange={(c) => {
                        setCountry(c || 'AE');
                        if (value && internalError) setInternalError('');
                    }}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={styles.phoneInput}
                    countrySelectComponent={CustomCountrySelect}
                    numberInputProps={{
                        maxLength,
                        ...numberInputProps,
                    }}
                    {...rest}
                />
            </div>
            {displayError && <p className={styles.errorMsg}>{displayError}</p>}
        </div>
    );
}
