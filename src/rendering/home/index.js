import React from 'react'
import dynamic from 'next/dynamic'
import Herobanner from './herobanner'
import AnimatedSection from '@/components/animation/AnimatedSection'

// Dynamically import below-the-fold sections for faster initial page load & better LCP
const SliderSection = dynamic(() => import('./sliderSection'))
const TradersSection = dynamic(() => import('./tradersSection'))
const TradingDesk = dynamic(() => import('./tradingDesk'))
const WhyChooseUs = dynamic(() => import('./whyChooseUs'))
const HowitWorks = dynamic(() => import('./howitWorks'))
const TradeSetup = dynamic(() => import('./tradeSetup'))
const EcosystemSection = dynamic(() => import('./ecosystemSection'))
const ClientSection = dynamic(() => import('./clientSection'))
const FaqSection = dynamic(() => import('./faqSection'))
const NewsletterSection = dynamic(() => import('./newsletterSection'))
const PlansSection = dynamic(() => import('./plansSection'))
const ReadyTostart = dynamic(() => import('./readyTostart'))

export default function HomePage() {
    return (
        <div>
            <Herobanner />
            <AnimatedSection><SliderSection /></AnimatedSection>
            {/* <StatsSection /> */}
            <AnimatedSection><TradersSection /></AnimatedSection>
            <AnimatedSection><TradingDesk /></AnimatedSection>
            <AnimatedSection><WhyChooseUs /></AnimatedSection>
            <AnimatedSection><HowitWorks /></AnimatedSection>
            <AnimatedSection><TradeSetup /></AnimatedSection>
            <AnimatedSection><EcosystemSection /></AnimatedSection>
            <AnimatedSection><ClientSection /></AnimatedSection>
            <AnimatedSection><FaqSection /></AnimatedSection>
            <AnimatedSection><NewsletterSection /></AnimatedSection>
            <AnimatedSection><PlansSection /></AnimatedSection>
            <AnimatedSection><ReadyTostart /></AnimatedSection>
        </div>
    )
}
