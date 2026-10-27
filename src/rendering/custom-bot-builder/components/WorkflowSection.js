"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../customBotBuilder.module.scss';

const STEPS = [
  {
    num: "01",
    title: "Choose Your Builder",
    desc: "Start with AI Bot Builder or Custom Bot Builder."
  },
  {
    num: "02",
    title: "Define Your Strategy",
    desc: "Describe your idea or configure every rule manually."
  },
  {
    num: "03",
    title: "Configure Parameters",
    desc: "Set indicators, conditions, risk, position sizing and execution logic."
  },
  {
    num: "04",
    title: "Backtest Your Bot",
    desc: "Use historical market data to evaluate how your strategy performed."
  },
  {
    num: "05",
    title: "Refine & Optimize",
    desc: "Review the results, adjust parameters and run new simulations."
  },
  {
    num: "06",
    title: "Deploy Your Bot",
    desc: "Once your strategy is ready, move it into your ChronosX bot workflow."
  }
];

export default function WorkflowSection() {
  return (
    <section className={styles.workflowSection}>
      <div className="container">
        <SectionHeader
          badge="SECTION 05 — THE BOT CREATION FLOW"
          title1="From Idea to"
          title2="Executable Strategy"
          description="A structured end-to-end framework to take any trading concept into an algorithmic, deployable bot."
        />

        <div className={styles.workflowStepsGrid}>
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              className={styles.workflowStepCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
            >
              <div className={styles.stepNumBadge}>{step.num} — STEP</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
