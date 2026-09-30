import dynamic from 'next/dynamic';
import Banner from './banner';

const AiTradeReview = dynamic(() => import('./aiTradeReview'));
const ReviewFeatures = dynamic(() => import('./reviewFeatures'));
const InsideTrade = dynamic(() => import('./insideTrade'));
const LearningOpportunity = dynamic(() => import('./learningOpportunity'));
const AnalysisProcess = dynamic(() => import('./analysisProcess'));
const ReportIncludes = dynamic(() => import('./reportIncludes'));
const TradingPatterns = dynamic(() => import('./tradingPatterns'));
const WhyReview = dynamic(() => import('./whyReview'));
const ReadyToAnalyze = dynamic(() => import('./readyToAnalyze'));
const PastTradeFaq = dynamic(() => import('./pastTradeFaq'));

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
