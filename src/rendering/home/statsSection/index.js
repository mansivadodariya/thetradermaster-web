'use client'
import React, { useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import styles from './statsSection.module.scss'
import { useLanguage } from '@/context/LanguageContext'
import { useEffect } from 'react'

function AnimatedCounter({ value, suffix = '', prefix = '' }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const count = useMotionValue(0)
    const rounded = useTransform(count, (v) => Math.round(v))

    useEffect(() => {
        if (isInView) {
            const controls = animate(count, value, {
                duration: 2,
                ease: 'easeOut',
            })
            return controls.stop
        }
    }, [isInView, value, count])

    return (
        <span ref={ref} className={styles.counterValue}>
            {prefix}
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    )
}

export default function StatsSection() {
    const { t } = useLanguage()

    const stats = [
        {
            value: 50,
            suffix: '+',
            label: t('home.statsPairs', 'Currency Pairs Supported'),
        },
        {
            value: 3,
            suffix: '',
            label: t('home.statsTools', 'AI-Powered Trading Tools'),
        },
        {
            value: 24,
            suffix: '/7',
            label: t('home.statsAnalysis', 'Real-Time Market Analysis'),
        },
        {
            value: 4,
            suffix: '',
            prefix: '',
            label: t('home.statsSteps', 'Simple Steps to Get Started'),
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
        },
    }

    return (
        <section className={styles.statsSection}>
            <div className="container">
                <motion.div
                    className={styles.statsGrid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className={styles.statItem}
                            variants={itemVariants}
                        >
                            <div className={styles.statNumber}>
                                <AnimatedCounter
                                    value={stat.value}
                                    suffix={stat.suffix}
                                    prefix={stat.prefix || ''}
                                />
                            </div>
                            <p className={styles.statLabel}>{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
