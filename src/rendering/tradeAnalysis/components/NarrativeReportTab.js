'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from '@/components/toast';
import { useLanguage } from '@/context/LanguageContext';
import { TranslateResponseButton } from '@/components/translateButton';
import styles from '../tradeAnalysis.module.scss';
import { SparklesIcon, CopyIcon } from '@/icons/tradeAnalysisIcons';

export default function NarrativeReportTab({
    dynamicReportMarkdown
}) {
    const { t } = useLanguage();
    const [translation, setTranslation] = useState({ text: '', lang: null, isTranslated: false });

    const activeMarkdown = translation.isTranslated && translation.text
        ? translation.text
        : dynamicReportMarkdown;
    const isRTL = translation.isTranslated && (translation.lang === 'ar' || translation.lang === 'ary');

    return (
        <div className={styles.dataTableCard}>
            <div className={styles.tableSectionHeader}>
                <h3>
                    <SparklesIcon />
                    <span>{t('tradeAnalysis.narrativeReportTitle', 'AI Narrative Analysis Report')}</span>
                </h3>
                <div className={styles.actionButtons}>
                    <TranslateResponseButton
                        originalText={dynamicReportMarkdown}
                        isTranslated={translation.isTranslated}
                        activeLang={translation.lang}
                        onTranslated={(translatedText, langCode, isTranslated) => {
                            setTranslation({ text: translatedText, lang: langCode, isTranslated });
                        }}
                    />
                    <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={() => {
                            navigator.clipboard.writeText(activeMarkdown);
                            toast.success(t('tradeAnalysis.copiedToClipboard', 'Report copied to clipboard!'));
                        }}
                    >
                        <CopyIcon />
                        <span>{t('tradeAnalysis.copyReport', 'Copy Report')}</span>
                    </button>
                </div>
            </div>

            <div className={styles.markdownReportWrapper} dir={isRTL ? 'rtl' : undefined} style={isRTL ? { textAlign: 'right' } : undefined}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h3: ({ node, ...props }) => <h3 className={styles.reportH3} {...props} />,
                        h4: ({ node, ...props }) => <h4 className={styles.reportH4} {...props} />,
                        p: ({ node, children, ...props }) => {
                            const text = String(children);
                            if (text.startsWith('Key takeaway:') || text.startsWith('**Key takeaway:**')) {
                                return (
                                    <div className={styles.reportTakeawayBox}>
                                        <strong>{t('tradeAnalysis.executiveTakeaway', 'Executive Key Takeaway')}</strong>
                                        <p>{text.replace(/\*\*Key takeaway:\*\*/i, '').replace(/Key takeaway:/i, '').trim()}</p>
                                    </div>
                                );
                            }
                            return <p className={styles.reportP} {...props}>{children}</p>;
                        },
                        strong: ({ node, ...props }) => <strong className={styles.reportStrong} {...props} />,
                        table: ({ node, ...props }) => (
                            <div className={styles.tableWrapper}>
                                <table className={styles.reportTable} {...props} />
                            </div>
                        ),
                        th: ({ node, ...props }) => <th className={styles.reportTh} {...props} />,
                        td: ({ node, ...props }) => <td className={styles.reportTd} {...props} />,
                        ul: ({ node, ...props }) => <ul className={styles.reportUl} {...props} />,
                        li: ({ node, ...props }) => <li className={styles.reportLi} {...props} />,
                    }}
                >
                    {dynamicReportMarkdown}
                </ReactMarkdown>
            </div>
        </div>
    );
}
