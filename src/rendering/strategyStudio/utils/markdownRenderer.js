import React from 'react';
import styles from '../styles/strategyStudio.module.scss';

/**
 * Strips all emojis, unicode pictorial symbols, and duplicate icon artifacts
 */
export function stripEmojis(str) {
    if (!str) return '';
    return String(str)
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FE}\u{25FD}\u{25FC}\u{25FB}\u{2B1B}\u{2B1C}\u{1F004}\u{1F0CF}\u{3030}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{203C}\u{2049}\u{2139}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{23E9}-\u{23EC}\u{23F0}\u{23F3}\u{FE0F}\u{FE0E}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Parses markdown inline tokens (**bold**, `code`, *italic*) into styled elements.
 * Automatically cleans any stray or unclosed asterisks so no literal '**' or '*' leaks into the UI.
 */
export function renderInlineTokens(str) {
    if (!str) return null;
    let cleanStr = stripEmojis(String(str));

    // Remove any leading/trailing unclosed asterisks
    cleanStr = cleanStr.replace(/^\*+\s*/, '').replace(/\s*\*+$/, '');

    // If string has an uneven count of '**', strip orphaned '**' at boundaries
    const countDoubleStars = (cleanStr.match(/\*\*/g) || []).length;
    if (countDoubleStars % 2 !== 0) {
        cleanStr = cleanStr.replace(/\*\*+$/, '').replace(/^\*\*+/, '');
    }

    const parts = [];
    const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = tokenRegex.exec(cleanStr)) !== null) {
        if (match.index > lastIndex) {
            const textPart = cleanStr.substring(lastIndex, match.index).replace(/\*+/g, '');
            if (textPart) parts.push(textPart);
        }
        const token = match[0];
        if (token.startsWith('**') && token.endsWith('**')) {
            const boldInner = token.slice(2, -2).replace(/\*+/g, '').trim();
            if (boldInner) {
                parts.push(
                    <strong key={`b_${key++}`} className={styles.inlineStrong}>
                        {boldInner}
                    </strong>
                );
            }
        } else if (token.startsWith('`') && token.endsWith('`')) {
            parts.push(
                <code key={`c_${key++}`} className={styles.markdownInlineCode}>
                    {token.slice(1, -1)}
                </code>
            );
        } else if (token.startsWith('*') && token.endsWith('*')) {
            parts.push(
                <em key={`i_${key++}`}>
                    {token.slice(1, -1)}
                </em>
            );
        }
        lastIndex = match.index + token.length;
    }

    if (lastIndex < cleanStr.length) {
        const remaining = cleanStr.substring(lastIndex).replace(/\*+/g, '');
        if (remaining) parts.push(remaining);
    }

    return parts.length > 0 ? parts : cleanStr.replace(/\*+/g, '');
}

/**
 * Parses markdown and structured lists:
 * - Step progress titles (e.g. Step 1 of 5: Asset Selection) -> Bold formatted header with 0 asterisks
 * - Bullet points with titles (e.g. • Entry Logic: description...) -> Title bold, description on next line/inline
 * - Key-Value headers (e.g. Strategy Name: ...) -> Bold title
 * - Section titles (e.g. Chart Elements:) -> Bold section title
 * - Chart element indicators -> Clean bold text with clean bullet dot (no emojis/duplicate icons)
 */
export function renderFormattedMarkdown(text) {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((rawLine, lineIdx) => {
        let line = rawLine.trim();
        if (!line) {
            return <div key={lineIdx} className={styles.emptyLineSpacer} />;
        }

        // Clean stray leading asterisks in bullets like "• *Chart Elements:" -> "• Chart Elements:"
        line = line.replace(/^[•\-]\s*\*+([^*]+)\*?:?$/, '• $1:');

        // 0a. Step Progress Headers (e.g. "**Step 1 of 5: Asset Selection**" or "Step 1 of 5: Asset Selection**")
        const stepHeaderMatch = line.match(/^(?:\*\*)?(Step\s*\d+(?:\s*(?:of|\/)\s*\d+)?)(?:\*\*)?:?\s*(?:\*\*)?([^:\n*]+)?(?:\*\*)?:?$/i);
        if (stepHeaderMatch) {
            const stepNum = stripEmojis(stepHeaderMatch[1].replace(/\*/g, '')).trim();
            const stepTitle = stripEmojis((stepHeaderMatch[2] || '').replace(/\*/g, '')).trim();
            const fullTitle = stepTitle ? `${stepNum}: ${stepTitle}` : stepNum;
            return (
                <div key={lineIdx} className={styles.stepHeaderRow}>
                    <strong>{fullTitle}</strong>
                </div>
            );
        }

        // 0b. Markdown Headings (e.g. "### Chart Elements:" or "# Overview")
        const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
        if (headingMatch) {
            const headingText = stripEmojis(headingMatch[1].replace(/^\*\*|\*\*$/g, '').replace(/\*/g, '').replace(/:$/, '')).trim();
            return (
                <div key={lineIdx} className={styles.headingRow}>
                    <strong>{headingText}:</strong>
                </div>
            );
        }

        // 1. Standalone Section Titles (e.g. "**Chart Elements:**", "Chart Elements:", "*Chart Elements:*")
        const standaloneHeaderMatch = line.match(/^(?:(?:\*{1,3})?([A-Za-z0-9\s/&()-]{2,35})(?:\*{1,3})?:?\s*)$/);
        if (standaloneHeaderMatch && (line.endsWith(':') || line.startsWith('**') || line.toLowerCase().includes('chart element') || line.toLowerCase().includes('overview'))) {
            const titleLabel = stripEmojis(standaloneHeaderMatch[1].replace(/\*/g, '')).trim();
            return (
                <div key={lineIdx} className={styles.keyValueRow}>
                    <strong>{titleLabel}:</strong>
                </div>
            );
        }

        // 2. Bullet point with bold or plain title AND description on same line: e.g. "• **Entry Logic:** desc" or "• Entry Logic: desc"
        const bulletWithDescMatch = line.match(/^(?:[•\-]|(?:\*\s+))\s*(?:\*\*)?([^:\n]+?)(?:\*\*)?:\s*(.+)$/);
        if (bulletWithDescMatch) {
            const titleLabel = stripEmojis(bulletWithDescMatch[1].replace(/\*/g, '')).trim();
            const descText = stripEmojis(bulletWithDescMatch[2].replace(/^\*\*:\s*|^\*\*\s*/, '').replace(/\*+$/, '')).trim();
            return (
                <div key={lineIdx} className={styles.bulletInlineRow}>
                    <span className={styles.bulletDot}>•</span>
                    <div className={styles.bulletContent}>
                        <strong>{titleLabel}:</strong>
                        <span>{renderInlineTokens(descText)}</span>
                    </div>
                </div>
            );
        }

        // 3. Chart Element / Indicator single bullet (e.g. "• EMA 9:", "• EMA 9", "• Buy Signal:", "• Take Profit Level:")
        const chartElementBulletMatch = line.match(/^(?:[•\-]|(?:\*\s+))\s*(.+)$/);
        if (chartElementBulletMatch) {
            let itemContent = stripEmojis(chartElementBulletMatch[1].replace(/\*/g, '')).trim();
            const cleanLabel = itemContent.replace(/:$/, '').trim();

            if (itemContent.endsWith(':') || itemContent.toLowerCase().includes('signal') || itemContent.toLowerCase().includes('ema') || itemContent.toLowerCase().includes('sma') || itemContent.toLowerCase().includes('profit') || itemContent.toLowerCase().includes('loss') || itemContent.toLowerCase().includes('level')) {
                return (
                    <div key={lineIdx} className={styles.simpleBulletRow}>
                        <span className={styles.bulletDot}>•</span>
                        <div className={styles.bulletContent}>
                            <strong>{cleanLabel}</strong>
                        </div>
                    </div>
                );
            }

            return (
                <div key={lineIdx} className={styles.simpleBulletRow}>
                    <span className={styles.bulletDot}>•</span>
                    <div className={styles.bulletContent}>{renderInlineTokens(itemContent)}</div>
                </div>
            );
        }

        // 4. Plain or Bold Key-Value header: e.g. "Strategy Name: EMA Crossover..." or "Category: Forex"
        const keyValueMatch = line.match(/^([A-Za-z0-9\s/&()-]{2,35}):\s*(.+)$/);
        if (keyValueMatch && !line.includes('http://') && !line.includes('https://')) {
            const keyLabel = stripEmojis(keyValueMatch[1].replace(/\*/g, '')).trim();
            const valText = stripEmojis(keyValueMatch[2].replace(/^\*\*:\s*|^\*\*\s*/, '').replace(/\*+$/, '')).trim();
            return (
                <div key={lineIdx} className={styles.keyValueRow}>
                    <strong>{keyLabel}:</strong>
                    <span>{renderInlineTokens(valText)}</span>
                </div>
            );
        }

        // 5. Italic Footer Prompt line (e.g. "Want to add or change any chart elements? Just let me know...")
        let cleanRaw = stripEmojis(rawLine.trim());
        cleanRaw = cleanRaw.replace(/^\*+\s*/, '').replace(/\s*\*+$/, '');

        if (
            cleanRaw.toLowerCase().startsWith('want to add or change') ||
            cleanRaw.toLowerCase().includes('confirm to proceed') ||
            cleanRaw.toLowerCase().startsWith('sounds good')
        ) {
            return (
                <div key={lineIdx} className={styles.markdownFooterPrompt}>
                    {cleanRaw.replace(/:$/, '')}
                </div>
            );
        }

        // 6. Default plain text line
        return (
            <div key={lineIdx} className={styles.markdownTextLine}>
                {renderInlineTokens(cleanRaw)}
            </div>
        );
    });
}
