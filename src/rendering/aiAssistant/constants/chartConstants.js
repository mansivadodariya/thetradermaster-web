import React from 'react';

export const DEFAULT_INDICATOR_CONFIGS = {
    ema10: { length: 10, source: 'close', color: '#00E5FF', lineWidth: 1.5 },
    ema20: { length: 20, source: 'close', color: '#38BDF8', lineWidth: 1.5 },
    ema50: { length: 50, source: 'close', color: '#AA00FF', lineWidth: 1.5 },
    bollinger: { length: 20, stdDev: 2, source: 'close', color: 'rgba(24, 201, 139, 0.7)', lineWidth: 1 },
    pivot: { type: 'Standard', pColor: '#38BDF8', rColor: '#EF5350', sColor: '#26A69A', lineWidth: 1 },
    rsi: { length: 14, overbought: 70, oversold: 30, color: '#AA00FF', lineWidth: 1.8 },
    macd: { fast: 12, slow: 26, signal: 9, macdColor: '#00E5FF', signalColor: '#38BDF8', lineWidth: 1.8 },
    stochastic: { kPeriod: 14, dPeriod: 3, smooth: 3, kColor: '#00E5FF', dColor: '#38BDF8', lineWidth: 1.8 },
};

export const SYMBOL_DATABASE = [
    { symbol: 'No Pair', name: 'No Specific Currency Pair', category: 'all' },
    // Forex
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex' },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'forex' },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'forex' },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'forex' },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'forex' },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'forex' },
    { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', category: 'forex' },
    { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'forex' },
    { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', category: 'forex' },
    { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'forex' },
    { symbol: 'EUR/AUD', name: 'Euro / Australian Dollar', category: 'forex' },
    { symbol: 'EUR/CAD', name: 'Euro / Canadian Dollar', category: 'forex' },
    { symbol: 'GBP/AUD', name: 'British Pound / Australian Dollar', category: 'forex' },
    { symbol: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', category: 'forex' },
    { symbol: 'CAD/JPY', name: 'Canadian Dollar / Japanese Yen', category: 'forex' },
    // Digital Assets
    { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'crypto' },
    { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'crypto' },
    { symbol: 'SOL/USD', name: 'Solana / US Dollar', category: 'crypto' },
    { symbol: 'XRP/USD', name: 'Ripple / US Dollar', category: 'crypto' },
    // Commodities
    { symbol: 'XAU/USD', name: 'Gold / US Dollar', category: 'commodities' },
    { symbol: 'XAG/USD', name: 'Silver / US Dollar', category: 'commodities' },
    { symbol: 'WTI/USD', name: 'Crude Oil WTI', category: 'commodities' },
];

export const PAIR_GROUPS = [
    {
        label: 'MAJOR PAIRS',
        pairs: ['EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'XAU/USD'],
    },
    {
        label: 'EURO CROSSES',
        pairs: ['EUR/GBP', 'EUR/CHF', 'EUR/JPY', 'EUR/AUD', 'EUR/CAD', 'EUR/NZD'],
    },
    {
        label: 'POUND CROSSES',
        pairs: ['GBP/JPY', 'GBP/AUD', 'GBP/CAD', 'GBP/CHF', 'GBP/NZD'],
    },
    {
        label: 'YEN CROSSES',
        pairs: ['CHF/JPY', 'CAD/JPY', 'AUD/JPY', 'NZD/JPY'],
    },
    {
        label: 'COMMODITIES & DIGITAL ASSETS',
        pairs: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD', 'XAU/USD', 'XAG/USD', 'WTI/USD'],
    },
];

export const ALL_PAIRS = ['No Pair', ...PAIR_GROUPS.flatMap((g) => g.pairs)];

export const TIMEFRAMES = [
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '30m', value: '30m' },
    { label: '1h', value: '1h' },
    // { label: '4h', value: '4h' },
    { label: '1d', value: '1d' },
];

export const CHART_TYPES = [
    { label: 'Candlestick', value: 'candlestick' },
    { label: 'Line', value: 'line' },
    { label: 'Area', value: 'area' },
];

export const DEFAULT_MAIN_OVERLAYS = [
    // EMA Presets
    { id: 'ema_20',  name: 'EMA 20',  type: 'EMA', length: 20,  period: 20,  color: '#38BDF8', source: 'close', lineWidth: 1.5, visible: true },
    { id: 'ema_50',  name: 'EMA 50',  type: 'EMA', length: 50,  period: 50,  color: '#AA00FF', source: 'close', lineWidth: 1.5, visible: false },
    { id: 'ema_200', name: 'EMA 200', type: 'EMA', length: 200, period: 200, color: '#FF1744', source: 'close', lineWidth: 1.5, visible: true },
    // SMA Presets
    { id: 'sma_20',  name: 'SMA 20',  type: 'SMA', length: 20,  period: 20,  color: '#00E5FF', source: 'close', lineWidth: 1.5, visible: false },
    { id: 'sma_50',  name: 'SMA 50',  type: 'SMA', length: 50,  period: 50,  color: '#FF9100', source: 'close', lineWidth: 1.5, visible: false },
    { id: 'sma_200', name: 'SMA 200', type: 'SMA', length: 200, period: 200, color: '#00E676', source: 'close', lineWidth: 1.5, visible: false },
];

export const MA_COLOR_PALETTE = ['#38BDF8', '#00E5FF', '#AA00FF', '#0284C7', '#FF1744', '#00E676', '#26A69A', '#E91E63', '#18C98B'];

export const DEFAULT_ACTIVE_INDICATORS = {
    bollinger: false,
    pivot: false,
    rsi: false,
    macd: false,
    stochastic: false,
};

