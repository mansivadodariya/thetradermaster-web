'use client';

import React from 'react';

import Modal from '@/rendering/tradeSnap/Modal';
import Loader from '@/components/loader';
import RemoveIcon from '@/icons/removeIcon';
import { getBidiProps } from '@/lib/bidi';
import styles from '../aiAssistant.module.scss';

export default function AssistantModals({
    confirmDeleteOpen,
    closeDeleteConfirm,
    handleConfirmDelete,
    pendingDeleteItem,
    historyModalOpen,
    setHistoryModalOpen,
    loadingHistory,
    chatHistory,
    selectedChat,
    currentConversationId,
    handleSelectChat,
    openDeleteConfirm,
    getQuestionText,
    t
}) {

    return (
        <>
            <Modal
                open={confirmDeleteOpen}
                onClose={closeDeleteConfirm}
                title={t('aiAssistant.deleteConfirmTitle', 'Delete history item?')}
                description={t('aiAssistant.deleteConfirmDesc', 'This action cannot be undone.')}
                footer={
                    <>
                        <button type="button" className={styles.modalCancelBtn} onClick={closeDeleteConfirm}>
                            {t('aiAssistant.cancel', 'Cancel')}
                        </button>
                        <button type="button" className={styles.modalDeleteBtn} onClick={handleConfirmDelete}>
                            {t('aiAssistant.delete', 'Delete')}
                        </button>
                    </>
                }
            >
                <p className={styles.modalText}>
                    {t('aiAssistant.deleteConfirmBody', 'Are you sure you want to delete this history item?')}
                </p>
            </Modal>

            <Modal
                open={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                title={t('aiChat.history', 'Chat History')}
            >
                <div className={styles.historyModalContent}>
                    <div className={styles.allMessage}>
                        {loadingHistory ? (
                            <Loader centered />
                        ) : chatHistory.length === 0 ? (
                            <div className={styles.noHistory}>{t('aiAssistant.noHistoryFound', 'No past questions found')}</div>
                        ) : (
                            chatHistory.map((item, index) => {
                                const sessionId = item?.session_id || item?.sessionId || item?.conversation_id || item?.id || item?.history_id || item?._id;
                                const isSelected = selectedChat === item || (currentConversationId && sessionId && String(currentConversationId) === String(sessionId));
                                return (
                                    <div
                                        className={`${styles.messageBox} ${isSelected ? styles.selectedBox : ''}`}
                                        key={sessionId || index}
                                        onClick={() => handleSelectChat(item)}
                                        data-session-id={sessionId || undefined}
                                    >
                                        <p {...getBidiProps(getQuestionText(item), styles.truncate)}>
                                            {getQuestionText(item)}
                                        </p>
                                        <div
                                            className={styles.icon}
                                            onClick={(e) => openDeleteConfirm(e, 'chat', index, item)}
                                        >
                                            <RemoveIcon />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}
