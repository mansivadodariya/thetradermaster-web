/**
 * Helper to fetch and cache MT5 / Newera broker lot and balance data.
 */

export function formatBrokerDate(dateInput) {
    if (!dateInput) return '';
    if (typeof dateInput === 'string') {
        const trimmed = dateInput.trim();
        if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) return trimmed;
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            const [yyyy, mm, dd] = trimmed.split('-');
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

export function getBrokerDateRange() {
    const now = new Date();
    const toDate = formatBrokerDate(now);
    const fiveYearsAgo = new Date(now);
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    const fromDate = formatBrokerDate(fiveYearsAgo);
    return { fromDate, toDate };
}

export async function fetchBrokerLotData(email, customFromDate = null, customToDate = null) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail) return null;

    try {
        const { fromDate: defaultFrom, toDate: defaultTo } = getBrokerDateRange();
        const fromDate = customFromDate ? formatBrokerDate(customFromDate) : defaultFrom;
        const toDate = customToDate ? formatBrokerDate(customToDate) : defaultTo;

        const payload = {
            Email: cleanEmail,
            email: cleanEmail,
            FromDate: fromDate,
            fromDate: fromDate,
            ToDate: toDate,
            toDate: toDate,
        };

        const res = await fetch('https://api.newera365.com/OpenApi/V1/OpenMTAccount/check/lot', {
            method: 'POST',
            headers: {
                'ClientId': 'N5JwfT49fBxr60',
                'SecretKey': 'w0Zmz0TsYJ3vSPM3l1N23kCAfJ4Vb68q',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: cleanEmail,
                FromDate: fromDate,
                ToDate: toDate,
            }),
        });

        if (!res.ok) return null;

        const result = await res.json();
        const rawData = result?.Data || result?.data;
        if (result?.Status === 0 && rawData) {
            const resultData = rawData?.Result || rawData?.result || rawData;
            const listData = Array.isArray(rawData?.List)
                ? rawData.List
                : (Array.isArray(rawData?.list) ? rawData.list : []);

            const dataToStore = {
                ...rawData,
                UserExists: !!resultData?.UserExists,
                AccountCount: Number(resultData?.AccountCount ?? listData.length ?? 0),
                AccountBalance: Number(resultData?.AccountBalance ?? 0),
                Volume: Number(resultData?.Volume ?? 0),
                Lot: Number(resultData?.Lot ?? 0),
                Result: resultData,
                List: listData,
                email: cleanEmail,
                meta: {
                    email: cleanEmail,
                    fromDate,
                    toDate,
                    timestamp: new Date().toISOString(),
                },
                fetchedAt: Date.now(),
            };

            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('broker_lot_data', JSON.stringify(dataToStore));
                    window.dispatchEvent(new CustomEvent('broker:lot_updated', { detail: dataToStore }));
                } catch (_) {}
            }
            return dataToStore;
        }
        return null;
    } catch (err) {
        console.error('Failed to fetch broker lot data:', err);
        return null;
    }
}

export function getStoredBrokerLotData() {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem('broker_lot_data');
        if (stored && stored !== 'undefined' && stored !== 'null') {
            return JSON.parse(stored);
        }
    } catch (_) {}
    return null;
}
