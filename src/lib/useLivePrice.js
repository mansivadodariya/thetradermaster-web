'use client';

import { useState, useEffect, useRef } from 'react';
import { unifiedSocket, cleanPairSymbol } from './unifiedSocket';

/**
 * Live MT5 Price Stream Hook (Unified WebSocket Powered)
 * Subscribes to the single global Unified MT5 Live WebSocket
 * and receives real-time price_update ticks.
 */
export function useLivePrice(symbol = 'XAUUSD') {
    const cleanSymbol = cleanPairSymbol(symbol);

    const [priceData, setPriceData] = useState(null);
    const [tickDirection, setTickDirection] = useState(null); // 'up' | 'down' | null
    const prevPriceRef = useRef(null);

    useEffect(() => {
        if (!cleanSymbol) return;

        let isMounted = true;

        const updatePrice = (newPrice, changePercent, timestamp, bid, ask) => {
            if (!isMounted) return;
            const numPrice = parseFloat(newPrice);
            if (isNaN(numPrice) || numPrice <= 0) return;

            if (prevPriceRef.current !== null) {
                if (numPrice > prevPriceRef.current) {
                    setTickDirection('up');
                } else if (numPrice < prevPriceRef.current) {
                    setTickDirection('down');
                }
            }
            prevPriceRef.current = numPrice;

            setPriceData({
                symbol: cleanSymbol,
                price: numPrice,
                bid: bid !== undefined && bid !== null ? parseFloat(bid) : numPrice,
                ask: ask !== undefined && ask !== null ? parseFloat(ask) : numPrice,
                changePercent: changePercent !== undefined && changePercent !== null ? parseFloat(changePercent) : 0,
                timestamp: timestamp || new Date().toISOString(),
            });
        };

        // 1. Listen for global livePriceUpdate events
        const handleGlobalPriceUpdate = (e) => {
            const payload = e?.detail;
            if (!payload || !payload.symbol || payload.price === undefined || payload.price === null) return;
            const eventSym = cleanPairSymbol(payload.symbol);
            if (eventSym !== cleanSymbol) return;
            updatePrice(
                payload.price,
                payload.change_percent ?? payload.changePercent,
                payload.timestamp,
                payload.bid,
                payload.ask
            );
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('livePriceUpdate', handleGlobalPriceUpdate);
        }

        // 2. Subscribe to unified socket singleton
        const unsubscribe = unifiedSocket.subscribePrice((data) => {
            if (!isMounted) return;
            updatePrice(
                data.price,
                data.change_percent ?? data.changePercent,
                data.timestamp,
                data.bid,
                data.ask
            );
        }, cleanSymbol);

        return () => {
            isMounted = false;
            if (typeof window !== 'undefined') {
                window.removeEventListener('livePriceUpdate', handleGlobalPriceUpdate);
            }
            unsubscribe();
        };
    }, [cleanSymbol]);

    return { priceData, tickDirection };
}
