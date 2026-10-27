'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

let cachedVisibleTabs = null;
let fetchPromise = null;
const listeners = new Set();

export function normalizeTabName(name) {
  return (name || '').toLowerCase().trim();
}

export function checkPermissionInSet(set, tabName) {
  if (!set || set.size === 0) return false;
  const target = normalizeTabName(tabName);
  
  if (target === 'subscription plans' || target === 'plans' || target === 'pricing') {
    return (
      set.has('subscription plans') ||
      set.has('subscription_plans') ||
      set.has('plans') ||
      set.has('pricing') ||
      set.has('subscription')
    );
  }

  if (
    target === 'ai past trade analyzer' ||
    target === 'past trade analyzer' ||
    target === 'ai trade advisor' ||
    target === 'trade advisor' ||
    target === 'ai trade audit' ||
    target === 'trade audit' ||
    target === 'ai trade analysis' ||
    target === 'trade analysis'
  ) {
    return (
      set.has('ai past trade analyzer') ||
      set.has('past trade analyzer') ||
      set.has('ai trade advisor') ||
      set.has('trade advisor') ||
      set.has('ai trade audit') ||
      set.has('trade audit') ||
      set.has('ai trade analysis')
    );
  }

  if (
    target === 'custom bot builder' ||
    target === 'manual bot builder' ||
    target === 'custom bot' ||
    target === 'manual bot' ||
    target === 'ai trading bot builder'
  ) {
    return (
      set.has('custom bot builder') ||
      set.has('manual bot builder') ||
      set.has('custom bot') ||
      set.has('manual bot') ||
      set.has('ai trading bot builder')
    );
  }

  if (
    target === 'ai bot builder' ||
    target === 'bot builder' ||
    target === 'strategy studio' ||
    target === 'ai strategy studio'
  ) {
    return (
      set.has('ai bot builder') ||
      set.has('bot builder') ||
      set.has('strategy studio') ||
      set.has('ai strategy studio')
    );
  }

  if (
    target === 'browse bots library' ||
    target === 'bot library' ||
    target === 'browse bots' ||
    target === 'bots library'
  ) {
    return (
      set.has('browse bots library') ||
      set.has('bot library') ||
      set.has('browse bots') ||
      set.has('bots library')
    );
  }

  if (target === 'my bots' || target === 'my bot') {
    return set.has('my bots') || set.has('my bot');
  }

  if (
    target === 'associated brokers' ||
    target === 'associated broker' ||
    target === 'broker' ||
    target === 'brokers'
  ) {
    return (
      set.has('associated brokers') ||
      set.has('associated broker') ||
      set.has('broker') ||
      set.has('brokers')
    );
  }

  if (target === 'economic calendar' || target === 'calendar') {
    return set.has('economic calendar') || set.has('calendar');
  }

  if (target === 'forex calculator' || target === 'calculator') {
    return set.has('forex calculator') || set.has('calculator');
  }

  if (target === 'market news' || target === 'news') {
    return set.has('market news') || set.has('news');
  }

  if (target === 'ai chart scanner' || target === 'chart scanner') {
    return set.has('ai chart scanner') || set.has('chart scanner');
  }

  if (target === 'ai market assistant' || target === 'market assistant') {
    return set.has('ai market assistant') || set.has('market assistant');
  }

  if (target === 'backtest' || target === 'backtesting') {
    return set.has('backtest') || set.has('backtesting') || set.has('ai bot builder');
  }

  if (target === 'notifications' || target === 'notification') {
    return set.has('notifications') || set.has('notification');
  }

  return set.has(target);
}

export function getVisibleTabNamesSync() {
  if (cachedVisibleTabs) return cachedVisibleTabs;
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('visible_tab_names');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedVisibleTabs = new Set(parsed.map(normalizeTabName));
          return cachedVisibleTabs;
        }
      }
    } catch { /* ignore */ }
  }
  return null;
}

let realtimeChannel = null;

function initRealtimeSubscription() {
  if (typeof window === 'undefined' || !supabase || realtimeChannel) return;
  try {
    realtimeChannel = supabase
      .channel('realtime:dashboard_tabs_permissions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dashboard_tabs' },
        () => {
          // Realtime push notification from Supabase on Admin toggle
          fetchVisibleTabNames(true);
        }
      )
      .subscribe();
  } catch (err) {
    console.warn('Realtime tab permission subscription error:', err);
  }
}

export async function fetchVisibleTabNames(force = false) {
  if (force) {
    cachedVisibleTabs = null;
    fetchPromise = null;
  }
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      if (supabase) {
        initRealtimeSubscription();

        let rawTabs = null;

        // Directly query dashboard_tabs table for latest is_visible values
        const { data: tableData, error: tableError } = await supabase
          .from('dashboard_tabs')
          .select('*')
          .order('display_order', { ascending: true });

        if (!tableError && Array.isArray(tableData) && tableData.length > 0) {
          rawTabs = tableData;
        } else {
          const { data: rpcData, error: rpcError } = await supabase.rpc('get_visible_dashboard_tabs');
          if (!rpcError && Array.isArray(rpcData)) {
            rawTabs = rpcData;
          }
        }

        if (Array.isArray(rawTabs)) {
          const names = new Set(
            rawTabs
              .filter(t => {
                if (typeof t === 'string') return true;
                if (t?.is_visible === false || t?.is_visible === 0 || t?.is_visible === 'false') return false;
                if (t?.is_active === false || t?.is_active === 0 || t?.is_active === 'false') return false;
                return true;
              })
              .map(t => normalizeTabName(typeof t === 'string' ? t : (t?.name || t?.tab_name || '')))
              .filter(Boolean)
          );
          cachedVisibleTabs = names;
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('visible_tab_names', JSON.stringify([...names]));
            window.dispatchEvent(new CustomEvent('tab_permissions:updated', { detail: names }));
          }
          listeners.forEach(fn => fn(cachedVisibleTabs));
          return cachedVisibleTabs;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch visible tab names:", e);
    } finally {
      fetchPromise = null;
    }
    return cachedVisibleTabs;
  })();

  return fetchPromise;
}

export function useTabPermission(tabName) {
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const update = (set) => {
      if (!isMounted || !set) return;
      setIsAllowed(checkPermissionInSet(set, tabName));
    };

    if (cachedVisibleTabs) {
      setIsAllowed(checkPermissionInSet(cachedVisibleTabs, tabName));
    } else {
      try {
        const stored = sessionStorage.getItem('visible_tab_names');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const set = new Set(parsed.map(normalizeTabName));
            setIsAllowed(checkPermissionInSet(set, tabName));
          }
        }
      } catch { /* ignore */ }
    }

    listeners.add(update);
    fetchVisibleTabNames().then(set => {
      if (set && isMounted) update(set);
    });

    return () => {
      isMounted = false;
      listeners.delete(update);
    };
  }, [tabName]);

  return isAllowed;
}
