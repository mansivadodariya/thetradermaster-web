'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    getStoredUserId,
    getStoredUser,
    clearAuthSession,
    fetchUserOnboardingStatus,
    setOnboardingCompletedInSession,
    clearOnboardingInSession
} from '@/lib/authSession';
import { toast } from '@/components/toast';

export default function AuthGuard({ children }) {
    const router = useRouter();

    useEffect(() => {
        const handleUnauthorized = () => {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            router.replace('/login' + (currentPath && currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''));
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);

        const checkUserStatus = async () => {
            const user = getStoredUser();
            const uid = getStoredUserId() || user?.id || '';
            const email = user?.email || '';

            if (uid || email) {
                try {
                    const status = await fetchUserOnboardingStatus(uid, email);

                    // User inactive
                    if (status.exists && !status.is_active) {
                        clearAuthSession();
                        toast.error('Your account is inactive. Please contact admin.');
                        router.replace('/login');
                        return;
                    }

                    if (status.exists) {
                        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

                        if (status.onboarding_completed) {
                            setOnboardingCompletedInSession();
                            if (currentPath === '/onboarding' || currentPath === '/steper') {
                                router.replace('/dashboard');
                                return;
                            }
                        } else {
                            clearOnboardingInSession();
                            if (currentPath !== '/onboarding' && currentPath !== '/steper') {
                                router.replace('/onboarding');
                                return;
                            }
                        }

                        // Sync verified status
                        if (user && status.user) {
                            user.phone_number = status.user.phone_number || user.phone_number || '';
                            user.is_phone_verified = Boolean(status.user.is_phone_verified);
                            user.onboarding_completed = status.onboarding_completed;
                            localStorage.setItem('user', JSON.stringify(user));
                            window.dispatchEvent(new CustomEvent('user:updated'));
                        }
                    }
                } catch (e) {
                    console.error('AuthGuard status check error:', e);
                }
            }
        };

        checkUserStatus();

        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [router]);

    return children;
}
