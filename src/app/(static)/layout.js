"use client";
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function StaticLayout({ children }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
