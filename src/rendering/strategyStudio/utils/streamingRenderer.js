'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * useStreamingText — Ultra-smooth, frame-perfect streaming text renderer
 *
 * Powered by requestAnimationFrame & performance.now() delta timing.
 * Delivers continuous, fluid character streaming (60-120fps) without jerky
 * word pops, sudden punctuation freezes, or React state thrashing.
 *
 * Respects prefers-reduced-motion - shows full text immediately when enabled.
 *
 * @param {string} fullText - The complete text to stream
 * @param {object} options - Configuration
 * @param {number} options.msPerChar - Milliseconds per character (default: 18ms ≈ 55 chars/sec)
 * @param {boolean} options.enabled - Whether streaming is enabled (default: true)
 * @param {function} options.onComplete - Callback when streaming finishes
 * @param {function} options.onProgress - Callback on each character rendered
 * @returns {{ displayedText: string, isStreaming: boolean, cursorVisible: boolean, skipToEnd: function }}
 */
export function useStreamingText(fullText, options = {}) {
    const prefersReducedMotion = useReducedMotion();
    const {
        msPerChar = 18,
        enabled = true,
        onComplete = null,
        onProgress = null
    } = options;

    // If reduced motion is preferred, show full text immediately
    const shouldStream = enabled && !prefersReducedMotion && Boolean(fullText);

    const [displayedText, setDisplayedText] = useState(() => (shouldStream ? '' : (fullText || '')));
    const [isStreaming, setIsStreaming] = useState(false);

    const rafRef = useRef(null);
    const fullTextRef = useRef('');
    const onCompleteRef = useRef(onComplete);
    const onProgressRef = useRef(onProgress);

    onCompleteRef.current = onComplete;
    onProgressRef.current = onProgress;

    // Skip to end immediately
    const skipToEnd = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        setDisplayedText(fullTextRef.current);
        setIsStreaming(false);
        if (onCompleteRef.current) onCompleteRef.current();
    }, []);

    useEffect(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        // If reduced motion or disabled, show full text immediately
        if (!shouldStream) {
            setDisplayedText(fullText || '');
            setIsStreaming(false);
            if (onCompleteRef.current) onCompleteRef.current();
            return;
        }

        fullTextRef.current = fullText;
        setDisplayedText('');
        setIsStreaming(true);

        const totalLength = fullText.length;
        let charIndex = 0;
        let lastTime = performance.now();
        let accumulatedTime = 0;

        const tick = (now) => {
            const delta = now - lastTime;
            lastTime = now;
            accumulatedTime += delta;

            const charsToAdd = Math.floor(accumulatedTime / msPerChar);
            if (charsToAdd > 0) {
                accumulatedTime -= charsToAdd * msPerChar;
                charIndex = Math.min(charIndex + charsToAdd, totalLength);

                setDisplayedText(fullText.slice(0, charIndex));
                if (onProgressRef.current) onProgressRef.current(charIndex, totalLength);

                if (charIndex >= totalLength) {
                    setIsStreaming(false);
                    rafRef.current = null;
                    if (onCompleteRef.current) onCompleteRef.current();
                    return;
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [fullText, enabled, msPerChar, prefersReducedMotion, shouldStream]);

    return { displayedText, isStreaming, cursorVisible: isStreaming, skipToEnd };
}

/**
 * StreamingTextRenderer — Render component that wraps useStreamingText for inline use
 */
export function StreamingTextRenderer({ text, enabled, onComplete, onProgress }) {
    const { displayedText, isStreaming } = useStreamingText(text, {
        enabled,
        onComplete,
        onProgress
    });

    return (
        <>
            {displayedText}
            {isStreaming && (
                <span className="streamingCursorChar">▌</span>
            )}
        </>
    );
}
