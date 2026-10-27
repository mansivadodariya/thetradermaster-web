'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LineText from '@/components/lineText';
import styles from './learningOpportunity.module.scss';

export default function LearningOpportunity() {
    const { t } = useLanguage();
    const scenarioCards = [
        {
            type: 'losing',
            tag: t('learningOpp.tag1', 'Losing Trade?'),
            title: t('learningOpp.title1', 'Analyze Execution Issues'),
            desc: t('learningOpp.desc1', 'Find the execution issues that may have contributed to the loss.'),
        },
        {
            type: 'winning',
            tag: t('learningOpp.tag2', 'Winning Trade?'),
            title: t('learningOpp.title2', 'Recognize Quality Setups'),
            desc: t('learningOpp.desc2', 'Understand what you did correctly so you can recognize similar high-quality setups.'),
        },
        {
            type: 'repeating',
            tag: t('learningOpp.tag3', 'Repeating Mistakes?'),
            title: t('learningOpp.title3', 'Identify Bad Habits'),
            desc: t('learningOpp.desc3', 'Compare your reviewed trades and identify patterns in your execution.'),
        },
        {
            type: 'unsure',
            tag: t('learningOpp.tag4', 'Unsure Process?'),
            title: t('learningOpp.title4', 'Build Consistency'),
            desc: t('learningOpp.desc4', 'Use your previous trades to see where your decision-making can become more consistent.'),
        },
    ];

    return (
        <section className={styles.learningOpportunity}>
            <div className="container-xs">
                <div className={styles.sectionHeader}>
                    <LineText text={t('learningOpp.badge', 'Adaptive Learning')} />
                    <h2>
                        {t('learningOpp.mainTitlePart1', 'Turn Every Trade Into a')} <span className={styles.neonText}>{t('learningOpp.mainTitlePart2', 'Learning Opportunity')}</span>
                    </h2>
                </div>

                <div className={styles.scenariosGrid}>
                    {scenarioCards.map((sc, idx) => (
                        <motion.div
                            key={idx}
                            className={`${styles.scenarioCard} ${styles[sc.type]}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                            <span className={styles.badgeTag}>{sc.tag}</span>
                            <h4>{sc.title}</h4>
                            <p>{sc.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
