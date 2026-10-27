"use client";
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import styles from './whatsappButton.module.scss';
import { usePathname } from 'next/navigation';
import { useContactInfo } from '@/services/contactInfoService';

const SUPPORTED_LOCALES = ['en', 'ar', 'ary', 'es', 'ru', 'zh', 'vi', 'id', 'fil', 'arabic', 'spanish', 'russian', 'chinese', 'vietnamese', 'indonesian', 'filipino', 'darija'];

function stripLocalePrefix(path) {
    if (!path) return '/';
    const clean = path.split('?')[0].replace(/\/$/, '') || '/';
    const parts = clean.split('/').filter(Boolean);
    if (parts.length > 0 && SUPPORTED_LOCALES.includes(parts[0].toLowerCase())) {
        const withoutLocale = '/' + parts.slice(1).join('/');
        return withoutLocale === '' ? '/' : withoutLocale;
    }
    return clean;
}

export default function WhatsappButton() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const { contactInfo } = useContactInfo();

    const publicLandingPages = [
        '/',
        '/',
        '/capabilities',
        '/economic-calendar',
        '/forex-calculator',
        '/market-news',
        '/blogs',
        '/about-us',
        '/contact-us',
        '/terms-and-conditions',
        '/privacy-policy',
        '/risk-disclosure',
        '/plans',
        '/white-label',
        '/affiliate-program',
        '/ai-chart-scanner',
        '/ai-market-assistant',
        '/ai-strategy-core',
        '/ai-strategy-hub',
        '/ai-trade-advisor',
        '/ai-trade-audit',
        '/ai-trading-signal',
        '/backtesting',
        '/custom-bot-builder',
        '/live-market-scanner',
        '/no-refund-policy',
        '/supported-brokers'
    ];

    const cleanPath = stripLocalePrefix(pathname);

    const isPublicPage = Boolean(
        cleanPath && (
            publicLandingPages.includes(cleanPath) ||
            publicLandingPages.some(page => page !== '/' && cleanPath.startsWith(page))
        )
    );

    // If not a public landing page (i.e. user dashboard, tools, auth, onboarding), hide it completely
    if (!isPublicPage) {
        return null;
    }

    // Dynamic WhatsApp number from Supabase social_links (fallback to phone or default)
    const rawNumber = contactInfo?.whatsapp?.value || contactInfo?.phone?.value || '+971 56 884 0900';
    const whatsappUrl = (() => {
        const trimmed = (rawNumber || '').trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
        }
        const digits = trimmed.replace(/[^\d]/g, '');
        return `https://wa.me/${digits || '971568840900'}`;
    })();

    return (
        <motion.div
            className={styles.whatsappWrapper}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
        >
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
                aria-label={t('components.whatsapp.chatOnWhatsapp', 'Chat on WhatsApp')}
            >
                <div className={styles.tooltip}>Chat with us</div>
                <div className={styles.pulseRing}></div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className={styles.whatsappIcon}
                >
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
            </a>
        </motion.div>
    );
}
