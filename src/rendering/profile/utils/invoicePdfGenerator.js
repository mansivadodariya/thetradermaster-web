import { getStoredUser } from '@/lib/authSession';

/**
 * Formats any transaction or invoice string to "TXN-XXXXXXX" format
 */
export function formatTransactionId(rawId, index = 1) {
    if (!rawId) {
        return `TXN-${String(index).padStart(7, '0')}`;
    }
    const str = String(rawId).trim().toUpperCase();
    if (str.startsWith('TXN-')) {
        return str;
    }
    const clean = str.replace(/[^A-Z0-9]/g, '');
    if (clean.length > 0) {
        return `TXN-${clean.slice(0, 7)}`;
    }
    return `TXN-${String(index).padStart(7, '0')}`;
}

import { getPdfLogoDataUrl } from '@/lib/pdfLogoHelper';

/**
 * Generates an executive, institutional PDF invoice for a transaction
 */
export async function generateInvoicePdf(item, index = 1) {
    try {
        const jspdfModule = await import('jspdf');
        const jsPDF = jspdfModule.default || jspdfModule.jsPDF;
        const doc = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        });

        const user = getStoredUser() || {};
        const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || user.email?.split('@')[0] || 'Valued Trader';
        const userEmail = user.email || 'trader@chronosx.com';
        const userUid = user.id || user.user_id || 'UID-00842';

        const txnId = formatTransactionId(item?.invoice_number || item?.id, index);
        const amountNum = Number(item?.amount || 99).toFixed(2);
        const planName = item?.plan_name || 'Starter AI';
        const period = item?.period || '1 Month Full Access';
        const gateway = item?.gateway || 'USDT (Solana Decentralized Settlement)';

        let invoiceDate = new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        if (item?.created_at) {
            try {
                const d = new Date(item.created_at);
                if (!isNaN(d.getTime())) {
                    invoiceDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                }
            } catch (_) {}
        }

        // ================= 1. HEADER SECTION =================
        // White clean background
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');

        // Top decorative accent bar (ChronosX Emerald green)
        doc.setFillColor(24, 201, 139);
        doc.rect(0, 0, 210, 5, 'F');

        // Embed Logo if available
        const logoData = await getPdfLogoDataUrl(false);
        if (logoData) {
            try {
                // width: 44mm, height: 12mm
                doc.addImage(logoData, 'PNG', 16, 14, 44, 12);
            } catch (_) {
                doc.setTextColor(24, 201, 139);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(20);
                doc.text('CHRONOSX', 16, 24);
            }
        } else {
            doc.setTextColor(24, 201, 139);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.text('CHRONOSX', 16, 24);
        }

        // Right Header: INVOICE title & Transaction ID
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42); // slate 900
        doc.text('OFFICIAL INVOICE', 194, 20, { align: 'right' });

        doc.setFont('courier', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(24, 201, 139); // emerald
        doc.text(txnId, 194, 26, { align: 'right' });

        const statusStr = String(item?.status || item?.payment_status || item?.original_status || 'PAID').toUpperCase();
        const isPaid = statusStr === 'PAID' || statusStr === 'SUCCESS' || statusStr === 'COMPLETED' || item?.is_paid;
        const isExpired = statusStr === 'EXPIRED';

        // Status Badge (Clean standard font without glitched unicode glyphs)
        if (isPaid) {
            doc.setFillColor(236, 253, 245); // emerald 50
            doc.setDrawColor(24, 201, 139);
            doc.setLineWidth(0.4);
            doc.roundedRect(165, 29.5, 29, 7.5, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(5, 150, 105);
            doc.text('PAID', 179.5, 34.8, { align: 'center' });
        } else if (isExpired) {
            doc.setFillColor(254, 242, 242); // red 50
            doc.setDrawColor(239, 68, 68);
            doc.setLineWidth(0.4);
            doc.roundedRect(160, 29.5, 34, 7.5, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(220, 38, 38);
            doc.text('EXPIRED', 177, 34.8, { align: 'center' });
        } else {
            doc.setFillColor(254, 249, 195); // amber 50
            doc.setDrawColor(234, 179, 8);
            doc.setLineWidth(0.4);
            doc.roundedRect(160, 29.5, 34, 7.5, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(180, 83, 9);
            doc.text(statusStr, 177, 34.8, { align: 'center' });
        }

        // Divider
        doc.setDrawColor(226, 232, 240); // slate 200
        doc.setLineWidth(0.4);
        doc.line(16, 42, 194, 42);

        // ================= 2. FROM / TO ADDRESS BLOCK =================
        let y = 50;

        // Column 1: FROM (ChronosX)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139); // slate 500
        doc.text('ISSUED BY:', 16, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text('ChronosX', 16, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text('Autonomous Quant Intelligence Desk', 16, y + 11);
        doc.text('DIFC FinTech District, Dubai, UAE', 16, y + 16);
        doc.text('Support & Compliance: billing@chronosx.com', 16, y + 21);
        doc.text('Portal: https://chronosx.com', 16, y + 26);

        // Column 2: TO (User details)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('BILLED TO (CUSTOMER):', 115, y);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text(userName, 115, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`Account Email: ${userEmail}`, 115, y + 11);
        doc.text(`Invoice Date: ${invoiceDate}`, 115, y + 16);
        doc.text(`Payment Gateway: ${gateway}`, 115, y + 21);

        // ================= 3. LINE ITEMS TABLE =================
        y = 86;

        // Table Header
        doc.setFillColor(15, 23, 42); // slate 900
        doc.roundedRect(16, y, 178, 9, 1.5, 1.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text('DESCRIPTION & PLATFORM ENTITLEMENT', 22, y + 6);
        doc.text('VALIDITY', 105, y + 6);
        doc.text('AI COMPUTE', 142, y + 6);
        doc.text('AMOUNT (USD)', 190, y + 6, { align: 'right' });

        // Table Row Background
        y += 12;
        doc.setFillColor(248, 250, 252); // slate 50
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(16, y, 178, 16, 1.5, 1.5, 'FD');

        // Row Content
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`ChronosX ${planName} Access`, 22, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('Multi-Timeframe AI pattern scans, Chart OCR, AI Trading Signal', 22, y + 11);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(period, 105, y + 8);
        doc.text(`${item?.credits || 500} Credits`, 142, y + 8);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`$${amountNum}`, 190, y + 8, { align: 'right' });

        // ================= 4. TOTALS & SUMMARY =================
        y += 24;

        // Summary Rows
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text('Subtotal:', 140, y);
        doc.setTextColor(15, 23, 42);
        doc.text(`$${amountNum}`, 190, y, { align: 'right' });

        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('Promotional Discount:', 140, y);
        doc.setTextColor(5, 150, 105);
        doc.text('-$0.00', 190, y, { align: 'right' });

        y += 6;
        doc.setTextColor(100, 116, 139);
        doc.text('Tax / SaaS Platform Fee (0%):', 140, y);
        doc.setTextColor(15, 23, 42);
        doc.text('$0.00', 190, y, { align: 'right' });

        y += 5;
        doc.setDrawColor(226, 232, 240);
        doc.line(135, y, 194, y);

        y += 6;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(isPaid ? 'TOTAL PAID:' : 'TOTAL AMOUNT:', 140, y);
        doc.setTextColor(isPaid ? 5 : 100, isPaid ? 150 : 116, isPaid ? 105 : 139);
        doc.text(`$${amountNum} USD`, 190, y, { align: 'right' });

        // ================= 5. CRYPTOGRAPHIC SETTLEMENT SEAL =================
        y += 18;
        if (isPaid) {
            doc.setFillColor(240, 253, 244); // emerald 50
            doc.setDrawColor(24, 201, 139);
            doc.setLineWidth(0.4);
            doc.roundedRect(16, y, 178, 22, 2, 2, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(5, 150, 105);
            doc.text('VERIFIED SETTLEMENT CONFIRMATION', 22, y + 7);

            doc.setFont('courier', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(71, 85, 105);
            doc.text(`Transaction Reference: ${txnId}`, 22, y + 12);
            doc.text(`Gateway Settlement:    ${gateway}`, 22, y + 16);
            doc.text(`Status:                SUCCESS | Autonomous System Activation Confirmed`, 22, y + 20);
        } else {
            doc.setFillColor(248, 250, 252); // slate 50
            doc.setDrawColor(203, 213, 225);
            doc.setLineWidth(0.4);
            doc.roundedRect(16, y, 178, 22, 2, 2, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            doc.text('ORDER TRANSACTION RECORD', 22, y + 7);

            doc.setFont('courier', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            doc.text(`Transaction Reference: ${txnId}`, 22, y + 12);
            doc.text(`Gateway Settlement:    ${gateway}`, 22, y + 16);
            doc.text(`Status:                ${statusStr} | Record Archived`, 22, y + 20);
        }

        // ================= 6. FOOTER =================
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(16, 270, 194, 270);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text('ChronosX - Subscription fees cover high-availability GPU cloud inferences and market research tools.', 105, 275, { align: 'center' });
        doc.text('Questions or custom enterprise requirements? Email support@chronosx.com or visit https://chronosx.com', 105, 279, { align: 'center' });

        // ================= 7. TRIGGER DOWNLOAD =================
        const fileName = `ChronosX_Invoice_${txnId}.pdf`;
        doc.save(fileName);
        return true;
    } catch (error) {
        console.error('Failed to generate invoice PDF:', error);
        throw error;
    }
}
