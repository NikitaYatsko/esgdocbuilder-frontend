import { useState, useCallback, useRef, useEffect } from 'react';

class CacheManager {
    constructor() {
        this.cache = new Map();
        this.pendingRequests = new Map(); 
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

    set(key, data, tags = []) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            tags 
        });
    }

    clear(key) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }

    clearByTag(tag) {
        for (const [key, value] of this.cache.entries()) {
            if (value.tags.includes(tag)) {
                this.cache.delete(key);
            }
        }
    }

    has(key) {
        return this.cache.has(key);
    }

    addPendingRequest(key, promise) {
        this.pendingRequests.set(key, promise);
        promise.finally(() => {
            this.pendingRequests.delete(key);
        });
        return promise;
    }

    getPendingRequest(key) {
        return this.pendingRequests.get(key);
    }
}

const globalCache = new CacheManager();

export const useCache = () => {
    const getCached = useCallback((key, ttl = 5 * 60 * 1000) => {
        return globalCache.get(key, ttl);
    }, []);

    const setCached = useCallback((key, data, tags = []) => {
        globalCache.set(key, data, tags);
    }, []);

    const clearCache = useCallback((key) => {
        globalCache.clear(key);
    }, []);

    const clearCacheByTag = useCallback((tag) => {
        globalCache.clearByTag(tag);
    }, []);

    const hasCache = useCallback((key) => {
        return globalCache.has(key);
    }, []);

    const fetchWithCache = useCallback(async (key, fetchFn, ttl = 5 * 60 * 1000, tags = []) => {
        const cached = globalCache.get(key, ttl);
        if (cached !== null) {
            return cached;
        }

        const pending = globalCache.getPendingRequest(key);
        if (pending) {
            return pending;
        }


        const promise = fetchFn().then(data => {
            globalCache.set(key, data, tags);
            return data;
        });

        return globalCache.addPendingRequest(key, promise);
    }, []);

    return { getCached, setCached, clearCache, clearCacheByTag, hasCache, fetchWithCache };
};