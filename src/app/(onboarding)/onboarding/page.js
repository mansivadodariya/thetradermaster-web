import Onboarding from '@/rendering/onboarding';
import React from 'react';

export const metadata = {
    title: 'Onboarding | ChronosX',
    description: 'Personalize your trading experience with ChronosX AI trading tools and market insights.',
};

export default function OnboardingPage() {
    return (
        <main>
            <Onboarding />
        </main>
    );
}
