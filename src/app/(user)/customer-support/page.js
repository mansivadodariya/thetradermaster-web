'use client';

import React, { useEffect } from 'react';
import CustomerSupport from '@/rendering/customerSupport';
import { getStoredUser, getStoredUserId } from '@/lib/authSession';
import { useRouter } from 'next/navigation';

export default function CustomerSupportPage() {
    const router = useRouter();

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const user = getStoredUser();
                const userId = getStoredUserId();
                if (!user && !userId) {
                    router.replace('/support');
                }
            }
        } catch (_) {}
    }, [router]);

    return <CustomerSupport isDashboard={true} />;
}
