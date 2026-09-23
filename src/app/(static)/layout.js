"use client";
import Footer from '@/components/footer'
import Header from '@/components/header'
import React, { useEffect } from 'react'
import { captureUtmParameters } from '@/lib/utm';

export default function Layout({ children }) {
    useEffect(() => {
        captureUtmParameters();
        document.documentElement.classList.add('dark');
    }, []);

    return (
        <div style={{ backgroundColor: '#050d09', minHeight: '100vh', color: '#FFFFFF' }}>
            <Header />
            {children}
            <Footer />
        </div>
    )
}
