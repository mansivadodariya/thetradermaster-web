'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import WhiteLabelHero from './components/WhiteLabelHero';
import WhiteLabelIntro from './components/WhiteLabelIntro';
import WhiteLabelCapabilities from './components/WhiteLabelCapabilities';
import WhiteLabelMakeItYours from './components/WhiteLabelMakeItYours';
import WhiteLabelHowItWorks from './components/WhiteLabelHowItWorks';
import WhiteLabelFaq from './components/WhiteLabelFaq';
import WhiteLabelInquiryForm from './components/WhiteLabelInquiryForm';
import CommonCta from '@/components/commonCta';
import styles from './whiteLabel.module.scss';

export default function WhiteLabel() {
    const scrollToInquiryForm = () => {
        const el = document.getElementById('whiteLabelInquiryForm');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <main className={styles.whiteLabelPage}>
            {/* Ambient Background Lighting & Tech Grid */}
            <div className={styles.ambientGlowTop} />
            <div className={styles.ambientGlowRight} />
            <div className={styles.ambientGlowLeft} />
            <div className={styles.gridPatternOverlay} />

            {/* 01 — Hero Section with Official Site Logo Mockup */}
            <WhiteLabelHero onContactClick={scrollToInquiryForm} />

            {/* 02 — Enterprise Architecture & Strategic Foundation */}
            <WhiteLabelIntro />

            {/* 03 — Core AI Platform Capabilities & Live Telemetry Stream */}
            <WhiteLabelCapabilities />

            {/* 04 — Interactive Brand Customization & Theme Simulator */}
            <WhiteLabelMakeItYours />

            {/* 05 — 4-Step Deployment Process & Enterprise Security Infrastructure */}
            <WhiteLabelHowItWorks />

            {/* 07 — Dedicated White-Label Inquiry & Lead Capture Form */}
            <WhiteLabelInquiryForm />

            {/* 06 — Frequently Asked Questions */}
            <WhiteLabelFaq />

            {/* 08 — Enterprise Conversion Call To Action */}
            <CommonCta
                badge="READY TO GET STARTED?"
                title1="Build Your Trading Platform"
                title2="With TraderMaster."
                description="Your business already has the vision. Now build the technology around it. Launch an AI-powered trading experience under your own brand with everything you need in one connected environment."
                primaryBtnText="TALK TO OUR TEAM"
                primaryBtnAction={scrollToInquiryForm}
                secondaryBtnText="EXPLORE TRADERMASTER"
                secondaryBtnAction="/capabilities"
            />
        </main>
    );
}

