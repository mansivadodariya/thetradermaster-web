import React from 'react';
import TradeSnapBanner from './tradeSnapBanner';
import TradeSnapContent from './tradeSnapContent';

export default function TradeSnapPage() {
    return (
        <div style={{ backgroundColor: '#030E09' }}>
            <TradeSnapBanner />
            <TradeSnapContent />
        </div>
    );
}
