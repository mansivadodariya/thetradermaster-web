'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { fetchMaintenanceStatus } from '@/lib/maintenance';
import MaintenanceModal from '@/components/maintenanceModal';

export default function MaintenanceGuard({ children }) {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    const checkStatus = useCallback(async () => {
        try {
            const isMaint = await fetchMaintenanceStatus();
            setIsMaintenance(isMaint);
        } catch (err) {
            console.warn('MaintenanceGuard check failed:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkStatus();

        if (!supabase) return;

        const channel = supabase
            .channel('maintenance_guard_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'dashboard_tabs' },
                () => {
                    checkStatus();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [checkStatus]);

    useEffect(() => {
        checkStatus();
    }, [pathname, checkStatus]);

    if (isMaintenance) {
        return <MaintenanceModal onRecheck={checkStatus} />;
    }

    return children;
}
