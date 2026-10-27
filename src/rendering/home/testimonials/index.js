"use client";
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import styles from './testimonials.module.scss';
import SectionHeader from '@/components/sectionHeader';

export default function Testimonials() {
  const { t } = useLanguage();

  const testimonialsData = [
    {
      rating: 5,
      quote: t('homeSections.testimonials.quote1', '"The signals are sharp and the AI analysis explains the reasoning behind every setup. My entries have never been cleaner."'),
      initials: 'DM',
      name: 'Daniel Mercer',
      role: t('homeSections.testimonials.role1', 'Full-Time Forex Trader')
    },
    {
      rating: 5,
      quote: t('homeSections.testimonials.quote2', '"I upload a chart, get a full trade plan with entry, target and risk in seconds. It replaced hours of manual work."'),
      initials: 'AR',
      name: 'Aisha Rahman',
      role: t('homeSections.testimonials.role2', 'Swing Trader')
    },
    {
      rating: 5,
      quote: t('homeSections.testimonials.quote3', '"Risk management tools alone are worth it. The AI keeps me disciplined and out of low-quality trades."'),
      initials: 'MR',
      name: 'Marcus Reed',
      role: t('homeSections.testimonials.role3', 'Prop Firm Trader')
    },
    {
      rating: 5,
      quote: t('homeSections.testimonials.quote4', '"The breakout confirmation alerts caught the entire gold surge before the London open. Absolute game changer."'),
      initials: 'LS',
      name: 'Liam Sterling',
      role: t('homeSections.testimonials.role4', 'Commodities Trader')
    },
    {
      rating: 5,
      quote: t('homeSections.testimonials.quote5', '"Having institutional heat list rankings mapped alongside raw price action completely eliminated second-guessing."'),
      initials: 'EV',
      name: 'Elena Vasilev',
      role: t('homeSections.testimonials.role5', 'Quant Trader')
    },
    {
      rating: 5,
      quote: t('homeSections.testimonials.quote6', '"Backtesting my custom ICT strategies against 5 years of tick data gave me the edge I needed to get funded."'),
      initials: 'LB',
      name: 'Lucas Bennett',
      role: t('homeSections.testimonials.role6', 'Funded Account Trader')
    }
  ];

  const halfItems = [...testimonialsData, ...testimonialsData];

  return (
    <div className={styles.testimonials}>
      <div className='container'>
        <SectionHeader
          badge={t('homeSections.testimonials.badge', 'TESTIMONIALS')}
          title1={t('homeSections.testimonials.title1', 'Used by Serious')}
          title2={t('homeSections.testimonials.title2', 'Forex Traders')}
          description={t('homeSections.testimonials.description', 'Real reviews from active traders using TraderMaster.')}
        />
      </div>
      {/* Standard Width Marquee with Foggy Edge Layers */}
      <div className={styles.marqueeWrapper} dir="ltr">
        <div className={styles.fogLeft}></div>
        <div className={styles.fogRight}></div>

        <div className={styles.marqueeTrack} dir="ltr">
          <div className={styles.marqueeGroup} dir="ltr">
            {halfItems.map((item, index) => (
              <div key={`t-a-${index}`} className={styles.card} dir="ltr">
                <div className={styles.stars}>
                  {[...Array(item.rating)].map((_, i) => (
                    <img key={i} src="/assets/icons/star.svg" alt="star" />
                  ))}
                </div>

                <p className={styles.quote}>{item.quote}</p>

                <div className={styles.author}>
                  <div className={styles.avatar}>{item.initials}</div>
                  <div className={styles.authorInfo}>
                    <h4>{item.name}</h4>
                    <span>{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.marqueeGroup} aria-hidden="true" dir="ltr">
            {halfItems.map((item, index) => (
              <div key={`t-b-${index}`} className={styles.card} dir="ltr">
                <div className={styles.stars}>
                  {[...Array(item.rating)].map((_, i) => (
                    <img key={i} src="/assets/icons/star.svg" alt="star" />
                  ))}
                </div>

                <p className={styles.quote}>{item.quote}</p>

                <div className={styles.author}>
                  <div className={styles.avatar}>{item.initials}</div>
                  <div className={styles.authorInfo}>
                    <h4>{item.name}</h4>
                    <span>{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

