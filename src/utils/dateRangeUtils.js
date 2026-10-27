/**
 * Date range helpers for Backtest & Strategy Studio filters.
 * Ensures:
 * 1. Date selection cannot exceed past 3 years from today.
 * 2. Date selection cannot be in the future.
 * 3. Range span (difference between FROM and TO) cannot exceed 1 year.
 */

export const formatDateStr = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const parseDateStr = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    return new Date(year, month, day);
};

export const getTodayDateStr = () => {
    return formatDateStr(new Date());
};

export const getPastYearsDateStr = (years = 3) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    return formatDateStr(d);
};

export const addYearsToStr = (dateStr, years = 1) => {
    const d = parseDateStr(dateStr);
    if (!d) return dateStr;
    d.setFullYear(d.getFullYear() + years);
    return formatDateStr(d);
};

export const clampDateStr = (dateStr, minStr, maxStr) => {
    if (!dateStr) return dateStr;
    if (minStr && dateStr < minStr) return minStr;
    if (maxStr && dateStr > maxStr) return maxStr;
    return dateStr;
};

/**
 * Validates and adjusts the complementary date when FROM is changed
 */
export const handleFromDateChangeConstrained = (newFrom, currentTo, maxYearsDiff = 1, maxPastYears = 3) => {
    const today = getTodayDateStr();
    const minPast = getPastYearsDateStr(maxPastYears);

    if (!newFrom) return { from: '', to: currentTo };

    let clampedFrom = clampDateStr(newFrom, minPast, today);
    let adjustedTo = currentTo;

    if (adjustedTo) {
        // If TO is earlier than FROM, move TO to match FROM
        if (adjustedTo < clampedFrom) {
            adjustedTo = clampedFrom;
        } else {
            // Max allowed TO is 1 year from FROM or today (whichever is earlier)
            const maxToAllowed = clampDateStr(addYearsToStr(clampedFrom, maxYearsDiff), minPast, today);
            if (adjustedTo > maxToAllowed) {
                adjustedTo = maxToAllowed;
            }
        }
    }

    return { from: clampedFrom, to: adjustedTo };
};

/**
 * Validates and adjusts the complementary date when TO is changed
 */
export const handleToDateChangeConstrained = (newTo, currentFrom, maxYearsDiff = 1, maxPastYears = 3) => {
    const today = getTodayDateStr();
    const minPast = getPastYearsDateStr(maxPastYears);

    if (!newTo) return { from: currentFrom, to: '' };

    let clampedTo = clampDateStr(newTo, minPast, today);
    let adjustedFrom = currentFrom;

    if (adjustedFrom) {
        // If FROM is later than TO, move FROM to match TO
        if (adjustedFrom > clampedTo) {
            adjustedFrom = clampedTo;
        } else {
            // Min allowed FROM is 1 year before TO or minPast (whichever is later)
            const minFromAllowed = clampDateStr(addYearsToStr(clampedTo, -maxYearsDiff), minPast, today);
            if (adjustedFrom < minFromAllowed) {
                adjustedFrom = minFromAllowed;
            }
        }
    }

    return { from: adjustedFrom, to: clampedTo };
};
