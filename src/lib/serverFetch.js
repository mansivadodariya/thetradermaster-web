/**
 * Server-side Fetch Utility with Connection Cleanup & Socket Leak Prevention
 * 
 * Prevents CLOSE_WAIT connection leaks by:
 * 1. Propagating incoming client request.signal so disconnecting clients abort upstream calls immediately.
 * 2. Enforcing an explicit timeout on all external requests.
 * 3. Guaranteeing that every response body is either completely consumed or explicitly cancelled.
 * 4. Requesting 'Connection: close' on external calls to avoid stale keep-alive pool sockets.
 */

export async function serverFetch(url, options = {}) {
    const {
        timeoutMs = 6000,
        clientSignal = null,
        closeConnection = true,
        headers = {},
        ...restOptions
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort(new Error(`Server fetch timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    const onClientAbort = () => {
        controller.abort(new Error('Client aborted the request'));
    };

    if (clientSignal) {
        if (clientSignal.aborted) {
            clearTimeout(timeoutId);
            controller.abort(new Error('Client already aborted'));
        } else {
            clientSignal.addEventListener('abort', onClientAbort, { once: true });
        }
    }

    const mergedHeaders = {
        'Accept': 'application/json',
        ...(closeConnection ? { 'Connection': 'close' } : {}),
        ...headers,
    };

    try {
        const response = await fetch(url, {
            ...restOptions,
            headers: mergedHeaders,
            signal: controller.signal,
        });

        return response;
    } finally {
        clearTimeout(timeoutId);
        if (clientSignal) {
            clientSignal.removeEventListener('abort', onClientAbort);
        }
    }
}

/**
 * Safely parses JSON from a response, guaranteeing that the body is cancelled
 * if parsing fails or if the response is not OK.
 */
export async function safeFetchJson(url, options = {}) {
    let response = null;
    try {
        response = await serverFetch(url, options);

        if (!response.ok) {
            // Cancel unconsumed body stream to release socket
            await response.body?.cancel().catch(() => {});
            return {
                ok: false,
                status: response.status,
                data: null,
                error: `Upstream HTTP ${response.status}`,
            };
        }

        const data = await response.json();
        return {
            ok: true,
            status: response.status,
            data,
            error: null,
        };
    } catch (err) {
        if (response && !response.bodyUsed) {
            await response.body?.cancel().catch(() => {});
        }
        return {
            ok: false,
            status: 500,
            data: null,
            error: err?.message || 'Upstream request failed',
        };
    }
}
