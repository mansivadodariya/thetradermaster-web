'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { authNavigate } from '@/lib/authRedirect';
import { SAMPLE_PRESETS } from '../constants/aiTradeData';
import styles from '../aiTrade.module.scss';

export default function LiveScannerDemoSection({
    demoRef,
    selectedPreset,
    onSelectPreset,
    isScanning,
    scanProgress,
    uploadedFile,
    fileInputRef,
    onFileUpload,
    onCopyPlan
}) {
    const router = useRouter();
    const { t } = useLanguage();

    return (
        <section ref={demoRef} id="live-demo" className={styles.scannerDemoSection}>
            <div className="container">
                <SectionHeader
                    badge={t('aiTrade.demoBadge', 'LIVE VISION AI SCANNER PREVIEW')}
                    title1={t('aiTrade.demoTitle1', 'EXPERIENCE AI TRADE')}
                    title2={t('aiTrade.demoTitle2', 'IN ACTION')}
                    description={t('aiTrade.demoSubtitle', 'Select a demo preset or test-upload your own chart to inspect instant trade setups, conviction ratings, and multi-TP targets.')}
                    align="center"
                />

                <div className={styles.scannerCockpit}>
                    {/* Terminal Window Header */}
                    <div className={styles.cockpitNavHeader}>
                        <div className={styles.cockpitBrand}>
                            <span className={`${styles.dot} ${styles.dotRed}`} />
                            <span className={`${styles.dot} ${styles.dotYellow}`} />
                            <span className={`${styles.dot} ${styles.dotGreen}`} />
                            <span className={styles.brandTitle}>TRADERMASTER // VISION AI TRADE ENGINE</span>
                        </div>

                        {/* Preset Tabs */}
                        <div className={styles.presetTabs}>
                            {SAMPLE_PRESETS.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => onSelectPreset(p)}
                                    className={`${styles.tabBtn} ${selectedPreset.id === p.id ? styles.tabBtnActive : ''}`}
                                >
                                    {p.pair} ({p.timeframe})
                                </button>
                            ))}
                        </div>

                        <div className={styles.telemetryStatus}>
                            <span className={styles.pulseDot}>
                                <span className={styles.pulseRing} />
                            </span>
                            <span>OCR V3.4 READY</span>
                        </div>
                    </div>

                    {/* Scanner Main Body: 2-Column Display */}
                    <div className={styles.cockpitBodyGrid}>
                        {/* Left Column: Annotated Visual Chart Simulation / Upload Box */}
                        <div className={styles.chartVisualCol}>
                            <div className={styles.chartFrame}>
                                {/* Scan Progress Overlay */}
                                <AnimatePresence>
                                    {isScanning && (
                                        <motion.div
                                            className={styles.scanningOverlay}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className={styles.scanAnimationBox}>
                                                <div className={styles.laserScanLine} />
                                                <div className={styles.scanSpinner} />
                                                <h4>VISION AI SCANNING IN PROGRESS</h4>
                                                <p>Extracting candlestick structures, order blocks &amp; S/R liquidity...</p>
                                                <div className={styles.scanProgressBar}>
                                                    <div
                                                        className={styles.scanProgressFill}
                                                        style={{ width: `${scanProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Candlestick & Pattern SVG Simulation */}
                                <div className={styles.candlestickStage}>
                                    <svg className={styles.chartSvg} viewBox="0 0 540 280" fill="none">
                                        {/* Grid */}
                                        <line x1="0" y1="70" x2="540" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                                        <line x1="0" y1="140" x2="540" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                                        <line x1="0" y1="210" x2="540" y2="210" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                                        {/* Take Profit Target Lines */}
                                        <line x1="280" y1="50" x2="520" y2="50" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
                                        <text x="440" y="42" fill="#10B981" fontSize="10" fontWeight="700">TP3: {selectedPreset.tp3}</text>

                                        <line x1="280" y1="85" x2="520" y2="85" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
                                        <text x="440" y="78" fill="#10B981" fontSize="10" fontWeight="700">TP1: {selectedPreset.tp1}</text>

                                        {/* Stop Loss Line */}
                                        <line x1="280" y1="230" x2="520" y2="230" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" />
                                        <text x="440" y="222" fill="#EF4444" fontSize="10" fontWeight="700">SL: {selectedPreset.stopLoss.split(' ')[0]}</text>

                                        {/* Pattern Bounding Box */}
                                        <rect x="180" y="90" width="220" height="110" fill="rgba(24, 201, 139, 0.05)" stroke="rgba(24, 201, 139, 0.4)" strokeDasharray="3 3" rx="6" />
                                        <text x="190" y="108" fill="#18C98B" fontSize="10" fontWeight="800">PATTERN: {selectedPreset.patternDetected.toUpperCase()}</text>

                                        {/* Candlesticks sequence */}
                                        <line x1="40" y1="160" x2="40" y2="220" stroke="#10B981" strokeWidth="2" />
                                        <rect x="34" y="170" width="12" height="35" fill="#10B981" rx="1" />

                                        <line x1="75" y1="140" x2="75" y2="200" stroke="#10B981" strokeWidth="2" />
                                        <rect x="69" y="150" width="12" height="40" fill="#10B981" rx="1" />

                                        <line x1="110" y1="110" x2="110" y2="180" stroke="#10B981" strokeWidth="2" />
                                        <rect x="104" y="120" width="12" height="45" fill="#10B981" rx="1" />

                                        <line x1="145" y1="120" x2="145" y2="190" stroke="#EF4444" strokeWidth="2" />
                                        <rect x="139" y="130" width="12" height="45" fill="#EF4444" rx="1" />

                                        <line x1="180" y1="150" x2="180" y2="215" stroke="#EF4444" strokeWidth="2" />
                                        <rect x="174" y="165" width="12" height="35" fill="#EF4444" rx="1" />

                                        <line x1="215" y1="130" x2="215" y2="205" stroke="#10B981" strokeWidth="2" />
                                        <rect x="209" y="145" width="12" height="40" fill="#10B981" rx="1" />

                                        <line x1="250" y1="100" x2="250" y2="175" stroke="#10B981" strokeWidth="2" />
                                        <rect x="244" y="115" width="12" height="45" fill="#10B981" rx="1" />

                                        <line x1="285" y1="110" x2="285" y2="195" stroke="#EF4444" strokeWidth="2" />
                                        <rect x="279" y="125" width="12" height="50" fill="#EF4444" rx="1" />

                                        <line x1="320" y1="85" x2="320" y2="165" stroke="#10B981" strokeWidth="2.5" />
                                        <rect x="314" y="100" width="12" height="45" fill="#10B981" rx="1" />

                                        <line x1="355" y1="65" x2="355" y2="145" stroke="#10B981" strokeWidth="2.5" />
                                        <rect x="349" y="80" width="12" height="45" fill="#10B981" rx="1" />
                                    </svg>

                                    {/* Floating Callout Badges */}
                                    <div className={styles.visionCallout}>
                                        <div className={styles.calloutDot} />
                                        <span>Vision AI Confirmed: {selectedPreset.patternDetected}</span>
                                    </div>
                                </div>

                                {/* Upload Trigger Bar */}
                                <div className={styles.uploadTriggerBar}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={onFileUpload}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className={styles.uploadDropBtn}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span>{uploadedFile ? `Uploaded: ${uploadedFile}` : 'Drag & Drop or Click to Test Your Chart Screenshot'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Structured AI Trade Analysis Result */}
                        <div className={styles.resultCardCol}>
                            <div className={styles.resultHeaderRow}>
                                <div className={styles.resultTitleWrap}>
                                    <div className={styles.resultIconBox}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                            <circle cx="12" cy="13" r="4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className={styles.resultHeaderTag}>AI TRADE ANALYSIS RESULT</span>
                                        <h3 className={styles.resultPairTitle}>
                                            {selectedPreset.pair} <span className={styles.tfBadge}>{selectedPreset.timeframe}</span>
                                        </h3>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={onCopyPlan}
                                    className={styles.copyBtn}
                                    title="Copy Trade Setup to Clipboard"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                    <span>Copy Setup</span>
                                </button>
                            </div>

                            {/* Decision Pill & Conviction Bar */}
                            <div className={styles.decisionBanner}>
                                <div className={styles.decisionInfo}>
                                    <span className={styles.decisionLabel}>TRADE DECISION:</span>
                                    <div className={selectedPreset.decisionType === 'buy' ? styles.decisionBuy : styles.decisionSell}>
                                        <span className={styles.statusDotGreen} />
                                        <strong>{selectedPreset.decision}</strong>
                                    </div>
                                </div>

                                <div className={styles.convictionBadge}>
                                    <span className={styles.convLabel}>CONFIDENCE</span>
                                    <span className={styles.convVal}>{selectedPreset.confidence}</span>
                                </div>
                            </div>

                            {/* Execution Parameters Grid */}
                            <div className={styles.executionBox}>
                                <div className={styles.execHeader}>
                                    <div className={styles.targetIconBox}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <circle cx="12" cy="6" r="2" />
                                        </svg>
                                    </div>
                                    <h5>EXECUTION BLUEPRINT</h5>
                                </div>

                                <div className={styles.execRows}>
                                    <div className={styles.execRow}>
                                        <span className={styles.execKey}>Entry Zone:</span>
                                        <span className={styles.execValHighlight}>{selectedPreset.entryZone}</span>
                                    </div>

                                    <div className={styles.execRow}>
                                        <span className={styles.execKey}>Protection Stop Loss:</span>
                                        <span className={styles.execValSl}>{selectedPreset.stopLoss}</span>
                                    </div>

                                    <div className={styles.execRow}>
                                        <span className={styles.execKey}>Target 1 (TP1):</span>
                                        <span className={styles.execValTp}>{selectedPreset.tp1}</span>
                                    </div>

                                    <div className={styles.execRow}>
                                        <span className={styles.execKey}>Target 2 (TP2):</span>
                                        <span className={styles.execValTp}>{selectedPreset.tp2}</span>
                                    </div>

                                    <div className={styles.execRow}>
                                        <span className={styles.execKey}>Target 3 (TP3):</span>
                                        <span className={styles.execValTp}>{selectedPreset.tp3}</span>
                                    </div>

                                    <div className={styles.execRow}>
                                        <span className={styles.execKey}>Risk-to-Reward Ratio:</span>
                                        <span className={styles.execValRrr}>{selectedPreset.rrr}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trade Rationale Box */}
                            <div className={styles.rationaleBox}>
                                <div className={styles.rationaleHeader}>
                                    <div className={styles.lightbulbIconBox}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                                        </svg>
                                    </div>
                                    <h5>TRADE RATIONALE &amp; VISION FINDINGS</h5>
                                </div>
                                <p className={styles.rationaleText}>
                                    {selectedPreset.rationale}
                                </p>
                            </div>

                            {/* Launch Desk CTA */}
                            <div className={styles.deskActionRow}>
                                <button
                                    type="button"
                                    onClick={() => authNavigate(router, '/chart-scanner')}
                                    className={styles.openLiveDeskBtn}
                                >
                                    <span>Open in Full Scanner Desk</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
