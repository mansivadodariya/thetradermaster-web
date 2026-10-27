'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext({
    theme: 'dark',
    toggleTheme: () => { },
    setTheme: () => { },
});

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setThemeState(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (newTheme) => {
        const root = document.documentElement;
        if (newTheme === 'light') {
            root.classList.remove('dark');
            root.classList.add('light');
            root.setAttribute('data-theme', 'light');
        } else {
            root.classList.remove('light');
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        }
        localStorage.setItem('theme', newTheme);
    };

    /**
     * Executes circular reveal transition originating from the button center
     */
    const executeThemeTransition = (nextTheme, event) => {
        if (typeof window === 'undefined') {
            setThemeState(nextTheme);
            applyTheme(nextTheme);
            return;
        }

        // Calculate origin coordinate (center of clicked button or event coordinate)
        let x = Math.round(window.innerWidth - 80);
        let y = 35;

        if (event) {
            try {
                const targetEl = event.currentTarget || (event.target && typeof event.target.closest === 'function' ? event.target.closest('button') : null) || event.target;
                if (targetEl && typeof targetEl.getBoundingClientRect === 'function') {
                    const rect = targetEl.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        x = Math.round(rect.left + rect.width / 2);
                        y = Math.round(rect.top + rect.height / 2);
                    }
                } else if (typeof event.clientX === 'number' && event.clientX > 0) {
                    x = Math.round(event.clientX);
                    y = Math.round(event.clientY);
                }
            } catch (_) { }
        }

        if (!Number.isFinite(x) || x <= 0) x = Math.round(window.innerWidth - 80);
        if (!Number.isFinite(y) || y <= 0) y = 35;

        const maxRadius = Math.ceil(
            Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            )
        );

        // Set origin coordinates and radius for CSS keyframes
        document.documentElement.style.setProperty('--theme-x', `${x}px`);
        document.documentElement.style.setProperty('--theme-y', `${y}px`);
        document.documentElement.style.setProperty('--theme-r', `${maxRadius}px`);

        const isViewTransitionSupported =
            typeof document !== 'undefined' &&
            typeof document.startViewTransition === 'function' &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Native View Transition API (handled on GPU via CSS @keyframes theme-circle-reveal)
        if (isViewTransitionSupported) {
            try {
                document.startViewTransition(() => {
                    flushSync(() => {
                        setThemeState(nextTheme);
                        applyTheme(nextTheme);
                    });
                });
                return;
            } catch (_) {
                // Fallback to direct apply if transition throws
            }
        }

        // Direct apply fallback for older browsers or reduced-motion
        document.documentElement.classList.add('theme-transitioning');
        setThemeState(nextTheme);
        applyTheme(nextTheme);
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 400);
    };

    const setTheme = (newTheme, event) => {
        if (newTheme === theme) return;
        executeThemeTransition(newTheme, event);
    };

    const toggleTheme = (event) => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        executeThemeTransition(nextTheme, event);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
