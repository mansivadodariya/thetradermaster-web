/**
 * Interface definition for ParsedChatMessage
 * @typedef {Object} ParsedChatMessage
 * @property {string} disclaimerHeader
 * @property {string} disclaimerFooter
 * @property {object|null} jsonData
 * @property {string} fallbackText
 */

import { formatTechnicalProse, isTechnicalJsonPayload } from './formatTechnicalProse.js';

/**
 * Parses raw chat message text and extracts disclaimer header, footer,
 * embedded JSON analysis report, and clean fallback text.
 * 
 * @param {string|object} rawText
 * @param {string|object} [fullReport]
 * @returns {ParsedChatMessage}
 */
export function parseChatMessage(rawText, fullReport) {
  const result = {
    disclaimerHeader: '',
    disclaimerFooter: '',
    jsonData: null,
    fallbackText: ''
  };

  if (!rawText && !fullReport) return result;

  const sourceText = typeof rawText === 'string' ? rawText : (rawText ? JSON.stringify(rawText) : '');
  const reportText = typeof fullReport === 'string' ? fullReport : (fullReport ? JSON.stringify(fullReport) : '');

  // 1. Extract Disclaimer Header if present (e.g. "> ⚠️ **Disclaimer: ...**\n\n")
  const headerMatch = sourceText.match(/^(>\s*⚠️[\s\S]*?\n\n)/i) ||
                      sourceText.match(/^(>\s*\[!WARNING\][\s\S]*?\n\n)/i) ||
                      sourceText.match(/^(\*\*⚠️[^\n]*\*\*[\s\S]*?\n\n)/i) ||
                      sourceText.match(/^(>\s*\*\*Disclaimer:[\s\S]*?\n\n)/i);
  if (headerMatch) {
    result.disclaimerHeader = headerMatch[1].trim();
  }

  // 2. Extract Disclaimer Footer if present (e.g. "\n\n***Disclaimer: ...***")
  const footerMatch = sourceText.match(/(\n\n\*\*\*Disclaimer:[\s\S]*?\*?)$/i) ||
                      sourceText.match(/(\n\n\*\*Disclaimer:[\s\S]*?\*?)$/i) ||
                      sourceText.match(/(\n\n>\s*⚠️[\s\S]*?)$/i) ||
                      sourceText.match(/(\n\n>\s*\*\*Disclaimer:[\s\S]*?)$/i);
  if (footerMatch) {
    result.disclaimerFooter = footerMatch[1].trim();
  }

  // 3. Try to extract JSON object from fullReport or sourceText
  const textToParse = reportText || sourceText;
  if (typeof textToParse === 'object' && textToParse !== null) {
    result.jsonData = textToParse;
  } else if (typeof textToParse === 'string') {
    const jsonMatch = textToParse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        result.jsonData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn("Could not parse embedded JSON in message:", e);
        result.jsonData = null;
      }
    }
  }

  // If reportText didn't give JSON, also check sourceText
  if (!result.jsonData && sourceText && sourceText !== textToParse) {
    const jsonMatchSource = sourceText.match(/\{[\s\S]*\}/);
    if (jsonMatchSource) {
      try {
        result.jsonData = JSON.parse(jsonMatchSource[0]);
      } catch (_) {}
    }
  }

  // 4. Extract Fallback Prose Text (Only strip JSON blocks if structured JSON was detected)
  let cleanText = sourceText;
  if (headerMatch && headerMatch[1]) {
    cleanText = cleanText.replace(headerMatch[1], '');
  }
  if (footerMatch && footerMatch[1]) {
    cleanText = cleanText.replace(footerMatch[1], '');
  }

  if (result.jsonData) {
    // Remove code fences ```json ... ```
    cleanText = cleanText.replace(/```(?:json)?[\s\S]*?```/gi, '');

    // Only strip pure JSON object if the message was predominantly a vision JSON envelope
    if (/^\s*\{[\s\S]*\"(?:overall_trend|market_structure|chart_sections|is_valid_chart)\"[\s\S]*\}\s*$/i.test(cleanText.trim())) {
      cleanText = '';
    } else if (isTechnicalJsonPayload(result.jsonData)) {
      cleanText = formatTechnicalProse(result.jsonData);
    }
  }

  cleanText = cleanText.trim();

  // If cleanText is still raw JSON (e.g. indicator dump), format it
  if (cleanText && cleanText.startsWith('{') && cleanText.endsWith('}')) {
    try {
      const parsedObj = JSON.parse(cleanText);
      if (isTechnicalJsonPayload(parsedObj)) {
        cleanText = formatTechnicalProse(parsedObj);
      }
    } catch (_) {}
  }

  // If cleanText was completely wiped but sourceText had content (and not raw JSON envelope)
  if (!cleanText && sourceText && !/^\s*\{[\s\S]*\}\s*$/.test(sourceText.trim())) {
    cleanText = sourceText.trim();
  }

  result.fallbackText = cleanText;

  return result;
}

export default parseChatMessage;
