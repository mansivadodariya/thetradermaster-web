import React from 'react'
import TradeSnapBanner from './tradeSnapBanner'
import TradeSetup from '../home/tradeSetup'

export default function TradeSnapPage() {
    return (
        <div style={{ backgroundColor: '#030E09' }}>
            <TradeSnapBanner />
            <TradeSetup />
        </div>
    )
}
