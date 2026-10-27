'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from './languageToggle.module.scss';

/* Crisp Vector Flags for Supported Languages */
const USFlag = () => (
  <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagSvg} aria-hidden="true">
    <g fillRule="evenodd">
      <path fill="#bd3d44" d="M0 0h640v480H0z"/>
      <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"/>
      <path fill="#192f5d" d="M0 0h260v260H0z"/>
      <circle cx="45" cy="45" r="16" fill="#fff"/>
      <circle cx="130" cy="45" r="16" fill="#fff"/>
      <circle cx="215" cy="45" r="16" fill="#fff"/>
      <circle cx="87.5" cy="87.5" r="16" fill="#fff"/>
      <circle cx="172.5" cy="87.5" r="16" fill="#fff"/>
      <circle cx="45" cy="130" r="16" fill="#fff"/>
      <circle cx="130" cy="130" r="16" fill="#fff"/>
      <circle cx="215" cy="130" r="16" fill="#fff"/>
      <circle cx="87.5" cy="172.5" r="16" fill="#fff"/>
      <circle cx="172.5" cy="172.5" r="16" fill="#fff"/>
      <circle cx="45" cy="215" r="16" fill="#fff"/>
      <circle cx="130" cy="215" r="16" fill="#fff"/>
      <circle cx="215" cy="215" r="16" fill="#fff"/>
    </g>
  </svg>
);

const UAEFlag = () => (
  <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagSvg} aria-hidden="true">
    <path fill="#00732f" d="M0 0h640v160H0z"/>
    <path fill="#ffffff" d="M0 160h640v160H0z"/>
    <path fill="#000000" d="M0 320h640v160H0z"/>
    <path fill="#ff0000" d="M0 0h160v480H0z"/>
  </svg>
);

const MoroccoFlag = () => (
  <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagSvg} aria-hidden="true">
    <path fill="#c1272d" d="M0 0h640v480H0z"/>
    <path fill="none" stroke="#006233" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" d="M320 120 L370 270 L240 180 L400 180 L270 270 Z"/>
  </svg>
);

const SpainFlag = () => (
  <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagSvg} aria-hidden="true">
    <path fill="#aa151b" d="M0 0h640v480H0z"/>
    <path fill="#f1bf00" d="M0 120h640v240H0z"/>
  </svg>
);

const RussiaFlag = () => (
  <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagSvg} aria-hidden="true">
    <path fill="#ffffff" d="M0 0h640v160H0z"/>
    <path fill="#0039a6" d="M0 160h640v160H0z"/>
    <path fill="#d52b1e" d="M0 320h640v160H0z"/>
  </svg>
);

const ChinaFlag = () => (
  <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagSvg} aria-hidden="true">
    <path fill="#de2910" d="M0 0h640v480H0z"/>
    <polygon fill="#ffde00" points="120,60 135,108 185,108 145,138 160,185 120,155 80,185 95,138 55,108 105,108"/>
    <circle cx="210" cy="50" r="14" fill="#ffde00"/>
    <circle cx="250" cy="90" r="14" fill="#ffde00"/>
    <circle cx="250" cy="150" r="14" fill="#ffde00"/>
    <circle cx="210" cy="190" r="14" fill="#ffde00"/>
  </svg>
);

const VietnamFlag = () => (
  <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagSvg} aria-hidden="true">
    <path fill="#da251d" d="M0 0h640v480H0z"/>
    <polygon fill="#ffff00" points="320,130 355,238 468,238 376,305 412,412 320,345 228,412 264,305 172,238 285,238"/>
  </svg>
);

const IndonesiaFlag = () => (
  <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagSvg} aria-hidden="true">
    <path fill="#ce1126" d="M0 0h640v240H0z"/>
    <path fill="#ffffff" d="M0 240h640v240H0z"/>
  </svg>
);

const PHFlag = () => (
  <svg width="18" height="13" viewBox="0 0 640 480" className={styles.flagSvg} aria-hidden="true">
    <path fill="#0038a8" d="M0 0h640v240H0z"/>
    <path fill="#ce1126" d="M0 240h640v240H0z"/>
    <path fill="#fff" d="M0 0l277.1 240L0 480z"/>
    <circle cx="92" cy="240" r="32" fill="#fcd116"/>
    <circle cx="35" cy="120" r="12" fill="#fcd116"/>
    <circle cx="35" cy="360" r="12" fill="#fcd116"/>
    <circle cx="210" cy="240" r="12" fill="#fcd116"/>
  </svg>
);

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', Flag: USFlag },
  { code: 'ar', label: 'UAE / Arabic', native: 'العربية', Flag: UAEFlag },
  { code: 'ary', label: 'Moroccan Darija', native: 'الدارجة المغربية', Flag: MoroccoFlag },
  { code: 'es', label: 'Spanish', native: 'Español', Flag: SpainFlag },
  { code: 'ru', label: 'Russian', native: 'Русский', Flag: RussiaFlag },
  { code: 'zh', label: 'Chinese', native: '中文（普通话）', Flag: ChinaFlag },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt', Flag: VietnamFlag },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia', Flag: IndonesiaFlag },
  { code: 'fil', label: 'Filipino', native: 'Filipino', Flag: PHFlag },
];

export default function LanguageToggle({ className = '', variant = 'default' }) {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({});
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl' || document.dir === 'rtl';
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const isSmall = vw < 540;
    const targetWidth = isSmall ? Math.min(vw - 20, 330) : Math.min(vw - 24, 490);

    // Dynamic alignment: right-anchor with button, clamped within viewport edges
    let left = rect.right - targetWidth;
    if (left < 12) {
      left = 12;
    }
    if (left + targetWidth > vw - 12) {
      left = Math.max(12, vw - targetWidth - 12);
    }

    const spaceBelow = vh - rect.bottom - 12;
    const top = rect.bottom + 8;

    setMenuPosition({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      right: 'auto',
      bottom: 'auto',
      width: `${targetWidth}px`,
      maxHeight: `${Math.max(180, spaceBelow)}px`,
      zIndex: 99999,
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        (!menuRef.current || !menuRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen && wrapperRef.current) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang, false);
    setIsOpen(false);

    try {
      const currentPath = (typeof window !== 'undefined' ? window.location.pathname : pathname) || '/';
      const segments = currentPath.split('/').filter(Boolean);
      const firstSeg = segments[0]?.toLowerCase();
      const isFirstSegLocale = ['en', 'ar', 'ary', 'es', 'ru', 'zh', 'vi', 'id', 'fil', 'arabic', 'spanish', 'russian', 'chinese', 'vietnamese', 'indonesian', 'filipino', 'darija'].includes(firstSeg);
      const cleanSegments = isFirstSegLocale ? segments.slice(1) : segments;
      const newPath = cleanSegments.length > 0 ? `/${lang}/${cleanSegments.join('/')}` : `/${lang}`;
      router.push(newPath);
    } catch (e) {
      console.warn('Could not navigate to localized path:', e);
    }
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const CurrentFlag = currentLang.Flag;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} ref={wrapperRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className={[styles.toggleButton, styles[variant], isOpen ? styles.btnActive : ''].filter(Boolean).join(' ')}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <span className={styles.flagWrap}>
          <CurrentFlag />
        </span>
        
        <span className={styles.label}>
          {currentLang.native}
        </span>

        <span className={[styles.chevronIcon, isOpen ? styles.rotated : ''].filter(Boolean).join(' ')}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className={styles.dropdownMenu}
            style={menuPosition}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {LANGUAGES.map((item) => {
              const ItemFlag = item.Flag;
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  className={[styles.dropdownOption, isSelected ? styles.activeOption : ''].filter(Boolean).join(' ')}
                  onClick={() => handleSelectLanguage(item.code)}
                >
                  <div className={styles.optionLeft}>
                    <span className={styles.flagWrap}>
                      <ItemFlag />
                    </span>
                    <div className={styles.textWrap}>
                      <span className={styles.optionLabel}>{item.native}</span>
                      <span className={styles.optionSubLabel}>{item.label}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
