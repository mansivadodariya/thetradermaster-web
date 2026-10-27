"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { navigateFeature } from '@/lib/authRedirect';
import styles from './capabilities.module.scss';
import SectionHeader from '@/components/sectionHeader';

export default function Capabilities() {
  const { t } = useLanguage();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className={styles.capabilitiesSection}>
      <div className="container">

        {/* Section Header */}
        <SectionHeader
          align="split"
          badge={t('homeSections.capabilities.badge', 'PLATFORM CAPABILITIES')}
          title1={t('homeSections.capabilities.title1', 'Four Tools.')}
          title2={t('homeSections.capabilities.title2', 'One Intelligent Cockpit.')}
          description={t('homeSections.capabilities.description', 'Four integrated AI modules. One unified workflow. Scan high-conviction setups, consult your real-time AI advisor, deploy verified strategies, and simulate performance before putting capital at risk.')}
        />

        {/* Connected Cockpit Grid Container */}
        <div className={styles.cockpitContainer}>

          {/* Card 1: Heat List Algorithm (AI Chart Scanner) */}
          <div
            className={`${styles.cockpitCard} ${hoveredIndex === 0 ? styles.cardActive : ''} ${hoveredIndex !== null && hoveredIndex !== 0 ? styles.cardDimmed : ''}`}
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => router.push('/ai-chart-scanner')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push('/ai-chart-scanner');
              }
            }}
          >
            <div className={styles.cardTwoPartSplit}>
              {/* Left Side: Metadata & Description */}
              <div className={styles.cardLeftData}>
                <div className={styles.cardHeaderMeta}>
                  <div className={styles.topRowHeader}>
                    <div className={styles.capLabelRow}>
                      <span className={styles.watermarkNum}>01</span>
                    </div>
                  </div>
                  <h3>{t('homeSections.capabilities.card1Title', 'AI CHART SCANNER')}</h3>
                </div>

                <div className={styles.cardFooter}>
                  <p className={styles.cardDesc}>
                    {t('homeSections.capabilities.card1Desc', 'Instant market screening, technical pattern detection, and high-conviction chart vision.')}
                  </p>
                </div>

              </div>

              {/* Right Side: Interactive Animation Box (Candlestick / Signal Box) */}
              <div className={styles.cardRightAnim}>
                <div className={`${styles.widgetBox} ${hoveredIndex === 0 ? styles.widgetActive : ''}`}>
                  <div className={styles.widgetTopRow}>
                    <span className={styles.tickerText}>XAU/USD · 1H</span>
                    <span className={styles.proTag}>BUY/SELL · PRO</span>
                  </div>

                  <div className={styles.candlestickArea}>
                    {/* Floating BUY Badge */}
                    <div className={`${styles.buyBadge} ${hoveredIndex === 0 ? styles.buyBadgeActive : ''}`}>
                      BUY · 0.94
                      <span className={styles.beaconDot}></span>
                    </div>

                    <svg viewBox="0 0 240 135" className={styles.candleSvg}>
                      {hoveredIndex === 0 ? (
                        <g>
                          <motion.path
                            d="M 28 104 Q 90 84 152 50 T 208 24"
                            fill="none"
                            stroke="#6EE7B7"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            filter="drop-shadow(0 0 10px rgba(24, 201, 139, 0.95))"
                          />

                          <g className={styles.growingCandle}>
                            <line x1="28" y1="84" x2="28" y2="124" stroke="#EF4444" strokeWidth="1.5" />
                            <motion.rect
                              x="22"
                              y="92"
                              width="12"
                              height="24"
                              fill="#EF4444"
                              rx="2"
                              initial={{ scaleY: 0.3 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.35, delay: 0.02 }}
                              style={{ transformOrigin: "28px 116px" }}
                            />
                          </g>

                          <g className={styles.growingCandle}>
                            <line x1="64" y1="74" x2="64" y2="114" stroke="#EF4444" strokeWidth="1.5" />
                            <motion.rect
                              x="58"
                              y="82"
                              width="12"
                              height="22"
                              fill="#EF4444"
                              rx="2"
                              initial={{ scaleY: 0.3 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.35, delay: 0.08 }}
                              style={{ transformOrigin: "64px 104px" }}
                            />
                          </g>

                          <g className={styles.growingCandle}>
                            <line x1="100" y1="58" x2="100" y2="98" stroke="#34D399" strokeWidth="1.5" />
                            <motion.rect
                              x="94"
                              y="66"
                              width="12"
                              height="24"
                              fill="#34D399"
                              rx="2"
                              initial={{ scaleY: 0.3 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.35, delay: 0.14 }}
                              style={{ transformOrigin: "100px 90px" }}
                            />
                          </g>

                          <g className={styles.growingCandle}>
                            <line x1="136" y1="44" x2="136" y2="84" stroke="#34D399" strokeWidth="1.5" />
                            <motion.rect
                              x="130"
                              y="52"
                              width="12"
                              height="24"
                              fill="#34D399"
                              rx="2"
                              initial={{ scaleY: 0.3 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.35, delay: 0.2 }}
                              style={{ transformOrigin: "136px 76px" }}
                            />
                          </g>

                          <g className={styles.growingCandle}>
                            <line x1="172" y1="30" x2="172" y2="70" stroke="#34D399" strokeWidth="1.5" />
                            <motion.rect
                              x="166"
                              y="38"
                              width="12"
                              height="24"
                              fill="#34D399"
                              rx="2"
                              initial={{ scaleY: 0.3 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.35, delay: 0.26 }}
                              style={{ transformOrigin: "172px 62px" }}
                            />
                          </g>

                          <g className={styles.growingCandle}>
                            <line x1="208" y1="14" x2="208" y2="54" stroke="#34D399" strokeWidth="1.5" />
                            <motion.rect
                              x="202"
                              y="22"
                              width="12"
                              height="24"
                              fill="#34D399"
                              rx="2"
                              initial={{ scaleY: 0.3 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.35, delay: 0.32 }}
                              style={{ transformOrigin: "208px 46px" }}
                            />
                          </g>

                          <circle cx="208" cy="24" r="5" fill="#6EE7B7" />
                          <circle cx="208" cy="24" r="2.5" fill="#FFFFFF" />
                        </g>
                      ) : (
                        <g>
                          <path
                            d="M 28 106 L 90 92 L 152 74 L 208 52"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx="208" cy="52" r="3" fill="rgba(255, 255, 255, 0.4)" />
                        </g>
                      )}
                    </svg>

                    <div className={styles.widgetFooterMeta}>
                      0 REPAINT · 0 LAG · ALL TFS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Heat List Algorithm (AI Market Assistant) */}
          <div
            className={`${styles.cockpitCard} ${hoveredIndex === 1 ? styles.cardActive : ''} ${hoveredIndex !== null && hoveredIndex !== 1 ? styles.cardDimmed : ''}`}
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => router.push('/ai-market-assistant')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push('/ai-market-assistant');
              }
            }}
          >
            <div className={styles.cardTwoPartSplit}>
              {/* Left Side: Metadata & Description */}
              <div className={styles.cardLeftData}>
                <div className={styles.cardHeaderMeta}>
                  <div className={styles.topRowHeader}>
                    <div className={styles.capLabelRow}>
                      <span className={styles.watermarkNum}>02</span>
                    </div>
                  </div>
                  <h3>{t('homeSections.capabilities.card2Title', 'AI MARKET ASSISTANT')}</h3>
                </div>

                <div className={styles.cardFooter}>
                  <p className={styles.cardDesc}>
                    {t('homeSections.capabilities.card2Desc', 'Ask questions, validate trade setups, and receive real-time institutional market insights.')}
                  </p>
                </div>
              </div>

              {/* Right Side: Interactive Animation Box (Live Conviction Heat List) */}
              <div className={styles.cardRightAnim}>
                <div className={`${styles.widgetBox} ${hoveredIndex === 1 ? styles.widgetActive : ''}`}>
                  <div className={styles.widgetTopRow}>
                    <div className={styles.liveTag}>
                      <span className={styles.goldBeacon}></span>
                      {t('homeSections.capabilities.liveConviction', 'LIVE CONVICTION')}
                    </div>
                    <span className={styles.subMeta}>{t('homeSections.capabilities.pairsScanned', '1,000+ PAIRS SCANNED')}</span>
                  </div>

                  <div className={styles.convictionList}>
                    {[
                      { rank: '01', sym: 'XAU/USD', score: 96, width: '96%' },
                      { rank: '02', sym: 'EUR/USD', score: 89, width: '89%' },
                      { rank: '03', sym: 'GBP/USD', score: 78, width: '78%' },
                      { rank: '04', sym: 'USD/JPY', score: 64, width: '64%' }
                    ].map((item, i) => (
                      <div key={i} className={styles.convRow}>
                        <span className={styles.rankNum}>{item.rank}</span>
                        <span className={styles.symText}>{item.sym}</span>
                        <div className={styles.trackBar}>
                          <motion.div
                            className={styles.fillBar}
                            animate={{
                              width: hoveredIndex === 1 ? item.width : `${parseInt(item.width) - 10}%`,
                              background: hoveredIndex === 1
                                ? 'linear-gradient(90deg, #18c98b 0%, #6EE7B7 100%)'
                                : 'rgba(255, 255, 255, 0.18)',
                              boxShadow: hoveredIndex === 1 ? '0 0 14px rgba(24, 201, 139, 0.7)' : 'none'
                            }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                          />
                        </div>
                        <span className={`${styles.scoreText} ${hoveredIndex === 1 ? styles.scoreActive : ''}`}>
                          {item.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: STRATEGY HUB */}
          <div
            className={`${styles.cockpitCard} ${hoveredIndex === 2 ? styles.cardActive : ''} ${hoveredIndex !== null && hoveredIndex !== 2 ? styles.cardDimmed : ''}`}
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => router.push('/ai-trading-signal')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push('/ai-trading-signal');
              }
            }}
          >
            <div className={styles.cardTwoPartSplit}>
              {/* Left Side: Metadata & Description */}
              <div className={styles.cardLeftData}>
                <div className={styles.cardHeaderMeta}>
                  <div className={styles.topRowHeader}>
                    <div className={styles.capLabelRow}>
                      <span className={styles.watermarkNum}>03</span>
                    </div>
                  </div>
                  <h3>{t('homeSections.capabilities.card3Title', 'AI TRADING SIGNAL')}</h3>
                </div>

                <div className={styles.cardFooter}>
                  <p className={styles.cardDesc}>
                    {t('homeSections.capabilities.card3Desc', 'Execute live market intelligence and automate proven strategy playbooks.')}
                  </p>
                </div>
              </div>

              {/* Right Side: Interactive Animation Box */}
              <div className={styles.cardRightAnim}>
                <div className={`${styles.widgetBox} ${hoveredIndex === 2 ? styles.widgetActive : ''}`}>
                  <div className={styles.widgetTopRow}>
                    <span className={styles.resLabel}>{t('homeSections.capabilities.resistanceBreak', 'RESISTANCE BREAK')}</span>
                    <span className={`${styles.momText} ${hoveredIndex === 2 ? styles.momActive : ''}`}>MOM 0.86</span>
                  </div>

                  <div className={styles.breakoutArea}>
                    <div className={styles.resLevelMarker}>R · 142.50</div>

                    <svg viewBox="0 0 240 135" className={styles.breakoutSvg}>
                      <defs>
                        <linearGradient id="breakoutAreaGradGold" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#18c98b" stopOpacity="0.35" />
                          <stop offset="60%" stopColor="#18c98b" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#18c98b" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <line x1="6" y1="74" x2="234" y2="74" stroke="rgba(24, 201, 139, 0.45)" strokeDasharray="4 4" strokeWidth="1.2" />

                      {hoveredIndex === 2 ? (
                        <g>
                          <motion.path
                            d="M 12 110 L 68 102 L 120 74 Q 165 70 215 28 L 215 125 L 12 125 Z"
                            fill="url(#breakoutAreaGradGold)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                          />

                          <motion.path
                            d="M 12 110 L 68 102 L 120 74 Q 165 70 215 28"
                            fill="none"
                            stroke="#6EE7B7"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            filter="drop-shadow(0 0 10px rgba(24, 201, 139, 0.95))"
                          />

                          <motion.circle
                            cx="120"
                            cy="74"
                            r="8"
                            fill="none"
                            stroke="#6EE7B7"
                            strokeWidth="1.2"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: [0, 0.8, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                            style={{ transformOrigin: "120px 74px" }}
                          />
                          <motion.circle
                            cx="120"
                            cy="74"
                            r="4.5"
                            fill="#6EE7B7"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.28 }}
                          />

                          <motion.circle
                            cx="215"
                            cy="28"
                            r="5.5"
                            fill="#FFFFFF"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.52 }}
                            filter="drop-shadow(0 0 8px #6EE7B7)"
                          />
                        </g>
                      ) : (
                        <g>
                          <path
                            d="M 12 110 L 68 102 L 120 74"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx="120" cy="74" r="3" fill="rgba(255, 255, 255, 0.4)" />
                        </g>
                      )}
                    </svg>

                    <motion.div
                      className={`${styles.breakoutToast} ${hoveredIndex === 2 ? styles.toastActive : ''}`}
                      animate={hoveredIndex === 2 ? { y: [8, 0], opacity: 1 } : { opacity: 0.6 }}
                      transition={{ duration: 0.35, delay: 0.2 }}
                    >
                      <span className={styles.arrowIcon}>↗</span>
                      <div className={styles.toastText}>
                        XAU/USD breakout <span>142.50 → 145.20</span> +1.9%
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: AI TRADE AUDIT */}
          <div
            className={`${styles.cockpitCard} ${hoveredIndex === 3 ? styles.cardActive : ''} ${hoveredIndex !== null && hoveredIndex !== 3 ? styles.cardDimmed : ''}`}
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => router.push('/ai-trade-advisor')}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push('/ai-trade-advisor');
              }
            }}
          >
            <div className={styles.cardTwoPartSplit}>
              {/* Left Side: Metadata & Description */}
              <div className={styles.cardLeftData}>
                <div className={styles.cardHeaderMeta}>
                  <div className={styles.topRowHeader}>
                    <div className={styles.capLabelRow}>
                      <span className={styles.watermarkNum}>04</span>
                    </div>
                  </div>
                  <h3>{t('homeSections.capabilities.card4Title', 'AI PAST TRADE ANALYZER')}</h3>
                </div>

                <div className={styles.cardFooter}>
                  <p className={styles.cardDesc}>
                    {t('homeSections.capabilities.card4Desc', 'Audit win rates, profit factor, and max drawdown curves before putting capital at risk.')}
                  </p>
                </div>
              </div>

              {/* Right Side: Interactive Animation Box */}
              <div className={styles.cardRightAnim}>
                <div className={`${styles.widgetBox} ${hoveredIndex === 3 ? styles.widgetActive : ''}`}>
                  <div className={styles.widgetTopRow}>
                    <span className={styles.equityLabel}>{t('homeSections.capabilities.equityCurve', 'EQUITY CURVE · ILLUSTRATIVE')}</span>
                    <span className={styles.sampleBadge}>SAMPLE</span>
                  </div>

                  <div className={styles.equityArea}>
                    <svg viewBox="0 0 240 110" className={styles.equitySvg}>
                      <defs>
                        <linearGradient id="eqGlowGradGold" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#18c98b" stopOpacity="0.4" />
                          <stop offset="60%" stopColor="#18c98b" stopOpacity="0.1" />
                          <stop offset="100%" stopColor="#18c98b" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {hoveredIndex === 3 ? (
                        <g>
                          <motion.path
                            d="M 10 95 Q 50 86 90 76 T 150 48 T 205 32 T 232 20 L 232 108 L 10 108 Z"
                            fill="url(#eqGlowGradGold)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.18 }}
                          />

                          <motion.path
                            d="M 10 95 Q 50 86 90 76 T 150 48 T 205 32 T 232 20"
                            fill="none"
                            stroke="#6EE7B7"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.65, ease: "easeOut" }}
                            filter="drop-shadow(0 0 10px rgba(24, 201, 139, 0.95))"
                          />

                          <motion.circle
                            cx="232"
                            cy="20"
                            r="5.5"
                            fill="#FFFFFF"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.55 }}
                            filter="drop-shadow(0 0 8px #6EE7B7)"
                          />
                        </g>
                      ) : (
                        <g>
                          <path
                            d="M 10 95 Q 50 86 90 76 T 150 48"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <circle cx="150" cy="48" r="3" fill="rgba(255, 255, 255, 0.4)" />
                        </g>
                      )}
                    </svg>

                    <motion.div
                      className={styles.statBoxesRow}
                      animate={hoveredIndex === 3 ? { y: [6, 0], opacity: 1 } : { opacity: 0.7 }}
                      transition={{ duration: 0.35, delay: 0.2 }}
                    >
                      <div className={`${styles.statPill} ${hoveredIndex === 3 ? styles.statPillActive : ''}`}>
                        <span className={styles.statTitle}>{t('homeSections.capabilities.win', 'WIN')}</span>
                        <span className={styles.statNum}>64%</span>
                      </div>
                      <div className={`${styles.statPill} ${hoveredIndex === 3 ? styles.statPillActive : ''}`}>
                        <span className={styles.statTitle}>{t('homeSections.capabilities.maxDd', 'MAX DD')}</span>
                        <span className={styles.statNum}>-8.2%</span>
                      </div>
                      <div className={`${styles.statPill} ${hoveredIndex === 3 ? styles.statPillActive : ''}`}>
                        <span className={styles.statTitle}>{t('homeSections.capabilities.trades', 'TRADES')}</span>
                        <span className={styles.statNum}>124</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
