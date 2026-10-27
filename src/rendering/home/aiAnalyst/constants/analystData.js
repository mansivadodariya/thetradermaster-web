export const tabPresets = {
  chat: {
    user: "Analyze top intraday breakout setups with institutional volume surges.",
    time: "10:24 AM",
    intro: "High-conviction institutional breakout detected on Gold (XAU/USD):",
    bullets: [
      "H1 Order Block breached with +2.8x volume surge & 1 : 2.6 R:R."
    ],
    chartData: {
      chartType: "breakout",
      symbol: "XAU/USD · Gold Spot",
      timeframe: "1H · INTRADAY",
      action: "STRONG BUY",
      conviction: "94%",
      entry: "$2,748.50",
      tp: "$2,768.00 (+1.95%)",
      sl: "$2,741.00 (-0.27%)",
      rr: "1 : 2.60",
      yTicks: ["$2,768.0", "$2,748.5", "$2,741.0"],
      xTicks: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      telemetry: "Institutional Volume +2.8x · Alignment Rating 94.8% · London/NY Confluence"
    },
    pills: ["XAU/USD Breakout", "Volume Surge", "H1 Order Block", "Liquidity Map"]
  },
  chart: {
    user: "Generate MT5 automated strategy parameters & optimal R:R for EUR/USD.",
    time: "10:26 AM",
    intro: "MetaTrader 5 Confluence & Execution Parameters:",
    bullets: [
      "Asian liquidity sweep confirmed at 1.0845 with 50 EMA dynamic rebound."
    ],
    chartData: {
      chartType: "confluence",
      symbol: "EUR/USD · Euro / US Dollar",
      timeframe: "15M · SCALP/DAY",
      action: "LONG PULLBACK",
      conviction: "91%",
      entry: "1.0845",
      tp: "1.0925 (+80 pips)",
      sl: "1.0818 (-27 pips)",
      rr: "1 : 2.96",
      yTicks: ["1.0925", "1.0845", "1.0818"],
      xTicks: ["10:15", "10:30", "10:45", "11:00", "11:15", "11:30"],
      telemetry: "ADX 34.2 Momentum · MT5 Bridge Synced · Zero Lag Signal"
    },
    pills: ["EUR/USD Confluence", "MT5 Execution", "London Killzone", "Dynamic SL/TP"]
  },
  sliders: {
    user: "Scan watchlist for active Fair Value Gaps (FVG) and liquidity sweeps.",
    time: "10:28 AM",
    intro: "Real-Time Scanner — Unmitigated FVGs & Institutional Pools:",
    bullets: [
      "4H Bullish FVG imbalance retested with clean London open buyer absorption."
    ],
    chartData: {
      chartType: "fvg",
      symbol: "GBP/USD · British Pound",
      timeframe: "4H · SWING",
      action: "FVG RETEST BUY",
      conviction: "89%",
      entry: "1.2980",
      tp: "1.3070 (+90 pips)",
      sl: "1.2945 (-35 pips)",
      rr: "1 : 2.57",
      yTicks: ["1.3070", "1.2980", "1.2945"],
      xTicks: ["04:00", "08:00", "12:00", "16:00", "20:00", "00:00"],
      telemetry: "Unmitigated Imbalance Filled · Smart Money Order Flow · High Conviction"
    },
    pills: ["GBP/USD FVG", "Imbalance Fill", "Order Flow", "Session High Target"]
  },
  report: {
    user: "Audit my last 50 closed trades and detect behavioral execution leaks.",
    time: "10:30 AM",
    intro: "Performance Audit & Behavioral Diagnostics:",
    bullets: [
      "London/NY killzone filtering eliminates 62% of drawdown (2.41 Profit Factor)."
    ],
    chartData: {
      chartType: "audit",
      symbol: "PORTFOLIO DIAGNOSTICS",
      timeframe: "50 TRADES · AUDIT",
      action: "OPTIMAL RECOVERY",
      conviction: "88%",
      entry: "Win Rate: 68.4%",
      tp: "Profit Factor: 2.41",
      sl: "Max DD: 4.2%",
      rr: "Avg R:R 1:2.85",
      yTicks: ["+24.8%", "18.2%", "0.0%"],
      xTicks: ["T1-10", "T11-20", "T21-30", "T31-40", "T41-50", "Live"],
      telemetry: "68.4% Win Rate · 2.41 Profit Factor · Behavioral Leak Mitigated"
    },
    pills: ["Trade Statement Audit", "Leak Detection", "Win Rate Optimizer", "Risk Matrix"]
  }
};

export const tabKeys = ['chat', 'chart', 'sliders', 'report'];

export const featurePoints = [
  {
    num: "01",
    title: "Grounded in Live Platform Telemetry.",
    desc: "TraderMaster inspects real-time tick data, scanner rankings, and your active charts. It reasons directly from live market reality—not generic internet guesses."
  },
  {
    num: "02",
    title: "Algorithms Are the Source of Truth.",
    desc: "The AI interprets the underlying mathematical models and breakout triggers verbatim. It never hallucinates nonexistent trades or forces bad entries."
  },
  {
    num: "03",
    title: "Zero False Confidence.",
    desc: "When market conditions are murky or conviction is low, the AI warns you to stay in cash and shows the exact underlying data rather than guessing."
  }
];
