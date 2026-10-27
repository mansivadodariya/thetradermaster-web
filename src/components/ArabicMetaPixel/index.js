'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const META_PIXEL_ID = '1090886467268392';

function MetaPixelInner({ initialIsArabic = false }) {
    const { language } = useLanguage();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isActive, setIsActive] = useState(initialIsArabic);
    const hasFiredRef = useRef(false);

    useEffect(() => {
        const checkIsArabic = () => {
            const currentPath = (typeof window !== 'undefined' ? window.location.pathname : pathname) || '';
            const currentSearch = (typeof window !== 'undefined' ? window.location.search : searchParams?.toString()) || '';
            const pathSegments = currentPath.split('/').filter(Boolean);
            const firstSeg = pathSegments[0]?.toLowerCase();

            const isArLang = language === 'ar' || language === 'ary';
            const isArSegment = firstSeg === 'ar' || firstSeg === 'arabic' || firstSeg === 'ary' || firstSeg === 'darija';
            const isArQuery = currentSearch.includes('lang=ar') || currentSearch.includes('lang=arabic') || currentSearch.includes('locale=ar');
            const isArDom = typeof document !== 'undefined' && (
                document.documentElement.lang === 'ar' || 
                document.documentElement.getAttribute('dir') === 'rtl'
            );

            return Boolean(isArLang || isArSegment || isArQuery || isArDom);
        };

        const active = checkIsArabic();
        if (active) {
            setIsActive(true);
            if (typeof window !== 'undefined' && window.fbq && hasFiredRef.current) {
                window.fbq('track', 'PageView');
            }
            hasFiredRef.current = true;
        }
    }, [language, pathname, searchParams]);

    if (!isActive) {
        return null;
    }

    return (
        <>
            {/* Meta Pixel Code for TraderMaster Arabic Landing Page */}
            <Script
                id="meta-pixel-arabic"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${META_PIXEL_ID}');
                        fbq('track', 'PageView');
                    `,
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    );
}

export default function ArabicMetaPixel({ initialIsArabic = false }) {
    return (
        <Suspense fallback={null}>
            <MetaPixelInner initialIsArabic={initialIsArabic} />
        </Suspense>
    );
}
