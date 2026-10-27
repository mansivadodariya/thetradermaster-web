import ForexCalculator from '@/rendering/calculator';

export const metadata = {
    title: 'Forex & Trading Calculators | ChronosX',
    description: 'Precision pip value, margin requirements, Fibonacci retracements, pivot points, and position sizing risk calculator.',
};

export default function CalculatorPage() {
    return <ForexCalculator />;
}
