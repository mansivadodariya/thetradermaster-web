'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/toast';
import { syncCreditsAfterAction } from '@/lib/credits';
import { fxApi } from '@/lib/api';

const AiAssistantJobContext = createContext({
    activeJobs: [],
    isAnalyzing: false,
    latestActiveJob: null,
    startAnalysis: async () => {},
    getJob: () => null,
    dismissJob: () => {},
});

const STORAGE_KEY = 'tm_ai_assistant_jobs_v1';

function getStoredJobs() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        // Only keep jobs from the last 2 hours
        const cutoff = Date.now() - 2 * 60 * 60 * 1000;
        return Array.isArray(parsed) ? parsed.filter(j => j.createdAt > cutoff) : [];
    } catch {
        return [];
    }
}

function persistJobs(jobs) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs.slice(-20)));
    } catch {
        // ignore
    }
}

export function AiAssistantJobProvider({ children }) {
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const jobsRef = useRef([]);
    const pollingIntervalRef = useRef(null);

    // Sync ref
    useEffect(() => {
        jobsRef.current = jobs;
    }, [jobs]);

    // Initial load from storage
    useEffect(() => {
        const initial = getStoredJobs();
        if (initial.length > 0) {
            setJobs(initial);
        }
    }, []);

    // Save to storage on update
    useEffect(() => {
        persistJobs(jobs);
    }, [jobs]);

    // Request notification permission if supported
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().catch(() => {});
            }
        }
    }, []);

    // Trigger notification when job is ready
    const notifyJobReady = useCallback((job) => {
        // 1. Toast Notification with direct navigation action
        toast((t) => (
            <div 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: '12px', 
                    cursor: 'pointer',
                    width: '100%',
                    padding: '2px 0'
                }} 
                onClick={() => {
                    toast.dismiss(t.id);
                    router.push(`/ai-assistant?openJob=${encodeURIComponent(job.id)}`);
                }}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Analysis Ready</span>
                        <span style={{ fontSize: '11px', background: '#ECFDF5', color: '#059669', padding: '2px 6px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                            {job.pair}
                        </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Quantitative report completed. Click to view.
                    </div>
                </div>
                <button 
                    type="button"
                    style={{ 
                        fontSize: '12px', 
                        fontWeight: 700, 
                        color: '#059669', 
                        background: '#ECFDF5', 
                        border: '1px solid #A7F3D0',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        flexShrink: 0
                    }}
                >
                    View
                </button>
            </div>
        ), {
            duration: 8000,
            id: `job-ready-${job.id}`,
            icon: null,
            style: {
                background: '#FFFFFF',
                border: '1px solid #10B981',
                padding: '12px 16px',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
                maxWidth: '420px',
            }
        });

        // 2. Desktop Notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
                const notif = new Notification('Trader Master AI Assistant', {
                    body: `Analysis for ${job.pair} is ready! Click to view full report.`,
                    icon: '/assets/icons/AIChat.svg',
                });
                notif.onclick = () => {
                    window.focus();
                    router.push(`/ai-assistant?openJob=${encodeURIComponent(job.id)}`);
                };
            } catch {
                // ignore
            }
        }

        // 3. Dispatch window event for open tabs / components
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('ai-assistant:job-completed', { detail: { job } }));
        }

        // 4. Sync credits if available
        if (job.result) {
            syncCreditsAfterAction(job.result);
        }
    }, [router]);

    // Polling and worker listener loop
    useEffect(() => {
        const pendingJobs = jobs.filter(j => j.status === 'queued' || j.status === 'processing');
        if (pendingJobs.length === 0) {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            return;
        }

        const pollJobs = async () => {
            const currentPending = jobsRef.current.filter(j => j.status === 'queued' || j.status === 'processing');
            if (currentPending.length === 0) return;

            for (const pJob of currentPending) {
                // Only poll if it's an external server-side queued job
                if (!pJob.isServerJob) continue;

                try {
                    const res = await fetch(`/api/v1/ai-assistant/jobs?jobId=${encodeURIComponent(pJob.id)}`);
                    if (!res.ok) continue;
                    const data = await res.json();
                    if (!data?.success || !data?.job) continue;

                    const updated = data.job;
                    if (updated.status === 'completed' || updated.status === 'failed') {
                        setJobs(prev => prev.map(item => item.id === pJob.id ? { ...item, ...updated } : item));

                        if (updated.status === 'completed') {
                            notifyJobReady(updated);
                        } else if (updated.status === 'failed') {
                            toast.error(updated.error || 'AI Analysis failed. Please try again.');
                            if (typeof window !== 'undefined') {
                                window.dispatchEvent(new CustomEvent('ai-assistant:job-failed', { detail: { job: updated } }));
                            }
                        }
                    }
                } catch (err) {
                    console.warn(`Polling error for job ${pJob.id}:`, err);
                }
            }
        };

        if (!pollingIntervalRef.current) {
            pollingIntervalRef.current = setInterval(pollJobs, 2000);
        }

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [jobs, notifyJobReady]);

    // Start an analysis job
    const startAnalysis = useCallback(async ({ pair, message, userId }) => {
        const jobId = `tm_job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        const initialJob = {
            id: jobId,
            pair,
            message,
            userId,
            status: 'processing',
            progress: 25,
            statusMessage: 'Analysis started – you can continue using the platform.',
            createdAt: Date.now(),
            result: null,
            error: null,
        };

        // 1. Immediately inform the user (no icon)
        toast('Analysis started – you can continue using the platform.', {
            duration: 4500,
            id: 'analysis-started',
            icon: null,
            style: {
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                fontSize: '14px',
                fontWeight: '500',
            },
        });

        // 2. Add to active jobs
        setJobs(prev => [initialJob, ...prev]);

        // 3. Immediately trigger /chat API directly via background worker
        (async () => {
            try {
                const result = await fxApi.chat(pair, message, userId);

                const completedJob = {
                    ...initialJob,
                    status: 'completed',
                    progress: 100,
                    result,
                    completedAt: Date.now(),
                };

                setJobs(prev => prev.map(j => j.id === jobId ? completedJob : j));
                notifyJobReady(completedJob);
            } catch (err) {
                console.error('[AI Assistant background worker /chat error]:', err);
                const failedJob = {
                    ...initialJob,
                    status: 'failed',
                    error: err?.message || 'Failed to complete analysis',
                    completedAt: Date.now(),
                };

                setJobs(prev => prev.map(j => j.id === jobId ? failedJob : j));
                toast.error(err?.message || 'AI Analysis failed.', { icon: null });

                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('ai-assistant:job-failed', { detail: { job: failedJob } }));
                }
            }
        })();

        return jobId;
    }, [notifyJobReady]);

    const getJob = useCallback((jobId) => {
        return jobsRef.current.find(j => j.id === jobId) || null;
    }, []);

    const dismissJob = useCallback((jobId) => {
        setJobs(prev => prev.filter(j => j.id !== jobId));
    }, []);

    const isAnalyzing = jobs.some(j => j.status === 'queued' || j.status === 'processing');
    const latestActiveJob = jobs.find(j => j.status === 'queued' || j.status === 'processing') || null;

    return (
        <AiAssistantJobContext.Provider
            value={{
                activeJobs: jobs,
                isAnalyzing,
                latestActiveJob,
                startAnalysis,
                getJob,
                dismissJob,
            }}
        >
            {children}
        </AiAssistantJobContext.Provider>
    );
}

export const useAiAssistantJobs = () => useContext(AiAssistantJobContext);
