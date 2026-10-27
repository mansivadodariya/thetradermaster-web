import { NextResponse } from 'next/server';
import { serverFetch } from '@/lib/serverFetch';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'XAUUSD';
    const lang = searchParams.get('lang') || 'en';
    const strategyId = searchParams.get('strategy_id') || searchParams.get('strategyId') || '';

    const query = new URLSearchParams({ symbol, lang });
    if (strategyId) query.set('strategy_id', strategyId);

    const primaryBase = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || '').replace(/\/+$/, '');

    if (primaryBase) {
        let res = null;
        try {
            res = await serverFetch(`${primaryBase}/api/v1/chart/analysis?${query.toString()}`, {
                timeoutMs: 4500,
                clientSignal: request.signal,
                closeConnection: true,
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
            console.warn('API route analysis fetch failed:', e.message);
        }
    }

    return NextResponse.json({ success: false, message: 'Failed to fetch analysis' }, { status: 502 });
}
