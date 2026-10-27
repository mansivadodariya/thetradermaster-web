import { useState } from 'react';
import { toast } from '@/components/toast';
import { DEFAULT_INDICATOR_CONFIGS } from '../constants/chartConstants';

export function useIndicatorState({
    activeIndicators,
    setActiveIndicators,
    movingAverages,
    setMovingAverages,
    chartRef,
    maSeriesRefs
}) {
    const [indicatorConfigs, setIndicatorConfigs] = useState(DEFAULT_INDICATOR_CONFIGS);
    const [indicatorVisibility, setIndicatorVisibility] = useState({
        ema10: true,
        ema20: true,
        ema50: true,
        bollinger: true,
        pivot: true,
        rsi: true,
        macd: true,
        stochastic: true,
    });
    const [editingIndicator, setEditingIndicator] = useState(null);

    const toggleIndicatorVisibility = (key) => {
        setIndicatorVisibility(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const removeIndicator = (key) => {
        setActiveIndicators(prev => ({ ...prev, [key]: false }));
    };

    const openIndicatorSettings = (key) => {
        setEditingIndicator(key);
    };

    const addMovingAverage = (type = 'EMA', suggestedLength = null) => {
        if (type === 'EMA_TOGGLE') {
            setMovingAverages(prev => prev.filter(m => m.type !== 'EMA'));
            return;
        }
        if (type === 'SMA_TOGGLE') {
            setMovingAverages(prev => prev.filter(m => m.type !== 'SMA'));
            return;
        }

        const activeOverlayCount = ['bollinger', 'pivot', 'rsi', 'macd', 'stochastic'].filter(k => Boolean(activeIndicators?.[k])).length;
        const activeMACount = movingAverages ? movingAverages.filter(m => m.visible).length : 0;
        if (activeOverlayCount + activeMACount >= 3) {
            toast('Maximum 3 indicators can be selected at a time');
            return;
        }

        const disabledPreset = movingAverages.find(m => m.type === type && !m.visible);
        if (disabledPreset && !suggestedLength) {
            setMovingAverages(prev => prev.map(m => m.id === disabledPreset.id ? { ...m, visible: true } : m));
            return;
        }

        let nextLength = suggestedLength;
        if (!nextLength) {
            const existingLengths = movingAverages.filter(m => m.type === type && m.visible).map(m => m.length || m.period);
            const standardLengths = [20, 50, 200, 10, 9, 21, 55, 89, 100];
            nextLength = standardLengths.find(l => !existingLengths.includes(l)) || (20 + (existingLengths.length * 10));
        }
        const defaultColors = type === 'EMA' ? ['#38BDF8', '#AA00FF', '#FF1744'] : ['#00E5FF', '#0284C7', '#00E676'];
        const colorIndex = movingAverages.filter(m => m.type === type).length % defaultColors.length;
        const newMA = {
            id: `ma_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: `${type} ${nextLength}`,
            type,
            length: nextLength,
            period: nextLength,
            source: 'close',
            color: defaultColors[colorIndex],
            lineWidth: 1.5,
            visible: true,
        };
        setMovingAverages(prev => [...prev, newMA]);
    };

    const toggleMAVisibility = (id) => {
        setMovingAverages(prev => {
            const target = prev.find(m => m.id === id);
            if (target && !target.visible) {
                const activeOverlayCount = ['bollinger', 'pivot', 'rsi', 'macd', 'stochastic'].filter(k => Boolean(activeIndicators?.[k])).length;
                const activeMACount = prev.filter(m => m.visible).length;
                if (activeOverlayCount + activeMACount >= 3) {
                    toast('Maximum 3 indicators can be selected at a time');
                    return prev;
                }
            }
            return prev.map(m => m.id === id ? { ...m, visible: !m.visible } : m);
        });
    };

    const removeMovingAverage = (id) => {
        setMovingAverages(prev => prev.filter(m => m.id !== id));
        if (maSeriesRefs?.current) {
            const s = maSeriesRefs.current.get(id);
            if (s && chartRef.current) {
                try { chartRef.current.removeSeries(s); } catch {}
                maSeriesRefs.current.delete(id);
            }
        }
    };

    const saveIndicatorConfig = (newCfg) => {
        if (!editingIndicator) return;
        if (editingIndicator.startsWith('ma_')) {
            setMovingAverages(prev => prev.map(m => {
                if (m.id === editingIndicator) {
                    const finalType = newCfg.type || m.type || 'EMA';
                    const finalLength = newCfg.length !== undefined ? Number(newCfg.length) : (m.length || 20);
                    return {
                        ...m,
                        ...newCfg,
                        type: finalType,
                        length: finalLength,
                        period: finalLength,
                        name: `${finalType} ${finalLength}`,
                    };
                }
                return m;
            }));
        } else {
            setIndicatorConfigs(prev => ({ ...prev, [editingIndicator]: newCfg }));
        }
    };

    const resetIndicatorDefaults = () => {
        if (!editingIndicator) return;
        if (editingIndicator.startsWith('ma_')) {
            setMovingAverages(prev => prev.map(m => {
                if (m.id === editingIndicator) {
                    const defaultLen = 20;
                    const finalType = m.type || 'EMA';
                    return {
                        ...m,
                        length: defaultLen,
                        period: defaultLen,
                        name: `${finalType} ${defaultLen}`,
                        source: 'close',
                        lineWidth: 1.5,
                    };
                }
                return m;
            }));
        } else {
            setIndicatorConfigs(prev => ({
                ...prev,
                [editingIndicator]: { ...DEFAULT_INDICATOR_CONFIGS[editingIndicator] }
            }));
        }
    };

    return {
        indicatorConfigs,
        setIndicatorConfigs,
        indicatorVisibility,
        setIndicatorVisibility,
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
    };
}
