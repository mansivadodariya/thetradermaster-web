export const PAIRS_CONFIG = {
    'XAU/USD': { contractSize: 100, pipSize: 0.01, defaultPrice: 4308.18, base: 'XAU', quote: 'USD', type: 'metal' },
    'EUR/USD': { contractSize: 100000, pipSize: 0.0001, defaultPrice: 1.08450, base: 'EUR', quote: 'USD', type: 'forex' },
    'GBP/USD': { contractSize: 100000, pipSize: 0.0001, defaultPrice: 1.29200, base: 'GBP', quote: 'USD', type: 'forex' },
    'USD/JPY': { contractSize: 100000, pipSize: 0.01, defaultPrice: 154.200, base: 'USD', quote: 'JPY', type: 'jpy' },
    'AUD/USD': { contractSize: 100000, pipSize: 0.0001, defaultPrice: 0.65400, base: 'AUD', quote: 'USD', type: 'forex' },
    'USD/CAD': { contractSize: 100000, pipSize: 0.0001, defaultPrice: 1.38500, base: 'USD', quote: 'CAD', type: 'forex' },
    'USD/CHF': { contractSize: 100000, pipSize: 0.0001, defaultPrice: 0.88400, base: 'USD', quote: 'CHF', type: 'forex' },
    'NZD/USD': { contractSize: 100000, pipSize: 0.0001, defaultPrice: 0.59800, base: 'NZD', quote: 'USD', type: 'forex' },
    'BTC/USD': { contractSize: 1, pipSize: 1, defaultPrice: 94250.00, base: 'BTC', quote: 'USD', type: 'crypto' },
    'ETH/USD': { contractSize: 1, pipSize: 0.1, defaultPrice: 2780.00, base: 'ETH', quote: 'USD', type: 'crypto' },
};

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'JPY', 'CAD', 'AUD', 'CHF', 'NZD'];

export const RATES_TO_USD = {
    USD: 1.0,
    EUR: 1.08450,
    GBP: 1.29200,
    AUD: 0.65400,
    NZD: 0.59800,
    CAD: 1 / 1.38500,
    CHF: 1 / 0.88400,
    JPY: 1 / 154.200,
    AED: 1 / 3.6725,
    XAU: 4308.18,
    BTC: 94250.00,
    ETH: 2780.00,
};

export const LEVERAGES = [
    { label: '1:1 (No Leverage)', value: 1 },
    { label: '1:10', value: 10 },
    { label: '1:20', value: 20 },
    { label: '1:30', value: 30 },
    { label: '1:50', value: 50 },
    { label: '1:100', value: 100 },
    { label: '1:200', value: 200 },
    { label: '1:400', value: 400 },
    { label: '1:500', value: 500 },
    { label: '1:1000', value: 1000 },
];
