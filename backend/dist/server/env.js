// backend/src/server/env.ts
import 'dotenv/config';
import { z } from 'zod';
const EnvSchema = z.object({
    PORT: z.coerce.number().default(3001),
    NODE_ENV: z.string().default('development'),
    CACHE_PROVIDER: z.enum(['memory', 'redis']).default('memory'),
    REDIS_URL: z.string().url().optional(),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
});
const result = EnvSchema.safeParse(process.env);
if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1); // Или fallback на значения по умолчанию
}
export const env = result.data;
