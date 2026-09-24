'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUserId, getStoredUser, clearAuthSession } from '@/lib/authSession';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/toast';
import FirebasePhoneModal from '@/components/firebasePhoneModal';
import { profileApi } from '@/lib/api';

export default function AuthGuard({ children }) {
    const router = useRouter();
    const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false);
    const [userPhone, setUserPhone] = useState('');
    const [activeUid, setActiveUid] = useState('');

    useEffect(() => {
        const handleUnauthorized = () => {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            router.replace('/login' + (currentPath && currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : ''));
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);

        const checkUserStatus = async () => {
            const uid = getStoredUserId();
            const localUser = getStoredUser();
            setActiveUid(uid);

            // 1. Instant check from local session to avoid delay/refresh dependency
            const isLocallyVerified = Boolean(localUser?.is_phone_verified === true);
            const initialPhone = localUser?.phone_number || '';
            setUserPhone(initialPhone);

            if (!isLocallyVerified) {
                console.log('AuthGuard: Phone is not verified in local session, showing modal immediately');
                setNeedsPhoneVerification(true);
            } else {
                setNeedsPhoneVerification(false);
            }

            // 2. Fetch fresh status from Supabase or backend API
            if (uid) {
                let dbUser = null;
                let isUserDeleted = false;

                if (supabase) {
                    try {
                        const { data, error } = await supabase
                            .from('users')
                            .select('phone_number, is_phone_verified, is_active')
                            .eq('id', uid)
                            .maybeSingle();

                        if (error?.code === 'PGRST116') {
                            isUserDeleted = true;
                        } else if (data) {
                            dbUser = data;
                        }
                    } catch (sbErr) {
                        console.warn('AuthGuard Supabase status fetch warning:', sbErr);
                    }
                }

                if (isUserDeleted) {
                    clearAuthSession();
                    toast.error('Your account has been deleted. Please contact admin.');
                    router.replace('/login');
                    return;
                }

                if (!dbUser) {
                    try {
                        const profRes = await profileApi.getProfile();
                        dbUser = profRes?.data || profRes;
                    } catch (apiErr) {
                        console.warn('AuthGuard profileApi status fetch warning:', apiErr);
                    }
                }

                if (dbUser?.is_active === false) {
                    clearAuthSession();
                    toast.error('Your account is inactive. Please contact admin.');
                    router.replace('/login');
                    return;
                }

                const updatedPhone = dbUser?.phone_number || initialPhone;
                if (updatedPhone) setUserPhone(updatedPhone);

                const isVerifiedInDb = Boolean(dbUser?.is_phone_verified === true);
                if (isVerifiedInDb) {
                    setNeedsPhoneVerification(false);
                    if (localUser) {
                        localUser.phone_number = updatedPhone;
                        localUser.is_phone_verified = true;
                        localStorage.setItem('user', JSON.stringify(localUser));
                    }
                    document.cookie = 'has_phone=true; path=/; SameSite=Lax';
                } else {
                    setNeedsPhoneVerification(true);
                }
            }
        };

        checkUserStatus();

        const handleUserUpdated = () => checkUserStatus();
        window.addEventListener('user:updated', handleUserUpdated);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
            window.removeEventListener('user:updated', handleUserUpdated);
        };
    }, [router]);

    const handlePhoneVerifiedSuccess = async (verifiedPhone) => {
        const phoneToSave = verifiedPhone || userPhone;
        try {
            const stored = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
            const firstName = stored.first_name || '';
            const lastName = stored.last_name || '';

            await profileApi.updateProfile({
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneToSave,
            });

            if (supabase && activeUid) {
                try {
                    await supabase
                        .from('users')
                        .update({
                            phone_number: phoneToSave,
                            is_phone_verified: true
                        })
                        .eq('id', activeUid);
                } catch (dbErr) {
                    console.warn("Supabase direct phone verification update error:", dbErr);
                }
            }

            if (typeof window !== 'undefined') {
                const parsed = JSON.parse(localStorage.getItem('user') || '{}');
                parsed.phone_number = phoneToSave;
                parsed.is_phone_verified = true;
                localStorage.setItem('user', JSON.stringify(parsed));
                document.cookie = 'has_phone=true; path=/; SameSite=Lax';
                window.dispatchEvent(new CustomEvent('user:updated'));
            }

            setNeedsPhoneVerification(false);
            toast.success('Phone number verified successfully!');
        } catch (err) {
            console.error('Failed to update phone verification status:', err);
            setNeedsPhoneVerification(false);
        }
    };

    return (
        <>
            {children}
            <FirebasePhoneModal
                isOpen={needsPhoneVerification}
                phoneNumber={userPhone}
                autoTriggerSend={true}
                isPhoneReadOnly={Boolean(userPhone)}
                onClose={null}
                onSuccess={handlePhoneVerifiedSuccess}
            />
        </>
    );
}
