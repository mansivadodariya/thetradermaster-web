'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AiAssistant from '@/rendering/aiAssistant';

function MarketAssistantWithParams() {
    const params = useSearchParams();
    const initialTab = params.get('tab') || undefined;
    const initialOpenId = params.get('open') || undefined;
    const initialPrompt = params.get('prompt') || params.get('q') || params.get('message') || undefined;
    return (
        <AiAssistant
            initialTab={initialTab}
            initialOpenId={initialOpenId}
            initialPrompt={initialPrompt}
        />
    );
}

export default function MarketAssistantPage() {
    return (
        <Suspense fallback={null}>
            <MarketAssistantWithParams />
        </Suspense>
    );
}
