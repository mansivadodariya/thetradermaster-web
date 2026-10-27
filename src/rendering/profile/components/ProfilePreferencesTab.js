'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from '@/components/toast';
import styles from '../styles/preferencesTab.module.scss';
import ProfileCustomSelect from './ProfileCustomSelect';

const TIMEZONE_OPTIONS = [
    { value: 'browser', label: 'Auto (Browser Local Time)' },
    { value: 'UTC', label: 'UTC (Universal Coordinated Time)' },
    { value: 'America/New_York', label: 'New York (EST / EDT)' },
    { value: 'Europe/London', label: 'London (GMT / BST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
];

const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'USDT', label: 'USDT (₮)' }
];

/* Crisp Vector Flags for All 9 Supported Languages */
const USFlag = () => (
    <svg viewBox="0 0 640 480" aria-hidden="true">
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
        </g>
    </svg>
);

const UAEFlag = () => (
    <svg viewBox="0 0 640 480" aria-hidden="true">
        <path fill="#00732f" d="M0 0h640v160H0z"/>
        <path fill="#ffffff" d="M0 160h640v160H0z"/>
        <path fill="#000000" d="M0 320h640v160H0z"/>
        <path fill="#ff0000" d="M0 0h160v480H0z"/>
    </svg>
);

const MoroccoFlag = () => (
    <svg viewBox="0 0 640 480" aria-hidden="true">
        <path fill="#c1272d" d="M0 0h640v480H0z"/>
        <path fill="none" stroke="#006233" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" d="M320 120 L370 270 L240 180 L400 180 L270 270 Z"/>
    </svg>
);

const SpainFlag = () => (
    <svg viewBox="0 0 640 480" aria-hidden="true">
        <path fill="#aa151b" d="M0 0h640v480H0z"/>
        <path fill="#f1bf00" d="M0 120h640v240H0z"/>
    </svg>
);

const RussiaFlag = () => (
    <svg viewBox="0 0 640 480" aria-hidden="true">
        <path fill="#ffffff" d="M0 0h640v160H0z"/>
        <path fill="#0039a6" d="M0 160h640v160H0z"/>
        <path fill="#d52b1e" d="M0 320h640v160H0z"/>
    </svg>
);

const ChinaFlag = () => (
    <svg viewBox="0 0 640 480" aria-hidden="true">
        <path fill="#de2910" d="M0 0h640v480H0z"/>
        <polygon fill="#ffde00" points="120,60 135,108 185,108 145,138 160,185 120,155 80,185 95,138 55,108 105,108"/>
        <circle cx="210" cy="50" r="14" fill="#ffde00"/>
        <circle cx="250" cy="90" r="14" fill="#ffde00"/>
        <circle cx="250" cy="150" r="14" fill="#ffde00"/>
        <circle cx="210" cy="190" r="14" fill="#ffde00"/>
    </svg>
);

const VietnamFlag = () => (
    <svg viewBox="0 0 640 480" aria-hidden="true">
        <path fill="#da251d" d="M0 0h640v480H0z"/>
        <polygon fill="#ffff00" points="320,130 355,238 468,238 376,305 412,412 320,345 228,412 264,305 172,238 285,238"/>
    </svg>
);

const IndonesiaFlag = () => (
    <svg viewBox="0 0 640 480" aria-hidden="true">
        <path fill="#ce1126" d="M0 0h640v240H0z"/>
        <path fill="#ffffff" d="M0 240h640v240H0z"/>
    </svg>
);

const PHFlag = () => (
    <svg viewBox="0 0 640 480" aria-hidden="true">
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

export default function ProfilePreferencesTab({ t }) {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme, toggleTheme } = useTheme();

    const [soundEnabled, setSoundEnabled] = useState(true);
    const [chartTimezone, setChartTimezone] = useState('browser');
    const [currency, setCurrency] = useState('USD');
    const [emailAlerts, setEmailAlerts] = useState(true);

    useEffect(() => {
        try {
            const savedSound = localStorage.getItem('app_sound_enabled');
            if (savedSound !== null) setSoundEnabled(savedSound === 'true');

            const savedTz = localStorage.getItem('app_timezone');
            if (savedTz) setChartTimezone(savedTz);

            const savedCurr = localStorage.getItem('app_currency_pref');
            if (savedCurr) setCurrency(savedCurr);

            const savedEmail = localStorage.getItem('app_email_alerts');
            if (savedEmail !== null) setEmailAlerts(savedEmail === 'true');
        } catch (_) {}
    }, []);

    const handleThemeSelect = (selectedTheme, event) => {
        if (setTheme) {
            setTheme(selectedTheme, event);
        } else if (theme !== selectedTheme && toggleTheme) {
            toggleTheme(event);
        }
        toast.success(
            selectedTheme === 'dark'
                ? t?.('profile.darkThemeEnabled', 'Dark mode activated') || 'Dark mode activated'
                : t?.('profile.lightThemeEnabled', 'Light mode activated') || 'Light mode activated'
        );
    };

    const handleLanguageSelect = (langCode) => {
        if (langCode === language) return;
        setLanguage(langCode);
        const langObj = LANGUAGES.find(l => l.code === langCode);
        toast.success(
            `${t?.('profile.languageUpdated', 'Language updated to') || 'Language updated to'} ${langObj?.native || langCode}`
        );
    };

    const handleSoundToggle = () => {
        const next = !soundEnabled;
        setSoundEnabled(next);
        try { localStorage.setItem('app_sound_enabled', String(next)); } catch (_) {}
        toast.success(next ? 'Sound effects enabled' : 'Sound effects muted');
    };

    const handleTimezoneChange = (e) => {
        const val = e.target.value;
        setChartTimezone(val);
        try { localStorage.setItem('app_timezone', val); } catch (_) {}
        toast.success('Timezone preference saved');
    };

    const handleCurrencyChange = (e) => {
        const val = e.target.value;
        setCurrency(val);
        try { localStorage.setItem('app_currency_pref', val); } catch (_) {}
        toast.success('Currency preference saved');
    };

    const handleEmailAlertsToggle = () => {
        const next = !emailAlerts;
        setEmailAlerts(next);
        try { localStorage.setItem('app_email_alerts', String(next)); } catch (_) {}
        toast.success(next ? 'AI alert emails enabled' : 'AI alert emails disabled');
    };

    return (
        <div className={styles.preferencesPanel}>
            {/* Page Header */}
            <div className={styles.panelHeader}>
                <h3>{t?.('profile.preferencesTitle', 'Account & Platform Preferences') || 'Account & Platform Preferences'}</h3>
                <p>
                    {t?.(
                        'profile.preferencesDesc',
                        'Customize your interface appearance, platform language, notification alerts, and market chart parameters.'
                    ) || 'Customize your interface appearance, platform language, notification alerts, and market chart parameters.'}
                </p>
            </div>

            {/* 1. Appearance / Theme */}
            <div className={styles.prefSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionIconWrap}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                        </svg>
                    </div>
                    <div className={styles.sectionText}>
                        <h4>{t?.('profile.themeSettings', 'Interface Theme') || 'Interface Theme'}</h4>
                        <p>{t?.('profile.themeDesc', 'Select your preferred visual styling across all trading charts and workspaces.') || 'Select your preferred visual styling across all trading charts and workspaces.'}</p>
                    </div>
                </div>

                <div className={styles.themeGrid}>
                    {/* Dark Theme Card */}
                    <div
                        className={`${styles.themeCard} ${theme === 'dark' ? styles.themeActive : ''}`}
                        onClick={(e) => handleThemeSelect('dark', e)}
                        role="button"
                        tabIndex={0}
                    >
                        <div className={`${styles.themePreview} ${styles.darkPreview}`}>
                            <div className={styles.previewNav}>
                                <span />
                                <span />
                                <span />
                            </div>
                            <div className={styles.previewChart} />
                        </div>
                        <div className={styles.themeInfoRow}>
                            <div className={styles.themeTitleCol}>
                                <span className={styles.themeName}>{t?.('profile.darkMode', 'Dark Theme') || 'Dark Theme'}</span>
                                <span className={styles.themeSub}>{t?.('profile.darkThemeSub', 'High contrast trading desk') || 'High contrast trading desk'}</span>
                            </div>
                            <div className={`${styles.checkCircle} ${theme === 'dark' ? styles.checked : ''}`}>
                                {theme === 'dark' && '✓'}
                            </div>
                        </div>
                    </div>

                    {/* Light Theme Card */}
                    <div
                        className={`${styles.themeCard} ${theme === 'light' ? styles.themeActive : ''}`}
                        onClick={(e) => handleThemeSelect('light', e)}
                        role="button"
                        tabIndex={0}
                    >
                        <div className={`${styles.themePreview} ${styles.lightPreview}`}>
                            <div className={styles.previewNav}>
                                <span />
                                <span />
                                <span />
                            </div>
                            <div className={styles.previewChart} />
                        </div>
                        <div className={styles.themeInfoRow}>
                            <div className={styles.themeTitleCol}>
                                <span className={styles.themeName}>{t?.('profile.lightMode', 'Light Theme') || 'Light Theme'}</span>
                                <span className={styles.themeSub}>{t?.('profile.lightThemeSub', 'Crisp high-legibility layout') || 'Crisp high-legibility layout'}</span>
                            </div>
                            <div className={`${styles.checkCircle} ${theme === 'light' ? styles.checked : ''}`}>
                                {theme === 'light' && '✓'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Platform Language */}
            <div className={styles.prefSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionIconWrap}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    </div>
                    <div className={styles.sectionText}>
                        <h4>{t?.('profile.languageSettings', 'Platform Language') || 'Platform Language'}</h4>
                        <p>{t?.('profile.languageDesc', 'Choose your localized language. Direction (LTR / RTL) updates automatically.') || 'Choose your localized language. Direction (LTR / RTL) updates automatically.'}</p>
                    </div>
                </div>

                <div className={styles.languagesGrid}>
                    {LANGUAGES.map((item) => {
                        const isSelected = language === item.code;
                        const FlagComponent = item.Flag;
                        return (
                            <div
                                key={item.code}
                                className={`${styles.languageCard} ${isSelected ? styles.languageActive : ''}`}
                                onClick={() => handleLanguageSelect(item.code)}
                                role="button"
                                tabIndex={0}
                            >
                                <div className={styles.flagWrap}>
                                    <FlagComponent />
                                </div>
                                <div className={styles.langInfo}>
                                    <span className={styles.langNative}>{item.native}</span>
                                    <span className={styles.langEn}>{item.label}</span>
                                </div>
                                {isSelected && <span className={styles.activeCheck}>✓</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Trading & Regional Parameters */}
            <div className={styles.prefSection}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionIconWrap}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </div>
                    <div className={styles.sectionText}>
                        <h4>{t?.('profile.additionalPref', 'Regional & Notification Settings') || 'Regional & Notification Settings'}</h4>
                        <p>{t?.('profile.additionalPrefDesc', 'Configure timezone mapping, account notification pings, and audio feedback.') || 'Configure timezone mapping, account notification pings, and audio feedback.'}</p>
                    </div>
                </div>

                <div className={styles.prefList}>
                    {/* Timezone Selection */}
                    <div className={`${styles.prefRow} ${styles.prefRowSelect}`}>
                        <div className={styles.prefRowLeft}>
                            <div className={styles.rowIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div className={styles.prefRowText}>
                                <span className={styles.rowTitle}>{t?.('profile.defaultTz', 'Default Market Timezone') || 'Default Market Timezone'}</span>
                                <span className={styles.rowDesc}>{t?.('profile.defaultTzSub', 'Align candlestick timestamp grids with your primary trading session.') || 'Align candlestick timestamp grids with your primary trading session.'}</span>
                            </div>
                        </div>
                        <div className={`${styles.prefRowRight} ${styles.timezoneSelect}`}>
                            <ProfileCustomSelect
                                value={chartTimezone}
                                onChange={(val) => handleTimezoneChange({ target: { value: val } })}
                                options={TIMEZONE_OPTIONS}
                            />
                        </div>
                    </div>

                    {/* Currency Display Preference */}
                    <div className={`${styles.prefRow} ${styles.prefRowSelect}`}>
                        <div className={styles.prefRowLeft}>
                            <div className={styles.rowIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                            <div className={styles.prefRowText}>
                                <span className={styles.rowTitle}>{t?.('profile.displayCurrency', 'Primary Display Currency') || 'Primary Display Currency'}</span>
                                <span className={styles.rowDesc}>{t?.('profile.displayCurrencySub', 'Symbol formatting for compute estimates and invoices.') || 'Symbol formatting for compute estimates and invoices.'}</span>
                            </div>
                        </div>
                        <div className={`${styles.prefRowRight} ${styles.currencySelect}`}>
                            <ProfileCustomSelect
                                value={currency}
                                onChange={(val) => handleCurrencyChange({ target: { value: val } })}
                                options={CURRENCY_OPTIONS}
                            />
                        </div>
                    </div>

                    {/* Sound Effects Toggle */}
                    <div className={styles.prefRow}>
                        <div className={styles.prefRowLeft}>
                            <div className={styles.rowIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </svg>
                            </div>
                            <div className={styles.prefRowText}>
                                <span className={styles.rowTitle}>{t?.('profile.soundEffects', 'Sound Effects & Alerts') || 'Sound Effects & Alerts'}</span>
                                <span className={styles.rowDesc}>{t?.('profile.soundEffectsSub', 'Auditory alerts on AI inference completion and trade signals.') || 'Auditory alerts on AI inference completion and trade signals.'}</span>
                            </div>
                        </div>
                        <div className={styles.prefRowRight}>
                            <label className={styles.switch}>
                                <input type="checkbox" checked={soundEnabled} onChange={handleSoundToggle} />
                                <span className={styles.slider} />
                            </label>
                        </div>
                    </div>

                    {/* AI Email Alerts */}
                    <div className={styles.prefRow}>
                        <div className={styles.prefRowLeft}>
                            <div className={styles.rowIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <div className={styles.prefRowText}>
                                <span className={styles.rowTitle}>{t?.('profile.emailReports', 'AI Digest & Email Reports') || 'AI Digest & Email Reports'}</span>
                                <span className={styles.rowDesc}>{t?.('profile.emailReportsSub', 'Receive daily trade summary analysis directly to your registered email.') || 'Receive daily trade summary analysis directly to your registered email.'}</span>
                            </div>
                        </div>
                        <div className={styles.prefRowRight}>
                            <label className={styles.switch}>
                                <input type="checkbox" checked={emailAlerts} onChange={handleEmailAlertsToggle} />
                                <span className={styles.slider} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
