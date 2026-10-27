import CustomBotBuilderView from '@/rendering/custom-bot-builder';

export const metadata = {
  title: 'AI Trading Bot Builder — Build Your Strategy, Automate Your Edge | ChronosX',
  description: 'Turn your trading ideas into configurable algorithmic bots with ChronosX. Choose an AI-powered workflow to describe your strategy in plain English, or build every rule manually with the Custom Bot Builder.',
  alternates: {
    canonical: 'https://chronosx.com/custom-bot-builder',
  },
};

export default function CustomBotBuilderPage() {
  return <CustomBotBuilderView />;
}
