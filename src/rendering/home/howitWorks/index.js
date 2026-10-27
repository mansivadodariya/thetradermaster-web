"use client";
import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './howitWorks.module.scss';
import Link from 'next/link';
import SectionHeader from '@/components/sectionHeader';
export default function HowitWorks() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [isIntro, setIsIntro] = useState(true);

  const steps = [
    {
      step: '01',
      label: t('homeSections.howItWorks.creatingAccount', 'Creating account'),
      icon: '01',
      title: t('homeSections.howItWorks.createAccount', 'Create Account'),
    },
    {
      step: '02',
      label: t('homeSections.howItWorks.linkingBrokers', 'Linking Top Brokers'),
      icon: '02',
      title: t('homeSections.howItWorks.linkTopBrokers', 'Link Top Brokers'),
    },
    {
      step: '03',
      label: t('homeSections.howItWorks.scanningMarket', 'Scanning market structure'),
      icon: '03',
      title: t('homeSections.howItWorks.askAi', 'Ask the AI'),
    },
    {
      step: '04',
      label: t('homeSections.howItWorks.replenishingCredits', 'Replenishing credits'),
      icon: '04',
      title: t('homeSections.howItWorks.tradeReplenish', 'Trade & Replenish'),
    }
  ];

  useEffect(() => {
    setIsIntro(true);
    const tm = setTimeout(() => setIsIntro(false), 1400);
    return () => clearTimeout(tm);
  }, [activeStep]);

  // Auto-cycle every 6.5s
  useEffect(() => {
    const tm = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6500);
    return () => clearInterval(tm);
  }, [steps.length]);

  const current = steps[activeStep];

  return (
    <section className={styles.howitWorks} aria-label="How TraderMaster Works">
      <div className="container">
        <div className={styles.row}>

          {/* ── LEFT: Text ── */}
          <div className={styles.left}>
            <SectionHeader
              align="left"
              badge={t('homeSections.howItWorks.badge', 'MT5 BROKER INTEGRATION')}
              title1={t('homeSections.howItWorks.title1', 'Trade Your Edge.')}
              title2={t('homeSections.howItWorks.title2', 'Earn Credits. Never Pay for AI.')}
              description={t('homeSections.howItWorks.description', 'Every trade you execute automatically refills your AI analysis credits—giving you unlimited access to institutional market scans, signals, and strategy playbooks for free.')}
            />

            <Link href="/signup" className={styles.cta}>
              {t('homeSections.howItWorks.getStartedFree', 'Get Started Free')} <span>&rarr;</span>
            </Link>

            {/* Step dots indicator */}
            <div className={styles.dots}>
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${activeStep === i ? styles.dotActive : ''}`}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT: TV Screen ── */}
          <div className={styles.right}>
            <div className={styles.tvBox}>
              <AnimatePresence mode="wait">

                {/* Phase 1 — Minimal intro label (LuxAlgo black screen style) */}
                {isIntro ? (
                  <motion.div
                    key={`intro-${activeStep}`}
                    className={styles.introState}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.06 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className={styles.introIcon}>{current.icon}</span>
                    <span className={styles.introLabel}>{current.label}</span>
                  </motion.div>
                ) : (

                  /* Phase 2 — Live simulation */
                  <motion.div
                    key={`sim-${activeStep}`}
                    className={styles.simState}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >

                    {/* ── SCREEN 01 ── */}
                    {activeStep === 0 && (
                      <div className={styles.sim}>
                        <div className={styles.simHead}>
                          <span className={styles.numTag}>01</span>
                          <span className={styles.simTitle}>{t('homeSections.howItWorks.createAccount', 'Create Free Account')}</span>
                          <span className={styles.statusGreen}>● {t('homeSections.howItWorks.active', 'ACTIVE')}</span>
                        </div>
                        <div className={styles.form}>
                          <div className={styles.lbl}>{t('homeSections.howItWorks.emailAddress', 'EMAIL ADDRESS')}</div>
                          <div className={styles.input}>
                            <span>trader@institutional.com</span>
                            <span className={styles.cursor}>|</span>
                          </div>
                          <div className={styles.btn}>
                            <span>{t('homeSections.howItWorks.initWorkspace', 'INITIALIZE AI WORKSPACE')}</span>
                            <span>&rarr;</span>
                          </div>
                        </div>
                        <div className={styles.alert}>
                          <div className={styles.check}>✓</div>
                          <div>
                            <strong>{t('homeSections.howItWorks.instantEmailVerif', 'Instant Email Verification')}</strong>
                            <span className={styles.alertSub}>{t('homeSections.howItWorks.welcomeCredits', '+10 Welcome Starter Credits Claimed')}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SCREEN 02 ── */}
                    {activeStep === 1 && (
                      <div className={styles.sim}>
                        <div className={styles.simHead}>
                          <span className={styles.numTag}>02</span>
                          <span className={styles.simTitle}>{t('homeSections.howItWorks.linkTopBrokers', 'Link MT5 Broker Account')}</span>
                          <span className={styles.statusGreen}>● {t('homeSections.howItWorks.bridgeSynced', 'BRIDGE SYNCED')}</span>
                        </div>
                        <div className={styles.brokerRow}>
                          <div className={styles.brokerLogo}>TB</div>
                          <div>
                            <h4>TOP BROKERS</h4>
                            <p>{t('homeSections.howItWorks.server', 'Server: MT5-LiveBridge01')}</p>
                          </div>
                        </div>
                        <div className={styles.mt5Row}>
                          <span>{t('homeSections.howItWorks.mt5Id', 'MT5 ID:')}</span>
                          <strong>12849021 ({t('homeSections.howItWorks.authenticated', 'Authenticated')})</strong>
                          <span>🔒</span>
                        </div>
                        <div className={styles.reward}>
                          <span className={styles.star}>✦</span>
                          <div>
                            <strong>{t('homeSections.howItWorks.creditsUnlocked', '+50 AI CREDITS UNLOCKED')}</strong>
                            <p>{t('homeSections.howItWorks.autoRefill', 'Direct MT5 Bridge Sync · Auto-Refill on Completed Trades')}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SCREEN 03 ── */}
                    {activeStep === 2 && (
                      <div className={styles.sim}>
                        <div className={styles.simHead}>
                          <span className={styles.numTag}>03</span>
                          <span className={styles.simTitle}>TradeSnap AI &middot; XAU/USD</span>
                          <span className={styles.signal}>▲ {t('homeSections.howItWorks.buySignal', 'BUY SIGNAL')}</span>
                        </div>
                        <div className={styles.chart}>
                          <div className={styles.sessions}>
                            <span>London</span>
                            <span>New York</span>
                          </div>
                          <div className={styles.sessionZone} />
                          <div className={styles.laser} />
                          <div className={styles.candles}>
                            {[32, 22, 48, 64, 30, 78, 96, 45, 60, 38, 82, 55].map((h, i) => (
                              <div
                                key={i}
                                className={`${styles.candle} ${i % 3 === 1 ? styles.red : styles.green}`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                          <div className={styles.callouts}>
                            <span className={styles.tp}>TP: $2,764.50 (+1.8%)</span>
                            <span className={styles.sl}>SL: $2,741.00 (-0.8%)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SCREEN 04 ── */}
                    {activeStep === 3 && (
                      <div className={styles.sim}>
                        <div className={styles.simHead}>
                          <span className={styles.numTag}>04</span>
                          <span className={styles.simTitle}>{t('homeSections.howItWorks.tradeReplenish', 'Perpetual Credit Engine')}</span>
                          <span className={styles.statusGold}>● {t('homeSections.howItWorks.lifetimeLoop', 'LIFETIME LOOP')}</span>
                        </div>
                        <div className={styles.loop}>
                          <div className={styles.ring1} />
                          <div className={styles.ring2} />
                          <div className={styles.loopCenter}>
                            <span className={styles.loopIcon}>⟳</span>
                            <span className={styles.loopNum}>+50</span>
                            <span className={styles.loopLabel}>{t('homeSections.howItWorks.creditsRefreshed', 'CREDITS REFRESHED')}</span>
                          </div>
                        </div>
                        <div className={styles.meta}>
                          <div className={styles.metaRow}>
                            <span>{t('homeSections.howItWorks.tradeExecution', 'Trade Execution:')}</span>
                            <strong className={styles.green}>{t('homeSections.howItWorks.verifiedBroker', 'Verified on Top Brokers MT5')}</strong>
                          </div>
                          <div className={styles.metaRow}>
                            <span>{t('homeSections.howItWorks.creditTopUp', 'Credit Top-Up:')}</span>
                            <strong className={styles.gold}>{t('homeSections.howItWorks.freeRefill', 'Free Instant Refill (+50)')}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
