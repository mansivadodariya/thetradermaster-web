'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from '../myBots.module.scss';

export default function DeleteBotModal({ isOpen, bot, onClose, onConfirm, isDeleting }) {
    const { t } = useLanguage();

    if (!isOpen || !bot) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.deleteModalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.deleteIconBox}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                </div>

                <h3 className={styles.deleteModalTitle}>{t('myBots.deleteModalTitle', 'Delete Strategy?')}</h3>

                <p className={styles.deleteModalDesc}>
                    {t('myBots.deleteModalDesc', 'Are you sure you want to permanently delete this strategy bot?')}
                    <br />
                    <span className={styles.deleteStrategyTag}>
                        {bot.name || 'Unnamed Strategy'}
                    </span>
                </p>

                <div className={styles.deleteModalActions}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        {t('myBots.cancel', 'Cancel')}
                    </button>
                    <button
                        type="button"
                        className={styles.confirmDeleteBtn}
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? t('myBots.deleting', 'Deleting...') : t('myBots.confirmDelete', 'Delete Strategy')}
                    </button>
                </div>
            </div>
        </div>
    );
}
