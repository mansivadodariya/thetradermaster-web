"use client";
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/sectionHeader';
import styles from '../customBotBuilder.module.scss';

const CONFIG_LAYERS = [
  {
    layer: "Market",
    control: "Symbol, market & timeframe"
  },
  {
    layer: "Indicators",
    control: "EMA, RSI, MACD, Bollinger Bands & more"
  },
  {
    layer: "Entry Logic",
    control: "Multiple technical conditions & confirmations"
  },
  {
    layer: "Exit Logic",
    control: "Take Profit, Stop Loss & Trailing Stop"
  },
  {
    layer: "Risk",
    control: "Risk parameters & risk-reward structure"
  },
  {
    layer: "Position Size",
    control: "Custom lot-size / sizing formulas"
  },
  {
    layer: "Execution",
    control: "Trade direction and execution conditions"
  }
];

export default function ConfigurableLayersSection() {
  return (
    <section className={styles.configurableLayersSection}>
      <div className="container">
        <SectionHeader
          badge="SECTION 06 — WHAT YOU CAN CONFIGURE"
          title1="Everything Behind the Strategy,"
          title2="In One Place"
          description="Total control over every algorithmic component of your trading system — without touching a line of code."
        />

        <motion.div
          className={styles.tableWrapper}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <table className={styles.layersTable}>
            <thead>
              <tr>
                <th>Strategy Layer</th>
                <th>What You Control</th>
              </tr>
            </thead>
            <tbody>
              {CONFIG_LAYERS.map((item, idx) => (
                <tr key={idx}>
                  <td className={styles.layerCell}>
                    <span className={styles.layerBadge}>{item.layer}</span>
                  </td>
                  <td className={styles.controlCell}>
                    {item.control}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
