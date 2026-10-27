'use client';

import React, { useState, useEffect } from 'react';
import { getTranslation } from '@/locales';

export default function GlobalError({ error, reset }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('app_language');
      if (stored) setLang(stored);
    } catch (_) {}
  }, []);

  return (
    <html lang={lang} dir={lang === 'ar' || lang === 'ary' ? 'rtl' : 'ltr'}>
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#040605',
        color: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', padding: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '99px',
            backgroundColor: 'rgba(24, 201, 139, 0.1)',
            border: '1px solid rgba(24, 201, 139, 0.35)',
            color: '#18C98B',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            marginBottom: '20px',
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#18C98B',
            }} />
            {getTranslation(lang, 'errors.global.tag', 'AUTO-RECONNECTING • LIVE SYNC')}
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 16px 0', color: '#FFFFFF' }}>
            {getTranslation(lang, 'errors.boundary.headingPrefix', 'We Will')}{' '}
            <span style={{ color: '#18C98B' }}>{getTranslation(lang, 'errors.boundary.headingHighlight', 'Connect Soon')}</span>
          </h1>

          <p style={{ color: '#9C9A96', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
            {getTranslation(lang, 'errors.global.desc', 'Establishing a secure connection with the live telemetry engine. Your session and settings are safely preserved.')}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '12px 28px',
                borderRadius: '99px',
                backgroundColor: '#18C98B',
                color: '#000000',
                fontWeight: 'bold',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {getTranslation(lang, 'errors.global.reload', 'RELOAD DESK')}
            </button>
            <a
              href="/"
              style={{
                padding: '12px 28px',
                borderRadius: '99px',
                backgroundColor: '#14100B',
                border: '1px solid rgba(24, 201, 139, 0.35)',
                color: '#18C98B',
                fontWeight: 'bold',
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              {getTranslation(lang, 'errors.global.returnHome', 'RETURN HOME')}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
