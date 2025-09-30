import { env } from '../server/env.js';
class MemoryCache {
    store = new Map();
    async get(key) {
        const it = this.store.get(key);
        if (!it)
            return null;
        if (Date.now() > it.exp) {
            this.store.delete(key);
            return null;
        }
        return JSON.parse(it.val);
    }
    async set(key, value, ttlSec) {
        this.store.set(key, {
            exp: Date.now() + ttlSec * 1000,
            val: JSON.stringify(value),
        });
    }
    async getOrSet(key, ttlSec, fn) {
        const cached = await this.get(key);
        if (cached)
            return cached;
        const fresh = await fn();
        await this.set(key, fresh, ttlSec);
        return fresh;
    }
}
class RedisCache {
    r;
    constructor(url) {
        const IORedis = require('ioredis'); // динамический импорт
        this.r = new IORedis(url);
    }
    async get(key) {
        const raw = await this.r.get(key);
        return raw ? JSON.parse(raw) : null;
    }
    async set(key, value, ttlSec) {
        await this.r.setex(key, ttlSec, JSON.stringify(value));
    }
    async getOrSet(key, ttlSec, fn) {
        const cached = await this.get(key);
        if (cached)
            return cached;
        const fresh = await fn();
        await this.set(key, fresh, ttlSec);
        return fresh;
    }
}
export const cache = env.CACHE_PROVIDER === 'redis' && env.REDIS_URL ? new RedisCache(env.REDIS_URL) : new MemoryCache();
//# sourceMappingURL=cache.js.map