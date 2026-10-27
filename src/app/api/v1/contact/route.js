import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

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

export async function POST(request) {
    try {
        if (!supabaseAdmin) {
            console.error('Supabase configuration missing in contact API');
            return NextResponse.json(
                { error: 'Server configuration error. Please contact support directly.' },
                { status: 500, headers: corsHeaders }
            );
        }

        const body = await request.json();
        const { name, email, country, phone, message } = body;

        // Validation
        if (!name?.trim()) {
            return NextResponse.json({ error: 'Full name is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!email?.trim() || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!message?.trim() || message.trim().length < 5) {
            return NextResponse.json({ error: 'Message must be at least 5 characters.' }, { status: 400, headers: corsHeaders });
        }

        const payload = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            country: (country || 'United Arab Emirates').trim(),
            phone: (phone || '').trim(),
            message: message.trim(),
            status: 'unread',
            created_at: new Date().toISOString()
        };

        // 1. First attempt: call the RPC function if available
        let { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('submit_contact_inquiry', {
            p_name: payload.name,
            p_email: payload.email,
            p_country: payload.country,
            p_phone: payload.phone,
            p_message: payload.message
        });

        if (rpcError) {
            console.warn('RPC submit_contact_inquiry not found or failed, falling back to direct insert:', rpcError.message);

            // 2. Fallback: direct table insert using service role
            const { data: insertData, error: insertError } = await supabaseAdmin
                .from('contact_inquiries')
                .insert([payload])
                .select();

            if (insertError) {
                console.error('Table insert error in contact API:', insertError);
                throw insertError;
            }
        }

        return NextResponse.json(
            { 
                success: true, 
                message: 'Your message has been sent successfully! Our team will contact you shortly.' 
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (err) {
        console.error('API Error in contact submission endpoint:', err);
        return NextResponse.json(
            { error: err?.message || 'Failed to submit contact inquiry.' },
            { status: 500, headers: corsHeaders }
        );
    }
}
