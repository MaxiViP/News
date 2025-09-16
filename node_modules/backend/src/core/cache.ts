import { env } from '../server/env.js'
import * as IORedis from 'ioredis'  // ← namespace

type CachePayload = unknown

class MemoryCache {
  private store = new Map<string, { exp: number; val: string }>()
  async get<T = CachePayload>(key: string): Promise<T | null> {
    const it = this.store.get(key)
    if (!it) return null
    if (Date.now() > it.exp) { this.store.delete(key); return null }
    return JSON.parse(it.val) as T
  }
  async set(key: string, value: CachePayload, ttlSec: number): Promise<void> {
    this.store.set(key, { exp: Date.now() + ttlSec * 1000, val: JSON.stringify(value) })
  }
}

class RedisCache {
  private r: IORedis.Redis   // тип класса из namespace
  constructor(url: string) {
    this.r = new (IORedis as any)(url)
  }
  async get<T = CachePayload>(key: string): Promise<T | null> {
    const raw = await this.r.get(key)
    return raw ? (JSON.parse(raw) as T) : null
  }
  async set(key: string, value: CachePayload, ttlSec: number): Promise<void> {
    await this.r.setex(key, ttlSec, JSON.stringify(value))
  }
}

export const cache =
  env.CACHE_PROVIDER === 'redis' && env.REDIS_URL
    ? new RedisCache(env.REDIS_URL)
    : new MemoryCache()
