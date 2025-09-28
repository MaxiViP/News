import dotenv from 'dotenv'
import { z } from 'zod'

// Загружаем .env файлы
dotenv.config()

const EnvSchema = z.object({
	PORT: z.coerce.number().default(3001),
	NODE_ENV: z.string().default('development'),
	CACHE_PROVIDER: z.enum(['memory', 'redis']).default('memory'),
	REDIS_URL: z.string().url().optional(),
	CORS_ORIGIN: z.string().default('http://localhost:5173'),
	FOOTBALL_API_TOKEN: z.string().default('563b1e8db9574057a9bae05e33cbbe85'), // 👈 добавьте default
	FOOTBALL_DATA_KEY: z.string().default('563b1e8db9574057a9bae05e33cbbe85'), // 👈 добавьте default
})

const result = EnvSchema.safeParse(process.env)
if (!result.success) {
	console.error('❌ Invalid environment variables:', result.error.format())
	// Вместо exit, используем значения по умолчанию
	console.log('🔄 Using default values...')
}

export const env = result.success ? result.data : EnvSchema.parse({})
console.log('📦 Loaded env - FOOTBALL_API_TOKEN:', env.FOOTBALL_API_TOKEN ? '✅ set' : '❌ missing')
