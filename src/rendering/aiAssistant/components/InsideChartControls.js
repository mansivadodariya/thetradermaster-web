'use client';

import React from 'react';
import SymbolIcon from '@/icons/symbolIcon';
import TickerSearchDropdown from '@/components/TickerSearchDropdown';
import { TIMEFRAMES, CHART_TYPES } from '../constants/chartConstants';
import { renderChartTypeIcon } from '../utils/indicatorCalculations';
import styles from '../aiAssistant.module.scss';

export default function InsideChartControls({
    symbolDropdownRef,
    symbolDropdownOpen,
    toggleSymbolDropdown,
    chartSymbol,
    activeSymbolClean,
    isChartLight,
    onSymbolChange,
    setSymbolDropdownOpen,
    timeframeDropdownRef,
    timeframeDropdownOpen,
    toggleTimeframeDropdown,
    currentTimeframe,
    setCurrentTimeframe,
    setTimeframeDropdownOpen,
    chartTypeDropdownRef,
    chartTypeDropdownOpen,
    toggleChartTypeDropdown,
    chartType,
    setChartType,
    setChartTypeDropdownOpen,
    t,
    indicatorsModalOpen,
    closeAllDropdowns,
    setIndicatorsModalOpen,
    settingsOpen,
    openSettingsModal
}) {
    return (
        <div
            className={styles.insideChartControlPill}
            onWheel={(e) => e.stopPropagation()}
        >
            {/* 1. Inside Chart Control Pill Symbol Dropdown */}
            <div className={styles.controlDropdownWrapper} ref={symbolDropdownRef}>
                <button
                    type="button"
                    className={styles.pillSymbolBtn}
                    onClick={toggleSymbolDropdown}
                >
                    <SymbolIcon symbol={chartSymbol} size={18} />
                    <span className={styles.pillSymbolName}>{activeSymbolClean}</span>
                    <span className={styles.statusDot} />
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                {symbolDropdownOpen && (
                    <TickerSearchDropdown
                        selectedSymbol={chartSymbol}
                        onSelectSymbol={(newSym) => {
                            if (onSymbolChange) onSymbolChange(newSym);
                        }}
                        onClose={() => setSymbolDropdownOpen(false)}
                        position="bottom"
                        isDark={!isChartLight}
                        allowNoPair={false}
                    />
                )}
            </div>

            {/* 2. Timeframe Selector Dropdown (TradingView Custom Style) */}
            <div className={styles.controlDropdownWrapper} ref={timeframeDropdownRef}>
                <button
                    type="button"
                    className={styles.pillTimeframeBtn}
                    onClick={toggleTimeframeDropdown}
                    title="Timeframe"
                >
                    <span className={styles.pillTimeframeLabel}>{currentTimeframe}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                {timeframeDropdownOpen && (
                    <div
                        className={`${styles.dropdownMenuFloating} ${styles.timeframeDropdownMenu}`}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        {TIMEFRAMES.map((tf) => {
                            const isActive = currentTimeframe === tf.value;
                            return (
                                <button
                                    key={tf.value}
                                    type="button"
                                    className={`${styles.dropdownMenuItem} ${isActive ? styles.activeItem : ''}`}
                                    onClick={() => {
                                        setCurrentTimeframe(tf.value);
                                        setTimeframeDropdownOpen(false);
                                    }}
                                >
                                    <span className={styles.timeframeItemLabel}>{tf.label}</span>
                                    {isActive && <span className={styles.pairCheck}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className={styles.pillDivider} />

            {/* 3. Chart Type Selector Dropdown (TradingView SVG Style) */}
            <div className={styles.controlDropdownWrapper} ref={chartTypeDropdownRef}>
                <button
                    type="button"
                    className={styles.pillChartTypeBtn}
                    onClick={toggleChartTypeDropdown}
                    title="Chart Type"
                >
                    {renderChartTypeIcon(chartType)}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                {chartTypeDropdownOpen && (
                    <div
                        className={`${styles.dropdownMenuFloating} ${styles.chartTypeDropdownMenu}`}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        {CHART_TYPES.map((ct) => {
                            const isActive = chartType === ct.value;
                            const translatedLabel = ct.value === 'candlestick'
                                ? t('aiAssistant.candlestick', ct.label)
                                : ct.value === 'line'
                                ? t('aiAssistant.line', ct.label)
                                : ct.value === 'area'
                                ? t('aiAssistant.area', ct.label)
                                : ct.label;
                            return (
                                <button
                                    key={ct.value}
                                    type="button"
                                    className={`${styles.dropdownMenuItem} ${isActive ? styles.activeItem : ''}`}
                                    onClick={() => {
                                        setChartType(ct.value);
                                        setChartTypeDropdownOpen(false);
                                    }}
                                >
                                    <div className={styles.chartTypeItemInfo}>
                                        {renderChartTypeIcon(ct.value)}
                                        <span>{translatedLabel}</span>
                                    </div>
                                    {isActive && <span className={styles.pairCheck}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className={styles.pillDivider} />

            {/* 4. Indicator Toggle Modal Trigger (TradingView Style Popup) */}
            <div className={styles.controlDropdownWrapper}>
                <button
                    type="button"
                    className={`${styles.pillTimeframeBtn} ${indicatorsModalOpen ? styles.activeControl : ''}`}
                    onClick={() => {
                        closeAllDropdowns();
                        setIndicatorsModalOpen(true);
                    }}
                    title="Indicators, Metrics & Strategies"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    <span className={styles.pillTimeframeLabel}>Indicators</span>
                </button>
            </div>

            <div className={styles.pillDivider} />

            {/* 5. Settings Cog Icon Button */}
            <button
                type="button"
                className={`${styles.pillIconBtn} ${settingsOpen ? styles.activeControl : ''}`}
                title="Chart Settings"
                onClick={openSettingsModal}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            </button>
        </div>
    );
}
