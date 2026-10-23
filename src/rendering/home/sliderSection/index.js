"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './sliderSection.module.scss';
// const MetaIcon = '/assets/icons/Img2.svg';
const EdufinsIcon = '/assets/icons/edufins.svg';
const AvaTradeIcon = '/assets/images/site-logo-20y-on-dark.svg';
const AsicIcon = '/assets/icons/asic.svg';
const AlgomaticIcon = '/assets/icons/algomaticIcon.svg';
const TickmillIcon = '/assets/logo/tickmill-logo-dark-animated.webp';
const images = [EdufinsIcon, AvaTradeIcon, AlgomaticIcon, TickmillIcon];
// Duplicate array 4 times to ensure it covers large screens and loops seamlessly
const duplicatedImages = [...images, ...images, ...images, ...images];

export default function SliderSection() {
    return (
        <div className={styles.sliderSection}>
            <div className="container-xs">
                <div className={styles.sliderWrapper}>
                    <motion.div
                        className={styles.sliderTrack}
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30
                        }}
                    >
                        {duplicatedImages.map((img, index) => (
                            <img key={index} src={img} alt={`brand-icon-${index}`} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
