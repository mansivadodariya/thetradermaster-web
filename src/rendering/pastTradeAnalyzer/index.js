import React from 'react';
import Banner from './banner';
import AiTradeReview from './aiTradeReview';
import ReviewFeatures from './reviewFeatures';
import InsideTrade from './insideTrade';
import LearningOpportunity from './learningOpportunity';
import AnalysisProcess from './analysisProcess';
import ReportIncludes from './reportIncludes';
import TradingPatterns from './tradingPatterns';
import WhyReview from './whyReview';
import ReadyToAnalyze from './readyToAnalyze';
import PastTradeFaq from './pastTradeFaq';

export default function PastTradeAnalyzerPage() {
    return (
        <div style={{ backgroundColor: '#030E09' }}>
            <Banner />
            <AiTradeReview />
            <ReviewFeatures />
            <InsideTrade />
            <LearningOpportunity />
            <AnalysisProcess />
            <ReportIncludes />
            <TradingPatterns />
            <WhyReview />
            <ReadyToAnalyze />
            <PastTradeFaq />
        </div>
    );
}
