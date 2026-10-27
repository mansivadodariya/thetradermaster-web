'use client';

import React, { useRef } from 'react';
import styles from '../styles/strategyStudio.module.scss';
import CustomSelect from './CustomSelect';
import { STRATEGY_PRESETS, validateStrategyInput } from '../utils/backtestEngine';
import {
    SparklesMagicIcon,
    CopyClipboardIcon,
    UploadFileIcon,
    RefreshResetIcon,
    RocketRunIcon,
    ShieldCheckIcon
} from './StudioIcons';

const PRESET_OPTIONS = [
    { value: '', label: 'Select Strategy Preset...' },
    { value: 'donchian', label: 'Donchian Breakout (XAUUSD 15m)' },
    { value: 'bollinger', label: 'Bollinger Bands Breakout (GBPUSD 15m)' },
    { value: 'ema', label: 'EMA Fast/Slow Crossover (EURUSD 30m)' },
    { value: 'rsi', label: 'RSI Oversold Reversal (USDJPY 15m)' },
    { value: 'macd', label: 'MACD Signal Crossover (EURUSD 60m)' }
];

export default function ManualJsonView({
    jsonInput,
    setJsonInput,
    onSyncToolbar,
    onRunBacktest,
    onToast
}) {
    const fileInputRef = useRef(null);
    const validation = validateStrategyInput(jsonInput);

    const handlePresetChange = (val) => {
        if (val && STRATEGY_PRESETS[val]) {
            setJsonInput(JSON.stringify(STRATEGY_PRESETS[val], null, 2));
            if (onToast) onToast(`Preset loaded: ${val}`);
        }
    };

    const handlePrettify = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            setJsonInput(JSON.stringify(parsed, null, 2));
            if (onToast) onToast('JSON formatted successfully');
        } catch (err) {
            if (onToast) onToast(`Invalid JSON: ${err.message}`);
        }
    };

    const handlePaste = async () => {
        try {
            const clip = await navigator.clipboard.readText();
            if (clip) {
                setJsonInput(clip);
                if (onToast) onToast('Pasted from clipboard');
            }
        } catch (err) {
            if (onToast) onToast('Clipboard access error');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setJsonInput(event.target.result);
                if (onToast) onToast(`Loaded file: ${file.name}`);
            };
            reader.readAsText(file);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const nextValue = jsonInput.substring(0, start) + '  ' + jsonInput.substring(end);
            setJsonInput(nextValue);
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + 2;
            }, 0);
        }
    };

    return (
        <div className={styles.manualStudioView}>
            <div className={styles.manualToolbar}>
                <CustomSelect
                    value=""
                    onChange={handlePresetChange}
                    options={PRESET_OPTIONS}
                    placeholder="Select Strategy Preset..."
                    width="230px"
                />

                <div className={styles.jsonActionsRow}>
                    <button type="button" className={styles.btnGhost} onClick={handlePrettify} title="Prettify JSON">
                        <SparklesMagicIcon size={13} />
                        <span>Prettify</span>
                    </button>
                    <button type="button" className={styles.btnGhost} onClick={handlePaste} title="Paste from clipboard">
                        <CopyClipboardIcon size={13} />
                        <span>Paste</span>
                    </button>
                    <button
                        type="button"
                        className={styles.btnGhost}
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload JSON file"
                    >
                        <UploadFileIcon size={13} />
                        <span>Upload</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className={styles.hiddenFileInput}
                        onChange={handleFileUpload}
                    />
                    <button
                        type="button"
                        className={`${styles.btnGhost} ${styles.btnClearJson}`}
                        onClick={() => setJsonInput('')}
                    >
                        Clear
                    </button>
                </div>
            </div>

            <textarea
                className={styles.jsonEditorTextarea}
                spellCheck={false}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste or write your custom strategy specification JSON..."
            />

            <div
                className={`${styles.validationBox} ${
                    !jsonInput.trim()
                        ? styles.idle
                        : validation.valid
                        ? styles.valid
                        : styles.invalid
                }`}
            >
                <ShieldCheckIcon size={14} />
                <span>
                    {!jsonInput.trim()
                        ? 'Paste a Strategy JSON or select a preset template above.'
                        : validation.valid
                        ? validation.summary
                        : validation.message}
                </span>
            </div>

            <div className={styles.jsonFooterRow}>
                <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={onSyncToolbar}
                    disabled={!validation.valid}
                >
                    <RefreshResetIcon size={13} />
                    <span>Sync to Toolbar</span>
                </button>
                <button
                    type="button"
                    className={styles.btnNeonRunBacktest}
                    onClick={() => onRunBacktest(validation.strategy)}
                    disabled={!validation.valid}
                >
                    <RocketRunIcon size={14} />
                    <span>Run This Strategy</span>
                </button>
            </div>
        </div>
    );
}
