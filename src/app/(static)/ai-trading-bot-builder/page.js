import CustomBotBuilderView from '@/rendering/custom-bot-builder';

export const metadata = {
  title: 'AI Trading Bot Builder — Build Your Strategy, Automate Your Edge | TraderMaster',
  description: 'Turn your trading ideas into configurable algorithmic bots with TraderMaster. Choose an AI-powered workflow to describe your strategy in plain English, or build every rule manually with the Custom Bot Builder.',
  alternates: {
    canonical: 'https://thetradermaster.com/ai-trading-bot-builder',
  },
};

export default function AiTradingBotBuilderPage() {
  return <CustomBotBuilderView />;
}
