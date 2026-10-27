'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translateResponseText } from '@/lib/translateService';
import { toast } from '@/components/toast';
import styles from './translateButton.module.scss';

export const TRANSLATE_OPTIONS = [
    { code: 'ru', label: 'Russian', native: 'Русский', flag: '🇷🇺' },
    { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: 'ary', label: 'Moroccan Darija', native: 'الدارجة', flag: '🇲🇦' },
    { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'zh', label: 'Chinese', native: '中文', flag: '🇨🇳' },
    { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'fil', label: 'Filipino', native: 'Filipino', flag: '🇵🇭' },
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
];

const TranslateGlobeIcon = ({ size = 14, color = 'currentColor', className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const ChevronDownMiniIcon = ({ size = 11, color = 'currentColor', className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const CheckIcon = ({ size = 13, color = '#18C98B' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const SpinnerIcon = ({ size = 13, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.spinAnimation}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export function TranslateResponseButton({
    originalText,
    onTranslated,
    isTranslated = false,
    activeLang = null,
    className = '',
}) {
    const { language: appLanguage } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Resolve default target code based on site language
    const currentTargetCode = useMemo(() => {
        if (activeLang && activeLang !== 'en') return activeLang;
        if (appLanguage && appLanguage !== 'en') return appLanguage;
        return 'ru';
    }, [activeLang, appLanguage]);

    const activeOption = useMemo(() => {
        return TRANSLATE_OPTIONS.find((opt) => opt.code === currentTargetCode) || TRANSLATE_OPTIONS[0];
    }, [currentTargetCode]);

    // Close menu on click outside
    useEffect(() => {
        if (!isMenuOpen) return;
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const handleExecuteTranslation = async (targetCode) => {
        if (!originalText || !originalText.trim()) return;

        if (targetCode === 'en') {
            setIsMenuOpen(false);
            onTranslated?.(originalText, 'en', false, true);
            return;
        }

        setIsLoading(true);
        setIsMenuOpen(false);

        try {
            const translated = await translateResponseText(originalText, targetCode);
            onTranslated?.(translated, targetCode, true, false);
        } catch (err) {
            console.error('Translation failed:', err);
            toast.error(err?.message || 'Could not translate message.');
        } finally {
            setIsLoading(false);
        }
    };

    const buttonLabel = useMemo(() => {
        if (isLoading) return 'Translating…';
        if (isTranslated && activeLang && activeLang !== 'en') {
            return `${activeOption.flag || ''} ${activeOption.native || activeOption.label}`.trim();
        }
        if (appLanguage && appLanguage !== 'en') {
            const siteOpt = TRANSLATE_OPTIONS.find((o) => o.code === appLanguage);
            return `Translate (${siteOpt?.native || siteOpt?.label || 'Auto'})`;
        }
        return 'Translate';
    }, [isLoading, isTranslated, activeLang, activeOption, appLanguage]);

    return (
        <div className={`${styles.translateButtonGroup} ${className}`} ref={menuRef}>
            {/* Single Unified Pill Button (Matching Height & Radius of Full Report PDF) */}
            <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                disabled={isLoading}
                className={`${styles.translateBtn} ${isTranslated ? styles.isActive : ''}`}
                title="Select language / Show original"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
            >
                {isLoading ? (
                    <SpinnerIcon size={14} />
                ) : (
                    <TranslateGlobeIcon size={14} />
                )}
                <span>{buttonLabel}</span>
                <ChevronDownMiniIcon
                    size={11}
                    className={`${styles.chevron} ${isMenuOpen ? styles.chevronOpen : ''}`}
                />
            </button>

            {/* Floating Themed Language Dropdown */}
            {isMenuOpen && (
                <div className={styles.languageMenu} role="menu">
                    {/* Show Original Option */}
                    <button
                        type="button"
                        className={`${styles.langMenuItem} ${!isTranslated ? styles.isSelected : ''}`}
                        onClick={() => handleExecuteTranslation('en')}
                        role="menuitem"
                    >
                        <span className={styles.langLeftPart}>
                            <span className={styles.langFlag}>🇬🇧</span>
                            <span>Original (English)</span>
                        </span>
                        {!isTranslated && <CheckIcon size={13} />}
                    </button>

                    <div className={styles.menuDivider} />
                    <div className={styles.menuSectionTitle}>Available Languages</div>

                    {/* Language List */}
                    {TRANSLATE_OPTIONS.filter((opt) => opt.code !== 'en').map((opt) => {
                        const isCurrent = isTranslated && activeLang === opt.code;
                        return (
                            <button
                                key={opt.code}
                                type="button"
                                className={`${styles.langMenuItem} ${isCurrent ? styles.isSelected : ''}`}
                                onClick={() => handleExecuteTranslation(opt.code)}
                                role="menuitem"
                            >
                                <span className={styles.langLeftPart}>
                                    <span className={styles.langFlag}>{opt.flag}</span>
                                    <span>{opt.label}</span>
                                </span>
                                <span className={styles.langNativeWrap}>
                                    <span className={styles.langNativeLabel}>{opt.native}</span>
                                    {isCurrent && <CheckIcon size={13} />}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default TranslateResponseButton;
