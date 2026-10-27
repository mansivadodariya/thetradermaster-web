'use client';

import { useEffect, useRef } from 'react';
import { createChart, LineSeries, HistogramSeries } from 'lightweight-charts';
import { calculateRSI, calculateMACD, calculateStochastic } from '../utils/indicatorCalculations';

export default function useSubPaneCharts({
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
}) {
    const rsiChartObjRef = useRef(null);
    const macdChartObjRef = useRef(null);
    const stochChartObjRef = useRef(null);

    useEffect(() => {
        const candles = candlesDataRef.current;
        if (!candles || candles.length === 0) return;

        const syncTimeWithMain = (subChart) => {
            if (!chartRef.current || !subChart) return;
            try {
                const mainTs = chartRef.current.timeScale();
                const subTs = subChart.timeScale();
                mainTs.subscribeVisibleLogicalRangeChange((r) => {
                    if (r) try { subTs.setVisibleLogicalRange(r); } catch {}
                });
                subTs.subscribeVisibleLogicalRangeChange((r) => {
                    if (r) try { mainTs.setVisibleLogicalRange(r); } catch {}
                });
                const curRange = mainTs.getVisibleLogicalRange();
                if (curRange) subTs.setVisibleLogicalRange(curRange);
            } catch {}
        };

        const subBg = isDark ? '#08090c' : '#FFFFFF';
        const subTxt = isDark ? '#94A3B8' : '#334155';
        const subGridVert = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)';
        const subGridHorz = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
        const subBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

        // RSI Sub-pane
        if (activeIndicators.rsi && rsiContainerRef.current) {
            const cfg = indicatorConfigs.rsi;
            const isVis = indicatorVisibility.rsi;
            if (!rsiChartObjRef.current) {
                const rChart = createChart(rsiContainerRef.current, {
                    height: rsiContainerRef.current.clientHeight || 115,
                    width: rsiContainerRef.current.clientWidth,
                    attributionLogo: false,
                    layout: { background: { color: subBg }, textColor: subTxt, fontFamily: 'Inter, sans-serif', attributionLogo: false },
                    grid: { vertLines: { color: subGridVert }, horzLines: { color: subGridHorz } },
                    timeScale: { visible: true, borderColor: subBorder },
                    rightPriceScale: { borderColor: subBorder },
                    handleScroll: { mouseWheel: false, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
                    handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: true },
                });
                const rSeries = rChart.addSeries(LineSeries, { color: cfg.color, lineWidth: cfg.lineWidth, visible: isVis });
                const line70 = rChart.addSeries(LineSeries, { color: 'rgba(239, 83, 80, 0.6)', lineWidth: 1, lineStyle: 2, visible: isVis });
                const line30 = rChart.addSeries(LineSeries, { color: 'rgba(38, 166, 154, 0.6)', lineWidth: 1, lineStyle: 2, visible: isVis });
                syncTimeWithMain(rChart);
                rsiChartObjRef.current = { chart: rChart, series: rSeries, line70, line30 };
            } else {
                rsiChartObjRef.current.chart.applyOptions({
                    layout: { background: { color: subBg }, textColor: subTxt, attributionLogo: false },
                    grid: { vertLines: { color: subGridVert }, horzLines: { color: subGridHorz } },
                    timeScale: { borderColor: subBorder },
                    rightPriceScale: { borderColor: subBorder }
                });
                rsiChartObjRef.current.series.applyOptions({ color: cfg.color, lineWidth: cfg.lineWidth, visible: isVis });
                rsiChartObjRef.current.line70.applyOptions({ visible: isVis });
                rsiChartObjRef.current.line30.applyOptions({ visible: isVis });
            }
            const rsiData = calculateRSI(candles, cfg.length);
            rsiChartObjRef.current.series.setData(rsiData);
            if (rsiData.length > 0) {
                const first = rsiData[0].time;
                const last = rsiData[rsiData.length - 1].time;
                rsiChartObjRef.current.line70.setData([{ time: first, value: cfg.overbought }, { time: last, value: cfg.overbought }]);
                rsiChartObjRef.current.line30.setData([{ time: first, value: cfg.oversold }, { time: last, value: cfg.oversold }]);
            }
        } else if (rsiChartObjRef.current) {
            try { rsiChartObjRef.current.chart.remove(); } catch {}
            rsiChartObjRef.current = null;
        }

        // MACD Sub-pane
        if (activeIndicators.macd && macdContainerRef.current) {
            const cfg = indicatorConfigs.macd;
            const isVis = indicatorVisibility.macd;
            if (!macdChartObjRef.current) {
                const mChart = createChart(macdContainerRef.current, {
                    height: macdContainerRef.current.clientHeight || 115,
                    width: macdContainerRef.current.clientWidth,
                    attributionLogo: false,
                    layout: { background: { color: subBg }, textColor: subTxt, fontFamily: 'Inter, sans-serif', attributionLogo: false },
                    grid: { vertLines: { color: subGridVert }, horzLines: { color: subGridHorz } },
                    timeScale: { visible: true, borderColor: subBorder },
                    rightPriceScale: { borderColor: subBorder },
                    handleScroll: { mouseWheel: false, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
                    handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: true },
                });
                const histSeries = mChart.addSeries(HistogramSeries, { priceScaleId: 'right', visible: isVis });
                const macdSeries = mChart.addSeries(LineSeries, { color: cfg.macdColor, lineWidth: cfg.lineWidth, visible: isVis });
                const signalSeries = mChart.addSeries(LineSeries, { color: cfg.signalColor, lineWidth: cfg.lineWidth, visible: isVis });
                syncTimeWithMain(mChart);
                macdChartObjRef.current = { chart: mChart, histSeries, macdSeries, signalSeries };
            } else {
                macdChartObjRef.current.chart.applyOptions({
                    layout: { background: { color: subBg }, textColor: subTxt, attributionLogo: false },
                    grid: { vertLines: { color: subGridVert }, horzLines: { color: subGridHorz } },
                    timeScale: { borderColor: subBorder },
                    rightPriceScale: { borderColor: subBorder }
                });
                macdChartObjRef.current.histSeries.applyOptions({ visible: isVis });
                macdChartObjRef.current.macdSeries.applyOptions({ color: cfg.macdColor, lineWidth: cfg.lineWidth, visible: isVis });
                macdChartObjRef.current.signalSeries.applyOptions({ color: cfg.signalColor, lineWidth: cfg.lineWidth, visible: isVis });
            }
            const { macd, macdLine, signal, signalLine, histogram } = calculateMACD(candles, cfg.fastPeriod, cfg.slowPeriod, cfg.signalPeriod);
            macdChartObjRef.current.macdSeries.setData(macd || macdLine || []);
            macdChartObjRef.current.signalSeries.setData(signal || signalLine || []);
            macdChartObjRef.current.histSeries.setData(histogram || []);
        } else if (macdChartObjRef.current) {
            try { macdChartObjRef.current.chart.remove(); } catch {}
            macdChartObjRef.current = null;
        }

        // Stochastic Sub-pane
        if (activeIndicators.stochastic && stochContainerRef.current) {
            const cfg = indicatorConfigs.stochastic;
            const isVis = indicatorVisibility.stochastic;
            if (!stochChartObjRef.current) {
                const sChart = createChart(stochContainerRef.current, {
                    height: stochContainerRef.current.clientHeight || 115,
                    width: stochContainerRef.current.clientWidth,
                    attributionLogo: false,
                    layout: { background: { color: subBg }, textColor: subTxt, fontFamily: 'Inter, sans-serif', attributionLogo: false },
                    grid: { vertLines: { color: subGridVert }, horzLines: { color: subGridHorz } },
                    timeScale: { visible: true, borderColor: subBorder },
                    rightPriceScale: { borderColor: subBorder },
                    handleScroll: { mouseWheel: false, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
                    handleScale: { mouseWheel: true, pinch: true, axisPressedMouseMove: true },
                });
                const kSeries = sChart.addSeries(LineSeries, { color: cfg.kColor, lineWidth: cfg.lineWidth, visible: isVis });
                const dSeries = sChart.addSeries(LineSeries, { color: cfg.dColor, lineWidth: cfg.lineWidth, visible: isVis });
                const line80 = sChart.addSeries(LineSeries, { color: 'rgba(239, 83, 80, 0.6)', lineWidth: 1, lineStyle: 2, visible: isVis });
                const line20 = sChart.addSeries(LineSeries, { color: 'rgba(38, 166, 154, 0.6)', lineWidth: 1, lineStyle: 2, visible: isVis });
                syncTimeWithMain(sChart);
                stochChartObjRef.current = { chart: sChart, kSeries, dSeries, line80, line20 };
            } else {
                stochChartObjRef.current.chart.applyOptions({
                    layout: { background: { color: subBg }, textColor: subTxt, attributionLogo: false },
                    grid: { vertLines: { color: subGridVert }, horzLines: { color: subGridHorz } },
                    timeScale: { borderColor: subBorder },
                    rightPriceScale: { borderColor: subBorder }
                });
                stochChartObjRef.current.kSeries.applyOptions({ color: cfg.kColor, lineWidth: cfg.lineWidth, visible: isVis });
                stochChartObjRef.current.dSeries.applyOptions({ color: cfg.dColor, lineWidth: cfg.lineWidth, visible: isVis });
                stochChartObjRef.current.line80.applyOptions({ visible: isVis });
                stochChartObjRef.current.line20.applyOptions({ visible: isVis });
            }
            const { k, d } = calculateStochastic(candles, cfg.kPeriod, cfg.dPeriod, cfg.smooth);
            stochChartObjRef.current.kSeries.setData(k || []);
            stochChartObjRef.current.dSeries.setData(d || []);
            if (k && k.length > 0) {
                const first = k[0].time;
                const last = k[k.length - 1].time;
                stochChartObjRef.current.line80.setData([{ time: first, value: 80 }, { time: last, value: 80 }]);
                stochChartObjRef.current.line20.setData([{ time: first, value: 20 }, { time: last, value: 20 }]);
            }
        } else if (stochChartObjRef.current) {
            try { stochChartObjRef.current.chart.remove(); } catch {}
            stochChartObjRef.current = null;
        }
    }, [activeIndicators, indicatorConfigs, indicatorVisibility, currentTimeframe, activeSymbolClean, isDark, theme]);

    useEffect(() => {
        const subBg = isDark ? '#08090c' : '#FFFFFF';
        const subTxt = isDark ? '#94A3B8' : '#334155';
        const subGridVert = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)';
        const subGridHorz = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
        const subBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

        const subOptions = {
            layout: { background: { color: subBg }, textColor: subTxt },
            grid: { vertLines: { color: subGridVert }, horzLines: { color: subGridHorz } },
            timeScale: { borderColor: subBorder },
            rightPriceScale: { borderColor: subBorder },
        };

        if (rsiChartObjRef.current?.chart) {
            try { rsiChartObjRef.current.chart.applyOptions(subOptions); } catch {}
        }
        if (macdChartObjRef.current?.chart) {
            try { macdChartObjRef.current.chart.applyOptions(subOptions); } catch {}
        }
        if (stochChartObjRef.current?.chart) {
            try { stochChartObjRef.current.chart.applyOptions(subOptions); } catch {}
        }
    }, [theme, isDark]);

    // Observe size changes on sub-pane containers
    useEffect(() => {
        const handleResizeSubPanes = () => {
            if (rsiChartObjRef.current?.chart && rsiContainerRef.current) {
                try {
                    rsiChartObjRef.current.chart.applyOptions({
                        width: rsiContainerRef.current.clientWidth,
                        height: rsiContainerRef.current.clientHeight || 120,
                    });
                } catch {}
            }
            if (macdChartObjRef.current?.chart && macdContainerRef.current) {
                try {
                    macdChartObjRef.current.chart.applyOptions({
                        width: macdContainerRef.current.clientWidth,
                        height: macdContainerRef.current.clientHeight || 120,
                    });
                } catch {}
            }
            if (stochChartObjRef.current?.chart && stochContainerRef.current) {
                try {
                    stochChartObjRef.current.chart.applyOptions({
                        width: stochContainerRef.current.clientWidth,
                        height: stochContainerRef.current.clientHeight || 120,
                    });
                } catch {}
            }
        };

        const ro = new ResizeObserver(() => {
            handleResizeSubPanes();
        });

        if (rsiContainerRef.current) ro.observe(rsiContainerRef.current);
        if (macdContainerRef.current) ro.observe(macdContainerRef.current);
        if (stochContainerRef.current) ro.observe(stochContainerRef.current);

        return () => {
            ro.disconnect();
        };
    }, [activeIndicators]);

    return {
        rsiChartObjRef,
        macdChartObjRef,
        stochChartObjRef
    };
}
