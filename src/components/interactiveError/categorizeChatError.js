'use client';

/**
 * Common Chat Error Categorization Utility
 *
 * Categorizes errors across AI Assistant, AI Bot Builder (Strategy Studio), and other chat interfaces into:
 * - 'credits': User out of AI credits -> Upgrade Plan & Get Credits
 * - 'api_unavailable': Server down / Failed to fetch / 502 / 503 / Network failure -> Try Again Later
 * - 'general': Unexpected error / validation -> Try Again
 */
export function categorizeChatError(errOrBody, status) {
    const text = String(
        errOrBody?.error ||
        errOrBody?.message ||
        errOrBody?.detail ||
        (typeof errOrBody === 'string' ? errOrBody : '')
    ).toLowerCase();

    const errorCode = String(
        errOrBody?.error_code ||
        errOrBody?.code ||
        errOrBody?.detail?.error_code ||
        ''
    ).toUpperCase();

    const resolvedStatus = status || errOrBody?.status || errOrBody?.statusCode || 0;

    // 1. Check for Credit / Balance issues
    const isCredits =
        resolvedStatus === 402 ||
        errorCode === 'INSUFFICIENT_CREDITS' ||
        errorCode === 'OUT_OF_CREDITS' ||
        errorCode === 'NO_CREDITS' ||
        text.includes('credit') ||
        text.includes('insufficient credits') ||
        text.includes('out of credits') ||
        text.includes('no credit') ||
        text.includes('payment required') ||
        text.includes('upgrade plan') ||
        text.includes('quota exceeded') ||
        text.includes('limit reached');

    if (isCredits) {
        return {
            errorType: 'credits',
            title: 'Insufficient AI Credits',
            message: 'You have run out of AI compute credits to continue chatting and generating insights.',
            suggestion: 'Top up your credits or upgrade your subscription plan to unlock full AI capabilities.',
            action: 'upgrade',
            actionLabel: 'Upgrade Plan & AI Credits',
            actionUrl: '/subscription-plans',
            statusTag: 'No Credits',
            statusCode: resolvedStatus || 402,
            rawError: text,
        };
    }

    // 2. Check for Network / Server / API offline / Failed to fetch
    const isApiOffline =
        resolvedStatus === 0 ||
        !resolvedStatus ||
        (resolvedStatus >= 500 && resolvedStatus <= 504) ||
        text.includes('failed to fetch') ||
        text.includes('network') ||
        text.includes('connection') ||
        text.includes('econnrefused') ||
        text.includes('timeout') ||
        text.includes('unreachable') ||
        text.includes('unavailable') ||
        text.includes('service unavailable') ||
        text.includes('load failed') ||
        text.includes('cors');

    if (isApiOffline) {
        return {
            errorType: 'api_unavailable',
            title: 'AI Service Temporarily Unavailable',
            message: 'Unable to communicate with the ChronosX AI API at this moment. The backend service may be offline or restarting.',
            suggestion: 'Please try again in a few moments. Your request has been preserved and can be retried immediately.',
            action: 'retry',
            actionLabel: 'Try Again',
            actionUrl: null,
            statusTag: 'Service Offline',
            statusCode: resolvedStatus || 0,
            rawError: text || 'Failed to fetch',
        };
    }

    // 3. Fallback General Error
    return {
        errorType: 'general',
        title: 'Unable to Process AI Request',
        message: errOrBody?.error || errOrBody?.message || (typeof errOrBody === 'string' ? errOrBody : 'An unexpected error occurred while processing your request.'),
        suggestion: 'Please refine your prompt or try again.',
        action: 'retry',
        actionLabel: 'Try Again',
        actionUrl: null,
        statusTag: 'Request Failed',
        statusCode: resolvedStatus || 400,
        rawError: text,
    };
}

export default categorizeChatError;
