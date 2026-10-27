'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './aiAssistant.module.scss';
import HistoryButton from '@/components/historyButton';
import { toast } from '@/components/toast';
import ReportPanel from './ReportPanel';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import TradingViewChartPane, { PAIR_GROUPS, ALL_PAIRS, SYMBOL_DATABASE, normalizeSymbol } from './TradingViewChartPane';
import ImagePreviewModal from './ImagePreviewModal';
import ChatMessageList from './components/ChatMessageList';
import ChatInputBar from './components/ChatInputBar';
import AssistantModals from './components/AssistantModals';
import { useAiAssistantStore } from '@/context/toolState';

const Logo = '/assets/logo/smallLogo.png';

export { PAIR_GROUPS, ALL_PAIRS, SYMBOL_DATABASE, normalizeSymbol };

const AiAssistant = ({ initialTab, initialOpenId, initialPrompt } = {}) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme !== 'light';

    const {
        userId,
        chatHistory,
        selectedChat,
        currentConversationId,
        chatMessages,
        chatInput,
        setChatInput,
        selectedPair,
        setSelectedPair,
        dropdownOpen,
        setDropdownOpen,
        attachDropdownOpen,
        setAttachDropdownOpen,
        attachmentDraft,
        setAttachmentDraft,
        previewAttachment,
        setPreviewAttachment,
        loadingHistory,
        isLoadingChat,
        pendingRequest,
        queuedCount,
        confirmDeleteOpen,
        setConfirmDeleteOpen,
        pendingDeleteItem,
        setPendingDeleteItem,
        historyModalOpen,
        setHistoryModalOpen,
        activeAnalysisMode,
        setActiveAnalysisMode,
        chatWidthPercent,
        setChatWidthPercent,
        exportData,
        setExportData,
        handleCreateNew,
        handleSelectChat,
        handleSendChatMessage,
        handleRetryMessage,
        handleConfirmDelete
    } = useAiAssistantStore();

    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1200);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Refs
    const dropdownRef = useRef(null);
    const attachDropdownRef = useRef(null);
    const chatEndRef = useRef(null);
    const exportRef = useRef(null);
    const gridRef = useRef(null);
    const fileInputRef = useRef(null);
    const chartPaneRef = useRef(null);
    const textareaRef = useRef(null);

    // Quick Action Chip & Mode Tab Handlers
    const handleGenerateFromImageClick = useCallback(() => {
        let draft = null;
        if (chartPaneRef.current) {
            const dataUrl = chartPaneRef.current.getScreenshotDataUrl();
            if (dataUrl) {
                draft = {
                    name: `${normalizeSymbol(selectedPair)}_chart.png`,
                    url: dataUrl,
                    type: 'image/png'
                };
                setAttachmentDraft(draft);
            }
        }
        setActiveAnalysisMode('image');
        setTimeout(() => textareaRef.current?.focus(), 60);
    }, [selectedPair, setAttachmentDraft, setActiveAnalysisMode]);

    const handleDeepAnalysisClick = useCallback(() => {
        setActiveAnalysisMode(prev => prev === 'deep' ? null : 'deep');
        setTimeout(() => textareaRef.current?.focus(), 60);
    }, [setActiveAnalysisMode]);

    const handleMacroNewsClick = useCallback(() => {
        setActiveAnalysisMode(prev => prev === 'news' ? null : 'news');
        setTimeout(() => textareaRef.current?.focus(), 60);
    }, [setActiveAnalysisMode]);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setAttachmentDraft({
                url: event.target.result,
                name: file.name || 'Image Attachment'
            });
            setSelectedPair('No Pair');
        };
        reader.readAsDataURL(file);
        setSelectedPair('No Pair');
        e.target.value = '';
    };

    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        setAttachmentDraft({
                            url: event.target.result,
                            name: file.name || 'Pasted Screenshot.png'
                        });
                        setSelectedPair('No Pair');
                    };
                    reader.readAsDataURL(file);
                    setSelectedPair('No Pair');
                    break;
                }
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAttachmentDraft({
                    url: event.target.result,
                    name: file.name || 'Image Attachment'
                });
                setSelectedPair('No Pair');
            };
            reader.readAsDataURL(file);
            setSelectedPair('No Pair');
        }
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;

        let animationFrameId = null;

        const handleMouseMove = (e) => {
            if (!gridRef.current) return;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(() => {
                if (!gridRef.current) return;
                const rect = gridRef.current.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const totalWidth = rect.width;
                const newPercent = (offsetX / totalWidth) * 100;
                const clamped = Math.max(20, Math.min(60, newPercent));
                setChatWidthPercent(clamped);
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isDragging, setChatWidthPercent]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (attachDropdownRef.current && !attachDropdownRef.current.contains(e.target)) {
                setAttachDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setDropdownOpen, setAttachDropdownOpen]);

    // Scroll handling: scroll container only on new chat messages, and keep at top on empty/initial welcome view
    useEffect(() => {
        const container = chatEndRef.current?.parentElement;
        if (chatMessages && chatMessages.length > 0) {
            if (container && typeof container.scrollTo === 'function') {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            } else if (chatEndRef.current?.scrollIntoView) {
                chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else if (container && typeof container.scrollTo === 'function') {
            container.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [chatMessages, pendingRequest]);

    // Deep-link support
    useEffect(() => {
        if (!initialOpenId || chatHistory.length === 0) return;
        const matchId = (item, index) =>
            String(item?.id || item?.created_at || item?.createdAt || index) === String(initialOpenId);
        const found = chatHistory.find((it, idx) => matchId(it, idx));
        if (found) handleSelectChat(found);
    }, [initialOpenId, chatHistory, handleSelectChat]);

    const initialPromptExecutedRef = useRef(false);

    // Auto-execute initial prompt if navigated with query parameter (e.g. from homepage input)
    useEffect(() => {
        if (!initialPrompt || initialPromptExecutedRef.current) return;
        const promptText = initialPrompt.trim();
        if (!promptText) return;

        initialPromptExecutedRef.current = true;
        setChatInput(promptText);

        // Clean query parameter from URL to avoid repeated execution
        if (typeof window !== 'undefined' && window.history?.replaceState) {
            const url = new URL(window.location.href);
            url.searchParams.delete('prompt');
            url.searchParams.delete('q');
            url.searchParams.delete('message');
            window.history.replaceState({}, '', url.toString());
        }

        const timer = setTimeout(() => {
            handleSendChatMessage(promptText);
        }, 300);

        return () => clearTimeout(timer);
    }, [initialPrompt, setChatInput, handleSendChatMessage]);

    const handleOptionClick = useCallback((optionLabel) => {
        setChatInput(optionLabel);
        setTimeout(() => handleSendChatMessage(optionLabel), 50);
    }, [setChatInput, handleSendChatMessage]);

    const openDeleteConfirm = (e, type, index, item) => {
        e.stopPropagation();
        setPendingDeleteItem({ type, index, item });
        setConfirmDeleteOpen(true);
    };

    const closeDeleteConfirm = () => {
        setPendingDeleteItem(null);
        setConfirmDeleteOpen(false);
    };

    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const handleDownloadFullReport = useCallback((reportContent, visualData, symbol) => {
        if (isExportingPdf || exportData) return;
        setExportData({ fullReport: reportContent, visualData, symbol: symbol || selectedPair });
    }, [isExportingPdf, exportData, setExportData, selectedPair]);

    useEffect(() => {
        if (!exportData) return;

        const generatePdf = async () => {
            setIsExportingPdf(true);
            try {
                toast('Preparing PDF download with market charts & figures...');
                const html2canvas = (await import('html2canvas')).default;
                const { jsPDF } = await import('jspdf');
                await new Promise((resolve) => setTimeout(resolve, 1400));

                const element = exportRef.current;
                if (!element) throw new Error("Export element not found");

                const cleanPair = (exportData.symbol && exportData.symbol !== 'No Pair')
                    ? exportData.symbol.replace(/[^A-Z0-9]/g, '').toUpperCase()
                    : 'MARKET';

                const dateStr = new Date().toISOString().split('T')[0];
                const filename = `ChronosX_Trading_Report_${cleanPair}_${dateStr}.pdf`;

                // ── PDF page dimensions (A4 portrait in mm) ──
                const PDF_W = 210;
                const PDF_H = 297;
                const MARGIN = 8; // mm on each side
                const CONTENT_W = PDF_W - MARGIN * 2;
                const CONTENT_H = PDF_H - MARGIN * 2;

                const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

                // ── Collect atomic sections ──
                const sections = element.querySelectorAll('.pdfSection');

                // If no sections found, fall back to rendering entire container
                const renderTargets = sections.length > 0
                    ? Array.from(sections)
                    : [element];

                let cursorY = MARGIN; // mm from top on current page
                let isFirstPage = true;

                // Force light-theme styles onto the export container
                const forceLightOnElement = (el) => {
                    el.style.backgroundColor = '#FFFFFF';
                    el.style.color = '#0F172A';
                };
                forceLightOnElement(element);

                for (let i = 0; i < renderTargets.length; i++) {
                    const section = renderTargets[i];

                    // Skip hidden or empty sections
                    if (section.offsetHeight === 0) continue;

                    // Render this single section to a canvas
                    const canvas = await html2canvas(section, {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#FFFFFF',
                        scrollX: 0,
                        scrollY: 0,
                        windowWidth: 800,
                        width: 800,
                        logging: false,
                        onclone: (clonedDoc, clonedEl) => {
                            if (!clonedDoc) return;

                            if (clonedDoc.documentElement) {
                                clonedDoc.documentElement.classList.add('light');
                                clonedDoc.documentElement.classList.remove('dark', 'isDark');
                                clonedDoc.documentElement.setAttribute('data-theme', 'light');
                                clonedDoc.documentElement.style.backgroundColor = '#FFFFFF';
                                clonedDoc.documentElement.style.color = '#0F172A';
                            }
                            if (clonedDoc.body) {
                                clonedDoc.body.classList.add('light', 'pdfExportLight');
                                clonedDoc.body.classList.remove('dark', 'isDark');
                                clonedDoc.body.style.backgroundColor = '#FFFFFF';
                                clonedDoc.body.style.color = '#0F172A';
                            }

                            const target = clonedEl || clonedDoc.body;
                            if (target && target.classList) {
                                target.classList.add('pdfExportLight', 'pdfExporting');
                            }

                            // Force high-contrast text on chart elements
                            clonedDoc.querySelectorAll('.apexcharts-text, [class*="apexcharts-text"]').forEach((textEl) => {
                                textEl.style.fill = '#334155';
                            });
                            clonedDoc.querySelectorAll('.apexcharts-gridline, [class*="apexcharts-gridline"]').forEach((gridEl) => {
                                gridEl.style.stroke = '#E2E8F0';
                            });

                            // Force light bg on widget cards inside this section
                            clonedDoc.querySelectorAll('.inlineWidgetCard, .reportWidget, .reportRadar, .reportGauge').forEach((el) => {
                                el.style.backgroundColor = '#F8FAFC';
                                el.style.border = '1px solid #E2E8F0';
                            });
                        }
                    });

                    // Convert canvas → image dimensions in mm
                    const imgW = CONTENT_W;
                    const imgH = (canvas.height * CONTENT_W) / canvas.width;
                    const imgData = canvas.toDataURL('image/jpeg', 0.95);

                    // If section is taller than a full page, render it across multiple pages by slicing
                    if (imgH > CONTENT_H) {
                        // Start tall section on a new page for cleanliness
                        if (cursorY > MARGIN) {
                            pdf.addPage();
                            cursorY = MARGIN;
                        }

                        // Slice the tall canvas across pages
                        const totalCanvasPx = canvas.height;
                        const pxPerMM = canvas.height / imgH;
                        const sliceHeightMM = CONTENT_H;
                        const sliceHeightPx = sliceHeightMM * pxPerMM;

                        let srcY = 0;
                        while (srcY < totalCanvasPx) {
                            const thisSlicePx = Math.min(sliceHeightPx, totalCanvasPx - srcY);
                            const thisSliceMM = thisSlicePx / pxPerMM;

                            // Create a sub-canvas for this slice
                            const sliceCanvas = document.createElement('canvas');
                            sliceCanvas.width = canvas.width;
                            sliceCanvas.height = thisSlicePx;
                            const ctx = sliceCanvas.getContext('2d');
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
                            ctx.drawImage(canvas, 0, srcY, canvas.width, thisSlicePx, 0, 0, canvas.width, thisSlicePx);

                            const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95);
                            pdf.addImage(sliceData, 'JPEG', MARGIN, MARGIN, imgW, thisSliceMM);

                            srcY += thisSlicePx;
                            if (srcY < totalCanvasPx) {
                                pdf.addPage();
                            }
                        }

                        cursorY = MARGIN + (((totalCanvasPx % sliceHeightPx) || sliceHeightPx) / pxPerMM);
                        continue;
                    }

                    // If this section won't fit on the current page, start a new page
                    if (cursorY + imgH > PDF_H - MARGIN) {
                        pdf.addPage();
                        cursorY = MARGIN;
                    }

                    // If not the first item on the first page and we're at page start, no extra page needed
                    if (!isFirstPage && i > 0 && cursorY === MARGIN) {
                        // Already on a fresh page
                    }

                    pdf.addImage(imgData, 'JPEG', MARGIN, cursorY, imgW, imgH);
                    cursorY += imgH + 2; // 2mm gap between sections
                    isFirstPage = false;
                }

                pdf.save(filename);
                toast.success('Report downloaded successfully!');
            } catch (err) {
                console.error('PDF download error:', err);
                if (exportData.fullReport) {
                    const blob = new Blob([exportData.fullReport], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'market-analysis-report.md';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            } finally {
                setExportData(null);
                setIsExportingPdf(false);
            }
        };

        generatePdf();
    }, [exportData, setExportData]);

    const getQuestionText = (item) => item.title || item.name || item.first_question || item.question || item.message || item.input_data || 'Untitled Conversation';

    return (
        <div className={`${styles.aiAssistant} ${isDark ? styles.isDark : styles.isLight}`}>
            <div
                ref={gridRef}
                className={`${styles.splitLayoutGrid} ${isDragging ? styles.isDraggingGrid : ''}`}
                style={!isMobile && (typeof window === 'undefined' || window.innerWidth > 1200) ? {
                    gridTemplateColumns: `minmax(380px, ${chatWidthPercent}%) 10px minmax(360px, 1fr)`,
                    transition: isDragging ? 'none' : 'grid-template-columns 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                } : undefined}
            >
                {/* Center / Left Panel: Chatbot conversation view */}
                <div className={styles.chatSingleBody}>
                    <div className={styles.chatCard}>
                        <div className={`${styles.chatHeader} ${chatWidthPercent <= 42 ? styles.compactHeader : ''}`}>
                            <div className={styles.headerInfo}>
                                <h3>{t('aiAssistant.copilotTitle', 'ChronosX Copilot')}</h3>
                                <span>{t('aiAssistant.activePair', 'Active Pair')}: {selectedPair}</span>
                            </div>
                            <div className={styles.headerAction}>
                                <button
                                    type="button"
                                    className={styles.createNewBtn}
                                    onClick={handleCreateNew}
                                    title={t('aiAssistant.createNewChat', 'Create New Chat')}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
                                    </svg>
                                    <span>{t('aiAssistant.createNewChat', 'Create New Chat')}</span>
                                </button>
                                <HistoryButton
                                    text={t('aiAssistant.history', 'History')}
                                    onClick={() => setHistoryModalOpen(true)}
                                    className={styles.historyHeaderBtn}
                                />
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <ChatMessageList
                            chatMessages={chatMessages}
                            isLoadingChat={isLoadingChat}
                            pendingRequest={pendingRequest}
                            queuedCount={queuedCount}
                            selectedPair={selectedPair}
                            chatEndRef={chatEndRef}
                            t={t}
                            handleDeepAnalysisClick={handleDeepAnalysisClick}
                            handleGenerateFromImageClick={handleGenerateFromImageClick}
                            handleMacroNewsClick={handleMacroNewsClick}
                            setPreviewAttachment={setPreviewAttachment}
                            handleDownloadFullReport={handleDownloadFullReport}
                            handleOptionClick={handleOptionClick}
                            handleRetryMessage={handleRetryMessage}
                        />
                    </div>

                    {/* Chat input box */}
                    <ChatInputBar
                        textareaRef={textareaRef}
                        chatInput={chatInput}
                        setChatInput={setChatInput}
                        handleSendChatMessage={() => handleSendChatMessage()}
                        handlePaste={handlePaste}
                        handleDrop={handleDrop}
                        pendingRequest={pendingRequest}
                        queuedCount={queuedCount}
                        activeAnalysisMode={activeAnalysisMode}
                        setActiveAnalysisMode={setActiveAnalysisMode}
                        selectedPair={selectedPair}
                        setSelectedPair={setSelectedPair}
                        attachmentDraft={attachmentDraft}
                        setAttachmentDraft={setAttachmentDraft}
                        setPreviewAttachment={setPreviewAttachment}
                        fileInputRef={fileInputRef}
                        handleFileSelect={handleFileSelect}
                        attachDropdownRef={attachDropdownRef}
                        attachDropdownOpen={attachDropdownOpen}
                        setAttachDropdownOpen={setAttachDropdownOpen}
                        dropdownRef={dropdownRef}
                        dropdownOpen={dropdownOpen}
                        setDropdownOpen={setDropdownOpen}
                        handleGenerateFromImageClick={handleGenerateFromImageClick}
                        handleDeepAnalysisClick={handleDeepAnalysisClick}
                        handleMacroNewsClick={handleMacroNewsClick}
                        isDark={isDark}
                        t={t}
                    />
                </div>

                {/* Resizable Splitter Line Handle */}
                <div
                    className={`${styles.resizerSplitter} ${isDragging ? styles.resizerActive : ''}`}
                    onMouseDown={handleMouseDown}
                    title="Drag to resize panels"
                >
                    <div className={styles.resizerLine} />
                </div>

                {/* Right Panel: TradingView Chart Pane */}
                <div className={styles.chartSingleBody}>
                    <TradingViewChartPane
                        ref={chartPaneRef}
                        symbol={selectedPair}
                        onSymbolChange={(newSymbol) => {
                            if (!newSymbol || newSymbol === 'No Pair' || newSymbol === 'NO_PAIR' || String(newSymbol).toUpperCase().includes('NO PAIR')) {
                                setSelectedPair('XAU/USD');
                                return;
                            }
                            const match = ALL_PAIRS.find(p => p.replace(/[^A-Z0-9]/g, '') === newSymbol.toUpperCase());
                            setSelectedPair(match || newSymbol);
                        }}
                        onAttachScreenshot={(attachment) => {
                            setAttachmentDraft(attachment);
                        }}
                    />
                </div>
            </div>

            {/* Modals */}
            <AssistantModals
                confirmDeleteOpen={confirmDeleteOpen}
                closeDeleteConfirm={closeDeleteConfirm}
                handleConfirmDelete={handleConfirmDelete}
                pendingDeleteItem={pendingDeleteItem}
                historyModalOpen={historyModalOpen}
                setHistoryModalOpen={setHistoryModalOpen}
                loadingHistory={loadingHistory}
                chatHistory={chatHistory}
                selectedChat={selectedChat}
                currentConversationId={currentConversationId}
                handleSelectChat={handleSelectChat}
                openDeleteConfirm={openDeleteConfirm}
                getQuestionText={getQuestionText}
                t={t}
            />

            {exportData && (
                <div
                    style={{
                        position: 'fixed',
                        left: '0px',
                        top: '0px',
                        width: '800px',
                        background: '#FFFFFF',
                        backgroundColor: '#FFFFFF',
                        zIndex: -99999,
                        opacity: 1,
                        pointerEvents: 'none',
                        overflow: 'visible'
                    }}
                >
                    <div ref={exportRef} className={`${styles.pdfExporting} ${styles.isLight} pdfExporting`}>
                        <ReportPanel
                            inline
                            fullReport={exportData.fullReport}
                            visualData={exportData.visualData}
                            symbol={exportData.symbol}
                            isLoading={false}
                            forceLight={true}
                        />
                    </div>
                </div>
            )}

            <ImagePreviewModal
                attachment={previewAttachment}
                onClose={() => setPreviewAttachment(null)}
            />
        </div>
    );
};

export default AiAssistant;
