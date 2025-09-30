// backend/src/core/cache.ts
import type { Redis } from 'ioredis'
import { env } from '../server/env.js'

type CachePayload = unknown

interface ICache {
	get<T = CachePayload>(key: string): Promise<T | null>
	set(key: string, value: CachePayload, ttlSec: number): Promise<void>
	getOrSet<T = CachePayload>(key: string, ttlSec: number, fn: () => Promise<T>): Promise<T>
}

class MemoryCache implements ICache {
	private store = new Map<string, { exp: number; val: string }>()

	async get<T = CachePayload>(key: string): Promise<T | null> {
		const it = this.store.get(key)
		if (!it) return null
		if (Date.now() > it.exp) {
			this.store.delete(key)
			return null
		}
		return JSON.parse(it.val) as T
	}

	async set(key: string, value: CachePayload, ttlSec: number): Promise<void> {
		this.store.set(key, {
			exp: Date.now() + ttlSec * 1000,
			val: JSON.stringify(value),
		})
	}

	async getOrSet<T = CachePayload>(key: string, ttlSec: number, fn: () => Promise<T>): Promise<T> {
		const cached = await this.get<T>(key)
		if (cached) return cached
		const fresh = await fn()
		await this.set(key, fresh, ttlSec)
		return fresh
	}
}

class RedisCache implements ICache {
	private r: Redis

	constructor(url: string) {
		const IORedis = require('ioredis') // динамический импорт
		this.r = new IORedis(url)
	}

	async get<T = CachePayload>(key: string): Promise<T | null> {
		const raw = await this.r.get(key)
		return raw ? (JSON.parse(raw) as T) : null
	}

	async set(key: string, value: CachePayload, ttlSec: number): Promise<void> {
		await this.r.setex(key, ttlSec, JSON.stringify(value))
	}

	async getOrSet<T = CachePayload>(key: string, ttlSec: number, fn: () => Promise<T>): Promise<T> {
		const cached = await this.get<T>(key)
		if (cached) return cached
		const fresh = await fn()
		await this.set(key, fresh, ttlSec)
		return fresh
	}
}

export const cache: ICache =
	env.CACHE_PROVIDER === 'redis' && env.REDIS_URL ? new RedisCache(env.REDIS_URL) : new MemoryCache()
