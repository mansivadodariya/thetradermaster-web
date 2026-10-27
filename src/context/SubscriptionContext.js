'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { subscriptionApi, PLAN_TIERS } from '@/lib/subscriptionApi';
import { getStoredUser } from '@/lib/authSession';

const SubscriptionContext = createContext({
    subscription: null,
    hasActivePlan: false,
    loading: true,
    refreshSubscription: async () => {},
    evaluatePlanAction: () => ({ action: 'SUBSCRIBE', label: 'Get Started', isCurrent: false }),
});

export function SubscriptionProvider({ children }) {
    const [subscription, setSubscription] = useState(null);
    const [hasActivePlan, setHasActivePlan] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadSubscription = useCallback(async () => {
        try {
            const data = await subscriptionApi.getCurrentSubscription();
            if (data?.has_active_plan && data?.active_subscription) {
                setSubscription(data.active_subscription);
                setHasActivePlan(true);
            } else if (data?.plan_id) {
                setSubscription(data);
                setHasActivePlan(true);
            } else {
                setSubscription(null);
                setHasActivePlan(false);
            }
        } catch (err) {
            console.warn('[SubscriptionContext] Error loading subscription:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSubscription();

        // Cross-tab and in-app event listeners for instant reactivity
        const handleSubUpdated = (e) => {
            if (e?.detail?.active_subscription) {
                setSubscription(e.detail.active_subscription);
                setHasActivePlan(true);
            } else {
                loadSubscription();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('subscription:updated', handleSubUpdated);
            return () => {
                window.removeEventListener('subscription:updated', handleSubUpdated);
            };
        }
    }, [loadSubscription]);

    /**
     * Compare plan tier with active subscription to determine eligibility
     */
    const evaluatePlanAction = useCallback((plan, t = (k, fallback) => fallback) => {
        if (!plan) return { action: 'SUBSCRIBE', label: 'Choose Plan', isCurrent: false };

        const targetId = String(plan.id || '').toLowerCase();
        const targetTier = PLAN_TIERS[targetId] !== undefined 
            ? PLAN_TIERS[targetId] 
            : (Number(plan.tier_level) || 1);

        const currentId = String(subscription?.plan_id || '').toLowerCase();
        const currentTier = PLAN_TIERS[currentId] !== undefined
            ? PLAN_TIERS[currentId]
            : (subscription?.tier_level || 0);

        // If no active paid plan
        if (!hasActivePlan || currentTier === 0 || !subscription) {
            return {
                action: 'SUBSCRIBE',
                label: t('plans.getStarted', 'Get Started'),
                isCurrent: false,
                color: 'default'
            };
        }

        // Same plan tier -> Renew
        if (targetId === currentId || targetTier === currentTier) {
            return {
                action: 'RENEW',
                label: t('plans.renewPlan', 'Manage / Renew'),
                isCurrent: true,
                color: 'emerald'
            };
        }

        // Higher plan tier -> Upgrade
        if (targetTier > currentTier) {
            return {
                action: 'UPGRADE',
                label: t('plans.upgradeTier', 'Upgrade Tier'),
                isCurrent: false,
                color: 'gold'
            };
        }

        // Lower plan tier -> Downgrade
        return {
            action: 'DOWNGRADE',
            label: t('plans.downgradeTier', 'Downgrade Plan'),
            isCurrent: false,
            color: 'muted'
        };
    }, [subscription, hasActivePlan]);

    const value = useMemo(() => ({
        subscription,
        hasActivePlan,
        loading,
        refreshSubscription: loadSubscription,
        evaluatePlanAction,
    }), [subscription, hasActivePlan, loading, loadSubscription, evaluatePlanAction]);

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        return {
            subscription: null,
            hasActivePlan: false,
            loading: false,
            refreshSubscription: async () => {},
            evaluatePlanAction: () => ({ action: 'SUBSCRIBE', label: 'Choose Plan', isCurrent: false }),
        };
    }
    return context;
}
