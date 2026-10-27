/**
 * High-resolution embedded brand logos for PDF export.
 * Uses synchronous in-memory Base64 data URLs to guarantee 100% immediate rendering
 * without CORS security restrictions, canvas taint errors, or network latency.
 */
import logoData from './pdfLogoBase64.json';

export function getPdfLogoDataUrl(isDarkBackground = false) {
    if (!logoData) return '';
    return isDarkBackground ? logoData.light : logoData.dark;
}
