import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
	PORT: z.coerce.number().default(3001),
	NODE_ENV: z.enum(['development', 'production']).default('development'),

	CACHE_PROVIDER: z.enum(['memory', 'redis']).default('memory'),
	REDIS_URL: z.string().url().optional(),

	CORS_ORIGIN: z.string().default('http://localhost:5173'),

	// Если нет переменной, берём дефолт
	FOOTBALL_API_TOKEN: z.string().default('563b1e8db9574057a9bae05e33cbbe85'),
	NEWSAPI_KEY: z.string().default('3f1863b3b1bf46c386cd23b0fafbb20a'),
})

const result = EnvSchema.safeParse(process.env)
if (!result.success) {
	console.error('❌ Invalid environment variables:', result.error.format())
	process.exit(1)
}

export const env = {
	...result.data,
	CORS_ORIGIN: result.data.CORS_ORIGIN.split(',').map(o => o.trim()),
}
