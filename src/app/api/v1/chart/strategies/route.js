import { NextResponse } from 'next/server';
import { serverFetch } from '@/lib/serverFetch';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const primaryBase = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || '').replace(/\/+$/, '');

    if (primaryBase) {
        let res = null;
        try {
            res = await serverFetch(`${primaryBase}/api/v1/chart/strategies`, {
                timeoutMs: 4500,
                clientSignal: request?.signal,
                headers: {
                    'accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data);
            }
            await res.body?.cancel().catch(() => {});
        } catch (e) {
            if (res && !res.bodyUsed) {
                await res.body?.cancel().catch(() => {});
            }
            console.warn('API route strategies fetch failed:', e.message);
        }
    }

    return NextResponse.json({
        strategies: [
            { id: '3e8d2b78-0e86-4fdf-9759-338276db1742', name: 'EMA Pullback', description: 'Trend Following EMA Pullback' }
        ]
    });
}
