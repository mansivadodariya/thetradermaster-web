import React from 'react';
import { motion } from 'framer-motion';
import styles from '../aiAnalyst.module.scss';

export default function DedicatedChartRenderer({ chartData }) {
  if (!chartData) return null;
  const { chartType, yTicks, xTicks } = chartData;

  return (
    <motion.div
      className={styles.miniCandleChartCard}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* High-Definition SVG Stage with Explicit X and Y Axes */}
      <div className={styles.svgContainer}>
        <svg viewBox="0 0 460 145" className={styles.candleSvgStage} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="bullCandleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="bearCandleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="fvgZoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.22)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.05)" />
            </linearGradient>
            <linearGradient id="equityAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.35)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.0)" />
            </linearGradient>
          </defs>

          {/* 1. Y-AXIS GRID LINES & LABELS (LEFT AREA 0 to 52) */}
          <line x1="52" y1="8" x2="52" y2="124" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          
          {/* Top TP Level Line & Label */}
          <line x1="52" y1="22" x2="385" y2="22" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" opacity="0.65" />
          <text x="48" y="25" fill="#10B981" fontSize="8" fontWeight="700" textAnchor="end" fontFamily="sans-serif">
            {yTicks?.[0] || "2,768.0"}
          </text>
          <rect x="390" y="14" width="62" height="15" rx="3" fill="rgba(16, 185, 129, 0.15)" stroke="rgba(16, 185, 129, 0.5)" />
          <text x="421" y="25" fill="#10B981" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">TP TARGET</text>

          {/* Mid Entry Level Line & Label */}
          <line x1="52" y1="64" x2="385" y2="64" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.8" />
          <text x="48" y="67" fill="#38BDF8" fontSize="8" fontWeight="700" textAnchor="end" fontFamily="sans-serif">
            {yTicks?.[1] || "2,748.5"}
          </text>
          <rect x="390" y="56" width="62" height="15" rx="3" fill="rgba(56, 189, 248, 0.15)" stroke="rgba(56, 189, 248, 0.5)" />
          <text x="421" y="67" fill="#38BDF8" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">ENTRY</text>

          {/* Bottom SL Level Line & Label */}
          <line x1="52" y1="106" x2="385" y2="106" stroke="#EF4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.65" />
          <text x="48" y="109" fill="#EF4444" fontSize="8" fontWeight="700" textAnchor="end" fontFamily="sans-serif">
            {yTicks?.[2] || "2,741.0"}
          </text>
          <rect x="390" y="98" width="62" height="15" rx="3" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.5)" />
          <text x="421" y="109" fill="#EF4444" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">STOP LOSS</text>

          {/* 2. X-AXIS TIMESTAMPS (BOTTOM 124 to 142) */}
          <line x1="52" y1="124" x2="450" y2="124" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {(xTicks || ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"]).map((t, idx) => {
            const xPos = 65 + idx * 58;
            return (
              <g key={idx}>
                <line x1={xPos} y1="124" x2={xPos} y2="128" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <text x={xPos} y="137" fill="#64748B" fontSize="7.5" fontWeight="500" textAnchor="middle" fontFamily="sans-serif">
                  {t}
                </text>
              </g>
            );
          })}

          {/* 3. DEDICATED VISUALIZATION PER TYPE */}
          
          {/* TYPE 1: BREAKOUT SURGE (XAU/USD) */}
          {chartType === 'breakout' && (
            <g>
              {/* Order Block Breakout Shaded Zone */}
              <rect x="180" y="44" width="140" height="24" rx="4" fill="url(#fvgZoneGrad)" stroke="rgba(16, 185, 129, 0.35)" strokeDasharray="2 2" />
              <text x="186" y="38" fill="#10B981" fontSize="7.5" fontWeight="700" letterSpacing="0.4">
                H1 ORDER BLOCK BREAKOUT ($2,748)
              </text>

              {/* Candlesticks Sequence */}
              {[
                { x: 65, wickTop: 54, wickBottom: 94, bodyY: 62, bodyHeight: 24, isBull: false },
                { x: 98, wickTop: 62, wickBottom: 104, bodyY: 70, bodyHeight: 26, isBull: false },
                { x: 131, wickTop: 72, wickBottom: 110, bodyY: 78, bodyHeight: 24, isBull: false },
                { x: 164, wickTop: 68, wickBottom: 106, bodyY: 74, bodyHeight: 22, isBull: true },
                { x: 197, wickTop: 56, wickBottom: 90, bodyY: 60, bodyHeight: 24, isBull: true },
                { x: 230, wickTop: 42, wickBottom: 78, bodyY: 48, bodyHeight: 24, isBull: true },
                { x: 263, wickTop: 32, wickBottom: 66, bodyY: 36, bodyHeight: 24, isBull: true },
                { x: 296, wickTop: 24, wickBottom: 56, bodyY: 28, bodyHeight: 24, isBull: true },
                { x: 329, wickTop: 16, wickBottom: 46, bodyY: 20, bodyHeight: 22, isBull: true }
              ].map((c, idx) => (
                <g key={idx}>
                  <line x1={c.x + 6} y1={c.wickTop} x2={c.x + 6} y2={c.wickBottom} stroke={c.isBull ? '#10B981' : '#EF4444'} strokeWidth="1.2" />
                  <rect x={c.x} y={c.bodyY} width="12" height={c.bodyHeight} rx="2" fill={c.isBull ? 'url(#bullCandleGrad)' : 'url(#bearCandleGrad)'} />
                  {idx === 8 && <circle cx={c.x + 6} cy={c.bodyY} r="3" fill="#10B981" className={styles.beaconCircle} />}
                </g>
              ))}

              {/* Volume Bars at base */}
              {[12, 14, 10, 18, 26, 38, 48, 52, 62].map((vh, vi) => (
                <rect key={vi} x={66 + vi * 33} y={124 - vh * 0.35} width="10" height={vh * 0.35} fill={vi >= 5 ? '#10B981' : 'rgba(255,255,255,0.15)'} opacity={vi >= 5 ? 0.85 : 0.3} rx="1" />
              ))}
              <text x="350" y="112" fill="#10B981" fontSize="7" fontWeight="700">+2.8x VOL</text>
            </g>
          )}

          {/* TYPE 2: DYNAMIC 50 EMA CONFLUENCE REBOUND (EUR/USD) */}
          {chartType === 'confluence' && (
            <g>
              {/* Dynamic 50 EMA Curve */}
              <path
                d="M 52 92 C 120 90, 200 78, 280 62 S 360 42, 385 36"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeDasharray="4 2"
                opacity="0.85"
              />
              <text x="60" y="44" fill="#38BDF8" fontSize="7.5" fontWeight="700">
                DYNAMIC 50 EMA SUPPORT (1.0845)
              </text>

              {/* Candles hitting EMA floor and bouncing */}
              {[
                { x: 65, wickTop: 34, wickBottom: 72, bodyY: 40, bodyHeight: 24, isBull: false },
                { x: 98, wickTop: 50, wickBottom: 86, bodyY: 56, bodyHeight: 24, isBull: false },
                { x: 131, wickTop: 66, wickBottom: 98, bodyY: 72, bodyHeight: 22, isBull: false },
                { x: 164, wickTop: 76, wickBottom: 104, bodyY: 82, bodyHeight: 18, isBull: false },
                { x: 197, wickTop: 68, wickBottom: 100, bodyY: 74, bodyHeight: 20, isBull: true },
                { x: 230, wickTop: 54, wickBottom: 86, bodyY: 60, bodyHeight: 22, isBull: true },
                { x: 263, wickTop: 42, wickBottom: 74, bodyY: 46, bodyHeight: 22, isBull: true },
                { x: 296, wickTop: 30, wickBottom: 60, bodyY: 34, bodyHeight: 22, isBull: true },
                { x: 329, wickTop: 20, wickBottom: 50, bodyY: 24, bodyHeight: 22, isBull: true }
              ].map((c, idx) => (
                <g key={idx}>
                  <line x1={c.x + 6} y1={c.wickTop} x2={c.x + 6} y2={c.wickBottom} stroke={c.isBull ? '#10B981' : '#EF4444'} strokeWidth="1.2" />
                  <rect x={c.x} y={c.bodyY} width="12" height={c.bodyHeight} rx="2" fill={c.isBull ? 'url(#bullCandleGrad)' : 'url(#bearCandleGrad)'} />
                  {idx === 8 && <circle cx={c.x + 6} cy={c.bodyY} r="3" fill="#10B981" className={styles.beaconCircle} />}
                </g>
              ))}
            </g>
          )}

          {/* TYPE 3: FAIR VALUE GAP IMBALANCE (GBP/USD) */}
          {chartType === 'fvg' && (
            <g>
              {/* Shaded FVG Retest Box */}
              <rect x="150" y="58" width="130" height="32" rx="4" fill="url(#fvgZoneGrad)" stroke="rgba(16, 185, 129, 0.4)" strokeDasharray="3 3" />
              <text x="156" y="52" fill="#10B981" fontSize="7.5" fontWeight="700">
                4H FAIR VALUE GAP (1.2980)
              </text>

              {/* Candles filling FVG and expanding */}
              {[
                { x: 65, wickTop: 24, wickBottom: 62, bodyY: 30, bodyHeight: 24, isBull: true },
                { x: 98, wickTop: 18, wickBottom: 54, bodyY: 24, bodyHeight: 24, isBull: true },
                { x: 131, wickTop: 26, wickBottom: 64, bodyY: 32, bodyHeight: 22, isBull: false },
                { x: 164, wickTop: 48, wickBottom: 84, bodyY: 54, bodyHeight: 24, isBull: false },
                { x: 197, wickTop: 68, wickBottom: 104, bodyY: 74, bodyHeight: 22, isBull: false },
                { x: 230, wickTop: 56, wickBottom: 94, bodyY: 62, bodyHeight: 24, isBull: true },
                { x: 263, wickTop: 42, wickBottom: 76, bodyY: 48, bodyHeight: 24, isBull: true },
                { x: 296, wickTop: 30, wickBottom: 62, bodyY: 34, bodyHeight: 24, isBull: true },
                { x: 329, wickTop: 18, wickBottom: 48, bodyY: 22, bodyHeight: 22, isBull: true }
              ].map((c, idx) => (
                <g key={idx}>
                  <line x1={c.x + 6} y1={c.wickTop} x2={c.x + 6} y2={c.wickBottom} stroke={c.isBull ? '#10B981' : '#EF4444'} strokeWidth="1.2" />
                  <rect x={c.x} y={c.bodyY} width="12" height={c.bodyHeight} rx="2" fill={c.isBull ? 'url(#bullCandleGrad)' : 'url(#bearCandleGrad)'} />
                  {idx === 8 && <circle cx={c.x + 6} cy={c.bodyY} r="3" fill="#10B981" className={styles.beaconCircle} />}
                </g>
              ))}
            </g>
          )}

          {/* TYPE 4: PERFORMANCE AUDIT & EQUITY GROWTH CURVE */}
          {chartType === 'audit' && (
            <g>
              {/* Shaded Area under Equity Spline */}
              <path
                d="M 65 110 C 120 95, 175 80, 230 58 S 310 32, 340 22 L 340 124 L 65 124 Z"
                fill="url(#equityAreaGrad)"
              />
              {/* Smooth Glowing Equity Curve */}
              <path
                d="M 65 110 C 120 95, 175 80, 230 58 S 310 32, 340 22"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.9))"
              />
              {/* Milestone Dots */}
              <circle cx="65" cy="110" r="3" fill="#38BDF8" />
              <circle cx="175" cy="80" r="3.5" fill="#38BDF8" />
              <circle cx="260" cy="50" r="3.5" fill="#6EE7B7" />
              <circle cx="340" cy="22" r="4.5" fill="#10B981" className={styles.beaconCircle} />

              <text x="65" y="44" fill="#10B981" fontSize="8" fontWeight="700">
                +24.8% NET PNL GROWTH (50 TRADES AUDITED)
              </text>
            </g>
          )}
        </svg>
      </div>
    </motion.div>
  );
}
