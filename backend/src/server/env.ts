import dotenv from 'dotenv'
import { z } from 'zod'

// Загружаем правильный .env в зависимости от окружения
dotenv.config({
	path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
})

const EnvSchema = z.object({
	PORT: z.coerce.number().default(3001),
	NODE_ENV: z.string().default('development'),
	CACHE_PROVIDER: z.enum(['memory', 'redis']).default('memory'),
	REDIS_URL: z.string().url().optional(),
	CORS_ORIGIN: z.string().default('http://localhost:5173'),
	FOOTBALL_API_TOKEN: z.string().optional(),
	FOOTBALL_DATA_KEY: z.string().optional(),
})

const result = EnvSchema.safeParse(process.env)
if (!result.success) {
	console.error('❌ Invalid environment variables:', result.error.format())
	process.exit(1)
}
console.log('📦 Loaded env from NODE_ENV:', process.env.NODE_ENV)
console.log('📦 FOOTBALL_API_TOKEN:', process.env.FOOTBALL_API_TOKEN ? '✅ set' : '❌ missing')

export const env = result.data
