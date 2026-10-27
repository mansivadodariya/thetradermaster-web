import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';

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
            return NextResponse.json(
                { error: 'Supabase server configuration is missing.' },
                { status: 500, headers: corsHeaders }
            );
        }

        const body = await request.json();
        const { userId, email, currentPassword, newPassword } = body;

        if (!userId && !email) {
            return NextResponse.json(
                { error: 'User identifier is required.' },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!currentPassword) {
            return NextResponse.json(
                { error: 'Current password is required.' },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json(
                { error: 'New password must be at least 8 characters long.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Fetch user from Supabase database
        let query = supabaseAdmin.from('users').select('id, email, hashed_password');
        if (userId) {
            query = query.eq('id', userId);
        } else if (email) {
            query = query.eq('email', email.trim().toLowerCase());
        }

        const { data: users, error: fetchErr } = await query;
        if (fetchErr || !users || users.length === 0) {
            return NextResponse.json(
                { error: 'User account not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        const user = users[0];

        // Verify current password with bcrypt
        if (user.hashed_password) {
            const isMatch = await bcrypt.compare(currentPassword, user.hashed_password);
            if (!isMatch) {
                return NextResponse.json(
                    { error: 'Incorrect current password. Please try again.' },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        // Hash the new password with salt factor 10 (matching backend bcrypt standard)
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        // Update hashed_password in database
        const { error: updateErr } = await supabaseAdmin
            .from('users')
            .update({
                hashed_password: newHashedPassword,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (updateErr) {
            throw updateErr;
        }

        return NextResponse.json(
            { success: true, message: 'Password updated successfully.' },
            { headers: corsHeaders }
        );
    } catch (err) {
        console.error('API Error in change-password endpoint:', err);
        return NextResponse.json(
            { error: err?.message || 'Failed to update password. Please try again.' },
            { status: 500, headers: corsHeaders }
        );
    }
}
