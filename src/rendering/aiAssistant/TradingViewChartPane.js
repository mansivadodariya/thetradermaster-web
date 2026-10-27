'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { createChart } from 'lightweight-charts';
import styles from './aiAssistant.module.scss';
import { toast } from '@/components/toast';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useLivePrice } from '@/lib/useLivePrice';
import ChartLoaderOverlay from './components/ChartLoaderOverlay';
import ChartSettingsModal from './components/ChartSettingsModal';
import IndicatorSettingsModal from './IndicatorSettingsModal';
import IndicatorsModal from './components/IndicatorsModal';
import ChartHeaderControls from './components/ChartHeaderControls';
import InsideChartControls from './components/InsideChartControls';
import FloatingIndicatorLegends from './components/FloatingIndicatorLegends';
import SubPanesArea from './components/SubPanesArea';
import useSubPaneCharts from './hooks/useSubPaneCharts';
import useOverlayIndicators from './hooks/useOverlayIndicators';
import useChartDataLoader from './hooks/useChartDataLoader';
import { useIndicatorState } from './hooks/useIndicatorState';
import { useChartExport } from './hooks/useChartExport';

// Re-export constants and calculations for 100% backwards compatibility
export {
    DEFAULT_INDICATOR_CONFIGS,
    SYMBOL_DATABASE,
    PAIR_GROUPS,
    ALL_PAIRS,
    TIMEFRAMES,
    CHART_TYPES,
    DEFAULT_MAIN_OVERLAYS,
    MA_COLOR_PALETTE
} from './constants/chartConstants';

export {
    getSymbolPrecision,
    applySymbolPrecision,
    formatPrice,
    normalizeSymbol,
    renderChartTypeIcon,
    getSymbolIcon,
    getTimeframeInterval,
    generateMockCandles,
    calculateEMA,
    calculateSMA,
    getIndicatorData,
    calculateBollingerBands,
    calculatePivotPoints,
    calculateRSI,
    calculateMACD,
    calculateStochastic
} from './utils/indicatorCalculations';

import {
    DEFAULT_INDICATOR_CONFIGS,
    DEFAULT_ACTIVE_INDICATORS,
    MA_COLOR_PALETTE
} from './constants/chartConstants';

import {
    normalizeSymbol
} from './utils/indicatorCalculations';

const TradingViewChartPane = forwardRef(function TradingViewChartPane(
    { symbol = 'XAU/USD', onSymbolChange, onAttachScreenshot },
    ref
) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const isDark = theme !== 'light';

    // Active Symbol Clean Resolution
    const chartSymbol = symbol || 'XAU/USD';
    const activeSymbolClean = normalizeSymbol(chartSymbol);

    // Chart Options & Display States
    const [currentTimeframe, setCurrentTimeframe] = useState('15m');
    const [chartType, setChartType] = useState('candlestick');
    const [loading, setLoading] = useState(true);
    const [latestCandle, setLatestCandle] = useState(null);
    const [activeIndicators, setActiveIndicators] = useState(DEFAULT_ACTIVE_INDICATORS);

    // Safety Watchdog: Never let chart loader stay stuck indefinitely
    useEffect(() => {
        if (loading) {
            const safetyTimer = setTimeout(() => {
                if (candlesDataRef.current && candlesDataRef.current.length > 0) {
                    setLoading(false);
                }
            }, 4000);
            return () => clearTimeout(safetyTimer);
        }
    }, [loading]);

    // Dynamic Moving Averages Array State (EMAs and SMAs) - Removed default EMAs per user request
    const [movingAverages, setMovingAverages] = useState([]);

    // Appearance & Color Customization
    const [bullishColor, setBullishColor] = useState('#26a69a');
    const [bearishColor, setBearishColor] = useState('#ef5350');
    const [backgroundColor, setBackgroundColor] = useState(isDark ? '#08090c' : '#FFFFFF');

    // Modals & Floating Menus States
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [indicatorsModalOpen, setIndicatorsModalOpen] = useState(false);
    const [draftBullishColor, setDraftBullishColor] = useState(bullishColor);
    const [draftBearishColor, setDraftBearishColor] = useState(bearishColor);
    const [draftBackgroundColor, setDraftBackgroundColor] = useState(backgroundColor);

    // Dropdown toggles
    const [symbolDropdownOpen, setSymbolDropdownOpen] = useState(false);
    const [headerSymbolDropdownOpen, setHeaderSymbolDropdownOpen] = useState(false);
    const [timeframeDropdownOpen, setTimeframeDropdownOpen] = useState(false);
    const [chartTypeDropdownOpen, setChartTypeDropdownOpen] = useState(false);
    const [indicatorsDropdownOpen, setIndicatorsDropdownOpen] = useState(false);
    const [cameraDropdownOpen, setCameraDropdownOpen] = useState(false);

    // Refs
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const volumeSeriesRef = useRef(null);
    const currentChartTypeRef = useRef('candlestick');
    const candlesDataRef = useRef([]);

    // Sub-pane Canvas Refs
    const rsiContainerRef = useRef(null);
    const macdContainerRef = useRef(null);
    const stochContainerRef = useRef(null);

    // DOM UI Dropdown Refs
    const symbolDropdownRef = useRef(null);
    const headerSymbolDropdownRef = useRef(null);
    const timeframeDropdownRef = useRef(null);
    const chartTypeDropdownRef = useRef(null);
    const indicatorsDropdownRef = useRef(null);
    const cameraDropdownRef = useRef(null);

    // Price updates via shared WebSocket hook (destructuring priceData & tickDirection)
    const { priceData, tickDirection: liveTickDirection } = useLivePrice(activeSymbolClean);
    const [tickDirection, setTickDirection] = useState(null);
    const prevPriceRef = useRef(null);

    useEffect(() => {
        if (liveTickDirection) {
            setTickDirection(liveTickDirection);
            const timer = setTimeout(() => setTickDirection(null), 350);
            return () => clearTimeout(timer);
        }
    }, [liveTickDirection, priceData?.price]);

    // Indicator Configs & Visibility States Hook
    const {
        indicatorConfigs,
        indicatorVisibility,
        editingIndicator,
        setEditingIndicator,
        toggleIndicatorVisibility,
        removeIndicator,
        openIndicatorSettings,
        addMovingAverage,
        toggleMAVisibility,
        removeMovingAverage,
        saveIndicatorConfig,
        resetIndicatorDefaults
    } = useIndicatorState({
        activeIndicators,
        setActiveIndicators,
        movingAverages,
        setMovingAverages,
        chartRef,
        maSeriesRefs: { current: null } // will be hooked
    });

    // Main Chart Overlay Indicators Hook
    const { maSeriesRefs, updateIndicators } = useOverlayIndicators({
        chartRef,
        candlesDataRef,
        activeIndicators,
        indicatorConfigs,
        indicatorVisibility,
        movingAverages
    });

    // Sub-panes (RSI, MACD, Stochastic) Hook
    useSubPaneCharts({
        chartRef,
        candlesDataRef,
        activeIndicators,
        indicatorConfigs,
        indicatorVisibility,
        currentTimeframe,
        activeSymbolClean,
        isDark,
        theme,
        rsiContainerRef,
        macdContainerRef,
        stochContainerRef
    });

    // Chart Data Loader & WebSocket Hook
    useChartDataLoader({
        chartRef,
        seriesRef,
        volumeSeriesRef,
        candlesDataRef,
        activeSymbolClean,
        currentTimeframe,
        chartType,
        currentChartTypeRef,
        bullishColor,
        bearishColor,
        livePrice: priceData?.price,
        setLoading,
        setLatestCandle,
        updateIndicators
    });

    // Expose capture functionality to parent via ref
    useImperativeHandle(ref, () => ({
        getScreenshotDataUrl: () => {
            if (!chartRef.current) return null;
            const canvas = chartRef.current.takeScreenshot();
            return canvas.toDataURL('image/png');
        },
        attachScreenshot: () => {
            attachChartToChat();
        },
    }));

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (symbolDropdownRef.current && !symbolDropdownRef.current.contains(e.target)) {
                setSymbolDropdownOpen(false);
            }
            if (headerSymbolDropdownRef.current && !headerSymbolDropdownRef.current.contains(e.target)) {
                setHeaderSymbolDropdownOpen(false);
            }
            if (cameraDropdownRef.current && !cameraDropdownRef.current.contains(e.target)) {
                setCameraDropdownOpen(false);
            }
            if (chartTypeDropdownRef.current && !chartTypeDropdownRef.current.contains(e.target)) {
                setChartTypeDropdownOpen(false);
            }
            if (timeframeDropdownRef.current && !timeframeDropdownRef.current.contains(e.target)) {
                setTimeframeDropdownOpen(false);
            }
            if (indicatorsDropdownRef.current && !indicatorsDropdownRef.current.contains(e.target)) {
                setIndicatorsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Sync chart theme colors on app theme change
    useEffect(() => {
        const bg = isDark ? '#08090c' : '#FFFFFF';
        const txt = isDark ? '#94A3B8' : '#334155';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
        const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)';

        setBackgroundColor(bg);

        if (chartRef.current) {
            chartRef.current.applyOptions({
                layout: { background: { color: bg }, textColor: txt },
                grid: { vertLines: { color: gridColor }, horzLines: { color: gridColor } },
                timeScale: { borderColor },
                rightPriceScale: { borderColor },
            });
        }
    }, [theme, isDark]);

    // Initialize Chart Engine
    useEffect(() => {
        if (!containerRef.current) return;

        const initialBg = isDark ? '#08090c' : '#FFFFFF';
        const initialTxt = isDark ? '#94A3B8' : '#334155';
        const initialGrid = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
        const initialBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)';

        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight || 500,
            attributionLogo: false,
            layout: {
                background: { color: initialBg },
                textColor: initialTxt,
                fontFamily: 'Inter, system-ui, sans-serif',
                attributionLogo: false,
            },
            grid: {
                vertLines: { color: initialGrid },
                horzLines: { color: initialGrid },
            },
            crosshair: {
                mode: 1,
                vertLine: { color: 'rgba(24, 201, 139, 0.5)', width: 1, style: 2 },
                horzLine: { color: 'rgba(24, 201, 139, 0.5)', width: 1, style: 2 },
            },
            handleScroll: {
                mouseWheel: false,
                pressedMouseMove: true,
                horzTouchDrag: true,
                vertTouchDrag: false,
            },
            handleScale: {
                axisPressedMouseMove: {
                    time: true,
                    price: true,
                },
                axisDoubleClickReset: {
                    time: true,
                    price: true,
                },
                mouseWheel: false,
                pinch: true,
            },
            timeScale: {
                borderColor: initialBorder,
                timeVisible: true,
                secondsVisible: false,
                rightBarStaysOnScroll: true,
                barSpacing: 5.5,
                rightOffset: 16,
            },
            rightPriceScale: {
                borderColor: initialBorder,
                scaleMargins: { top: 0.14, bottom: 0.20 },
            },
        });

        chartRef.current = chart;

        const handleResize = () => {
            if (containerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };

        const containerEl = containerRef.current;
        const handleWheelZoom = (e) => {
            const targetEl = e.target;
            if (
                targetEl &&
                (targetEl.closest(`.${styles.insideChartControlPill}`) ||
                 targetEl.closest('[class*="dropdown"]') ||
                 targetEl.closest('[class*="Dropdown"]') ||
                 targetEl.closest('[class*="tickerSearch"]') ||
                 targetEl.closest('[class*="tickerList"]') ||
                 targetEl.closest('[class*="modal"]') ||
                 targetEl.closest('[class*="Modal"]') ||
                 targetEl.closest('[class*="menu"]') ||
                 targetEl.closest('[class*="Menu"]') ||
                 targetEl.closest('[class*="popup"]') ||
                 targetEl.closest('[class*="settings"]') ||
                 targetEl.closest('[class*="control"]') ||
                 targetEl.closest('[class*="pill"]') ||
                 targetEl.closest('[class*="Pill"]') ||
                 targetEl.closest('input, select, textarea, button'))
            ) {
                // Allow natural scrolling inside dropdown menus, search results, and popups
                return;
            }

            if (e.cancelable) {
                e.preventDefault();
            }
            e.stopPropagation();

            if (!chartRef.current) return;
            const timeScale = chartRef.current.timeScale();
            const currentSpacing = timeScale.options().barSpacing || 5.5;

            const zoomIn = e.deltaY < 0;
            const zoomMultiplier = zoomIn ? 1.15 : 0.87;
            const nextSpacing = Math.max(2, Math.min(80, currentSpacing * zoomMultiplier));

            timeScale.applyOptions({
                barSpacing: nextSpacing,
                rightBarStaysOnScroll: true,
            });
        };

        if (containerEl) {
            containerEl.addEventListener('wheel', handleWheelZoom, { passive: false });
        }

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(containerRef.current);

        return () => {
            if (containerEl) {
                containerEl.removeEventListener('wheel', handleWheelZoom);
            }
            resizeObserver.disconnect();
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    // Update chart background when setting changes
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.applyOptions({
                layout: { background: { color: backgroundColor } },
            });
        }
    }, [backgroundColor]);

    const hasSubPanes = Boolean(activeIndicators.rsi || activeIndicators.macd || activeIndicators.stochastic);

    // Dynamically adjust scaleMargins and dimensions when subpanes are active
    useEffect(() => {
        if (!chartRef.current) return;
        chartRef.current.applyOptions({
            rightPriceScale: {
                scaleMargins: {
                    top: 0.08,
                    bottom: hasSubPanes ? 0.22 : 0.20,
                },
            },
        });
        try {
            chartRef.current.priceScale('volume').applyOptions({
                scaleMargins: {
                    top: hasSubPanes ? 0.74 : 0.80,
                    bottom: 0.02,
                },
            });
        } catch {}

        const updateDimensions = () => {
            if (containerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };

        updateDimensions();
        const raf = requestAnimationFrame(updateDimensions);
        const timer = setTimeout(updateDimensions, 220);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(timer);
        };
    }, [hasSubPanes]);

    // Update Series colors when bullish/bearish picker changes in Settings Modal
    useEffect(() => {
        if (seriesRef.current && chartType === 'candlestick') {
            seriesRef.current.applyOptions({
                upColor: bullishColor,
                borderUpColor: bullishColor,
                wickUpColor: bullishColor,
                downColor: bearishColor,
                borderDownColor: bearishColor,
                wickDownColor: bearishColor,
            });
        }
    }, [bullishColor, bearishColor, chartType]);

    // Camera Screenshot Actions Hook
    const { downloadChartImage, copyChartImageToClipboard, attachChartToChat } = useChartExport({
        chartRef,
        activeSymbolClean,
        onAttachScreenshot,
        setCameraDropdownOpen
    });

    const closeAllDropdowns = () => {
        setSymbolDropdownOpen(false);
        setHeaderSymbolDropdownOpen(false);
        setTimeframeDropdownOpen(false);
        setChartTypeDropdownOpen(false);
        setIndicatorsDropdownOpen(false);
        setCameraDropdownOpen(false);
    };

    const toggleSymbolDropdown = () => {
        const next = !symbolDropdownOpen;
        closeAllDropdowns();
        setSymbolDropdownOpen(next);
    };

    const toggleTimeframeDropdown = () => {
        const next = !timeframeDropdownOpen;
        closeAllDropdowns();
        setTimeframeDropdownOpen(next);
    };

    const toggleChartTypeDropdown = () => {
        const next = !chartTypeDropdownOpen;
        closeAllDropdowns();
        setChartTypeDropdownOpen(next);
    };

    const toggleCameraDropdown = () => {
        const next = !cameraDropdownOpen;
        closeAllDropdowns();
        setCameraDropdownOpen(next);
    };

    const openSettingsModal = () => {
        closeAllDropdowns();
        setDraftBullishColor(bullishColor);
        setDraftBearishColor(bearishColor);
        setDraftBackgroundColor(backgroundColor);
        setSettingsOpen(true);
    };

    const handleApplySettings = () => {
        setBullishColor(draftBullishColor);
        setBearishColor(draftBearishColor);
        setBackgroundColor(draftBackgroundColor);
        setSettingsOpen(false);
    };

    const handleResetSettings = () => {
        const defaultBg = isDark ? '#08090c' : '#FFFFFF';
        setDraftBullishColor('#26a69a');
        setDraftBearishColor('#ef5350');
        setDraftBackgroundColor(defaultBg);
    };

    const currentPrice = priceData?.price ?? latestCandle?.close ?? 0;
    const openPrice = latestCandle?.open || currentPrice;
    const priceDiff = currentPrice - openPrice;
    const candleChangePct = (openPrice && openPrice > 0)
        ? parseFloat(((priceDiff / openPrice) * 100).toFixed(2))
        : 0;

    // Use current candle direction when available so header color matches the chart candle & price scale badge exactly
    const isUp = latestCandle
        ? currentPrice >= openPrice
        : (priceData?.changePercent !== undefined ? priceData.changePercent >= 0 : true);

    const changePercent = latestCandle
        ? candleChangePct
        : (priceData?.changePercent !== undefined ? priceData.changePercent : candleChangePct);

    const flashClass = tickDirection === 'up' ? styles.flashUp : (tickDirection === 'down' ? styles.flashDown : '');

    const bgUpper = (backgroundColor || '').toUpperCase();
    const isBgLight = bgUpper === '#FFFFFF' || bgUpper === '#FFF' || bgUpper === 'WHITE' || bgUpper === '#F8F9FD' || bgUpper === '#F0F3FA';
    const isChartLight = !isDark || isBgLight;

    const isChartLoading = loading || !candlesDataRef.current || candlesDataRef.current.length === 0;

    return (
        <div className={`${styles.chartPaneContainer} ${isChartLight ? styles.lightThemePane : ''}`}>
            {/* Chart Header Controls Bar */}
            <ChartHeaderControls
                currentPrice={currentPrice}
                chartSymbol={chartSymbol}
                isUp={isUp}
                flashClass={flashClass}
                changePercent={changePercent}
                cameraDropdownRef={cameraDropdownRef}
                cameraDropdownOpen={cameraDropdownOpen}
                toggleCameraDropdown={toggleCameraDropdown}
                attachChartToChat={attachChartToChat}
                downloadChartImage={downloadChartImage}
                copyChartImageToClipboard={copyChartImageToClipboard}
                t={t}
            />

            {/* Live Chart Container */}
            <div className={styles.chartCanvasArea}>
                {isChartLoading && (
                    <ChartLoaderOverlay isDark={!isChartLight} />
                )}

                {/* Main Candlestick / Price Chart Container */}
                <div
                    ref={containerRef}
                    className={`${styles.mainChartContainer} ${hasSubPanes ? styles.hasSubPanes : ''} ${isChartLoading ? styles.isChartLoading : ''}`}
                    style={{ cursor: 'crosshair' }}
                >
                    {/* Inside Chart Floating Control Bar (Top Left) */}
                    <InsideChartControls
                        symbolDropdownRef={symbolDropdownRef}
                        symbolDropdownOpen={symbolDropdownOpen}
                        toggleSymbolDropdown={toggleSymbolDropdown}
                        chartSymbol={chartSymbol}
                        activeSymbolClean={activeSymbolClean}
                        isChartLight={isChartLight}
                        onSymbolChange={onSymbolChange}
                        setSymbolDropdownOpen={setSymbolDropdownOpen}
                        timeframeDropdownRef={timeframeDropdownRef}
                        timeframeDropdownOpen={timeframeDropdownOpen}
                        toggleTimeframeDropdown={toggleTimeframeDropdown}
                        currentTimeframe={currentTimeframe}
                        setCurrentTimeframe={setCurrentTimeframe}
                        setTimeframeDropdownOpen={setTimeframeDropdownOpen}
                        chartTypeDropdownRef={chartTypeDropdownRef}
                        chartTypeDropdownOpen={chartTypeDropdownOpen}
                        toggleChartTypeDropdown={toggleChartTypeDropdown}
                        chartType={chartType}
                        setChartType={setChartType}
                        setChartTypeDropdownOpen={setChartTypeDropdownOpen}
                        t={t}
                        indicatorsModalOpen={indicatorsModalOpen}
                        closeAllDropdowns={closeAllDropdowns}
                        setIndicatorsModalOpen={setIndicatorsModalOpen}
                        settingsOpen={settingsOpen}
                        openSettingsModal={openSettingsModal}
                    />
                </div>

                {/* TradingView Style Floating Indicator Widget Legend Pills */}
                <FloatingIndicatorLegends
                    movingAverages={movingAverages}
                    activeIndicators={activeIndicators}
                    indicatorConfigs={indicatorConfigs}
                    indicatorVisibility={indicatorVisibility}
                    toggleMAVisibility={toggleMAVisibility}
                    openIndicatorSettings={openIndicatorSettings}
                    removeMovingAverage={removeMovingAverage}
                    toggleIndicatorVisibility={toggleIndicatorVisibility}
                    removeIndicator={removeIndicator}
                />
            </div>

            {/* Sub-Pane Canvas Containers (Positioned Below Main Chart) */}
            <SubPanesArea
                hasSubPanes={hasSubPanes}
                activeIndicators={activeIndicators}
                indicatorConfigs={indicatorConfigs}
                indicatorVisibility={indicatorVisibility}
                toggleIndicatorVisibility={toggleIndicatorVisibility}
                openIndicatorSettings={openIndicatorSettings}
                removeIndicator={removeIndicator}
                rsiContainerRef={rsiContainerRef}
                macdContainerRef={macdContainerRef}
                stochContainerRef={stochContainerRef}
            />

            {/* Settings Panel Modal (TradingView Style) */}
            <ChartSettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                draftBullishColor={draftBullishColor}
                setDraftBullishColor={setDraftBullishColor}
                draftBearishColor={draftBearishColor}
                setDraftBearishColor={setDraftBearishColor}
                draftBackgroundColor={draftBackgroundColor}
                setDraftBackgroundColor={setDraftBackgroundColor}
                onReset={handleResetSettings}
                onApply={handleApplySettings}
            />

            {/* Indicator Settings Modal (TradingView Style with Inputs, Style, Defaults, Ok) */}
            <IndicatorSettingsModal
                isOpen={Boolean(editingIndicator)}
                indicatorKey={editingIndicator}
                config={
                    editingIndicator?.startsWith('ma_')
                        ? movingAverages.find(m => m.id === editingIndicator)
                        : (editingIndicator ? indicatorConfigs[editingIndicator] : null)
                }
                onClose={() => setEditingIndicator(null)}
                onSave={saveIndicatorConfig}
                onResetDefaults={resetIndicatorDefaults}
            />

            {/* Indicators & Metrics Modal (TradingView Style Dialog) */}
            <IndicatorsModal
                isOpen={indicatorsModalOpen}
                onClose={() => setIndicatorsModalOpen(false)}
                activeIndicators={activeIndicators}
                movingAverages={movingAverages}
                onAddMA={addMovingAverage}
                onToggleIndicator={(key) => {
                    setActiveIndicators(prev => ({ ...prev, [key]: !prev[key] }));
                }}
                isDark={!isChartLight}
            />
        </div>
    );
});

export default TradingViewChartPane;
