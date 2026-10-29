'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/context/LanguageContext';
import { translateResponseText } from '@/lib/translateService';
import { toast } from '@/components/toast';
import styles from './translateButton.module.scss';

import {
    USFlag,
    UAEFlag,
    MoroccoFlag,
    SpainFlag,
    RussiaFlag,
    ChinaFlag,
    VietnamFlag,
    IndonesiaFlag,
    PHFlag
} from '@/icons/countryFlags';

export const TRANSLATE_OPTIONS = [
    { code: 'ru', label: 'Russian', native: 'Русский', Flag: RussiaFlag },
    { code: 'ar', label: 'Arabic', native: 'العربية', Flag: UAEFlag },
    { code: 'ary', label: 'Moroccan Darija', native: 'الدارجة المغربية', Flag: MoroccoFlag },
    { code: 'es', label: 'Spanish', native: 'Español', Flag: SpainFlag },
    { code: 'zh', label: 'Chinese', native: '中文（普通话）', Flag: ChinaFlag },
    { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt', Flag: VietnamFlag },
    { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia', Flag: IndonesiaFlag },
    { code: 'fil', label: 'Filipino', native: 'Filipino', Flag: PHFlag },
    { code: 'en', label: 'English', native: 'English', Flag: USFlag },
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
    onTranslationStart,
    onTranslationError,
    onLanguageChange,
    onSelectLanguage,
    onTranslate,
    isTranslated = false,
    activeLang = null,
    placement = 'top',
    align = 'left',
    className = '',
}) {
    const { language: appLanguage, setLanguage } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [menuCoords, setMenuCoords] = useState(null);
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Resolve effective language code
    const effectiveLang = activeLang || appLanguage || 'en';

    // Resolve default target code based on site language
    const currentTargetCode = useMemo(() => {
        if (effectiveLang && effectiveLang !== 'en') return effectiveLang;
        return 'zh';
    }, [effectiveLang]);

    const activeOption = useMemo(() => {
        if (effectiveLang === 'en') {
            return { code: 'en', label: 'Original (English)', native: 'English', Flag: USFlag };
        }
        return TRANSLATE_OPTIONS.find((opt) => opt.code === effectiveLang) || TRANSLATE_OPTIONS[0];
    }, [effectiveLang]);

    const updateMenuCoords = useCallback(() => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const menuHeight = 290;

        let effectivePlacement = placement;
        if (placement === 'bottom' && spaceBelow < menuHeight && spaceAbove > spaceBelow) {
            effectivePlacement = 'top';
        } else if (placement === 'top' && spaceAbove < menuHeight && spaceBelow > spaceAbove) {
            effectivePlacement = 'bottom';
        }

        const coords = {
            position: 'fixed',
            zIndex: 99999,
        };

        if (effectivePlacement === 'bottom') {
            coords.top = `${rect.bottom + 6}px`;
            coords.bottom = 'auto';
        } else {
            coords.bottom = `${window.innerHeight - rect.top + 6}px`;
            coords.top = 'auto';
        }

        if (align === 'right') {
            const rightVal = Math.max(8, window.innerWidth - rect.right);
            coords.right = `${rightVal}px`;
            coords.left = 'auto';
        } else {
            const leftVal = Math.max(8, Math.min(window.innerWidth - 300, rect.left));
            coords.left = `${leftVal}px`;
            coords.right = 'auto';
        }

        setMenuCoords(coords);
    }, [placement, align]);

    useEffect(() => {
        if (!isMenuOpen) return;
        updateMenuCoords();

        const handleScrollOrResize = () => {
            updateMenuCoords();
        };

        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize);
        return () => {
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isMenuOpen, updateMenuCoords]);

    // Close menu on click outside
    useEffect(() => {
        if (!isMenuOpen) return;
        const handleClickOutside = (e) => {
            const inButton = buttonRef.current && buttonRef.current.contains(e.target);
            const inDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
            if (!inButton && !inDropdown) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => {
            const next = !prev;
            if (next) {
                updateMenuCoords();
            }
            return next;
        });
    };

    const handleExecuteTranslation = async (targetCode) => {
        setIsMenuOpen(false);

        // 1. Immediately synchronize global site language across all visible text
        if (setLanguage && typeof setLanguage === 'function') {
            try {
                setLanguage(targetCode, false);
            } catch (err) {
                console.warn('setLanguage error:', err);
            }
        }

        onLanguageChange?.(targetCode);
        onTranslationStart?.(targetCode);

        // 2. Handle switching back to Original (English)
        if (targetCode === 'en') {
            if (onSelectLanguage) {
                onSelectLanguage('en');
                return;
            }
            if (onTranslate) {
                setIsLoading(true);
                try {
                    await onTranslate('en');
                } finally {
                    setIsLoading(false);
                }
                return;
            }
            onTranslated?.(originalText, 'en', false, true);
            return;
        }

        // 3. Custom select handler
        if (onSelectLanguage) {
            onSelectLanguage(targetCode);
            return;
        }

        // 4. Custom async translate handler
        if (onTranslate) {
            setIsLoading(true);
            try {
                await onTranslate(targetCode);
            } catch (err) {
                console.error('Translation failed:', err);
                onTranslationError?.(err);
                toast.error(err?.message || 'Could not translate content.');
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // 5. Default text translation via Google Translate service
        // Immediately notify with selected language so all surrounding UI updates without waiting
        onTranslated?.('', targetCode, true, false);

        if (!originalText || !originalText.trim()) return;

        setIsLoading(true);

        try {
            const translated = await translateResponseText(originalText, targetCode);
            onTranslated?.(translated, targetCode, true, false);
        } catch (err) {
            console.error('Translation failed:', err);
            onTranslationError?.(err);
        } finally {
            setIsLoading(false);
        }
    };

    const buttonLabel = useMemo(() => {
        if (isLoading) return 'Translating…';
        if (effectiveLang === 'en') {
            return 'Original (English)';
        }
        const matched = TRANSLATE_OPTIONS.find((o) => o.code === effectiveLang);
        if (matched) {
            return matched.native || matched.label;
        }
        return 'Translate';
    }, [isLoading, effectiveLang]);

    const isEnglishSelected = effectiveLang === 'en';

    const menuContent = isMenuOpen && (
        <div
            ref={dropdownRef}
            className={`${styles.languageMenu} ${placement === 'bottom' ? styles.placementBottom : ''} ${align === 'right' ? styles.placementRight : ''}`}
            style={menuCoords || undefined}
            role="menu"
        >
            {/* Show Original Option */}
            <button
                type="button"
                className={`${styles.langMenuItem} ${isEnglishSelected ? styles.isSelected : ''}`}
                onClick={() => handleExecuteTranslation('en')}
                role="menuitem"
            >
                <span className={styles.langLeftPart}>
                    <span className={styles.flagWrap}>
                        <USFlag width={18} height={13} className={styles.flagSvg} />
                    </span>
                    <span>Original (English)</span>
                </span>
                {isEnglishSelected && <CheckIcon size={13} />}
            </button>

            <div className={styles.menuDivider} />
            <div className={styles.menuSectionTitle}>Available Languages</div>

            {/* Scrollable Language List */}
            <div className={styles.langListScroll}>
                {TRANSLATE_OPTIONS.filter((opt) => opt.code !== 'en').map((opt) => {
                    const isCurrent = effectiveLang === opt.code;
                    const FlagComponent = opt.Flag;
                    return (
                        <button
                            key={opt.code}
                            type="button"
                            className={`${styles.langMenuItem} ${isCurrent ? styles.isSelected : ''}`}
                            onClick={() => handleExecuteTranslation(opt.code)}
                            role="menuitem"
                        >
                            <span className={styles.langLeftPart}>
                                <span className={styles.flagWrap}>
                                    <FlagComponent width={18} height={13} className={styles.flagSvg} />
                                </span>
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
        </div>
    );

    return (
        <div className={`${styles.translateButtonGroup} ${className}`}>
            {/* Single Unified Pill Button (Matching Height & Radius of Full Report PDF) */}
            <button
                ref={buttonRef}
                type="button"
                onClick={toggleMenu}
                disabled={isLoading}
                className={`${styles.translateBtn} ${effectiveLang !== 'en' ? styles.isActive : ''}`}
                title="Select language / Show original"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
            >
                {isLoading ? (
                    <SpinnerIcon size={14} />
                ) : effectiveLang === 'en' ? (
                    <span className={styles.btnFlagWrap}>
                        <USFlag width={15} height={11} className={styles.flagSvg} />
                    </span>
                ) : activeOption?.Flag ? (
                    <span className={styles.btnFlagWrap}>
                        <activeOption.Flag width={15} height={11} className={styles.flagSvg} />
                    </span>
                ) : (
                    <TranslateGlobeIcon size={14} />
                )}
                <span>{buttonLabel}</span>
                <ChevronDownMiniIcon
                    size={11}
                    className={`${styles.chevron} ${isMenuOpen ? styles.chevronOpen : ''}`}
                />
            </button>

            {/* Floating Themed Language Dropdown rendered via Portal directly to body */}
            {mounted && isMenuOpen && typeof document !== 'undefined'
                ? createPortal(menuContent, document.body)
                : null}
        </div>
    );
}

export default TranslateResponseButton;
