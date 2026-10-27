'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './continueWithGoogle.module.scss';
import { authApi, profileApi } from '@/lib/api';
import {
    persistAuthSession,
    extractAccessToken,
    isGooglePendingApproval,
    fetchUserOnboardingStatus,
    setOnboardingCompletedInSession,
    clearOnboardingInSession,
    isUserOnboardingCompleted,
} from '@/lib/authSession';
import { toast } from '@/components/toast';
import { supabase } from '@/lib/supabaseClient';
import PhoneInput from '@/components/phoneInput';
import Button from '@/components/button';
import { isValidPhoneNumber } from 'react-phone-number-input';
import FirebasePhoneModal from '@/components/firebasePhoneModal';

const GoogleIcon = '/assets/icons/google.svg';

const ContinueWithGoogle = ({ redirectTo = '/dashboard', onPendingPhone }) => {
    const router = useRouter();
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false);
    const btnContainerRef = useRef(null);
    const redirectRef = useRef(redirectTo);
    const onboardingCompletedRef = useRef(null);

    const resolvePostAuthTarget = (preferredTarget = redirectRef.current) => {
        let isDone = onboardingCompletedRef.current;
        if (isDone === null || isDone === undefined) {
            isDone = isUserOnboardingCompleted();
        }

        if (!isDone) {
            return '/onboarding';
        }

        let target = preferredTarget || '/dashboard';
        if (!target || target === '/onboarding' || target === '/steper' || target.startsWith('/onboarding') || target.startsWith('/steper')) {
            target = '/dashboard';
        }
        return target;
    };

    useEffect(() => {
        redirectRef.current = redirectTo;
    }, [redirectTo]);

    // States for remembered Google/Chrome account
    const [savedGoogleAccount, setSavedGoogleAccount] = useState(null);

    // States for phone number step (fallback if no onPendingPhone prop is passed)
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [savingPhone, setSavingPhone] = useState(false);
    const [userId, setUserId] = useState('');

    const callbackRef = useRef(null);

    // Check localStorage for previously remembered Google user
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('last_google_user');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed?.name) {
                        setSavedGoogleAccount(parsed);
                        return;
                    }
                }
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    const name = parsed.first_name || (parsed.name ? parsed.name.split(' ')[0] : '');
                    if (name) {
                        setSavedGoogleAccount({
                            name,
                            fullName: parsed.name || name,
                            email: parsed.email || '',
                            picture: parsed.profile_picture || parsed.picture || ''
                        });
                    }
                }
            }
        } catch (e) {
            console.warn('Error reading saved Google account:', e);
        }
    }, []);

    callbackRef.current = async (response) => {
        if (!response?.credential) {
            setError('Google sign-in was cancelled or failed.');
            return;
        }

        // Extract Google user name and avatar from JWT ID token payload
        try {
            const tokenParts = response.credential.split('.');
            if (tokenParts.length > 1) {
                const base64Url = tokenParts[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const googlePayload = JSON.parse(jsonPayload);
                const displayName = googlePayload.given_name || (googlePayload.name ? googlePayload.name.split(' ')[0] : 'User');
                const accountData = {
                    name: displayName,
                    fullName: googlePayload.name || displayName,
                    email: googlePayload.email || '',
                    picture: googlePayload.picture || ''
                };
                setSavedGoogleAccount(accountData);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('last_google_user', JSON.stringify(accountData));
                    localStorage.setItem('last_user_name', displayName);
                }
            }
        } catch (jwtErr) {
            console.warn('Google JWT parse notice:', jwtErr);
        }

        setError('');
        setLoading(true);

        try {
            const result = await authApi.googleLogin(response.credential);
            const accessToken = extractAccessToken(result);

            if (accessToken) {
                // Persist session
                const sessionUser = persistAuthSession(result);
                if (typeof window !== 'undefined') {
                    document.cookie = 'has_phone=true; path=/; SameSite=Lax';
                }

                const uid = sessionUser?.id || (typeof window !== 'undefined' ? localStorage.getItem('user_id') : '');
                const email = sessionUser?.email || '';

                const status = await fetchUserOnboardingStatus(uid, email);
                const isOnboardingDone = Boolean(status.onboarding_completed);
                onboardingCompletedRef.current = isOnboardingDone;
                if (isOnboardingDone) {
                    setOnboardingCompletedInSession();
                } else {
                    clearOnboardingInSession();
                }

                const isPhoneVerified = status.is_phone_verified === true || status.user?.is_phone_verified === true;
                if (status.user && !isPhoneVerified) {
                    setPhoneNumber(status.user.phone_number || '');
                    setShowPhoneModal(true);
                    return;
                }

                const target = resolvePostAuthTarget();
                if (typeof window !== 'undefined') {
                    window.location.assign(target);
                } else {
                    router.replace(target);
                }
                return;
            }

            if (isGooglePendingApproval(result)) {
                setPending(true);
                router.push("/dashboard")
                toast.success(
                    result?.message ||
                        'Sign up successful! Your account is awaiting admin approval.'
                );
                return;
            }

            toast.error(
                result?.message || 'Google sign-in could not be completed. Please try again.'
            );
        } catch (err) {
            let msg = typeof err.message === 'string' ? err.message : 'Google sign-in failed.';
            if (
                msg.toLowerCase().includes('account is not active') ||
                msg.toLowerCase().includes('account is inactive') ||
                msg.toLowerCase().includes('account not active')
            ) {
                msg = 'Account is not active. Please contact admin.';
            }
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePhoneNumber = async (e) => {
        if (e) e.preventDefault();

        if (!phoneNumber) {
            setPhoneError('Phone number is required.');
            return;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            setPhoneError('Enter a valid phone number.');
            return;
        }

        setSavingPhone(true);
        setPhoneError('');

        try {
            const stored = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
            const firstName = stored.first_name || '';
            const lastName = stored.last_name || '';

            const apiRes = await profileApi.updateProfile({
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
            });

            // Update Supabase users table directly to set is_phone_verified = true
            const activeUid = stored.id || (typeof window !== 'undefined' ? localStorage.getItem('user_id') : null);
            if (supabase && activeUid) {
                try {
                    await supabase
                        .from('users')
                        .update({
                            phone_number: phoneNumber,
                            is_phone_verified: true
                        })
                        .eq('id', activeUid);
                } catch (dbErr) {
                    console.warn("Supabase direct phone verification update error:", dbErr);
                }
            }

            // Update user in localStorage
            if (typeof window !== 'undefined') {
                const parsed = JSON.parse(localStorage.getItem('user') || '{}');
                parsed.phone_number = phoneNumber;
                parsed.is_phone_verified = true;
                localStorage.setItem('user', JSON.stringify(parsed));
                document.cookie = 'has_phone=true; path=/; SameSite=Lax';
                window.dispatchEvent(new CustomEvent('user:updated'));
            }

            toast.success(apiRes?.message || 'Profile completed successfully!');
            setShowPhoneModal(false);

            const target = resolvePostAuthTarget();
            if (typeof window !== 'undefined') {
                window.location.assign(target);
            } else {
                router.replace(target);
                router.refresh();
            }
        } catch (err) {
            console.error('Failed to save phone number:', err);
            const msg = String(err.message || '');
            let userFriendlyMsg = 'Failed to complete profile.';
            if (msg.includes('unique constraint') || msg.includes('duplicate key') || msg.includes('already exists') || msg.includes('already in use')) {
                userFriendlyMsg = 'This phone number is already in use.';
            } else if (msg) {
                userFriendlyMsg = msg;
            }
            setPhoneError(userFriendlyMsg);
            toast.error(userFriendlyMsg);
        } finally {
            setSavingPhone(false);
        }
    };

    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) return;

        const init = () => {
            if (initialized.current) return;

            const container = btnContainerRef.current;
            if (!container) return;

            initialized.current = true;

            window.google.accounts.id.disableAutoSelect();

            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => callbackRef.current(response),
                auto_select: false,
                context: 'signin',
                itp_support: true,
                use_fedcm_for_prompt: true,
            });

            container.innerHTML = '';
            const width = Math.min(400, Math.max(240, container.offsetWidth || 320));

            window.google.accounts.id.renderButton(container, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                text: 'continue_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width,
            });

            // Prompt Chrome Google One Tap for instant direct login if supported
            try {
                window.google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        // Optional fallback logging
                    }
                });
            } catch (promptErr) {
                console.warn('Google One Tap prompt notice:', promptErr);
            }
        };

        if (window.google?.accounts?.id) {
            init();
        } else {
            const scriptId = 'google-gsi-script';
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = init;
                document.head.appendChild(script);
            } else {
                const interval = setInterval(() => {
                    if (window.google?.accounts?.id) {
                        clearInterval(interval);
                        init();
                    }
                }, 100);
            }
        }
    }, []);

    const buttonLabel = loading
        ? 'Signing in...'
        : savedGoogleAccount?.name
        ? `Continue as ${savedGoogleAccount.name}`
        : 'Continue with Google';

    return (
        <div className={styles.continueWithGoogle}>
            {error && <p className={styles.error} role="alert">{error}</p>}
            {loading && (
                <p className={styles.loading} role="status">
                    Signing in with Google...
                </p>
            )}
            {pending && (
                <p className={styles.pending} role="status">
                    Sign up successful! Your account is awaiting admin approval. You will be able
                    to log in after an admin approves your account.
                </p>
            )}
            <div className={styles.googleBtnWrapper}>
                <div className={styles.customGoogleBtn} aria-hidden="true">
                    {savedGoogleAccount?.picture ? (
                        <img
                            src={savedGoogleAccount.picture}
                            alt=""
                            className={styles.userAvatar}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = GoogleIcon;
                            }}
                        />
                    ) : (
                        <img src={GoogleIcon} alt="" />
                    )}
                    <span className={styles.btnLabelText}>{buttonLabel}</span>
                </div>
                <div
                    ref={btnContainerRef}
                    id="google-signin-btn"
                    className={styles.googleNativeBtn}
                    aria-label={buttonLabel}
                    aria-busy={loading}
                />
            </div>

            <FirebasePhoneModal
                isOpen={showPhoneModal}
                phoneNumber={phoneNumber}
                onClose={() => {
                    setShowPhoneModal(false);
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('skipPhoneVerification', 'true');
                        const target = resolvePostAuthTarget();
                        window.location.assign(target);
                    }
                }}
                onSkip={() => {
                    setShowPhoneModal(false);
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('skipPhoneVerification', 'true');
                        const target = resolvePostAuthTarget();
                        window.location.assign(target);
                    }
                }}
                onSuccess={() => {
                    setShowPhoneModal(false);
                    const target = resolvePostAuthTarget();
                    if (typeof window !== 'undefined') {
                        window.location.assign(target);
                    } else {
                        router.replace(target);
                        router.refresh();
                    }
                }}
            />
        </div>
    );
};

export default ContinueWithGoogle;
