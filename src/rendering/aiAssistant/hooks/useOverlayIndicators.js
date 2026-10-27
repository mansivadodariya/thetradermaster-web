'use client';

import { useEffect, useRef } from 'react';
import { LineSeries } from 'lightweight-charts';
import {
    getIndicatorData,
    calculateBollingerBands,
    calculatePivotPoints
} from '../utils/indicatorCalculations';

export default function useOverlayIndicators({
    chartRef,
    candlesDataRef,
    activeIndicators,
    indicatorConfigs,
    indicatorVisibility,
    movingAverages
}) {
    const maSeriesRefs = useRef(new Map());
    const bbUpperSeriesRef = useRef(null);
    const bbMiddleSeriesRef = useRef(null);
    const bbLowerSeriesRef = useRef(null);
    const pivotSeriesRefs = useRef([]);

    const updateIndicators = (candles) => {
        if (!chartRef.current || !candles || candles.length === 0) return;

        // 1. Dynamic Moving Averages (EMA & SMA)
        const currentMAIds = new Set(movingAverages.map(m => m.id));
        for (const [id, series] of maSeriesRefs.current.entries()) {
            if (!currentMAIds.has(id)) {
                try { chartRef.current.removeSeries(series); } catch {}
                maSeriesRefs.current.delete(id);
            }
        }

        movingAverages.forEach((ma) => {
            let s = maSeriesRefs.current.get(ma.id);
            if (!s) {
                s = chartRef.current.addSeries(LineSeries, {
                    color: ma.color,
                    lineWidth: ma.lineWidth || 1.5,
                    title: '',
                    visible: Boolean(ma.visible),
                });
                maSeriesRefs.current.set(ma.id, s);
            } else {
                try {
                    s.applyOptions({
                        color: ma.color,
                        lineWidth: ma.lineWidth || 1.5,
                        visible: Boolean(ma.visible),
                    });
                } catch {}
            }
            if (ma.visible) {
                const data = getIndicatorData(candles, ma.type, ma.length || ma.period, ma.source);
                try {
                    s.setData(Array.isArray(data) ? data : []);
                } catch (e) {
                    console.warn(`Error setting data for ${ma.id}:`, e);
                }
            } else {
                try { s.setData([]); } catch {}
            }
        });

        // 2. Bollinger Bands
        if (activeIndicators.bollinger) {
            const cfg = indicatorConfigs.bollinger;
            const isVis = indicatorVisibility.bollinger;
            const bb = calculateBollingerBands(candles, cfg.length, cfg.stdDev, cfg.source);
            if (!bbUpperSeriesRef.current) {
                bbUpperSeriesRef.current = chartRef.current.addSeries(LineSeries, { color: cfg.color, lineWidth: cfg.lineWidth, visible: isVis });
                bbMiddleSeriesRef.current = chartRef.current.addSeries(LineSeries, { color: cfg.color, lineWidth: cfg.lineWidth, lineStyle: 2, visible: isVis });
                bbLowerSeriesRef.current = chartRef.current.addSeries(LineSeries, { color: cfg.color, lineWidth: cfg.lineWidth, visible: isVis });
            } else {
                try {
                    bbUpperSeriesRef.current.applyOptions({ color: cfg.color, lineWidth: cfg.lineWidth, visible: isVis });
                    bbMiddleSeriesRef.current.applyOptions({ color: cfg.color, lineWidth: cfg.lineWidth, visible: isVis });
                    bbLowerSeriesRef.current.applyOptions({ color: cfg.color, lineWidth: cfg.lineWidth, visible: isVis });
                } catch {}
            }
            try {
                if (bb?.upper) bbUpperSeriesRef.current.setData(bb.upper);
                if (bb?.middle) bbMiddleSeriesRef.current.setData(bb.middle);
                if (bb?.lower) bbLowerSeriesRef.current.setData(bb.lower);
            } catch (e) {
                console.warn('Error setting Bollinger data:', e);
            }
        } else if (bbUpperSeriesRef.current) {
            try {
                chartRef.current.removeSeries(bbUpperSeriesRef.current);
                chartRef.current.removeSeries(bbMiddleSeriesRef.current);
                chartRef.current.removeSeries(bbLowerSeriesRef.current);
            } catch {}
            bbUpperSeriesRef.current = null;
            bbMiddleSeriesRef.current = null;
            bbLowerSeriesRef.current = null;
        }

        // 3. Pivot Points
        if (activeIndicators.pivot) {
            const cfg = indicatorConfigs.pivot;
            const isVis = indicatorVisibility.pivot;
            const pivots = calculatePivotPoints(candles);
            if (pivotSeriesRefs.current.length === 0) {
                pivotSeriesRefs.current = [
                    chartRef.current.addSeries(LineSeries, { color: cfg.pColor, lineWidth: cfg.lineWidth, lineStyle: 2, visible: isVis }),
                    chartRef.current.addSeries(LineSeries, { color: cfg.rColor, lineWidth: cfg.lineWidth, visible: isVis }),
                    chartRef.current.addSeries(LineSeries, { color: cfg.rColor, lineWidth: cfg.lineWidth, lineStyle: 1, visible: isVis }),
                    chartRef.current.addSeries(LineSeries, { color: cfg.sColor, lineWidth: cfg.lineWidth, visible: isVis }),
                    chartRef.current.addSeries(LineSeries, { color: cfg.sColor, lineWidth: cfg.lineWidth, lineStyle: 1, visible: isVis }),
                ];
            } else {
                pivotSeriesRefs.current.forEach(s => {
                    try { s.applyOptions({ visible: isVis }); } catch {}
                });
            }
            try {
                if (pivots?.P) pivotSeriesRefs.current[0].setData(pivots.P);
                if (pivots?.R1) pivotSeriesRefs.current[1].setData(pivots.R1);
                if (pivots?.R2) pivotSeriesRefs.current[2].setData(pivots.R2);
                if (pivots?.S1) pivotSeriesRefs.current[3].setData(pivots.S1);
                if (pivots?.S2) pivotSeriesRefs.current[4].setData(pivots.S2);
            } catch (e) {
                console.warn('Error setting Pivot data:', e);
            }
        } else if (pivotSeriesRefs.current.length > 0) {
            pivotSeriesRefs.current.forEach(s => {
                try { chartRef.current.removeSeries(s); } catch {}
            });
            pivotSeriesRefs.current = [];
        }
    };

    useEffect(() => {
        updateIndicators(candlesDataRef.current);
    }, [activeIndicators, indicatorConfigs, indicatorVisibility, movingAverages]);

    return {
        maSeriesRefs,
        updateIndicators
    };
}
