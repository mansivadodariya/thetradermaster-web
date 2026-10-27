import React from 'react';
import styles from '../aiAssistant.module.scss';

// Render inline markdown: bold (**text**), and HTML color spans from the API
export const renderInline = (text) => {
    if (!text) return null;
    // Split on **bold**, keeping delimiters
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        // Pass through HTML color spans the API sends (e.g. <span style='color:red;'>...)
        if (/<span\s+style=['"]color:[^'"]+['"]>/.test(part)) {
            return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
        }
        return part;
    });
};

// Render a markdown table from an array of pipe-delimited row strings
export const renderTable = (tableLines, keyPrefix) => {
    const rows = tableLines
        .filter(l => !/^\|[-:| ]+\|$/.test(l)) // strip separator rows
        .map(l => l.replace(/^\||\|$/g, '').split('|').map(c => c.trim()));

    if (rows.length === 0) return null;
    const [header, ...body] = rows;

    return (
        <div key={`table-${keyPrefix}`} className={styles.mdTableWrapper}>
            <table className={styles.mdTable}>
                <thead>
                    <tr>{header.map((cell, j) => <th key={j}>{renderInline(cell)}</th>)}</tr>
                </thead>
                <tbody>
                    {body.map((row, ri) => (
                        <tr key={ri}>
                            {row.map((cell, ci) => <td key={ci}>{renderInline(cell)}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const formatResponse = (text) => {
    if (!text || typeof text !== 'string') return null;

    const lines = text.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) { i++; continue; }

        // H2 heading: ## ...
        if (/^##\s+/.test(trimmed)) {
            elements.push(
                <h2 key={i} className={styles.mdH2}>
                    {renderInline(trimmed.replace(/^##\s+/, ''))}
                </h2>
            );
            i++; continue;
        }

        // H3 heading: ### ...
        if (/^###\s+/.test(trimmed)) {
            elements.push(
                <h3 key={i} className={styles.mdH3}>
                    {renderInline(trimmed.replace(/^###\s+/, ''))}
                </h3>
            );
            i++; continue;
        }

        // Table: starts with |
        if (trimmed.startsWith('|')) {
            const tableLines = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i].trim());
                i++;
            }
            elements.push(renderTable(tableLines, elements.length));
            continue;
        }

        // Unordered list item: - or *
        if (/^[-*]\s+/.test(trimmed)) {
            const listItems = [];
            while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
                listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
                i++;
            }
            elements.push(
                <ul key={`ul-${elements.length}`} className={styles.mdList}>
                    {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
                </ul>
            );
            continue;
        }

        // Ordered list item: 1. 2. etc
        if (/^\d+\.\s+/.test(trimmed)) {
            const listItems = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
                listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
                i++;
            }
            elements.push(
                <ol key={`ol-${elements.length}`} className={styles.mdList}>
                    {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
                </ol>
            );
            continue;
        }

        // Regular paragraph
        elements.push(<p key={i} className={styles.mdPara}>{renderInline(trimmed)}</p>);
        i++;
    }

    return elements;
};
