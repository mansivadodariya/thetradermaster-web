"use client";
import React, { useEffect } from 'react'
import { captureUtmParameters } from '@/lib/utm';
import MaintenanceGuard from '@/components/maintenanceGuard';

export default function Layout({ children }) {
    useEffect(() => {
        captureUtmParameters();
        document.documentElement.classList.remove('dark');
    }, []);

    return (
        <MaintenanceGuard>
            <div>
                {children}
            </div>
        </MaintenanceGuard>
    )
}