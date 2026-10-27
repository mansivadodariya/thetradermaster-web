"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './aiAnalyst.module.scss';
import SectionHeader from '@/components/sectionHeader';
import StreamingText from '@/components/streamingText';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { authNavigate } from '@/lib/authRedirect';
import StreamingWords from './components/StreamingWords';
import DedicatedChartRenderer from './components/DedicatedChartRenderer';
import { tabPresets, tabKeys, featurePoints } from './constants/analystData';
export default function AiAnalyst() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const terminalLogo = theme === 'light' ? "/assets/logo/logo.svg" : "/assets/logo/logoWhite.svg";
  const [activeSidebarTab, setActiveSidebarTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [activePill, setActivePill] = useState('XAU/USD Breakout');
  const [userInteractedUntil, setUserInteractedUntil] = useState(0);
  const chatBodyRef = useRef(null);

  // Auto-scroll chat body on content updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Initialize with initial tab preset
  useEffect(() => {
    const preset = tabPresets.chat;
    setMessages([
      { role: 'user', text: preset.user, time: preset.time },
      {
        role: 'bot',
        time: preset.time,
        intro: preset.intro,
        bullets: preset.bullets,
        chartData: preset.chartData,
        pills: preset.pills
      }
    ]);
  }, []);

  // Continuous Automatic Dialogue Sequence (User query ➔ Thinking ➔ Bot streaming response ➔ Pause ➔ Next)
  useEffect(() => {
    const timer = setInterval(() => {
      // If user recently clicked/typed, pause auto-loop for 14 seconds
      if (Date.now() < userInteractedUntil) {
        return;
      }

      setActiveSidebarTab((currTab) => {
        const nextIdx = (tabKeys.indexOf(currTab) + 1) % tabKeys.length;
        const nextKey = tabKeys[nextIdx];
        const preset = tabPresets[nextKey];
        setActivePill(preset.pills[0]);

        // 1. Post user question
        setMessages([{ role: 'user', text: preset.user, time: preset.time }]);
        setIsThinking(true);

        // 2. Transition from thinking to streaming bot response
        setTimeout(() => {
          setIsThinking(false);
          setMessages([
            { role: 'user', text: preset.user, time: preset.time },
            {
              role: 'bot',
              time: preset.time,
              intro: preset.intro,
              bullets: preset.bullets,
              chartData: preset.chartData,
              pills: preset.pills
            }
          ]);
        }, 850);

        return nextKey;
      });
    }, 9500);

    return () => clearInterval(timer);
  }, [userInteractedUntil]);

  // Handle Tab Click by User
  const handleTabClick = (tabKey) => {
    setUserInteractedUntil(Date.now() + 15000);
    setActiveSidebarTab(tabKey);
    const preset = tabPresets[tabKey] || tabPresets.chat;
    setActivePill(preset.pills[0]);
    
    setMessages([{ role: 'user', text: preset.user, time: preset.time }]);
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      setMessages([
        { role: 'user', text: preset.user, time: preset.time },
        {
          role: 'bot',
          time: preset.time,
          intro: preset.intro,
          bullets: preset.bullets,
          chartData: preset.chartData,
          pills: preset.pills
        }
      ]);
    }, 600);
  };

  // Handle Quick Prompt Pill Click
  const handleQuickPrompt = (pillText) => {
    setUserInteractedUntil(Date.now() + 15000);
    setActivePill(pillText);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: 'user', text: `Explain live confluence for: ${pillText}`, time: timeNow }]);
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const activeTabObj = tabPresets[activeSidebarTab] || tabPresets.chat;
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          time: timeNow,
          intro: `Real-time structural breakdown for ${pillText}:`,
          bullets: activeTabObj.bullets,
          chartData: activeTabObj.chartData,
          pills: activeTabObj.pills
        }
      ]);
    }, 600);
  };

  // Handle Custom Query Submission -> Redirect to Market Assistant or Login
  const handleSendMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = userInput.trim();
    const target = query
      ? `/market-assistant?prompt=${encodeURIComponent(query)}`
      : '/market-assistant';
    authNavigate(router, target);
  };

  return (
    <section className={styles.aiAnalystSection} aria-label="TraderMaster AI Market Assistant Section">
      <div className="container">
        <div className={styles.mainGrid}>
          
          {/* Left Column: Interactive Chat Terminal */}
          <motion.div 
            className={styles.terminalColumn}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.terminalContainer}>
              
              {/* Left Sidebar Navigation Dock */}
              <aside className={styles.sidebarDock} aria-label="Market Assistant Mode Switcher">
                <div className={styles.sidebarTopGroup}>
                  
                  {/* 1. Chat Tab (Breakout Setup) */}
                  <div className={styles.dockItemWrapper}>
                    {activeSidebarTab === 'chat' && <span className={styles.activeTabGlowPill} />}
                    <button
                      type="button"
                      onClick={() => handleTabClick('chat')}
                      className={`${styles.dockIconBtn} ${activeSidebarTab === 'chat' ? styles.activeDockBtn : ''}`}
                      title="AI Market Assistant (XAU/USD Breakout)"
                      aria-label="AI Market Assistant"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </button>
                  </div>

                  {/* 2. Chart Tab (EUR/USD Confluence) */}
                  <div className={styles.dockItemWrapper}>
                    {activeSidebarTab === 'chart' && <span className={styles.activeTabGlowPill} />}
                    <button
                      type="button"
                      onClick={() => handleTabClick('chart')}
                      className={`${styles.dockIconBtn} ${activeSidebarTab === 'chart' ? styles.activeDockBtn : ''}`}
                      title="MT5 Strategy Confluence (EUR/USD)"
                      aria-label="MT5 Strategy Confluence"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3v18h18"/>
                        <path d="m7 14 4-4 4 2 5-6"/>
                      </svg>
                    </button>
                  </div>

                  {/* 3. Sliders Tab (GBP/USD FVG Retest) */}
                  <div className={styles.dockItemWrapper}>
                    {activeSidebarTab === 'sliders' && <span className={styles.activeTabGlowPill} />}
                    <button
                      type="button"
                      onClick={() => handleTabClick('sliders')}
                      className={`${styles.dockIconBtn} ${activeSidebarTab === 'sliders' ? styles.activeDockBtn : ''}`}
                      title="Real-Time FVG Scanner (GBP/USD)"
                      aria-label="Real-Time FVG Scanner"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"/>
                        <line x1="4" y1="10" x2="4" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12" y2="3"/>
                        <line x1="20" y1="21" x2="20" y2="16"/>
                        <line x1="20" y1="12" x2="20" y2="3"/>
                        <line x1="1" y1="14" x2="7" y2="14"/>
                        <line x1="9" y1="8" x2="15" y2="8"/>
                        <line x1="17" y1="16" x2="23" y2="16"/>
                      </svg>
                    </button>
                  </div>

                  {/* 4. Report Tab (Trade Audit) */}
                  <div className={styles.dockItemWrapper}>
                    {activeSidebarTab === 'report' && <span className={styles.activeTabGlowPill} />}
                    <button
                      type="button"
                      onClick={() => handleTabClick('report')}
                      className={`${styles.dockIconBtn} ${activeSidebarTab === 'report' ? styles.activeDockBtn : ''}`}
                      title="AI Past Trade Performance Audit"
                      aria-label="AI Past Trade Performance Audit"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                    </button>
                  </div>

                </div>

                {/* Bottom Settings Icon */}
                <div className={styles.sidebarBottomGroup}>
                  <button type="button" className={styles.dockIconBtn} title="Terminal Settings" aria-label="Settings">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </button>
                </div>
              </aside>

              {/* Main Chat Interface */}
              <div className={styles.terminalMain}>
                
                {/* Top Header Bar */}
                <header className={styles.terminalHeader}>
                  <div className={styles.brandTitleRow}>
                    <img src={terminalLogo} alt="TraderMaster" className={styles.terminalLogoImg} />
                    <span className={styles.headerDivider}>|</span>
                    <span className={styles.headerSubtitle}>{t('homeSections.aiAnalyst.aiAssistantTitle', 'AI MARKET ASSISTANT')}</span>
                  </div>

                  <div className={styles.onlineStatusBadge}>
                    <span className={styles.statusDotGreen} />
                    <span className={styles.statusLabel}>{t('homeSections.aiAnalyst.aiOnline', 'AI ONLINE')}</span>
                  </div>
                </header>

                {/* Chat Scroll Viewport */}
                <div 
                  ref={chatBodyRef} 
                  className={styles.chatBody}
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        className={msg.role === 'user' ? styles.userRowWrapper : styles.botRowWrapper}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        {msg.role === 'user' ? (
                          /* Right-aligned User Bubble */
                          <div className={styles.userBubbleCard}>
                            <div className={styles.userAvatar}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                              </svg>
                            </div>
                            <div className={styles.userBubbleBody}>
                              <div className={styles.userHeaderName}>{t('homeSections.aiAnalyst.userYou', 'You')}</div>
                              <div className={styles.userQueryText}>{msg.text}</div>
                              <div className={styles.userTimestampRow}>
                                <span>{msg.time || "10:24 AM"}</span>
                                <span className={styles.checkMarks}>✓✓</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* TraderMaster AI Luminescent Glowing Response Card */
                          <div className={styles.aiResponseCard}>
                            
                            {/* Header row */}
                            <div className={styles.aiCardHeaderRow}>
                              <div className={styles.aiProfileCluster}>
                                <div className={styles.sparkleBadge}>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                                  </svg>
                                </div>
                                <span className={styles.aiBotName}>{t('homeSections.aiAnalyst.botName', 'TraderMaster Assistant')}</span>
                                <span className={styles.verifiedSignalBadge}>
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="8" x2="12" y2="16"/>
                                    <line x1="8" y1="12" x2="16" y2="12"/>
                                  </svg>
                                  {t('homeSections.aiAnalyst.verifiedSignal', 'VERIFIED SIGNAL')}
                                </span>
                              </div>

                              <span className={styles.aiCardTime}>{msg.time || "10:24 AM"}</span>
                            </div>

                            {/* Headline intro text with Word-by-Word Streaming animation */}
                            <div className={styles.aiHeadlineIntro}>
                              <StreamingText 
                                text={msg.intro} 
                                speed={20} 
                                isActive={i === messages.length - 1} 
                              />
                            </div>

                            {/* Technical Analysis Bullets */}
                            {msg.bullets && (
                              <div className={styles.analysisBulletsList}>
                                {msg.bullets.map((bullet, bIdx) => (
                                  <div key={bIdx} className={styles.bulletItem}>
                                    <span className={styles.bulletPoint}>◆</span>
                                    <span className={styles.bulletText}>
                                      <StreamingText 
                                        text={bullet} 
                                        speed={22} 
                                        delay={300 + bIdx * 250}
                                        isActive={i === messages.length - 1} 
                                      />
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Tailored Candlestick & Technical Chart Renderer */}
                            {msg.chartData && (
                              <DedicatedChartRenderer chartData={msg.chartData} />
                            )}

                            {/* Sources & Filter Pills Row */}
                            <div className={styles.sourcesPillRow}>
                              <div className={styles.sourcesBtn}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14 2 14 8 20 8"/>
                                  <line x1="16" y1="13" x2="8" y2="13"/>
                                  <line x1="16" y1="17" x2="8" y2="17"/>
                                </svg>
                                {t('homeSections.aiAnalyst.sources', 'Sources')}
                              </div>

                              {msg.pills?.map((pill, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => handleQuickPrompt(pill)}
                                  className={`${styles.filterPill} ${activePill === pill ? styles.activeFilterPill : ''}`}
                                >
                                  {pill}
                                </button>
                              ))}
                            </div>

                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Thinking Status Indicator */}
                  {isThinking && (
                    <motion.div 
                      className={styles.thinkingRow}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className={styles.sparkleBadgeSmall}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                        </svg>
                      </div>
                      <span className={styles.thinkingText}>{t('homeSections.aiAnalyst.scanningFlow', 'SCANNING INSTITUTIONAL ORDER FLOW & VOLUMES...')}</span>
                    </motion.div>
                  )}
                </div>

                {/* Bottom Interactive Chat Input Bar */}
                <form onSubmit={handleSendMessage} className={styles.chatInputContainer}>
                  <button type="button" className={styles.attachmentBtn} aria-label="Attach File">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                  </button>

                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={t('homeSections.aiAnalyst.inputPlaceholder', 'Ask TraderMaster Assistant anything...')}
                    className={styles.terminalInput}
                  />

                  <button type="button" className={styles.micBtn} aria-label="Voice Input">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  </button>

                  <button type="submit" onClick={handleSendMessage} className={styles.terminalSendBtn} aria-label="Send">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#040605" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </form>

              </div>

            </div>
          </motion.div>

          {/* Right Column: Section Header & Feature Points */}
          <motion.div 
            className={styles.contentColumn}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionHeader
              align="left"
              badge={t('homeSections.aiAnalyst.badge', 'TRADERMASTER · AI MARKET ASSISTANT')}
              title1={t('homeSections.aiAnalyst.title1', 'AI on Top of Verified Data.')}
              title2={t('homeSections.aiAnalyst.title2', 'Not Instead of It.')}
              description={t('homeSections.aiAnalyst.description', 'Raw signals and setups originate from real-time market data and quantitative algorithms. TraderMaster translates complex charts into plain English—explaining exactly why a setup triggered, filtering market scans, and validating your risk parameters in milliseconds.')}
            />

            {/* Feature List Points */}
            <div className={styles.featureList}>
              {featurePoints.map((item, index) => {
                const pointNum = index + 1;
                return (
                  <div key={index} className={styles.featureItem}>
                    <div className={styles.numBadge}>{item.num}</div>
                    <div className={styles.featureContent}>
                      <h3>{t(`homeSections.aiAnalyst.point${pointNum}Title`, item.title)}</h3>
                      <p>{t(`homeSections.aiAnalyst.point${pointNum}Desc`, item.desc)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
