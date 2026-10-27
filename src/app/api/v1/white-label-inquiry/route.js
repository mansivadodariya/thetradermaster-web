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
            console.error('Supabase configuration missing in white-label inquiry API');
            return NextResponse.json(
                { error: 'Server configuration error. Please contact support directly.' },
                { status: 500, headers: corsHeaders }
            );
        }

        const body = await request.json();
        const {
            fullName,
            companyName,
            email,
            phone,
            country,
            website,
            businessType,
            activeUsers,
            capabilities = [],
            message
        } = body;

        // Validation
        if (!fullName?.trim()) {
            return NextResponse.json({ error: 'Full name is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!companyName?.trim()) {
            return NextResponse.json({ error: 'Business / Company name is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!email?.trim()) {
            return NextResponse.json({ error: 'Valid business email is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!phone?.trim() || phone.trim().length < 4) {
            return NextResponse.json({ error: 'Valid Phone / WhatsApp number is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!country?.trim()) {
            return NextResponse.json({ error: 'Country is required.' }, { status: 400, headers: corsHeaders });
        }
        if (!businessType?.trim()) {
            return NextResponse.json({ error: 'Please select your type of business.' }, { status: 400, headers: corsHeaders });
        }
        if (!activeUsers?.trim()) {
            return NextResponse.json({ error: 'Please select your active user count.' }, { status: 400, headers: corsHeaders });
        }

        const payload = {
            full_name: fullName.trim(),
            company_name: companyName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            country: country.trim(),
            website: (website || '').trim(),
            business_type: businessType.trim(),
            active_users: activeUsers.trim(),
            capabilities: Array.isArray(capabilities) ? capabilities : [],
            message: (message || '').trim(),
            status: 'unread',
            created_at: new Date().toISOString()
        };

        let inserted = false;
        let inquiryId = null;

        // 1. Primary: Direct Supabase Admin Insert (Service role writes directly to public.white_label_inquiries)
        const { data: insertData, error: insertError } = await supabaseAdmin
            .from('white_label_inquiries')
            .insert([payload])
            .select();

        if (!insertError && insertData?.length > 0) {
            inserted = true;
            inquiryId = insertData[0]?.id;
        } else {
            console.warn('Direct table insert failed, trying RPC submit_white_label_inquiry:', insertError?.message);

            // 2. Fallback: Supabase RPC function (validating internal success flag)
            const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('submit_white_label_inquiry', {
                p_full_name: payload.full_name,
                p_company_name: payload.company_name,
                p_email: payload.email,
                p_phone: payload.phone,
                p_country: payload.country,
                p_website: payload.website,
                p_business_type: payload.business_type,
                p_active_users: payload.active_users,
                p_capabilities: payload.capabilities,
                p_message: payload.message
            });

            if (!rpcError && rpcData?.success !== false) {
                inserted = true;
                inquiryId = rpcData?.id;
            } else {
                const failReason = rpcData?.error || rpcError?.message || insertError?.message || 'Database insert failed.';
                console.error('All white-label inquiry submission methods failed:', failReason);
                throw new Error(failReason);
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Your white-label inquiry has been received! Our institutional team will contact you within 24 hours.'
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (err) {
        console.error('API Error in white-label inquiry submission endpoint:', err);
        return NextResponse.json(
            { error: err?.message || 'Failed to submit inquiry. Please try again or contact enterprise support.' },
            { status: 500, headers: corsHeaders }
        );
    }
}
