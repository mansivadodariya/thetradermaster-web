import { tryRefreshToken, clearAuthAndRedirect } from '@/lib/api';

function getBackendUrl() {
    const raw = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
    return raw.replace(/\/+$/, '');
}

export function getAnalyzeEndpoint() {
    const base = getBackendUrl();
    return `${base}/api/v1/trade-analyze/analyze`;
}

function getAccessToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
}

/**
 * Supported statement file extensions
 */
export const SUPPORTED_EXTENSIONS = ['.csv', '.xlsx', '.xls', '.pdf', '.html', '.htm', '.txt'];

/**
 * Validates selected statement files
 * @param {File[]|FileList} files
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateStatementFiles(files) {
    if (!files || files.length === 0) {
        return { valid: false, error: 'Please select at least one trading statement file to analyze.' };
    }

    const fileList = Array.from(files);

    for (const file of fileList) {
        const name = file.name ? file.name.toLowerCase() : '';
        const hasValidExt = SUPPORTED_EXTENSIONS.some((ext) => name.endsWith(ext));
        if (!hasValidExt) {
            return {
                valid: false,
                error: `File "${file.name}" has an unsupported format. Supported formats: CSV, XLSX, XLS, PDF, HTML, TXT.`,
            };
        }

        // Max 50MB
        if (file.size > 50 * 1024 * 1024) {
            return {
                valid: false,
                error: `File "${file.name}" exceeds the maximum allowed file size of 50MB.`,
            };
        }
    }

    return { valid: true, error: null };
}

/**
 * Calls POST /api/v1/trade-analyze/analyze with multipart/form-data
 * @param {File[]|Blob[]|FileList} files
 * @param {boolean} [_isRetry]
 * @returns {Promise<object>}
 */
export async function analyzeTradesReport(files, _isRetry = false) {
    const fileList = Array.from(files || []);
    const validation = validateStatementFiles(fileList);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    const token = getAccessToken();
    const formData = new FormData();

    fileList.forEach((file, index) => {
        const fileName = file.name || `statement_${index + 1}.csv`;
        formData.append('files', file, fileName);
    });

    const headers = {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const endpoint = getAnalyzeEndpoint();

    let res;
    try {
        res = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: formData,
        });
    } catch (netErr) {
        console.error('Trade analysis network error:', netErr);
        throw new Error('Could not connect to the analysis engine. Please check your internet connection and try again.');
    }

    if (res.status === 401 && !_isRetry) {
        const newToken = await tryRefreshToken();
        if (newToken) {
            return analyzeTradesReport(files, true);
        }
        clearAuthAndRedirect();
        throw new Error('Your session has expired. Please log in again.');
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        let msg = 'Failed to analyze trade statement.';
        if (data?.detail) {
            if (Array.isArray(data.detail)) {
                msg = data.detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(', ');
            } else if (typeof data.detail === 'string') {
                msg = data.detail;
            } else if (typeof data.detail === 'object') {
                msg = data.detail.message || data.detail.msg || JSON.stringify(data.detail);
            }
        } else if (data?.message) {
            msg = data.message;
        }
        const err = new Error(msg);
        err.status = res.status;
        err.raw = data;
        throw err;
    }

    if (!data) {
        throw new Error('Received an empty response from the analysis server.');
    }

    return {
        status: data.status || 'success',
        message: data.message || 'Statement analysis completed successfully.',
        broker_metadata: data.broker_metadata || {},
        trades: Array.isArray(data.trades) ? data.trades : [],
        summary: data.summary || {},
        scorecard: data.scorecard || data.summary?.scorecard || null,
        entry_analysis: data.entry_analysis || data.summary?.entry_analysis || null,
        report: data.report || data.summary?.formatted_report || '',
        raw_trades_count: data.raw_trades_count || data.trades?.length || 0,
        normalized_trades_count: data.normalized_trades_count || data.trades?.length || 0,
        deduplicated_trades_count: data.deduplicated_trades_count || 0,
        llm_usage: data.llm_usage || null,
    };
}

/**
 * Calls POST /api/v1/trade-analyze/trade/{trade_id}/analyze
 * @param {string|number} tradeId
 * @param {boolean} [_isRetry]
 * @returns {Promise<object>}
 */
export async function analyzeIndividualTrade(tradeId, _isRetry = false) {
    if (!tradeId) {
        throw new Error('Trade ID is required for analysis.');
    }

    const token = getAccessToken();
    const base = getBackendUrl();
    const directUrl = `${base}/api/v1/trade-analyze/trade/${encodeURIComponent(tradeId)}/analyze`;

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let res;
    try {
        res = await fetch(directUrl, {
            method: 'POST',
            headers,
        });
    } catch (netErr) {
        console.error('Trade analysis network error:', netErr);
        throw new Error('Could not connect to the individual trade analysis engine.');
    }

    if (res.status === 401 && !_isRetry) {
        const newToken = await tryRefreshToken();
        if (newToken) {
            return analyzeIndividualTrade(tradeId, true);
        }
        clearAuthAndRedirect();
        throw new Error('Your session has expired. Please log in again.');
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        let msg = 'Failed to analyze trade.';
        if (data?.detail) {
            if (Array.isArray(data.detail)) {
                msg = data.detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(', ');
            } else if (typeof data.detail === 'string') {
                msg = data.detail;
            } else if (typeof data.detail === 'object') {
                msg = data.detail.message || data.detail.msg || JSON.stringify(data.detail);
            }
        } else if (data?.message) {
            msg = data.message;
        }
        const err = new Error(msg);
        err.status = res.status;
        err.raw = data;
        throw err;
    }

    if (!data) {
        throw new Error('Received an empty response from the trade analysis server.');
    }

    return data;
}

/**
 * Returns a high-fidelity sample trade CSV statement for quick testing
 */
export function getSampleTradeCsvFile() {
    const csvContent = `Ticket,Open Time,Type,Size,Item,Price,S / L,T / P,Close Time,Price,Commission,Taxes,Swap,Profit
849201,2026.02.10 09:30:15,buy,0.20,EURUSD,1.08450,1.08150,1.09100,2026.02.10 11:45:00,1.08980,0.00,0.00,0.00,106.00
849202,2026.02.11 10:15:22,buy,0.15,GBPUSD,1.26420,1.26100,1.27200,2026.02.11 13:20:10,1.26950,0.00,0.00,0.00,79.50
849203,2026.02.12 14:30:00,sell,0.10,XAUUSD,2045.50,2052.00,2030.00,2026.02.12 16:15:40,2049.80,0.00,0.00,0.00,-43.00
849204,2026.02.13 10:05:10,buy,0.25,US30,38850.0,38700.0,39150.0,2026.02.13 12:50:30,39020.0,0.00,0.00,0.00,212.50
849205,2026.02.14 15:45:18,sell,0.15,USDJPY,150.200,150.800,149.100,2026.02.14 17:10:05,150.550,0.00,0.00,0.00,-35.00
849206,2026.02.16 09:40:00,buy,0.10,BTCUSD,51200.0,49800.0,54000.0,2026.02.16 19:22:15,52850.0,0.00,0.00,0.00,165.00
849207,2026.02.17 11:10:45,buy,0.20,EURUSD,1.08200,1.07900,1.08900,2026.02.17 12:40:20,1.08640,0.00,0.00,0.00,88.00
849208,2026.02.18 16:20:00,sell,0.10,GBPUSD,1.26800,1.27400,1.25800,2026.02.18 18:05:30,1.27150,0.00,0.00,0.00,-35.00`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    return new File([blob], 'tradermaster_institutional_sample_statement.csv', { type: 'text/csv' });
}
