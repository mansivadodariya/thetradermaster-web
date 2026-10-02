'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LineText from '@/components/lineText';
import styles from './whyReview.module.scss';

export default function WhyReview() {
    const { t } = useLanguage();
    const whyCards = [
        {
            title: t('whyReview.c1Title', 'Stop Repeating the Same Mistakes'),
            desc: t('whyReview.c1Desc', 'A mistake becomes expensive when it keeps happening. Review your previous trades and identify recurring execution problems.'),
        },
        {
            title: t('whyReview.c2Title', 'Understand What Works for You'),
            desc: t('whyReview.c2Desc', 'Learn which setups, conditions, and execution patterns have worked best within your own trading history.'),
        },
        {
            title: t('whyReview.c3Title', 'Improve Trading Discipline'),
            desc: t('whyReview.c3Desc', 'Create a habit of reviewing decisions instead of focusing only on the final profit or loss.'),
        },
        {
            title: t('whyReview.c4Title', 'Make Your Journal More Useful'),
            desc: t('whyReview.c4Desc', 'Turn raw trade records into structured insights you can actually use.'),
        },
        {
            title: t('whyReview.c5Title', 'Become More Consistent'),
            desc: t('whyReview.c5Desc', 'The objective is not to make every trade perfect. It is to make your decision-making process more consistent over time.'),
        },
    ];

    return (
        <section className={styles.whyReview}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text={t('whyReview.badge', 'Core Benefits')} />
                    <h2>
                        {t('whyReview.titlePart1', 'Why Review')} <span className={styles.neonText}>{t('whyReview.titlePart2', 'Past Trades?')}</span>
                    </h2>
                </div>

                <div className={styles.whyGrid}>
                    {whyCards.map((w, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.whyCard}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: idx * 0.08 }}
                        >
                            <h3>{w.title}</h3>
                            <p>{w.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className={styles.dataBanner}>
                    <h3>{t('whyReview.bannerTitle', 'Your Trading History Is Your Data')}</h3>
                    <p>
                        {t('whyReview.bannerDesc', 'Every completed trade contains information about your strategy, execution, risk, and decision-making. Instead of letting those trades disappear into a spreadsheet or trading platform history, use them as a source of feedback. Your past trades can become one of your most valuable learning tools. Past Trade Analyzer helps you extract that information.')}
                    </p>
                </div>
            </div>
        </section>
    );
}
