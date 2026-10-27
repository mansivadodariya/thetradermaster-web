import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Server-side global job store
if (!globalThis.__tmAiAssistantJobs) {
    globalThis.__tmAiAssistantJobs = new Map();
}
const jobStore = globalThis.__tmAiAssistantJobs;

// Periodic cleanup of jobs older than 1 hour
function cleanupStaleJobs() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [id, job] of jobStore.entries()) {
        if (job.createdAt < oneHourAgo) {
            jobStore.delete(id);
        }
    }
}

// Background worker executing the AI analysis against the backend service
async function executeJobWorker(jobId, { pair, message, userId, token }) {
    const job = jobStore.get(jobId);
    if (!job) return;

    job.status = 'processing';
    job.progress = 25;
    job.updatedAt = Date.now();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.thetradermaster.com';
    const endpoint = `${backendUrl.replace(/\/+$/, '')}/api/v1/chat`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
        };
        if (token) {
            headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        }

        job.progress = 50;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute maximum timeout

        const res = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                pair,
                message,
                user_id: userId,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            const errorMsg = data?.detail?.message || 
                data?.message || 
                (typeof data?.detail === 'string' ? data.detail : null) || 
                data?.error || 
                `Request failed with status ${res.status}`;

            job.status = 'failed';
            job.error = errorMsg;
            job.errorDetail = data?.detail;
            job.updatedAt = Date.now();
            job.completedAt = Date.now();
            return;
        }

        job.status = 'completed';
        job.progress = 100;
        job.result = data;
        job.updatedAt = Date.now();
        job.completedAt = Date.now();
    } catch (err) {
        job.status = 'failed';
        job.error = err.name === 'AbortError' 
            ? 'Analysis request timed out after 120 seconds. Please try again.'
            : (err.message || 'An error occurred during analysis');
        job.updatedAt = Date.now();
        job.completedAt = Date.now();
    }
}

export async function POST(request) {
    try {
        cleanupStaleJobs();

        const body = await request.json().catch(() => ({}));
        const { pair, message, userId } = body;

        if (!pair || !message) {
            return NextResponse.json(
                { success: false, error: 'Pair and message are required.' },
                { status: 400 }
            );
        }

        const authHeader = request.headers.get('authorization') || '';
        const jobId = `tm_job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        const job = {
            id: jobId,
            userId: userId || null,
            pair,
            message,
            status: 'queued',
            progress: 10,
            statusMessage: 'Analysis started – you can continue using the platform.',
            result: null,
            error: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        jobStore.set(jobId, job);

        // Run worker in background without blocking response
        executeJobWorker(jobId, { pair, message, userId, token: authHeader }).catch((err) => {
            console.error(`[Worker error for job ${jobId}]:`, err);
        });

        return NextResponse.json({
            success: true,
            jobId,
            status: 'queued',
            message: 'Analysis started – you can continue using the platform.',
            pair,
            createdAt: job.createdAt,
        }, { status: 202 });
    } catch (err) {
        console.error('Error in ai-assistant jobs POST:', err);
        return NextResponse.json(
            { success: false, error: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    cleanupStaleJobs();

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const userId = searchParams.get('userId');

    if (jobId) {
        const job = jobStore.get(jobId);
        if (!job) {
            return NextResponse.json(
                { success: false, error: 'Job not found or expired.' },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, job });
    }

    if (userId) {
        const userJobs = Array.from(jobStore.values())
            .filter((j) => j.userId === userId)
            .sort((a, b) => b.createdAt - a.createdAt);
        return NextResponse.json({ success: true, jobs: userJobs });
    }

    return NextResponse.json({
        success: true,
        totalJobs: jobStore.size,
    });
}
