"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authNavigate } from '@/lib/authRedirect';
import styles from './chartAnalysis.module.scss';
import SectionHeader from '@/components/sectionHeader';
import Button from '@/components/button';

// Animated SVG 1: Upload Your Chart
function UploadChartSvg() {
  return (
    <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.interactiveSvg}>
      <defs>
        <filter id="uploadGlow" x="90" y="50" width="100" height="90" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#6EE7B7" floodOpacity="0.8" />
        </filter>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#062218" />
          <stop offset="100%" stopColor="#03100B" />
        </linearGradient>
      </defs>

      {/* Dark glass tablet frame */}
      <rect x="30" y="20" width="220" height="140" rx="12" fill="#040b08" fillOpacity="0.9" stroke="#18c98b" strokeOpacity="0.4" strokeWidth="1.5" />
      
      {/* Tablet header dots */}
      <circle cx="48" cy="34" r="3" fill="#6EE7B7" fillOpacity="0.8" />
      <circle cx="58" cy="34" r="3" fill="#18c98b" fillOpacity="0.5" />
      <circle cx="68" cy="34" r="3" fill="#18c98b" fillOpacity="0.5" />
      
      {/* Grid lines */}
      <line x1="45" y1="55" x2="235" y2="55" stroke="#18c98b" strokeOpacity="0.15" strokeDasharray="3 3" />
      <line x1="45" y1="90" x2="235" y2="90" stroke="#18c98b" strokeOpacity="0.15" strokeDasharray="3 3" />
      <line x1="45" y1="125" x2="235" y2="125" stroke="#18c98b" strokeOpacity="0.15" strokeDasharray="3 3" />
      <line x1="85" y1="45" x2="85" y2="145" stroke="#18c98b" strokeOpacity="0.15" strokeDasharray="3 3" />
      <line x1="140" y1="45" x2="140" y2="145" stroke="#18c98b" strokeOpacity="0.15" strokeDasharray="3 3" />
      <line x1="195" y1="45" x2="195" y2="145" stroke="#18c98b" strokeOpacity="0.15" strokeDasharray="3 3" />

      {/* Dynamic Background Data Bars */}
      <g opacity="0.45">
        <motion.rect
          x="55"
          y="95"
          width="5"
          height="30"
          fill="#6EE7B7"
          rx="1"
          animate={{ scaleY: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "57px 125px" }}
        />
        <motion.rect
          x="75"
          y="75"
          width="5"
          height="40"
          fill="#18c98b"
          rx="1"
          animate={{ scaleY: [1.1, 0.7, 1.1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          style={{ transformOrigin: "77px 115px" }}
        />
        <motion.rect
          x="195"
          y="80"
          width="5"
          height="45"
          fill="#6EE7B7"
          rx="1"
          animate={{ scaleY: [0.7, 1.2, 0.7] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ transformOrigin: "197px 125px" }}
        />
        <motion.rect
          x="215"
          y="65"
          width="5"
          height="55"
          fill="#6EE7B7"
          rx="1"
          animate={{ scaleY: [1.2, 0.8, 1.2] }}
          transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          style={{ transformOrigin: "217px 120px" }}
        />
      </g>

      {/* Floating Glowing Cloud Upload Group */}
      <motion.g
        filter="url(#uploadGlow)"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Cloud shape */}
        <path
          d="M140 65C127.5 65 117.2 73.8 115 85.5C108.5 87 104 93 104 100C104 108.3 110.7 115 119 115H161C168.2 115 174 109.2 174 102C174 95.3 169 89.8 162.5 89.1C160.5 75.5 151.5 65 140 65Z"
          fill="url(#cloudGrad)"
          stroke="#6EE7B7"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Upload Arrow with Moving Surge */}
        <motion.g
          animate={{ y: [3, -5, 3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M140 106V85M140 85L131 94M140 85L149 94"
            stroke="#6EE7B7"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </motion.g>
    </svg>
  );
}

// Animated SVG 2: AI Market Analysis (Moving Magnifying Glass & Candlesticks)
function AnalysisChartSvg() {
  return (
    <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.interactiveSvg}>
      <defs>
        <filter id="glassGlow" x="100" y="30" width="130" height="130" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#6EE7B7" floodOpacity="0.75" />
        </filter>
        <radialGradient id="lensGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#18c98b" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Dark glass tablet */}
      <rect x="30" y="20" width="220" height="140" rx="12" fill="#040b08" fillOpacity="0.9" stroke="#18c98b" strokeOpacity="0.4" strokeWidth="1.5" />
      
      {/* Tablet header dots */}
      <circle cx="48" cy="34" r="3" fill="#EF4444" />
      <circle cx="58" cy="34" r="3" fill="#6EE7B7" />
      <circle cx="68" cy="34" r="3" fill="#34D399" />

      {/* Moving Candlesticks in Price Action */}
      {/* Red Candlesticks */}
      <motion.g
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <line x1="65" y1="80" x2="65" y2="135" stroke="#EF4444" strokeWidth="1.5" />
        <rect x="61" y="90" width="8" height="35" fill="#EF4444" rx="1.5" />
      </motion.g>

      <motion.g
        animate={{ y: [2, -2, 2] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        <line x1="85" y1="95" x2="85" y2="145" stroke="#EF4444" strokeWidth="1.5" />
        <rect x="81" y="105" width="8" height="30" fill="#EF4444" rx="1.5" />
      </motion.g>

      {/* Green Candlesticks */}
      <motion.g
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <line x1="105" y1="65" x2="105" y2="130" stroke="#34D399" strokeWidth="1.5" />
        <rect x="101" y="75" width="8" height="40" fill="#34D399" rx="1.5" />
      </motion.g>

      <motion.g
        animate={{ y: [3, -3, 3] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      >
        <line x1="125" y1="50" x2="125" y2="120" stroke="#34D399" strokeWidth="1.5" />
        <rect x="121" y="60" width="8" height="45" fill="#34D399" rx="1.5" />
      </motion.g>

      {/* Green/Gold Bullish Surge */}
      <motion.g
        animate={{ y: [-2, 4, -2] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <line x1="145" y1="40" x2="145" y2="110" stroke="#34D399" strokeWidth="1.5" />
        <rect x="141" y="50" width="8" height="50" fill="#34D399" rx="1.5" />
      </motion.g>

      <motion.g
        animate={{ y: [2, -2, 2] }}
        transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <line x1="165" y1="55" x2="165" y2="125" stroke="#EF4444" strokeWidth="1.5" />
        <rect x="161" y="65" width="8" height="45" fill="#EF4444" rx="1.5" />
      </motion.g>

      <motion.g
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <line x1="185" y1="45" x2="185" y2="115" stroke="#34D399" strokeWidth="1.5" />
        <rect x="181" y="55" width="8" height="50" fill="#34D399" rx="1.5" />
      </motion.g>

      <motion.g
        animate={{ y: [3, -3, 3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        <line x1="205" y1="35" x2="205" y2="100" stroke="#34D399" strokeWidth="1.5" />
        <rect x="201" y="45" width="8" height="40" fill="#34D399" rx="1.5" />
      </motion.g>

      {/* Moving & Scanning Green 3D Magnifying Glass */}
      <motion.g
        filter="url(#glassGlow)"
        animate={{
          x: [-18, 12, -18],
          y: [-5, 6, -5],
          rotate: [-4, 4, -4]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: "160px 85px" }}
      >
        {/* Glass lens fill */}
        <circle cx="160" cy="85" r="28" fill="url(#lensGrad)" stroke="#6EE7B7" strokeWidth="3.5" />
        <circle cx="160" cy="85" r="23" stroke="#18c98b" strokeWidth="1.5" strokeOpacity="0.7" />
        
        {/* Glass reflection arc */}
        <path d="M143 72C148 66 156 63 165 64" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        
        {/* Green Handle */}
        <line x1="180" y1="105" x2="208" y2="133" stroke="#6EE7B7" strokeWidth="6" strokeLinecap="round" />
        <line x1="180" y1="105" x2="208" y2="133" stroke="#03100B" strokeWidth="2.2" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

// Animated SVG 3: Get Your Trade Plan (Checklist & Pulsing Target)
function TargetPlanSvg() {
  return (
    <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.interactiveSvg}>
      <defs>
        <filter id="targetGlow" x="135" y="35" width="110" height="110" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#6EE7B7" floodOpacity="0.85" />
        </filter>
        <radialGradient id="targetInnerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="60%" stopColor="#18c98b" />
          <stop offset="100%" stopColor="#064E3B" />
        </radialGradient>
      </defs>

      {/* Clipboard on the left */}
      <rect x="70" y="25" width="110" height="135" rx="8" fill="#091812" stroke="#18c98b" strokeOpacity="0.5" strokeWidth="1.5" />
      
      {/* Clipboard clip at top */}
      <rect x="105" y="18" width="40" height="14" rx="4" fill="#6EE7B7" stroke="#040b08" strokeWidth="1.5" />
      <circle cx="125" cy="25" r="2.5" fill="#040b08" />

      {/* Checklist items with sequential tick animations */}
      <g stroke="#6EE7B7" strokeWidth="1.8" strokeLinecap="round">
        {/* Row 1 */}
        <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.1 }}>
          <rect x="85" y="48" width="12" height="12" rx="2" fill="rgba(24, 201, 139, 0.2)" />
          <path d="M88 54L91 57L98 50" strokeWidth="2" />
          <line x1="105" y1="54" x2="160" y2="54" strokeOpacity="0.8" />
        </motion.g>

        {/* Row 2 */}
        <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}>
          <rect x="85" y="70" width="12" height="12" rx="2" fill="rgba(24, 201, 139, 0.2)" />
          <path d="M88 76L91 79L98 72" strokeWidth="2" />
          <line x1="105" y1="76" x2="155" y2="76" strokeOpacity="0.8" />
        </motion.g>

        {/* Row 3 */}
        <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.7 }}>
          <rect x="85" y="92" width="12" height="12" rx="2" fill="rgba(24, 201, 139, 0.2)" />
          <path d="M88 98L91 101L98 94" strokeWidth="2" />
          <line x1="105" y1="98" x2="150" y2="98" strokeOpacity="0.8" />
        </motion.g>

        {/* Row 4 */}
        <motion.g animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.2, repeat: Infinity, delay: 1.0 }}>
          <rect x="85" y="114" width="12" height="12" rx="2" fill="rgba(24, 201, 139, 0.2)" />
          <path d="M88 120L91 123L98 116" strokeWidth="2" />
          <line x1="105" y1="120" x2="158" y2="120" strokeOpacity="0.8" />
        </motion.g>
      </g>

      {/* Dynamic 3D Target & Arrow on the right with Pulse & Vibration */}
      <motion.g
        filter="url(#targetGlow)"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "185px 88px" }}
      >
        {/* Target outer rings */}
        <circle cx="185" cy="88" r="38" fill="#040d09" stroke="#6EE7B7" strokeWidth="3" />
        <circle cx="185" cy="88" r="26" stroke="#18c98b" strokeWidth="2.5" />
        <circle cx="185" cy="88" r="15" fill="url(#targetInnerGrad)" stroke="#6EE7B7" strokeWidth="2" />
        <circle cx="185" cy="88" r="6" fill="#040b08" />

        {/* Green Arrow hitting Bullseye with Impact Vibration */}
        <motion.g
          animate={{
            x: [0, -2, 0],
            y: [0, 2, 0]
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path d="M218 55L188 85" stroke="#6EE7B7" strokeWidth="4" strokeLinecap="round" />
          {/* Arrow flights/feathers */}
          <path d="M214 47L224 57M210 51L220 61M218 43L228 53" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

const stepData = [
  {
    step: '01',
    component: <UploadChartSvg />,
    title: 'Upload Your Chart',
    desc: 'Upload your trading chart and let AI analyze the market structure.',
    hasPedestal: true
  },
  {
    step: '02',
    component: <AnalysisChartSvg />,
    title: 'AI Market Analysis',
    desc: 'AI analyzes trends, indicators, price action, and market conditions.',
    hasPedestal: false
  },
  {
    step: '03',
    component: <TargetPlanSvg />,
    title: 'Get Your Trade Plan',
    desc: 'Receive an AI-powered trade setup with entry, target, and risk information.',
    hasPedestal: true
  }
];

export default function ChartAnalysis() {
  const router = useRouter();
  return (
    <div className={styles.chartAnalysis}>
      <div className='container'>
        <SectionHeader
          badge="CHART ANALYSIS"
          title1="Analyze Any Trade"
          title2="Setup in 3 Simple Steps"
          description="Upload a chart and let AI uncover the potential trade opportunities."
        />

        <div className={styles.stepsFlow}>
          {/* Connector Arrow between step 1 and 2 */}
          <motion.div 
            className={styles.connectorBadgeOne}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </motion.div>
          
          {/* Connector Arrow between step 2 and 3 */}
          <motion.div 
            className={styles.connectorBadgeTwo}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18C98B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </motion.div>

          <div className={styles.stepsGrid}>
            {stepData.map((item, index) => (
              <motion.div 
                key={index} 
                className={styles.stepCard}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.18,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className={styles.graphicArea}>
                  <div className={styles.graphicImg}>
                    {item.component}
                  </div>
                  {item.hasPedestal && (
                    <div className={styles.pedestal}>
                      <div className={styles.pedestalLight}></div>
                      <div className={styles.pedestalRingOuter}></div>
                      <div className={styles.pedestalRingInner}></div>
                      <div className={styles.pedestalGlow}></div>
                    </div>
                  )}
                </div>

                <div className={styles.cardBox}>
                  <div className={styles.stepBadgePill}>
                    <span>STEP {item.step}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className={styles.ctaWrapper}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              text="START SCANNING WITH AI"
              icon="/assets/icons/right.svg"
              onClick={() => authNavigate(router, '/chart-scanner')}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
