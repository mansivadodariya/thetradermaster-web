"use client";
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './globalNetworkMap.module.scss';
import SectionHeader from '@/components/sectionHeader';
import { hubs, routes, buildCurveD } from './networkData';

const GlobeMapImage = '/assets/images/globe-map.svg';

export default function GlobalNetworkMap() {
  const { t } = useLanguage();
  const [activeHubId, setActiveHubId] = useState(null);

  const handleMouseEnterHub = (hubId) => {
    setActiveHubId(hubId);
  };

  const handleMouseLeaveHub = () => {
    setActiveHubId(null);
  };

  return (
    <section className={styles.networkMapSection}>
      <div className="container">
        <SectionHeader
          badge={t('homeSections.globalNetworkMap.badge', 'GLOBAL INFRASTRUCTURE')}
          title1={t('homeSections.globalNetworkMap.title1', 'Ultra Low-Latency')}
          title2={t('homeSections.globalNetworkMap.title2', 'AI Execution Mesh')}
          description={t('homeSections.globalNetworkMap.description', 'Connected directly to tier-1 liquidity providers and major financial exchanges worldwide for institutional-grade signal speed.')}
        />

        <div className={styles.mapCard}>
          <div className={styles.scanlineTop} />
          <div className={styles.scanlineBottom} />
          <div className={styles.lightShineSweep} />
          <div className={styles.lightShineSweep2} />

          <div className={styles.svgWrapper}>
            {/* Base Pixel World Map SVG */}
            <div className={styles.globeMapBg}>
              <img
                src={GlobeMapImage}
                alt="Global Network Map Base"
                className={styles.mapImg}
                loading="eager"
                decoding="async"
              />
            </div>

            {/* High-performance Interactive Overlay SVG */}
            <svg viewBox="0 20 833 415" xmlns="http://www.w3.org/2000/svg" className={styles.overlaySvg}>
              <defs>
                {/* Title Matching Green Gradient for Curves */}
                <linearGradient id="goldRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#18c98b" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#6EE7B7" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#18c98b" stopOpacity="0.2" />
                </linearGradient>

                {/* Radial gradient glow for comets */}
                <radialGradient id="cometHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="40%" stopColor="#6EE7B7" stopOpacity="0.95" />
                  <stop offset="70%" stopColor="#18c98b" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#18c98b" stopOpacity="0" />
                </radialGradient>

                {/* Continuous Title Green Shimmer Sweep Gradient for Badges */}
                <linearGradient id="badgeShimmerSweep" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#18c98b" stopOpacity="0">
                    <animate attributeName="offset" values="-1; 1" dur="6.5s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="50%" stopColor="#6EE7B7" stopOpacity="0.38">
                    <animate attributeName="offset" values="-0.5; 1.5" dur="6.5s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#18c98b" stopOpacity="0">
                    <animate attributeName="offset" values="0; 2" dur="6.5s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>



              {/* Render Network Route Connections */}
              <g className="networkRoutes">
                {routes.map((route, i) => {
                  const fromHub = hubs.find(h => h.id === route.from);
                  const toHub = hubs.find(h => h.id === route.to);
                  if (!fromHub || !toHub) return null;

                  const curveD = buildCurveD(fromHub.x, fromHub.y, toHub.x, toHub.y, route.lift);
                  const isHighlighted = activeHubId === route.from || activeHubId === route.to;
                  const pathId = `globe-route-path-${i}`;

                  return (
                    <g key={i}>
                      <path
                        id={pathId}
                        d={curveD}
                        className={`${styles.routeCurve} ${isHighlighted ? styles.highlighted : ''}`}
                      />

                      {/* Smooth GPU Particle Comet */}
                      <circle r="4" fill="url(#cometHalo)" className={styles.particleComet}>
                        <animateMotion
                          dur={route.dur}
                          repeatCount="indefinite"
                          rotate="auto"
                        >
                          <mpath href={`#${pathId}`} />
                        </animateMotion>
                      </circle>
                    </g>
                  );
                })}
              </g>

              {/* Render Trading Hub Nodes (Native SVG elements for 60FPS speed) */}
              <g className="tradingHubs">
                {hubs.map((hub) => {
                  const isActive = activeHubId === hub.id;
                  const badgeWidth = Math.max(hub.name.length * 6.2 + 16, 32);
                  const isLeft = hub.align === 'left';
                  const badgeX = isLeft ? hub.x - badgeWidth - 12 : hub.x + 12;
                  const badgeY = hub.y - 8.5;
                  const badgeHeight = 17;

                  return (
                    <g
                      key={hub.id}
                      className={`${styles.hubGroup} ${isActive ? styles.activeHub : ''}`}
                      onMouseEnter={() => handleMouseEnterHub(hub.id)}
                      onMouseLeave={handleMouseLeaveHub}
                    >
                      {/* Sonar Pulse Ring */}
                      <circle cx={hub.x} cy={hub.y} r="14" className={styles.hubGlowRing} />
                      <circle cx={hub.x} cy={hub.y} r="6" className={styles.hubRippleRing} />
                      <circle cx={hub.x} cy={hub.y} r="3" className={styles.hubCoreDot} />
                      <circle cx={hub.x} cy={hub.y} r="1.2" fill="#FFFFFF" />

                      {/* Native SVG City Tag Badge */}
                      <g className={styles.hubBadgeG}>
                        <rect
                          x={badgeX}
                          y={badgeY}
                          width={badgeWidth}
                          height={badgeHeight}
                          rx="4.5"
                          className={`${styles.hubBadgeRect} ${hub.isSpecial ? styles.specialBadgeRect : ''}`}
                        />
                        {/* Dynamic Traveling Golden Shimmer Light Layer */}
                        <rect
                          x={badgeX}
                          y={badgeY}
                          width={badgeWidth}
                          height={badgeHeight}
                          rx="4.5"
                          fill="url(#badgeShimmerSweep)"
                          className={styles.hubBadgeShimmerLayer}
                        />
                        <text
                          x={badgeX + badgeWidth / 2}
                          y={hub.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={`${styles.hubBadgeText} ${hub.isSpecial ? styles.specialBadgeText : ''}`}
                        >
                          {hub.name}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
