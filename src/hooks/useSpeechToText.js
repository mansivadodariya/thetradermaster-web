'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from '@/components/toast';

export function useSpeechToText({ onResult, onStart, onEnd, onError, lang = 'en-US' } = {}) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);
    const isListeningRef = useRef(false);
    const isManualStopRef = useRef(false);
    const sessionTranscriptRef = useRef('');
    const currentFinalRef = useRef('');
    const restartTimeoutRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                setIsSupported(true);
            }
        }
    }, []);

    const callbacksRef = useRef({ onResult, onStart, onEnd, onError });
    useEffect(() => {
        callbacksRef.current = { onResult, onStart, onEnd, onError };
    }, [onResult, onStart, onEnd, onError]);

    const cleanupRecognitionInstance = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.onstart = null;
                recognitionRef.current.onresult = null;
                recognitionRef.current.onerror = null;
                recognitionRef.current.onend = null;
                recognitionRef.current.abort();
            } catch (_) {}
            recognitionRef.current = null;
        }
    }, []);

    const stopListening = useCallback(() => {
        isManualStopRef.current = true;
        isListeningRef.current = false;
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
        }
        cleanupRecognitionInstance();
        setIsListening(false);
        if (callbacksRef.current.onEnd) {
            callbacksRef.current.onEnd();
        }
    }, [cleanupRecognitionInstance]);

    const createAndStartRecognition = useCallback(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
            isListeningRef.current = false;
            setIsListening(false);
            return;
        }

        // Clean up any stale recognition instance first
        cleanupRecognitionInstance();

        if (isManualStopRef.current) return;

        try {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;

            const browserLang = (typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage))
                ? (navigator.language || navigator.userLanguage)
                : 'en-US';
            recognition.lang = lang || browserLang || 'en-US';

            recognition.onstart = () => {
                isListeningRef.current = true;
                setIsListening(true);
                if (callbacksRef.current.onStart) {
                    callbacksRef.current.onStart();
                }
            };

            recognition.onresult = (event) => {
                let accumulatedFinal = '';
                let currentInterim = '';

                for (let i = 0; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result && result[0]) {
                        const transcript = result[0].transcript || '';
                        if (result.isFinal) {
                            accumulatedFinal += (accumulatedFinal ? ' ' : '') + transcript.trim();
                        } else {
                            currentInterim += (currentInterim ? ' ' : '') + transcript.trim();
                        }
                    }
                }

                currentFinalRef.current = accumulatedFinal;

                // Combine accumulated session text + current final + current interim
                const fullSessionText = [
                    sessionTranscriptRef.current,
                    accumulatedFinal,
                    currentInterim
                ]
                    .filter(Boolean)
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (fullSessionText && callbacksRef.current.onResult) {
                    callbacksRef.current.onResult(fullSessionText, {
                        final: [sessionTranscriptRef.current, accumulatedFinal].filter(Boolean).join(' ').trim(),
                        interim: currentInterim.trim(),
                        raw: fullSessionText
                    });
                }
            };

            recognition.onerror = (event) => {
                console.warn('Speech recognition event:', event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    toast.error('Microphone access denied. Please click the lock/settings icon in the browser address bar to allow microphone access.');
                    isManualStopRef.current = true;
                    isListeningRef.current = false;
                    setIsListening(false);
                } else if (event.error === 'audio-capture') {
                    toast.error('No microphone found. Please connect a microphone and try again.');
                    isManualStopRef.current = true;
                    isListeningRef.current = false;
                    setIsListening(false);
                } else if (event.error === 'network') {
                    console.warn('Speech recognition network notice');
                }

                if (callbacksRef.current.onError) {
                    callbacksRef.current.onError(event);
                }
            };

            recognition.onend = () => {
                // Persist any finalized text from this segment into sessionTranscriptRef
                if (currentFinalRef.current) {
                    sessionTranscriptRef.current = [sessionTranscriptRef.current, currentFinalRef.current]
                        .filter(Boolean)
                        .join(' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    currentFinalRef.current = '';
                }

                // If user didn't manually stop listening, keep listening active by creating a fresh instance
                if (!isManualStopRef.current && isListeningRef.current) {
                    restartTimeoutRef.current = setTimeout(() => {
                        if (!isManualStopRef.current && isListeningRef.current) {
                            createAndStartRecognition();
                        }
                    }, 100);
                    return;
                }

                setIsListening(false);
                isListeningRef.current = false;
                if (callbacksRef.current.onEnd) {
                    callbacksRef.current.onEnd();
                }
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (err) {
            console.error('Failed to start speech recognition:', err);
            // If already started, ignore; otherwise notify user
            if (err?.name !== 'InvalidStateError') {
                toast.error('Unable to start voice input. Please try again.');
            }
            setIsListening(false);
            isListeningRef.current = false;
        }
    }, [lang, cleanupRecognitionInstance]);

    const startListening = useCallback(() => {
        isManualStopRef.current = false;
        isListeningRef.current = true;
        sessionTranscriptRef.current = '';
        currentFinalRef.current = '';
        if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
        }
        createAndStartRecognition();
    }, [createAndStartRecognition]);

    const toggleListening = useCallback(() => {
        if (isListeningRef.current || isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    useEffect(() => {
        return () => {
            isManualStopRef.current = true;
            isListeningRef.current = false;
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
            }
            cleanupRecognitionInstance();
        };
    }, [cleanupRecognitionInstance]);

    return {
        isListening,
        isSupported,
        startListening,
        stopListening,
        toggleListening
    };
}
