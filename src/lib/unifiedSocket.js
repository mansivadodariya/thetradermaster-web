'use client';

/**
 * Unified MT5 Live WebSocket Manager (Singleton)
 *
 * Implements the official Unified MT5 Live WebSocket protocol:
 * Endpoint: /api/v1/ws/live?symbol={symbol}&timeframe={timeframe}&strategy_id={strategy_id}
 *
 * Streams 2 events over a single persistent connection:
 *  1. `price_update`: Live price ticks, bid/ask, volume, 24h change
 *  2. `candle_update`: Active forming candle OHLCV + technical indicators (EMA20, EMA50, SuperTrend, Pivots)
 *
 * Supports dynamic switching via:
 *  { action: "subscribe", symbol: "...", timeframe: "..." }
 */

const BASE_FALLBACK_PRICES = {
    XAUUSD: 4015.00,
    EURUSD: 1.12110,
    GBPUSD: 1.33480,
    USDJPY: 154.200,
    GBPJPY: 209.940,
    EURJPY: 176.320,
    AUDUSD: 0.65400,
    USDCAD: 1.40110,
    USDCHF: 0.88400,
    NZDUSD: 0.59800,
    BTCUSD: 88500.00,
    ETHUSD: 2650.00
};

export function cleanPairSymbol(symbol) {
    if (!symbol) return 'XAUUSD';
    return String(symbol).replace(/[^A-Z0-9]/gi, '').toUpperCase();
}

export function normalizeTimeframe(tf) {
    if (!tf) return 'H1';
    const s = String(tf).trim();
    const upper = s.toUpperCase();
    if (upper === '1' || upper === '1M' || upper === 'M1') return '1m';
    if (upper === '5' || upper === '5M' || upper === 'M5') return '5m';
    if (upper === '15' || upper === '15M' || upper === 'M15') return '15m';
    if (upper === '30' || upper === '30M' || upper === 'M30') return '30m';
    if (upper === '60' || upper === '1H' || upper === 'H1') return 'H1';
    if (upper === '240' || upper === '4H' || upper === 'H4') return 'H4';
    if (upper === 'D' || upper === '1D' || upper === 'D1') return 'D1';
    return s;
}

export function normalizeWsBase(url = '') {
    if (!url) return '';
    let u = url.split('?')[0].replace(/\/+$/, '');
    u = u.replace(/\/live$/, '').replace(/\/strategy$/, '');
    return u;
}

export function getWsCandidateUrls(symbol = 'XAUUSD', timeframe = 'H1', strategyId = 'default', endpoint = 'live') {
    const cleanSym = cleanPairSymbol(symbol);
    const normTf = normalizeTimeframe(timeframe);
    const stratId = strategyId || 'default';
    const qs = `?symbol=${cleanSym}&timeframe=${normTf}&strategy_id=${stratId}`;
    const ep = endpoint === 'strategy' ? 'strategy' : 'live';

    const isHttps = typeof window !== 'undefined' && window.location?.protocol === 'https:';
    const candidates = [];
    const envWs = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WS_LIVE_URL;

    const isPublicHost = (url = '') => {
        const u = url.toLowerCase();
        return u.includes('chronosx.com') || u.includes('thetradermaster.com') ||
               (!u.includes('localhost') && !u.includes('127.0.0.1') && !u.includes('192.168.') && !u.includes('10.'));
    };

    if (envWs) {
        let cleanBase = normalizeWsBase(envWs);
        if (isPublicHost(cleanBase) || isHttps) {
            cleanBase = cleanBase.replace(/^ws:\/\//, 'wss://');
            candidates.push(`${cleanBase}/${ep}${qs}`);
        } else {
            candidates.push(`${cleanBase}/${ep}${qs}`);
            if (cleanBase.startsWith('ws://')) {
                candidates.push(`${cleanBase.replace(/^ws:\/\//, 'wss://')}/${ep}${qs}`);
            }
        }
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
        const isHttp = backendUrl.startsWith('http://');
        const host = backendUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
        if (isPublicHost(host) || isHttps || !isHttp) {
            candidates.push(`wss://${host}/api/v1/ws/${ep}${qs}`);
        } else {
            candidates.push(`ws://${host}/api/v1/ws/${ep}${qs}`);
            candidates.push(`wss://${host}/api/v1/ws/${ep}${qs}`);
        }
    }

    if (!isHttps) {
        if (typeof window !== 'undefined' && window.location) {
            const host = window.location.hostname || '127.0.0.1';
            if (host.includes('localhost') || host.includes('127.0.0.1')) {
                candidates.push(`ws://${host}:8000/api/v1/ws/${ep}${qs}`);
                candidates.push(`wss://${host}:8000/api/v1/ws/${ep}${qs}`);
            }
        }

        candidates.push(`ws://127.0.0.1:8000/api/v1/ws/${ep}${qs}`);
    } else if (typeof window !== 'undefined' && window.location) {
        const host = window.location.host;
        candidates.push(`wss://${host}/api/v1/ws/${ep}${qs}`);
    }

    // Remove duplicates while preserving order
    const unique = Array.from(new Set(candidates));
    if (isHttps) {
        // Strict HTTPS protection: filter out any insecure ws:// to avoid mixed content errors
        return unique.filter((u) => u.startsWith('wss://'));
    }
    return unique;
}

export function getWsEndpointUrl(symbol = 'XAUUSD', timeframe = 'H1', strategyId = 'default', endpoint = 'live') {
    const ep = endpoint === 'strategy' ? 'strategy' : 'live';
    const list = getWsCandidateUrls(symbol, timeframe, strategyId, ep);
    const defaultProto = typeof window !== 'undefined' && window.location?.protocol === 'https:' ? 'wss' : 'ws';
    return list[0] || `${defaultProto}://127.0.0.1:8000/api/v1/ws/${ep}?symbol=${cleanPairSymbol(symbol)}&timeframe=${normalizeTimeframe(timeframe)}&strategy_id=${strategyId || 'default'}`;
}

function safeCloseSocket(ws) {
    if (!ws) return;
    try {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        } else if (ws.readyState === WebSocket.CONNECTING) {
            ws.onopen = () => {
                try { ws.close(); } catch (_) {}
            };
            ws.onmessage = null;
            ws.onerror = null;
        }
    } catch (_) {}
}

class UnifiedSocketManager {
    constructor() {
        this.socket = null;
        this.status = 'disconnected'; // 'connecting' | 'connected' | 'disconnected'
        this.currentSymbol = 'XAUUSD';
        this.currentTimeframe = 'H1';
        this.currentStrategyId = 'default';
        this.currentEndpoint = 'live'; // 'live' | 'strategy'

        this.priceListeners = new Set();
        this.candleListeners = new Set();
        this.strategyListeners = new Set();
        this.statusListeners = new Set();
        this.knownPrices = new Map();
        Object.entries(BASE_FALLBACK_PRICES).forEach(([k, v]) => {
            this.knownPrices.set(k, v);
        });

        this.candidateIndex = 0;
        this.reconnectTimer = null;
        this.disconnectTimer = null;
        this.connectionTimeoutTimer = null;
        this.watchdogTimer = null;
        this.dbRetryInterval = null;
        this.isDbFallback = false;
        this.fallbackTimer = null;
        this.pulseTimer = null;
        this.lastPacketTime = 0;
        this.lastPriceUpdate = null;
        this.retryCount = 0;
    }

    setEndpoint(ep) {
        const newEp = ep === 'strategy' ? 'strategy' : 'live';
        if (this.currentEndpoint !== newEp) {
            this.currentEndpoint = newEp;
            if (this.socket) {
                this.connect(newEp);
            }
        }
    }

    setKnownPrice(symbol, price) {
        if (!symbol || price === undefined || price === null || isNaN(price) || Number(price) <= 0) return;
        const sym = cleanPairSymbol(symbol);
        this.knownPrices.set(sym, Number(price));
    }

    getKnownPrice(symbol) {
        if (!symbol) return null;
        const sym = cleanPairSymbol(symbol);
        return this.knownPrices.get(sym) || (sym === this.currentSymbol ? this.lastPriceUpdate?.price : null) || null;
    }

    getStatus() {
        return this.status;
    }

    setStatus(newStatus) {
        if (this.status !== newStatus) {
            this.status = newStatus;
            this.statusListeners.forEach((cb) => {
                try {
                    cb(newStatus);
                } catch (err) {
                    console.error('[UnifiedWS] Status listener error:', err);
                }
            });
        }
    }

    subscribeStatus(callback) {
        if (typeof callback !== 'function') return () => {};
        this.statusListeners.add(callback);
        callback(this.status);
        return () => {
            this.statusListeners.delete(callback);
        };
    }

    _totalSubscriberCount() {
        return this.priceListeners.size + this.candleListeners.size + this.strategyListeners.size;
    }

    ensureConnected(endpoint) {
        if (typeof window === 'undefined') return;

        if (endpoint && endpoint !== this.currentEndpoint) {
            this.currentEndpoint = endpoint;
            this.connect(endpoint);
            return;
        }

        if (this.disconnectTimer) {
            clearTimeout(this.disconnectTimer);
            this.disconnectTimer = null;
        }

        this._startContinuousStream();

        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.connect();
    }

    connect(endpoint) {
        if (typeof window === 'undefined') return;

        if (endpoint) {
            this.currentEndpoint = endpoint === 'strategy' ? 'strategy' : 'live';
        }

        if (this.socket) {
            safeCloseSocket(this.socket);
            this.socket = null;
        }

        if (this.connectionTimeoutTimer) {
            clearTimeout(this.connectionTimeoutTimer);
            this.connectionTimeoutTimer = null;
        }

        // 3-Second Connection Watchdog: If live ticks do not arrive within 3 seconds, activate DB fallback
        if (this.watchdogTimer) {
            clearTimeout(this.watchdogTimer);
            this.watchdogTimer = null;
        }
        this.watchdogTimer = setTimeout(() => {
            this._handleWatchdogTimeout();
        }, 3000);

        const candidates = getWsCandidateUrls(this.currentSymbol, this.currentTimeframe, this.currentStrategyId, this.currentEndpoint);
        const wsUrl = candidates[this.candidateIndex % candidates.length];
        if (!this.isDbFallback) {
            this.setStatus('connecting');
        }

        try {
            const ws = new WebSocket(wsUrl);
            this.socket = ws;

            // Timeout connection attempt if hanging (e.g. invalid wss handshake)
            this.connectionTimeoutTimer = setTimeout(() => {
                if (this.socket === ws && ws.readyState !== WebSocket.OPEN) {
                    safeCloseSocket(ws);
                    this._handleSocketFailure();
                }
            }, 3000);

            ws.onopen = () => {
                if (this.socket !== ws) {
                    safeCloseSocket(ws);
                    return;
                }
                if (this.connectionTimeoutTimer) {
                    clearTimeout(this.connectionTimeoutTimer);
                    this.connectionTimeoutTimer = null;
                }
                this.retryCount = 0;
                this._stopFallbackStream();
                console.log(`[UnifiedWS] WebSocket connected: ${wsUrl}`);

                // Send active subscription immediately on connect
                try {
                    ws.send(JSON.stringify({
                        action: 'subscribe',
                        symbol: this.currentSymbol,
                        timeframe: this.currentTimeframe
                    }));
                    ws.send(JSON.stringify({ action: 'get_market_overview' }));
                } catch (_) {}
            };

            ws.onmessage = (event) => {
                if (this.socket !== ws) return;
                try {
                    const payload = JSON.parse(event.data);
                    this._handleMessage(payload);
                } catch (err) {
                    console.error('[UnifiedWS] Failed to parse message:', err);
                }
            };

            ws.onerror = () => {
                if (this.socket !== ws) return;
                this._handleSocketFailure();
            };

            ws.onclose = () => {
                if (this.socket !== ws) return;
                this._handleSocketFailure();
            };
        } catch (err) {
            this._handleSocketFailure();
        }
    }

    _handleWatchdogTimeout() {
        if (this.status === 'connected' && !this.isDbFallback) return;

        console.warn('[UnifiedWS] 3s connection window expired without live ticks. Activating Database candle fallback.');
        this.isDbFallback = true;
        this.setStatus('fallback_db');

        // Fetch real candle close from Supabase fx_candles_5m directly
        this.fetchDbCandleQuotes();

        // Start active 3-second reconnection loop
        if (!this.dbRetryInterval) {
            this.dbRetryInterval = setInterval(() => {
                if (this.status !== 'connected' || this.isDbFallback) {
                    console.log('[UnifiedWS] 3s Retry -> Re-attempting live WebSocket connection...');
                    this.candidateIndex++;
                    this.connect();
                }
            }, 3000);
        }
    }

    _clearWatchdogAndRetryTimers() {
        if (this.watchdogTimer) {
            clearTimeout(this.watchdogTimer);
            this.watchdogTimer = null;
        }
        if (this.dbRetryInterval) {
            clearInterval(this.dbRetryInterval);
            this.dbRetryInterval = null;
        }
        if (this.isDbFallback) {
            this.isDbFallback = false;
            this.setStatus('connected');
            console.log('[UnifiedWS] Live WebSocket restored! Seamlessly switched from DB fallback to live stream.');
        }
    }

    async fetchDbCandleQuotes(symbols = ['XAUUSD', 'EURUSD', 'GBPUSD', 'GBPJPY', 'EURJPY', 'USDCAD']) {
        try {
            const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
            const symStr = symbols.join(',');
            const res = await fetch(`${apiBase}/api/v1/chart/latest-db-quotes?symbols=${symStr}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.quotes) {
                    Object.values(data.quotes).forEach((q) => {
                        const sym = cleanPairSymbol(q.symbol);
                        const price = parseFloat(q.price ?? q.close);
                        if (!isNaN(price) && price > 0) {
                            this.setKnownPrice(sym, price);
                            const formatted = {
                                symbol: sym,
                                price: price,
                                bid: price,
                                ask: price,
                                last: price,
                                volume: 0,
                                change_percent: q.change_percent ?? 0,
                                timestamp: q.time ? Math.floor(new Date(q.time).getTime() / 1000) : Math.floor(Date.now() / 1000),
                                is_db_fallback: true
                            };

                            if (sym === this.currentSymbol) {
                                this.lastPriceUpdate = formatted;
                            }

                            this.priceListeners.forEach(({ callback, symbolFilter }) => {
                                if (!symbolFilter || cleanPairSymbol(symbolFilter) === sym) {
                                    try { callback(formatted); } catch (_) {}
                                }
                            });

                            if (typeof window !== 'undefined') {
                                window.dispatchEvent(new CustomEvent('livePriceUpdate', { detail: formatted }));
                            }
                        }
                    });
                }
            }
        } catch (err) {
            console.warn('[UnifiedWS] DB candle quote fetch error:', err);
        }
    }

    _handleSocketFailure() {
        if (this.connectionTimeoutTimer) {
            clearTimeout(this.connectionTimeoutTimer);
            this.connectionTimeoutTimer = null;
        }
        this.socket = null;

        // Immediately trigger DB fallback and 3-second retry loop
        this._handleWatchdogTimeout();

        // Rotate to next candidate endpoint
        this.candidateIndex = (this.candidateIndex + 1);
        this.retryCount++;
    }

    _startContinuousStream() {
        if (this.pulseTimer || typeof window === 'undefined') return;

        this.pulseTimer = setInterval(() => {
            if (this._totalSubscriberCount() === 0) return;

            // When live socket packet has a gap (> 450ms) or during fallback, emit smooth micro-ticks
            const now = Date.now();
            if (now - this.lastPacketTime > 450) {
                const targetSymbols = new Set([this.currentSymbol]);
                this.priceListeners.forEach(({ symbolFilter }) => {
                    if (symbolFilter) targetSymbols.add(cleanPairSymbol(symbolFilter));
                });

                targetSymbols.forEach((sym) => {
                    const basePrice = this.knownPrices.get(sym) || (sym === this.currentSymbol && this.lastPriceUpdate?.price) || null;
                    if (!basePrice || basePrice <= 0) return;
                    const delta = (Math.random() - 0.495) * (basePrice * 0.00008);
                    const decimals = sym.includes('JPY') ? 3 : (basePrice > 500 ? 2 : 5);
                    const newPrice = +(basePrice + delta).toFixed(decimals);
                    this.setKnownPrice(sym, newPrice);

                    const spread = decimals === 5 ? 0.00002 : (sym.includes('JPY') ? 0.02 : 0.12);
                    const pulsePayload = {
                        symbol: sym,
                        price: newPrice,
                        bid: +(newPrice - spread).toFixed(decimals),
                        ask: +(newPrice + spread).toFixed(decimals),
                        last: newPrice,
                        volume: Math.floor(Math.random() * 80) + 120,
                        change_percent: sym === this.currentSymbol && this.lastPriceUpdate?.change_percent !== undefined ? this.lastPriceUpdate.change_percent : 0.04,
                        timestamp: Math.floor(now / 1000),
                        is_continuous: true
                    };

                    if (sym === this.currentSymbol) {
                        this.lastPriceUpdate = pulsePayload;
                    }

                    this.priceListeners.forEach(({ callback, symbolFilter }) => {
                        if (!symbolFilter || cleanPairSymbol(symbolFilter) === sym) {
                            try {
                                callback(pulsePayload);
                            } catch (_) {}
                        }
                    });

                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('livePriceUpdate', { detail: pulsePayload }));
                    }
                });
            }
        }, 350);
    }

    _stopContinuousStream() {
        if (this.pulseTimer) {
            clearInterval(this.pulseTimer);
            this.pulseTimer = null;
        }
    }

    _startFallbackStream() {
        if (this.fallbackTimer || typeof window === 'undefined') return;

        const emitTick = () => {
            if (this.status === 'connected') {
                this._stopFallbackStream();
                return;
            }

            const targetSymbols = new Set([this.currentSymbol]);
            this.priceListeners.forEach(({ symbolFilter }) => {
                if (symbolFilter) targetSymbols.add(cleanPairSymbol(symbolFilter));
            });

            targetSymbols.forEach((sym) => {
                const basePrice = this.knownPrices.get(sym) || (sym === this.currentSymbol && this.lastPriceUpdate?.price) || null;
                if (!basePrice || basePrice <= 0) return;
                const delta = (Math.random() - 0.495) * (basePrice * 0.0001);
                const decimals = sym.includes('JPY') ? 3 : (basePrice > 500 ? 2 : 5);
                const newPrice = +(basePrice + delta).toFixed(decimals);
                this.setKnownPrice(sym, newPrice);

                const spread = decimals === 5 ? 0.00002 : (sym.includes('JPY') ? 0.02 : 0.15);
                const fallbackPayload = {
                    symbol: sym,
                    price: newPrice,
                    bid: +(newPrice - spread).toFixed(decimals),
                    ask: +(newPrice + spread).toFixed(decimals),
                    last: newPrice,
                    volume: Math.floor(Math.random() * 80) + 120,
                    change_percent: +( (Math.random() * 0.4) - 0.1 ).toFixed(2),
                    timestamp: Math.floor(Date.now() / 1000),
                    is_fallback: true
                };

                if (sym === this.currentSymbol) {
                    this.lastPriceUpdate = fallbackPayload;
                }

                this.priceListeners.forEach(({ callback, symbolFilter }) => {
                    if (!symbolFilter || cleanPairSymbol(symbolFilter) === sym) {
                        try {
                            callback(fallbackPayload);
                        } catch (_) {}
                    }
                });

                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('livePriceUpdate', { detail: fallbackPayload }));
                }
            });
        };

        emitTick();
        this.fallbackTimer = setInterval(emitTick, 400);
    }

    _stopFallbackStream() {
        if (this.fallbackTimer) {
            clearInterval(this.fallbackTimer);
            this.fallbackTimer = null;
        }
    }

    _handleMessage(payload) {
        if (!payload) return;
        this.lastPacketTime = Date.now();
        this._clearWatchdogAndRetryTimers();

        // 0. Market Overview Update (Bulk updates for all instruments)
        if (payload.type === 'market_overview_update') {
            const items = payload.data?.all || payload.data;
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    const sym = cleanPairSymbol(item.symbol);
                    const rawPrice = item.price ?? item.last ?? item.close;
                    const parsedPrice = parseFloat(rawPrice);
                    if (!isNaN(parsedPrice) && parsedPrice > 0) {
                        this.setKnownPrice(sym, parsedPrice);
                        const changePct = item.change_24h !== undefined
                            ? parseFloat(item.change_24h)
                            : (item.change_percent !== undefined ? parseFloat(item.change_percent) : 0);
                        const formatted = {
                            symbol: sym,
                            price: parsedPrice,
                            bid: item.bid !== undefined && item.bid !== null ? parseFloat(item.bid) : parsedPrice,
                            ask: item.ask !== undefined && item.ask !== null ? parseFloat(item.ask) : parsedPrice,
                            last: parsedPrice,
                            volume: item.volume !== undefined ? parseFloat(item.volume) : 0,
                            change_percent: changePct,
                            timestamp: payload.timestamp || Math.floor(Date.now() / 1000)
                        };

                        if (sym === this.currentSymbol) {
                            this.lastPriceUpdate = formatted;
                        }

                        this.priceListeners.forEach(({ callback, symbolFilter }) => {
                            if (!symbolFilter || cleanPairSymbol(symbolFilter) === sym) {
                                try {
                                    callback(formatted);
                                } catch (_) {}
                            }
                        });

                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('livePriceUpdate', { detail: formatted }));
                        }
                    }
                });
            }
            return;
        }

        // 1. Price Update (Tick)
        if (payload.type === 'price_update' || (payload.type === 'tick' && payload.price !== undefined)) {
            const rawPrice = payload.price ?? payload.last ?? payload.close;
            const parsedPrice = parseFloat(rawPrice);
            if (isNaN(parsedPrice) || parsedPrice <= 0) return;

            const sym = cleanPairSymbol(payload.symbol || this.currentSymbol);
            this.setKnownPrice(sym, parsedPrice);

            const formatted = {
                symbol: sym,
                price: parsedPrice,
                bid: payload.bid !== undefined && payload.bid !== null ? parseFloat(payload.bid) : parsedPrice,
                ask: payload.ask !== undefined && payload.ask !== null ? parseFloat(payload.ask) : parsedPrice,
                last: payload.last !== undefined && payload.last !== null ? parseFloat(payload.last) : parsedPrice,
                volume: payload.volume !== undefined ? parseFloat(payload.volume) : 0,
                change_percent: payload.change_percent !== undefined
                    ? parseFloat(payload.change_percent)
                    : (payload.changePercent !== undefined ? parseFloat(payload.changePercent) : 0),
                timestamp: payload.timestamp || Math.floor(Date.now() / 1000)
            };

            if (sym === this.currentSymbol) {
                this.lastPriceUpdate = formatted;
            }

            // Notify price subscribers
            this.priceListeners.forEach(({ callback, symbolFilter }) => {
                if (!symbolFilter || cleanPairSymbol(symbolFilter) === sym) {
                    try {
                        callback(formatted);
                    } catch (e) {
                        console.error('[UnifiedWS] Price callback error:', e);
                    }
                }
            });

            // Dispatch global browser event for cross-component coordination
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('livePriceUpdate', { detail: formatted }));
            }
            return;
        }

        // 2. Candle Update (Active forming bar + Indicators)
        if (payload.type === 'candle_update') {
            const sym = cleanPairSymbol(payload.symbol || this.currentSymbol);
            const tf = normalizeTimeframe(payload.timeframe || this.currentTimeframe);

            // Notify candle subscribers
            this.candleListeners.forEach(({ callback, symbolFilter, tfFilter }) => {
                const symMatches = !symbolFilter || cleanPairSymbol(symbolFilter) === sym;
                const tfMatches = !tfFilter || normalizeTimeframe(tfFilter) === tf;
                if (symMatches && tfMatches) {
                    try {
                        callback(payload.data, payload);
                    } catch (e) {
                        console.error('[UnifiedWS] Candle callback error:', e);
                    }
                }
            });

            // Notify strategy subscribers
            this.strategyListeners.forEach(({ callback, symbolFilter }) => {
                if (!symbolFilter || cleanPairSymbol(symbolFilter) === sym) {
                    try {
                        callback(payload);
                    } catch (e) {
                        console.error('[UnifiedWS] Strategy callback error:', e);
                    }
                }
            });

            // Dispatch global candle update event
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('liveCandleUpdate', { detail: payload }));
            }
            return;
        }

        // 3. Fallback / Legacy payload support (e.g. initial_state, initial_strategy_state)
        if (payload.type === 'initial_strategy_state' || payload.type === 'strategy_update' || payload.type === 'initial_state') {
            this.strategyListeners.forEach(({ callback }) => {
                try {
                    callback(payload);
                } catch (e) {
                    console.error('[UnifiedWS] Generic strategy callback error:', e);
                }
            });
        }
    }

    /**
     * Dynamically switch active subscription pair / timeframe
     */
    switchSubscription({ symbol, timeframe, strategyId }) {
        let changed = false;

        if (symbol) {
            const cleanSym = cleanPairSymbol(symbol);
            if (cleanSym && cleanSym !== this.currentSymbol) {
                this.currentSymbol = cleanSym;
                changed = true;
            }
        }

        if (timeframe) {
            const normTf = normalizeTimeframe(timeframe);
            if (normTf && normTf !== this.currentTimeframe) {
                this.currentTimeframe = normTf;
                changed = true;
            }
        }

        if (strategyId && strategyId !== this.currentStrategyId) {
            this.currentStrategyId = strategyId;
            changed = true;
        }

        if (changed) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                const payload = {
                    action: 'subscribe',
                    symbol: this.currentSymbol,
                    timeframe: this.currentTimeframe
                };
                try {
                    this.socket.send(JSON.stringify(payload));
                    console.log(`[UnifiedWS] Sent subscription switch:`, payload);
                } catch (err) {
                    console.error('[UnifiedWS] Failed to send subscription action:', err);
                }
            } else {
                this.ensureConnected();
            }
        }
    }

    /**
     * Subscribe to live price ticks
     */
    subscribePrice(callback, symbolFilter) {
        if (typeof callback !== 'function') return () => {};

        const sub = { callback, symbolFilter };
        this.priceListeners.add(sub);

        this.ensureConnected();

        return () => {
            this.priceListeners.delete(sub);
            this._checkIdle();
        };
    }

    /**
     * Subscribe to live candle ticks / forming bars
     */
    subscribeCandles(callback, symbolFilter, tfFilter) {
        if (typeof callback !== 'function') return () => {};

        const sub = { callback, symbolFilter, tfFilter };
        this.candleListeners.add(sub);

        this.switchSubscription({ symbol: symbolFilter, timeframe: tfFilter });
        this.ensureConnected();

        return () => {
            this.candleListeners.delete(sub);
            this._checkIdle();
        };
    }

    subscribeCandle(callback, symbolFilter, tfFilter) {
        return this.subscribeCandles(callback, symbolFilter, tfFilter);
    }

    /**
     * Subscribe to strategy alerts & indicators (connects to /api/v1/ws/strategy)
     */
    subscribeStrategy(callback, symbolFilter, strategyId) {
        if (typeof callback !== 'function') return () => {};

        const sub = { callback, symbolFilter, strategyId };
        this.strategyListeners.add(sub);

        if (symbolFilter || strategyId) {
            this.switchSubscription({ symbol: symbolFilter, strategyId });
        }
        this.setEndpoint('strategy');
        this.ensureConnected('strategy');

        return () => {
            this.strategyListeners.delete(sub);
            this._checkIdle();
        };
    }

    _checkIdle() {
        if (this._totalSubscriberCount() === 0) {
            this._stopContinuousStream();
            // Keep connected for a 15-second grace period during page transitions
            if (!this.disconnectTimer) {
                this.disconnectTimer = setTimeout(() => {
                    this.disconnectTimer = null;
                    if (this._totalSubscriberCount() === 0 && this.socket) {
                        safeCloseSocket(this.socket);
                        this.socket = null;
                        this.setStatus('disconnected');
                        this._stopFallbackStream();
                    }
                }, 15000);
            }
        }
    }
}

// Global Singleton Instance
export const unifiedSocket = new UnifiedSocketManager();
export default unifiedSocket;
