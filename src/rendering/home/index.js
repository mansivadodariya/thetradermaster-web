import React from 'react'
import dynamic from 'next/dynamic'
import Herobanner from './herobanner'
import SliderSection from './sliderSection'
import TradersSection from './tradersSection'
import TradingDesk from './tradingDesk'

// Dynamically import below-the-fold sections for faster initial page load & better LCP
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
            <SliderSection />
            {/* <StatsSection /> */}
            <TradersSection />
            <TradingDesk />
            <WhyChooseUs />
            <HowitWorks />
            <TradeSetup />
            <EcosystemSection />
            <ClientSection />
            <FaqSection />
            <NewsletterSection />
            <PlansSection />
            <ReadyTostart />
        </div>
    )
}
