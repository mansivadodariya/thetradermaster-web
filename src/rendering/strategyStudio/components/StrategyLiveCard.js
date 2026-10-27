'use client';

import React from 'react';
import styles from '../styles/strategyStudio.module.scss';
import { EditPencilIcon, RocketRunIcon } from './StudioIcons';

const MISSING_LABEL_MAP = {
    pair: 'Pair',
    timeframe: 'Timeframe',
    period: 'Period',
    entry_rules: 'Entry rules',
    direction: 'Direction',
    exit: 'Exit',
};

export default function StrategyLiveCard({
    resp,
    onSwitchToEdit,
    onRunBacktest,
    busy = false,
}) {
    if (!resp) {
        return (
            <div className={styles.copilotCard}>
                <div className={styles.cardTitle}>Connecting to Strategy Copilot…</div>
                <div className={styles.fieldHint}>Initializing metadata and engine sessions…</div>
            </div>
        );
    }

    const summary = resp.strategy_summary || {
        title: 'New strategy',
        market: {},
        entry: { rules: [] },
        exit: { rules: [] },
        risk: {},
    };

    const isReady = resp.stage === 'review';
    const missingKeys = resp.missing || [];
    const allKeys = Object.keys(MISSING_LABEL_MAP);
    const errors = resp.errors || [];
    const payloadJson = resp.engine_payload || resp.strategy || {};

    return (
        <div className={styles.copilotCard}>
            {/* Header: Title and Draft / Ready Badge */}
            <div className={styles.cardHeaderRow}>
                <h2 className={styles.cardTitle}>{summary.title || 'Untitled Strategy'}</h2>
                <span
                    className={`${styles.stageChip} ${
                        isReady ? styles.chipReady : styles.chipDraft
                    }`}
                >
                    {isReady ? 'Ready' : 'Draft'}
                </span>
            </div>

            {/* 6 Completeness Chips */}
            <div className={styles.chipsRow}>
                {allKeys.map((k) => {
                    const isMissing = missingKeys.includes(k);
                    return (
                        <span
                            key={k}
                            className={`${styles.chipItem} ${
                                isMissing ? styles.chipTodo : styles.chipDone
                            }`}
                        >
                            {MISSING_LABEL_MAP[k]}
                        </span>
                    );
                })}
            </div>

            {/* Market Specifications */}
            <div className={styles.sectionSubheader}>Market</div>
            <div className={styles.kvGrid}>
                <div className={styles.kvKey}>Pair</div>
                <div className={styles.kvVal}>{summary.market?.pair || '—'}</div>
                <div className={styles.kvKey}>Timeframe</div>
                <div className={styles.kvVal}>{summary.market?.timeframe || '—'}</div>
                <div className={styles.kvKey}>Period</div>
                <div className={styles.kvVal}>{summary.market?.period || '—'}</div>
                <div className={styles.kvKey}>Direction</div>
                <div className={styles.kvVal}>{summary.market?.direction || '—'}</div>
            </div>

            {/* Entry Rules & Session */}
            <div className={styles.sectionSubheader}>
                Entry · {summary.entry?.logic || 'ALL rules (AND)'}
            </div>
            {summary.entry?.rules && summary.entry.rules.length > 0 ? (
                summary.entry.rules.map((rule, idx) => (
                    <div key={idx} className={styles.rulePill}>
                        {rule}
                    </div>
                ))
            ) : (
                <div className={styles.fieldHint}>No entry rules defined yet</div>
            )}
            <div className={styles.fieldHint}>Session {summary.entry?.session || '00:00 - 23:59 (server time)'}</div>

            {/* Exit Parameters & Optional Rules */}
            <div className={styles.sectionSubheader}>Exit</div>
            <div className={styles.kvGrid}>
                <div className={styles.kvKey}>Take profit</div>
                <div className={styles.kvVal}>{summary.exit?.take_profit || 'off'}</div>
                <div className={styles.kvKey}>Stop loss</div>
                <div className={styles.kvVal}>
                    {summary.exit?.stop_loss || 'off'}
                    {summary.exit?.trailing_stop ? ' (trailing)' : ''}
                </div>
            </div>
            {summary.exit?.rules && summary.exit.rules.length > 0 && (
                <>
                    <div className={styles.fieldHint} style={{ marginTop: '8px' }}>
                        Exit when {summary.exit?.logic || 'ANY rule (OR)'}:
                    </div>
                    {summary.exit.rules.map((rule, idx) => (
                        <div key={idx} className={styles.rulePill}>
                            {rule}
                        </div>
                    ))}
                </>
            )}

            {/* Risk Sizing */}
            <div className={styles.sectionSubheader}>Risk</div>
            <div className={styles.kvGrid}>
                <div className={styles.kvKey}>Lots</div>
                <div className={styles.kvVal}>{summary.risk?.lots ?? 0.01}</div>
                <div className={styles.kvKey}>Initial capital</div>
                <div className={styles.kvVal}>${summary.risk?.initial_capital ?? 10000}</div>
                <div className={styles.kvKey}>Close at day end</div>
                <div className={styles.kvVal}>{summary.risk?.close_at_day_end ? 'Yes' : 'No'}</div>
            </div>

            {/* Validation Errors Box */}
            {errors && errors.length > 0 && (
                <div className={styles.validationErrors}>
                    <strong>Needs fixing:</strong>
                    <ul>
                        {errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Contextual Actions */}
            <div className={styles.cardActions}>
                {isReady ? (
                    <>
                        <button
                            type="button"
                            className={styles.btnGhostAction}
                            onClick={onSwitchToEdit}
                            disabled={busy}
                        >
                            <EditPencilIcon size={14} color="currentColor" />
                            <span>Modify strategy</span>
                        </button>
                        <button
                            type="button"
                            className={styles.btnPrimaryAction}
                            onClick={onRunBacktest}
                            disabled={busy}
                        >
                            {busy ? (
                                <span>Running backtest…</span>
                            ) : (
                                <>
                                    <RocketRunIcon size={14} color="currentColor" />
                                    <span>Run backtest</span>
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className={styles.btnGhostAction}
                        onClick={onSwitchToEdit}
                        disabled={busy}
                        title="Skip the questions and fill the form yourself"
                    >
                        Fill in manually instead
                    </button>
                )}
            </div>

            {/* Collapsible JSON Engine Payload */}
            <details className={styles.jsonAccordion}>
                <summary>JSON (engine payload)</summary>
                <pre>{JSON.stringify(payloadJson, null, 2)}</pre>
            </details>
        </div>
    );
}
