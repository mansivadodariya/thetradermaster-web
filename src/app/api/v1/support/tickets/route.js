import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function getBackendBase() {
    return (
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://127.0.0.1:8000'
    ).replace(/\/+$/, '');
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function POST(request) {
    try {
        const incoming = await request.formData();

        const name = String(incoming.get('name') || '').trim();
        const email = String(incoming.get('email') || '').trim();
        const contactNo = String(incoming.get('contact_no') || '').trim();
        const description = String(incoming.get('description') || '').trim();
        const image = incoming.get('image');

        if (!name) {
            return NextResponse.json({ error: 'Full name is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!contactNo) {
            return NextResponse.json({ error: 'Contact number is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!description || description.length < 10) {
            return NextResponse.json(
                { error: 'Description must be at least 10 characters.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const outbound = new FormData();
        const projectId = incoming.get('project_id') || '1';
        outbound.append('project_id', String(projectId));
        outbound.append('name', name);
        outbound.append('email', email.toLowerCase());
        outbound.append('contact_no', contactNo);
        outbound.append('description', description);

        if (image && typeof image === 'object' && 'arrayBuffer' in image && image.size > 0) {
            outbound.append('image', image, image.name || 'screenshot.png');
        }

        const headers = {
            Accept: 'application/json',
            'ngrok-skip-browser-warning': 'true',
        };
        const auth = request.headers.get('authorization');
        if (auth) headers.Authorization = auth;

        const backendUrl = `${getBackendBase()}/api/v1/support/tickets`;
        const upstream = await fetch(backendUrl, {
            method: 'POST',
            headers,
            body: outbound,
        });

        const data = await upstream.json().catch(() => ({}));

        if (!upstream.ok) {
            let message = 'Failed to create support ticket.';
            if (typeof data?.detail === 'string') message = data.detail;
            else if (Array.isArray(data?.detail)) {
                message = data.detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(', ');
            } else if (data?.error) message = data.error;
            else if (data?.message) message = data.message;

            return NextResponse.json(
                { error: message, detail: data?.detail },
                { status: upstream.status, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: data?.message || 'Your support ticket has been submitted successfully.',
                data: data?.data ?? data,
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (err) {
        console.error('API Error in support tickets endpoint:', err);
        return NextResponse.json(
            { error: err?.message || 'Failed to submit support ticket.' },
            { status: 500, headers: corsHeaders }
        );
    }
}
