'use client';
import React, { useEffect } from 'react';
import styles from './tradeSnap.module.scss';
import { getBidiProps } from '@/lib/bidi';

export default function Modal({ open, onClose, title, description, children, footer, headerActions, size = 'default' }) {
    useEffect(() => {
        if (!open) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        if (typeof window !== 'undefined' && window.lenis) {
            window.lenis.stop();
        }

        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = originalOverflow;
            if (typeof window !== 'undefined' && window.lenis) {
                window.lenis.start();
            }
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" onClick={onClose} data-lenis-prevent="true">
            <div
                className={`${styles.modalBox} ${size === 'large' ? styles.modalLarge : ''}`}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                data-lenis-prevent="true"
            >
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderContent}>
                        {title && <h2 {...getBidiProps(title)}>{title}</h2>}
                        {description && <p {...getBidiProps(description)}>{description}</p>}
                    </div>
                    <div className={styles.modalHeaderRight}>
                        {headerActions}
                        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>
                <div className={styles.modalBody}>{children}</div>
                {footer && <div className={styles.modalFooter}>{footer}</div>}
            </div>
        </div>
    );
}
