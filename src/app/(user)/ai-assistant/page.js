'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AiAssistant from '@/rendering/aiAssistant';

function AiAssistantWithParams() {
    const params = useSearchParams();
    const initialTab = params.get('tab') || undefined;
    const initialOpenId = params.get('open') || undefined;
    const initialOpenJob = params.get('openJob') || undefined;
    const initialPrompt = params.get('prompt') || undefined;
    return (
        <AiAssistant
            initialTab={initialTab}
            initialOpenId={initialOpenId}
            initialOpenJob={initialOpenJob}
            initialPrompt={initialPrompt}
        />
    );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <AiAssistantWithParams />
        </Suspense>
    );
}
