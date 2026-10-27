export const SAMPLE_TRADES = [
    {
        id: 'eurusd-loss',
        title: 'EUR/USD Short Breakout',
        pair: 'EUR/USD',
        timeframe: '15M / 1H',
        result: 'LOSS',
        percent: '-1.42%',
        score: 62,
        rr: '1 : 1.2',
        wrongEntryPrice: '1.08420',
        betterEntryPrice: '1.08750',
        verdict: 'Premature breakout entry into 1H supply zone without confirmation.',
        mistakes: [
            'Entered before confirmation of structure break',
            'No clear trend direction on higher timeframe',
            'SL placed too tight in a volatile zone',
            'Poor risk to reward ratio'
        ],
        improvements: [
            'Wait for market confirmation before entering',
            'Follow higher timeframe trend alignment',
            'Place SL beyond key structural levels',
            'Look for setups offering a minimum 1:2.5 R:R'
        ]
    },
    {
        id: 'btcusdt-fomo',
        title: 'BTC/USDT Long Impulse',
        pair: 'BTC/USDT',
        timeframe: '5M / 4H',
        result: 'LOSS',
        percent: '-2.15%',
        score: 54,
        rr: '1 : 0.8',
        wrongEntryPrice: '$64,820',
        betterEntryPrice: '$62,900',
        verdict: 'Chased green expansion candle into 4H major liquidity resistance.',
        mistakes: [
            'Chased aggressive green candle into 4H resistance',
            'Entered on extended RSI divergence (>82)',
            'Over-leveraged position with no liquidity sweep',
            'Ignored macroeconomic high-impact news window'
        ],
        improvements: [
            'Never enter at the top of an extended impulsive leg',
            'Wait for 4H retracement into optimal order block',
            'Size position strictly according to account 1% risk rule',
            'Check economic calendar before high-impact releases'
        ]
    },
    {
        id: 'xauusd-win',
        title: 'XAU/USD Gold Retracement',
        pair: 'XAU/USD',
        timeframe: '30M / Daily',
        result: 'WIN (Premature Exit)',
        percent: '+0.85%',
        score: 78,
        rr: '1 : 1.5',
        wrongEntryPrice: '$2,318.50',
        betterEntryPrice: '$2,312.00',
        verdict: 'Solid technical direction but exited full volume prematurely before daily liquidity target.',
        mistakes: [
            'Exited full position prematurely before key liquidity pool',
            'Sub-optimal entry on minor wick pullback',
            'Cut winners short due to emotional anxiety'
        ],
        improvements: [
            'Implement partial take-profits to capture full daily target',
            'Use trailing stop-loss behind market structure',
            'Stick to pre-defined risk-reward roadmap without emotion'
        ]
    }
];
