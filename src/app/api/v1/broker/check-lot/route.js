import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
}

function formatToDDMMYYYY(dateInput) {
    if (!dateInput) return '';
    if (typeof dateInput === 'string') {
        const trimmed = dateInput.trim();
        if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
            return trimmed;
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            const [yyyy, mm, dd] = trimmed.split('-');
            return `${dd}-${mm}-${yyyy}`;
        }
        if (/^\d{4}\/\d{2}\/\d{2}$/.test(trimmed)) {
            const [yyyy, mm, dd] = trimmed.split('/');
            return `${dd}-${mm}-${yyyy}`;
        }
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
            const [dd, mm, yyyy] = trimmed.split('/');
            return `${dd}-${mm}-${yyyy}`;
        }
    }
    const dt = new Date(dateInput);
    if (!isNaN(dt.getTime())) {
        const dd = String(dt.getDate()).padStart(2, '0');
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const yyyy = dt.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    }
    return String(dateInput || '');
}

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const email = String(body.Email || body.email || '').trim().toLowerCase();

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        const now = new Date();
        const fiveYearsAgo = new Date(now);
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

        const rawFrom = body.FromDate || body.fromDate;
        const rawTo = body.ToDate || body.toDate;

        const fromDate = formatToDDMMYYYY(rawFrom) || formatToDDMMYYYY(fiveYearsAgo);
        const toDate = formatToDDMMYYYY(rawTo) || formatToDDMMYYYY(now);

        const clientId = process.env.NEWERA_CLIENT_ID || 'N5JwfT49fBxr60';
        const secretKey = process.env.NEWERA_SECRET_KEY || 'w0Zmz0TsYJ3vSPM3l1N23kCAfJ4Vb68q';

        const apiRes = await fetch('https://api.newera365.com/OpenApi/V1/OpenMTAccount/check/lot', {
            method: 'POST',
            headers: {
                'ClientId': clientId,
                'SecretKey': secretKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: email,
                FromDate: fromDate,
                ToDate: toDate,
            }),
        });

        if (!apiRes.ok) {
            const errText = await apiRes.text().catch(() => '');
            return NextResponse.json(
                { success: false, error: `Upstream error ${apiRes.status}: ${errText}` },
                { status: apiRes.status, headers: corsHeaders }
            );
        }

        const data = await apiRes.json();

        return NextResponse.json(
            {
                success: data?.Status === 0 && !!data?.Data,
                status: data.Status,
                message: data.Message || data.MessageKey,
                data: data.Data || null,
                meta: {
                    email,
                    fromDate,
                    toDate,
                    timestamp: new Date().toISOString()
                }
            },
            { headers: corsHeaders }
        );
    } catch (err) {
        console.error('Error checking broker lot:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}
