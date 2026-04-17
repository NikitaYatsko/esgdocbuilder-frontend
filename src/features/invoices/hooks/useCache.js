import { useState, useCallback, useRef } from 'react';

class CacheManager {
    constructor() {
        this.cache = new Map();
    }

    get(key, ttl = 5 * 60 * 1000) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        const now = Date.now();
        if (now - cached.timestamp > ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clear(key) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }

    has(key) {
        return this.cache.has(key);
    }
}

const globalCache = new CacheManager();

export const useCache = () => {
    const getCached = useCallback((key, ttl = 5 * 60 * 1000) => {
        return globalCache.get(key, ttl);
    }, []);

    const setCached = useCallback((key, data) => {
        globalCache.set(key, data);
    }, []);

    const clearCache = useCallback((key) => {
        globalCache.clear(key);
    }, []);

    const hasCache = useCallback((key) => {
        return globalCache.has(key);
    }, []);

    return { getCached, setCached, clearCache, hasCache };
};