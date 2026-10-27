  'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { getTranslation, loadLocaleData, SUPPORTED_LOCALES, RTL_LOCALES, translations, normalizeLocale } from '@/locales';

const LanguageContext = createContext({
  language: 'en',
  dir: 'ltr',
  isRTL: false,
  isPending: false,
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, fallback, variables) => fallback || key,
  tDynamic: (item, keyEn) => '',
});

export const LanguageProvider = ({ children, initialLanguage = 'en' }) => {
  const [language, setLanguageState] = useState(() => {
    // 1. If server passed a valid initialLanguage, use it immediately
    if (initialLanguage && SUPPORTED_LOCALES.includes(initialLanguage)) {
      return initialLanguage;
    }
    if (typeof window !== 'undefined') {
      try {
        // 2. Check URL path prefix (e.g. /ar/dashboard -> 'ar')
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          const pathLang = normalizeLocale(pathSegments[0]);
          if (pathLang && SUPPORTED_LOCALES.includes(pathLang)) {
            return pathLang;
          }
        }

        // 3. Check query param (?lang=ar)
        const urlParams = new URLSearchParams(window.location.search);
        const langQuery = urlParams.get('lang') || urlParams.get('locale');
        if (langQuery) {
          const qLang = normalizeLocale(langQuery);
          if (qLang && SUPPORTED_LOCALES.includes(qLang)) {
            return qLang;
          }
        }

        // 4. Check localStorage
        const stored = localStorage.getItem('app_language');
        const canonical = normalizeLocale(stored);
        if (canonical && SUPPORTED_LOCALES.includes(canonical)) {
          return canonical;
        }

        // 5. Check cookies
        const cookieMatch = document.cookie.match(/(?:^|;\s*)(?:app_language|NEXT_LOCALE)=([^;]+)/);
        if (cookieMatch) {
          const cLang = normalizeLocale(decodeURIComponent(cookieMatch[1]));
          if (cLang && SUPPORTED_LOCALES.includes(cLang)) {
            return cLang;
          }
        }
      } catch (_) {}
    }
    return 'en';
  });
  const [, setLoadedVersion] = useState(0);

  useEffect(() => {
    try {
      let detectedLang = null;

      // 1. Check URL path prefix FIRST (e.g. /arabic, /ar, /es)
      if (typeof window !== 'undefined') {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
          detectedLang = normalizeLocale(pathSegments[0]);
        }
      }

      // 2. Check URL query parameter (e.g. ?lang=arabic or ?lang=ar)
      if (!detectedLang && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const langQuery = urlParams.get('lang') || urlParams.get('locale');
        if (langQuery) {
          detectedLang = normalizeLocale(langQuery);
        }
      }

      // 3. Check user's saved preference in localStorage or cookie
      if (!detectedLang && typeof window !== 'undefined') {
        let storedLang = localStorage.getItem('app_language');
        if (storedLang === 'ph') storedLang = 'fil';
        detectedLang = normalizeLocale(storedLang);

        if (!detectedLang) {
          const cookieMatch = document.cookie.match(/(?:^|;\s*)(?:app_language|NEXT_LOCALE)=([^;]+)/);
          if (cookieMatch) {
            detectedLang = normalizeLocale(decodeURIComponent(cookieMatch[1]));
          }
        }
      }

      const activeLang = detectedLang && SUPPORTED_LOCALES.includes(detectedLang) 
        ? detectedLang 
        : (initialLanguage && SUPPORTED_LOCALES.includes(initialLanguage) ? initialLanguage : 'en');

      setLanguageState(activeLang);
      localStorage.setItem('app_language', activeLang);
      document.cookie = `app_language=${activeLang}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `NEXT_LOCALE=${activeLang}; path=/; max-age=31536000; SameSite=Lax`;

      const isRtl = RTL_LOCALES.includes(activeLang);
      document.documentElement.setAttribute('lang', activeLang);
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

      // Sync address bar URL prefix to match active language without reloading
      if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const firstSeg = pathSegments[0]?.toLowerCase();
        const existingLang = normalizeLocale(firstSeg);
        if (existingLang && existingLang !== activeLang) {
          const cleanSegments = pathSegments.slice(1);
          const newPath = cleanSegments.length > 0 ? `/${activeLang}/${cleanSegments.join('/')}` : `/${activeLang}`;
          const targetFull = `${newPath}${window.location.search}${window.location.hash}`;
          window.history.replaceState({ lang: activeLang }, '', targetFull);
        }
      }

      if (activeLang !== 'en' && !translations[activeLang]) {
        loadLocaleData(activeLang).then(() => {
          setLoadedVersion((v) => v + 1);
        });
      }
    } catch (e) {
      console.warn('Could not initialize language context:', e);
    }
  }, [initialLanguage]);

  const setLanguage = useCallback((lang, updateUrl = true) => {
    const canonical = normalizeLocale(lang);
    if (!canonical || !SUPPORTED_LOCALES.includes(canonical)) return;
    setLanguageState(canonical);
    try {
      localStorage.setItem('app_language', canonical);
      document.cookie = `app_language=${canonical}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `NEXT_LOCALE=${canonical}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }
    if (typeof document !== 'undefined') {
      const isRtl = RTL_LOCALES.includes(canonical);
      document.documentElement.setAttribute('lang', canonical);
      document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

      // Update URL in browser address bar (e.g. /zh, /ar, /es, /en or /zh/about-us)
      if (updateUrl && typeof window !== 'undefined' && window.history) {
        try {
          const currentPath = window.location.pathname;
          const segments = currentPath.split('/').filter(Boolean);
          const firstSeg = segments[0]?.toLowerCase();
          const existingLang = normalizeLocale(firstSeg);
          const cleanSegments = existingLang ? segments.slice(1) : segments;
          
          const newPath = cleanSegments.length > 0 
            ? `/${canonical}/${cleanSegments.join('/')}` 
            : `/${canonical}`;

          const targetFull = `${newPath}${window.location.search}${window.location.hash}`;
          if (targetFull !== `${currentPath}${window.location.search}${window.location.hash}`) {
            window.history.pushState({ lang: canonical }, '', targetFull);
          }
        } catch (err) {
          console.warn('Could not update browser history URL:', err);
        }
      }
    }

    if (canonical !== 'en' && !translations[canonical]) {
      loadLocaleData(canonical).then(() => {
        setLoadedVersion((v) => v + 1);
      });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const urlLang = pathSegments.length > 0 ? normalizeLocale(pathSegments[0]) : null;
      if (urlLang && SUPPORTED_LOCALES.includes(urlLang)) {
        setLanguage(urlLang, false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setLanguage]);

  const toggleLanguage = useCallback(() => {
    const currentIndex = SUPPORTED_LOCALES.indexOf(language);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length;
    setLanguage(SUPPORTED_LOCALES[nextIndex]);
  }, [language, setLanguage]);

  const t = useCallback((key, fallback = '', variables = null) => {
    return getTranslation(language, key, fallback, variables);
  }, [language]);

  /** Helper to translate dynamic backend data objects (e.g. backend fields with _en / _ar / _es etc.) */
  const tDynamic = useCallback((item, fieldEn = 'title', fieldAr, fieldPh) => {
    if (!item) return '';
    const localizedKey = fieldEn + '_' + language;
    if (item[localizedKey]) return item[localizedKey];
    
    // Legacy fallbacks
    if (language === 'ar' && fieldAr && item[fieldAr]) return item[fieldAr];
    if ((language === 'fil' || language === 'ph') && fieldPh && item[fieldPh]) return item[fieldPh];

    return item[fieldEn] || item[fieldEn + '_en'] || item[fieldAr] || item[fieldPh] || '';
  }, [language]);

  const isRTL = RTL_LOCALES.includes(language);
  const dir = isRTL ? 'rtl' : 'ltr';

  const value = useMemo(() => ({
    language,
    dir,
    isRTL,
    isPending: false,
    setLanguage,
    toggleLanguage,
    t,
    tDynamic
  }), [language, dir, isRTL, setLanguage, toggleLanguage, t, tDynamic]);

  return (
    <LanguageContext.Provider value={{ language, dir, isRTL, isPending: false, setLanguage, toggleLanguage, t, tDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);