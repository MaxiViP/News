import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.string().default('development'),
  NEWSAPI_KEY: z.string().min(1, 'NEWSAPI_KEY is required'),
  CACHE_PROVIDER: z.enum(['memory', 'redis']).default('memory'),
  REDIS_URL: z.string().url().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
})

export const env = EnvSchema.parse(process.env)
