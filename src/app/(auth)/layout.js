"use client";
import React, { useEffect } from 'react';
import { captureUtmParameters } from '@/lib/utm';

export default function Layout({ children }) {
    useEffect(() => {
        captureUtmParameters();
    }, []);

    return (
        <div className='auth-layout'>
            {children}
        </div>
    );
}