"use client";
import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import styles from './commonCta.module.scss';
import classNames from 'classnames';

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function CommonCta({
  badge,
  title1,
  title2,
  description,
  primaryBtnText,
  primaryBtnAction = "/dashboard",
  primaryBtnIcon,
  secondaryBtnText,
  secondaryBtnAction,
  secondaryBtnIcon,
  className = ""
}) {
  const router = useRouter();
  const { t } = useLanguage();

  const resolvedBadge = badge || t('components.commonCta.badge', 'INSTANT INSTITUTIONAL ACCESS');
  const resolvedTitle1 = title1 || t('components.commonCta.title1', 'Ready to Bring AI to');
  const resolvedTitle2 = title2 !== undefined ? title2 : t('components.commonCta.title2', 'Your Trading Desk?');
  const resolvedDesc = description || t('components.commonCta.subtitle', 'Experience institutional-grade AI chart intelligence, pattern detection, and quantitative strategies in just a few minutes.');
  const resolvedPrimaryText = primaryBtnText || t('common.getStartedNow', 'GET STARTED NOW');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowOpacity = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleMouseEnter = () => {
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    glowOpacity.set(0);
  };

  const handlePrimaryClick = () => {
    if (typeof primaryBtnAction === 'function') {
      primaryBtnAction();
    } else if (typeof primaryBtnAction === 'string') {
      authNavigate(router, primaryBtnAction);
    }
  };

  const handleSecondaryClick = () => {
    if (typeof secondaryBtnAction === 'function') {
      secondaryBtnAction();
    } else if (typeof secondaryBtnAction === 'string') {
      if (secondaryBtnAction.startsWith('#')) {
        const el = document.querySelector(secondaryBtnAction);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        authNavigate(router, secondaryBtnAction);
      }
    }
  };

  const pointerGlowBg = useMotionTemplate`radial-gradient(550px circle at ${mouseX}px ${mouseY}px, rgba(24, 201, 139, 0.24) 0%, rgba(24, 201, 139, 0.08) 45%, transparent 80%)`;

  return (
    <section className={classNames(styles.commonCtaSection, className)}>
      <motion.div
        className={styles.bannerCardFull}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top ambient glow shimmer line */}
        <div className={styles.cardShimmerTop} />

        {/* Dynamic Pointer Following Radial Glow */}
        <motion.div
          className={styles.pointerGlow}
          style={{
            opacity: glowOpacity,
            background: pointerGlowBg
          }}
        />

        <div className="container">
          <div className={styles.content}>
            <SectionHeader
              badge={resolvedBadge}
              title1={resolvedTitle1}
              title2={resolvedTitle2}
              description={resolvedDesc}
            />

            <motion.div
              className={styles.btnWrapper}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                className={styles.ctaPrimaryBtn}
                onClick={handlePrimaryClick}
              >
                <span>{resolvedPrimaryText}</span>
                {primaryBtnIcon || <ArrowRightIcon />}
              </button>

              {secondaryBtnText && (
                <button
                  type="button"
                  className={styles.ctaSecondaryBtn}
                  onClick={handleSecondaryClick}
                >
                  <span>{secondaryBtnText}</span>
                  {secondaryBtnIcon}
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
