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

            // 1. If user is logged out or session is empty, immediately hide modal and return
            if (!uid || !localUser) {
                setActiveUid('');
                setNeedsPhoneVerification(false);
                return;
            }

            setActiveUid(uid);

            // 2. Check local session / cookie
            const isLocallyVerified = Boolean(
                localUser?.is_phone_verified === true ||
                (typeof document !== 'undefined' && document.cookie.includes('has_phone=true'))
            );
            const initialPhone = localUser?.phone_number || '';
            setUserPhone(initialPhone);

            if (isLocallyVerified) {
                setNeedsPhoneVerification(false);
            }

            // 3. Fetch fresh status from Supabase or backend API
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

            const isVerified = Boolean(
                dbUser?.is_phone_verified === true ||
                isLocallyVerified === true ||
                localUser?.is_phone_verified === true
            );

            const isSkipped = typeof window !== 'undefined' && sessionStorage.getItem('skip_phone_verification') === 'true';

            if (isVerified || isSkipped) {
                setNeedsPhoneVerification(false);
                if (isVerified && localUser && !localUser.is_phone_verified) {
                    localUser.phone_number = updatedPhone;
                    localUser.is_phone_verified = true;
                    localStorage.setItem('user', JSON.stringify(localUser));
                }
                if (isVerified) {
                    document.cookie = 'has_phone=true; path=/; SameSite=Lax';
                }
            } else {
                setNeedsPhoneVerification(true);
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
        const stored = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
        const phoneToSave = verifiedPhone || userPhone || stored.phone_number || '';
        console.log('AuthGuard handlePhoneVerifiedSuccess: phoneToSave =', phoneToSave);

        // Instantly close modal and set local session to verified
        setNeedsPhoneVerification(false);

        if (typeof window !== 'undefined') {
            const parsed = JSON.parse(localStorage.getItem('user') || '{}');
            parsed.phone_number = phoneToSave;
            parsed.is_phone_verified = true;
            localStorage.setItem('user', JSON.stringify(parsed));
            document.cookie = 'has_phone=true; path=/; SameSite=Lax';
        }

        if (!phoneToSave) return;

        try {
            const firstName = stored.first_name || '';
            const lastName = stored.last_name || '';
            const userEmail = stored.email || '';
            const targetUid = activeUid || stored.id || stored.user_id || getStoredUserId();

            try {
                await profileApi.updateProfile({
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneToSave,
                });
            } catch (apiErr) {
                console.warn("backend profileApi update error:", apiErr);
            }

            if (supabase) {
                try {
                    if (targetUid) {
                        await supabase
                            .from('users')
                            .update({
                                phone_number: phoneToSave,
                                is_phone_verified: true
                            })
                            .eq('id', targetUid);
                    }

                    if (userEmail) {
                        await supabase
                            .from('users')
                            .update({
                                phone_number: phoneToSave,
                                is_phone_verified: true
                            })
                            .eq('email', userEmail);
                    }
                } catch (dbErr) {
                    console.warn("Supabase direct phone verification update error:", dbErr);
                }
            }

            toast.success('Phone number verified successfully!');
        } catch (err) {
            console.error('Failed to update phone verification status:', err);
        }
    };

    const handleSkipPhoneVerification = () => {
        setNeedsPhoneVerification(false);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('skip_phone_verification', 'true');
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
                onClose={handleSkipPhoneVerification}
                onSkip={handleSkipPhoneVerification}
                onSuccess={handlePhoneVerifiedSuccess}
            />
        </>
    );
}
