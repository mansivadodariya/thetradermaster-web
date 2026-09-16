import React from 'react'
import Herobanner from './herobanner'
import SliderSection from './sliderSection'
import StatsSection from './statsSection'
import TradersSection from './tradersSection'
import TradingDesk from './tradingDesk'
import WhyChooseUs from './whyChooseUs'
import HowitWorks from './howitWorks'
import TradeSetup from './tradeSetup'
import EcosystemSection from './ecosystemSection'
import ClientSection from './clientSection'
import FaqSection from './faqSection'
import NewsletterSection from './newsletterSection'
import PlansSection from './plansSection'
import ReadyTostart from './readyTostart'

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
