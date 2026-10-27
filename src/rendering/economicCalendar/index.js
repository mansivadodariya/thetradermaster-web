"use client";

import React, { useEffect, useRef } from "react";
import CommonSectionHeader from '@/components/CommonSectionHeader';
import styles from "./economicCalendar.module.scss";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function EconomicCalendar() {
  const widgetContainerRef = useRef(null);
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    if (!widgetContainerRef.current) return;

    // Determine current theme from context or document attribute
    const currentTheme = theme === 'light' || (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light')
      ? 'light'
      : 'dark';

    // Clear and restore TradingView widget DOM structure
    widgetContainerRef.current.innerHTML = `
      <div class="tradingview-widget-container__widget" style="width: 100%; height: 720px;"></div>
    `;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: currentTheme,
      isTransparent: false,
      width: "100%",
      height: "720",
      locale: language === 'ar' ? 'ar' : 'en',
      importanceFilter: "-1,0,1",
      countryFilter: "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu"
    });

    widgetContainerRef.current.appendChild(script);

    return () => {
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = "";
      }
    };
  }, [language, theme]);

  return (
    <section className={styles.economicCalendar}>
      <CommonSectionHeader
        as="h1"
        badge="MACROECONOMIC EVENT RADAR"
        badgeIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        }
        title={t('nav.economicCalendar', 'Economic Calendar')}
        subtitle={t('economicCalendar.subtitle', 'Track global market-moving events in real time and plan your trades around key macro releases.')}
        isCard={true}
      />

      <div className={styles.widgetCard}>
        <div className="tradingview-widget-container" ref={widgetContainerRef}>
          <div className="tradingview-widget-container__widget" />
          <div className="tradingview-widget-copyright">
            <a href="https://www.tradingview.com/economic-calendar/" rel="noopener nofollow" target="_blank">
              Economic Calendar by TradingView
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
