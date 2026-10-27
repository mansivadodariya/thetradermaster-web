'use client';
import React, { useEffect } from 'react';
import hotToast, { Toaster, useToasterStore } from 'react-hot-toast';

// Single Toast Limiter Component: strictly enforces max 1 visible toast globally
function ToastLimiter() {
    const { toasts } = useToasterStore();
    const TOAST_LIMIT = 1;

    useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= TOAST_LIMIT)
            .forEach((t) => hotToast.dismiss(t.id));
    }, [toasts]);

    return null;
}

// Single Toast Wrapper (Ensures ONLY ONE toast is displayed at a time)
const singleToast = (message, options) => {
    hotToast.dismiss();
    return hotToast(message, options);
};

singleToast.success = (message, options) => {
    hotToast.dismiss();
    return hotToast.success(message, options);
};

singleToast.error = (message, options) => {
    hotToast.dismiss();
    return hotToast.error(message, options);
};

singleToast.info = (message, options) => {
    hotToast.dismiss();
    return hotToast(message, {
        ...options,
        style: {
            background: 'linear-gradient(135deg, #0A141D 0%, #050A0E 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.75), 0 0 15px rgba(56, 189, 248, 0.15)',
        },
        iconTheme: { primary: '#38BDF8', secondary: '#050A0E' },
    });
};

singleToast.loading = (message, options) => {
    hotToast.dismiss();
    return hotToast.loading(message, options);
};

singleToast.dismiss = (toastId) => hotToast.dismiss(toastId);
singleToast.remove = (toastId) => hotToast.remove(toastId);
singleToast.promise = (promise, msgs, opts) => hotToast.promise(promise, msgs, opts);

export { singleToast as toast };

export function ToastProvider({ children }) {
    return (
        <>
            <ToastLimiter />
            {children}

            <Toaster
                position="bottom-right"
                reverseOrder={false}
                gutter={10}
                containerStyle={{
                    bottom: 24,
                }}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#0D0E15',
                        color: '#FFFFFF',
                        border: '1px solid rgba(24, 201, 139, 0.35)',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontSize: '13.5px',
                        fontWeight: '600',
                        maxWidth: '420px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(12px)',
                    },
                    success: {
                        style: {
                            background: 'linear-gradient(135deg, #0B1E16 0%, #06100B 100%)',
                            color: '#FFFFFF',
                            border: '1px solid rgba(16, 185, 129, 0.45)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.85), 0 0 15px rgba(16, 185, 129, 0.15)',
                        },
                        iconTheme: { primary: '#10B981', secondary: '#06100B' },
                    },
                    error: {
                        style: {
                            background: 'linear-gradient(135deg, #220A0A 0%, #120505 100%)',
                            color: '#FFFFFF',
                            border: '1px solid rgba(239, 68, 68, 0.45)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.85), 0 0 15px rgba(239, 68, 68, 0.15)',
                        },
                        iconTheme: { primary: '#EF4444', secondary: '#120505' },
                    },
                    loading: {
                        style: {
                            background: 'linear-gradient(135deg, #161A26 0%, #0A0D14 100%)',
                            color: '#18C98B',
                            border: '1px solid rgba(24, 201, 139, 0.4)',
                        },
                        iconTheme: { primary: '#18C98B', secondary: '#0A0D14' },
                    },
                }}
            />
        </>
    );
}
