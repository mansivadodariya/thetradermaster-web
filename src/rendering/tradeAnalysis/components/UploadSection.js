'use client';

import React from 'react';
import styles from '../tradeAnalysis.module.scss';
import { useLanguage } from '@/context/LanguageContext';
import {
    PdfIcon,
    UploadIcon,
    CheckIcon,
    HistoryIcon,
    LockIcon,
    TargetIcon,
    ScaleIcon,
    BarChartIcon
} from '@/icons/tradeAnalysisIcons';

export default function UploadSection({
    fileInputRef,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFilesSelected,
    loading
}) {
    const { t } = useLanguage();

    return (
        <div className={styles.fullWidthUploadSection}>
            {/* 1. Next-Gen 4-Step Pipeline Stepper */}
            <div className={styles.stepperCard}>
                <div className={`${styles.stepItem} ${styles.stepActive}`}>
                    <div className={styles.stepCircle}>
                        <span className={styles.stepNum}>01</span>
                        <span className={styles.pulseHalo} />
                    </div>
                    <div className={styles.stepMeta}>
                        <span className={styles.stepTitle}>{t('tradeAnalysis.pipelineStep1Title', 'Statement Ingestion')}</span>
                        <span className={styles.stepSub}>{t('tradeAnalysis.pipelineStep1Sub', 'XLSX / CSV')}</span>
                    </div>
                </div>

                <div className={styles.stepConnector}>
                    <div className={styles.connectorLine} />
                    <span className={styles.connectorDot} />
                </div>

                <div className={styles.stepItem}>
                    <div className={styles.stepCircle}>
                        <span className={styles.stepNum}>02</span>
                    </div>
                    <div className={styles.stepMeta}>
                        <span className={styles.stepTitle}>{t('tradeAnalysis.pipelineStep2Title', 'Neural Extraction')}</span>
                        <span className={styles.stepSub}>{t('tradeAnalysis.pipelineStep2Sub', 'Executions, lots & SL/TP')}</span>
                    </div>
                </div>

                <div className={styles.stepConnector}>
                    <div className={styles.connectorLine} />
                    <span className={styles.connectorDot} />
                </div>

                <div className={styles.stepItem}>
                    <div className={styles.stepCircle}>
                        <span className={styles.stepNum}>03</span>
                    </div>
                    <div className={styles.stepMeta}>
                        <span className={styles.stepTitle}>{t('tradeAnalysis.pipelineStep3Title', 'Behavioral Audit')}</span>
                        <span className={styles.stepSub}>{t('tradeAnalysis.pipelineStep3Sub', 'Leaks, tilt & bias detection')}</span>
                    </div>
                </div>

                <div className={styles.stepConnector}>
                    <div className={styles.connectorLine} />
                    <span className={styles.connectorDot} />
                </div>

                <div className={styles.stepItem}>
                    <div className={styles.stepCircle}>
                        <span className={styles.stepNum}>04</span>
                    </div>
                    <div className={styles.stepMeta}>
                        <span className={styles.stepTitle}>{t('tradeAnalysis.pipelineStep4Title', 'Executive Scorecard')}</span>
                        <span className={styles.stepSub}>{t('tradeAnalysis.pipelineStep4Sub', 'Win-rate, R:R & playbook')}</span>
                    </div>
                </div>
            </div>

            {/* 2. Top Row: 2 Boxes (Dropzone on Left, Neural Extraction Engine on Right) */}
            <div className={styles.topUploadRow}>
                {/* Left Box: Central High-Tech Obsidian Glass Dropzone */}
                <div
                    className={`${styles.uploadCard} ${isDragging ? styles.activeDrag : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".csv,.xlsx,.xls,.pdf,.html,.htm,.txt"
                        className={styles.hiddenInput}
                        onChange={(e) => handleFilesSelected(e.target.files)}
                    />           

                    {/* Floating Holographic Icon Pedestal */}
                    <div className={styles.iconPedestal}>
                        <div className={styles.pedestalGlow} />
                        <div className={styles.pedestalIcon}>
                            <PdfIcon />
                        </div>
                    </div>

                    <div className={styles.uploadHeadingGroup}>
                        <h2>{t('tradeAnalysis.dropzoneTitle', 'Upload MT4 / MT5 / cTrader Trading Statement')}</h2>
                        <p>{t('tradeAnalysis.dropzoneSubtitle', 'Drag & drop your trading statement (CSV or XLSX) or click to browse files')}</p>
                    </div>

                    {/* Action Button Row */}
                    <div className={styles.uploadButtonRow}>
                        <button
                            type="button"
                            className={styles.chooseFileBtn}
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            disabled={loading}
                        >
                            <UploadIcon />
                            <span>{loading ? t('tradeAnalysis.uploading', 'Processing Statement...') : t('tradeAnalysis.selectFilesBtn', 'Choose Statement File')}</span>
                        </button>
                    </div>

                    <span className={styles.dragDropText}>{t('tradeAnalysis.supportedFormats', 'Supported: MetaTrader 4, MetaTrader 5, cTrader, TradingView CSV, Binance, Bybit')}</span>

                    <div className={styles.securityNotice}>
                        <LockIcon />
                        <span>{t('tradeAnalysis.enginePillar1', 'Zero Data Retention: Processed in memory')}</span>
                    </div>
                </div>

                {/* Right Box: Neural Data Extraction Engine */}
                <div className={styles.extractionCard}>
                    <div className={styles.matrixHeader}>
                        <div className={styles.matrixBadge}>
                            <TargetIcon />
                        </div>
                        <div>
                            <h4>{t('tradeAnalysis.engineTitle', 'Neural Extraction & Execution Engine')}</h4>
                            <p>{t('tradeAnalysis.engineSub', 'Instant quantitative parsing and behavioral edge audit across all historical orders.')}</p>
                        </div>
                    </div>

                    {/* 8-Item Telemetry Matrix */}
                    <div className={styles.checklistGrid}>
                        <div className={styles.checkItem}>
                            <div className={styles.checkIconBox}><CheckIcon /></div>
                            <span>{t('tradeAnalysis.entryPrecision', 'Entry & Exit Precision')}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <div className={styles.checkIconBox}><CheckIcon /></div>
                            <span>{t('tradeAnalysis.riskToReward', 'Risk-to-Reward (R:R)')}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <div className={styles.checkIconBox}><CheckIcon /></div>
                            <span>{t('tradeAnalysis.posSizing', 'Position Size & Lot Scale')}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <div className={styles.checkIconBox}><CheckIcon /></div>
                            <span>{t('tradeAnalysis.timestamps', 'Exact Execution Timestamps')}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <div className={styles.checkIconBox}><CheckIcon /></div>
                            <span>{t('tradeAnalysis.drawdownCurve', 'Net PnL & Drawdown Curve')}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <div className={styles.checkIconBox}><CheckIcon /></div>
                            <span>{t('tradeAnalysis.commissionSlippage', 'Commission, Swap & Slippage')}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <div className={styles.checkIconBox}><CheckIcon /></div>
                            <span>{t('tradeAnalysis.marketHours', 'Session & Market Hours')}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <div className={styles.checkIconBox}><CheckIcon /></div>
                            <span>{t('tradeAnalysis.orderTypes', 'Order Types (Market/Limit)')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. What The AI Audit Delivers Bento Grid */}
            <div className={styles.whatYouGetBox}>
                <div className={styles.sectionHeadingRow}>
                    <div>
                        <h3>{t('tradeAnalysis.neuralAuditDelivers', 'What The Neural Audit Delivers')}</h3>
                        <p>{t('tradeAnalysis.deliversSub', 'Institutional-grade analysis designed to eliminate capital leaks and compound edge')}</p>
                    </div>
                </div>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featIconBox}><TargetIcon /></div>
                        <div className={styles.featText}>
                            <h5>{t('tradeAnalysis.leakDetection', 'Execution Leak Detection')}</h5>
                            <p>{t('tradeAnalysis.leakDesc', 'Detect revenge trading, premature exits, moving stop-losses, and overleveraging before they erode equity.')}</p>
                        </div>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featIconBox}><ScaleIcon /></div>
                        <div className={styles.featText}>
                            <h5>{t('tradeAnalysis.mathEdge', 'Mathematical Edge & R:R')}</h5>
                            <p>{t('tradeAnalysis.mathDesc', 'Rigorous breakdown of your expectancy, profit factor, Kelly criterion sizing, and win/loss asymmetry.')}</p>
                        </div>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featIconBox}><HistoryIcon /></div>
                        <div className={styles.featText}>
                            <h5>{t('tradeAnalysis.psychTilt', 'Psychology & Tilt Mapping')}</h5>
                            <p>{t('tradeAnalysis.psychDesc', 'Isolate day-of-week tilt, time-of-day drawdown, session fatigue, and emotional holding patterns.')}</p>
                        </div>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featIconBox}><BarChartIcon /></div>
                        <div className={styles.featText}>
                            <h5>{t('tradeAnalysis.playbook', 'Actionable Trade Playbook')}</h5>
                            <p>{t('tradeAnalysis.playbookDesc', 'Synthesizes a concrete, prioritized checklist of rules tailored specifically to your historical executions.')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
