import React from 'react'
import dynamic from 'next/dynamic'
import styles from './home.module.scss'
import Herobanner from './herobanner'
import Capabilities from './capabilities'

// Dynamically split below-the-fold components for blazing fast initial page load
const MetricsSection = dynamic(() => import('./metricsSection'))
const AiCockpit = dynamic(() => import('./aiCockpit'))
const AiAnalyst = dynamic(() => import('./aiAnalyst'))
const BeforeAfterComparison = dynamic(() => import('./beforeAfterComparison'))
const HowitWorks = dynamic(() => import('./howitWorks'))
const MarketIntelligence = dynamic(() => import('./marketIntelligence'))
const BreakoutDetection = dynamic(() => import('./breakoutDetection'))
const TeamUp = dynamic(() => import('./teamUp'))
const BrokersSection = dynamic(() => import('./brokersSection'))
const GlobalNetworkMap = dynamic(() => import('./globalNetworkMap'))
const Testimonials = dynamic(() => import('./testimonials'))
const ReadytoPut = dynamic(() => import('./readytoPut'))

export default function HomePage() {
    return (
        <div className={styles.homeWrapper}>
            <Herobanner />
            <div className={styles.contentSections}>
                <Capabilities />
                <MetricsSection />
                <AiCockpit isHero={false} showHeader={true} />
                <AiAnalyst />
                <BrokersSection />
                <BeforeAfterComparison />
                <HowitWorks />
                <MarketIntelligence />
                <BreakoutDetection />
                <TeamUp />
                <GlobalNetworkMap />
                <Testimonials />
                <ReadytoPut />
            </div>
        </div>  
    )
}

