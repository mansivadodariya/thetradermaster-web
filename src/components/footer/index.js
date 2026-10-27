'use client';
import React, { useRef } from 'react';
import styles from './footer.module.scss';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useTabPermission } from '@/lib/useTabPermission';
import { useSocialLinks } from '@/services/socialLinksService';
import SocialIcon from './SocialIcon';

const DarkLogo = "/assets/logo/logoWhite.svg";
const LightLogo = "/assets/logo/logo.svg";

export default function Footer() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { socialLinks } = useSocialLinks();
  const hasPlansPermission = useTabPermission('Subscription Plans');
  const activeLogo = theme === 'light' ? LightLogo : DarkLogo;
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !spotlightRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!containerRef.current || !spotlightRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      spotlightRef.current.style.setProperty('--cursor-x', `${x}px`);
      spotlightRef.current.style.setProperty('--cursor-y', `${y}px`);
    });
  };

  const handleMouseEnter = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty('--hover-opacity', '1');
    }
  };

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty('--hover-opacity', '0');
    }
  };

  return (
    <footer className={styles.footer}>
      <div className='container'>
        {/* Giant Interactive Brand Signature */}
        <div
          ref={containerRef}
          className={styles.brandSignatureSection}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <h2 className={`${styles.signatureTypography} ${styles.baseLayer}`} aria-hidden="true">
            TraderMaster
          </h2>

          <h2
            ref={spotlightRef}
            className={`${styles.signatureTypography} ${styles.spotlightLayer}`}
          >
            TraderMaster
          </h2>
        </div>

        {/* Navigation & Company Links */}
        <div className={styles.topSection}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <Link href="/" aria-label="TraderMaster FrontPage">
                <img src={activeLogo} alt='TraderMaster Logo' />
              </Link>
            </div>
            <p className={styles.brandDesc}>
              {t('footer.brandDesc', 'Institutional-grade AI trading intelligence, neural chart pattern detection, and quantitative execution models built for modern traders.')}
            </p>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} />
              <span>{t('footer.statusOnline', 'AI Trading Desk Online')}</span>
            </div>
          </div>

          {/* 1. Products Column */}
          <div className={styles.navCol}>
            <h4>{t('footer.productsTitle', 'PRODUCTS')}</h4>
            <ul>
              <li><Link href="/ai-chart-scanner">{t('header.products.chartScanner.title', 'AI Chart Scanner')}</Link></li>
              <li><Link href="/ai-market-assistant">{t('header.products.marketAssistant.title', 'AI Market Assistant')}</Link></li>
              <li><Link href="/ai-trading-signal">{t('header.products.strategyHub.title', 'AI Trading Signal')}</Link></li>
            </ul>
          </div>

          {/* 2. Trading Tools Column */}
          <div className={styles.navCol}>
            <h4>{t('footer.tradingToolsTitle', 'TRADING TOOLS')}</h4>
            <ul>
              <li><Link href="/ai-trade-advisor">{t('header.tradingTools.tradeAudit.title', 'AI Past Trade Analyzer')}</Link></li>
              <li><Link href="/custom-bot-builder">{t('header.tradingTools.strategyCreate.title', 'AI Trading Bot Builder')}</Link></li>
              <li><Link href="/backtesting">{t('footer.quantBacktesting', 'Backtesting')}</Link></li>
            </ul>
          </div>

          {/* 3. Company & Resources Column */}
          <div className={styles.navCol}>
            <h4>{t('footer.companyTitle', 'COMPANY')}</h4>
            <ul>
              <li><Link href="/about-us">{t('header.company.aboutUs.title', 'About Us')}</Link></li>
              {hasPlansPermission && (
                <li><Link href="/plans">{t('footer.pricingPlans', 'Pricing Plans')}</Link></li>
              )}
              <li><Link href="/blogs">{t('footer.researchBlogs', 'Research & Blogs')}</Link></li>
              <li><Link href="/market-news">{t('header.company.news.title', 'Market News')}</Link></li>
              <li><Link href="/forex-calculator">{t('header.company.forexCalculator.title', 'Forex Calculator')}</Link></li>
              <li><Link href="/economic-calendar">{t('header.company.economicCalendar.title', 'Economic Calendar')}</Link></li>
              <li><Link href="/white-label">{t('footer.whiteLabel', 'White Label')}</Link></li>
              <li><Link href="/contact-us">{t('footer.contactUs', 'Contact Us')}</Link></li>
              <li><Link href="/customer-support">{t('footer.customerSupport', 'Customer Support')}</Link></li>
            </ul>
          </div>

          {/* 4. Legal Column */}
          <div className={styles.navCol}>
            <h4>{t('footer.legalTitle', 'LEGAL')}</h4>
            <ul>
              <li><Link href="/privacy-policy">{t('footer.privacyPolicy', 'Privacy Policy')}</Link></li>
              <li><Link href="/terms-and-conditions">{t('footer.termsAndConditions', 'Terms & Conditions')}</Link></li>
              <li><Link href="/risk-disclosure">{t('footer.riskDisclosure', 'Risk Disclosure')}</Link></li>
              {/* No Refund Policy */}
              <li><Link href="/no-refund-policy">{t('footer.noRefundPolicy', 'No Refund Policy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.disclaimerSection}>
          <div className={styles.companyRegLine} dir="ltr">
            <strong>The Trader Master</strong> | Dubai Silicon Oasis, IFZA Business Park, Building A1, Dubai, United Arab Emirates (UAE). Reg No: FZ-LLC-2024-CX8901
          </div>
          <p>{t('footer.disclaimerP1')}</p>
          <p>{t('footer.disclaimerP2')}</p>
          <p>{t('footer.disclaimerP3')}</p>
          <p>{t('footer.disclaimerP4')}</p>
          <p>{t('footer.disclaimerP5')}</p>

          <p className={styles.fullDisclaimerLink}>
            {t('footer.disclaimerNotice')}{' '}
            <Link href="/risk-disclosure">{t('footer.riskDisclosure', 'Risk Disclosure')}</Link> {t('common.and', 'and')}{' '}
            <Link href="/terms-and-conditions">{t('footer.termsAndConditions', 'Terms & Conditions')}</Link>.
          </p>
        </div>

        <div className={styles.divider} />

        {/* Bottom Bar */}
        <div className={styles.bottomSection}>
          <p>{t('footer.copyright', '© 2026 The Trader Master. All rights reserved.')}</p>

          <div className={styles.allsociallinks}>
            {socialLinks
              .filter((item) => {
                const p = String(item?.platform || '').toLowerCase().trim();
                const h = String(item?.href || '').toLowerCase().trim();
                if (!p || ['email', 'contact_email', 'support_email', 'phone', 'contact_phone', 'tel', 'address', 'contact_address', 'office_address', 'location'].includes(p)) return false;
                if (h.startsWith('mailto:') || h.startsWith('tel:')) return false;
                return true;
              })
              .map((item, index) => {
              const brandColor = theme === 'light'
                ? (item.lightColor || item.brandColor)
                : (item.darkColor || item.brandColor);

              return (
                <a
                  key={item.platform || index}
                  href={item.href}
                  aria-label={item.label}
                  data-platform={item.platform}
                  className={styles.sociallinks}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    '--brand-color': brandColor,
                    '--brand-hover-bg': item.hoverBg,
                    '--brand-glow': item.glow,
                  }}
                >
                  <SocialIcon
                    platform={item.platform}
                    className={styles.socialIcon}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
