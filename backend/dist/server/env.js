import 'dotenv/config';
import { z } from 'zod';
// Сначала описываем "сырые" строки из process.env
const EnvSchema = z.object({
    PORT: z.coerce.number().default(3001),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    CACHE_PROVIDER: z.enum(['memory', 'redis']).default('memory'),
    REDIS_URL: z.string().url().optional(),
    // Разрешённые CORS origin (в .env через запятую)
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    // Football API токен
    FOOTBALL_API_TOKEN: z.string().min(10, 'FOOTBALL_API_TOKEN is required'),
});
// Валидируем
const result = EnvSchema.safeParse(process.env);
if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
}
// Преобразуем в удобный объект
export const env = {
    ...result.data,
    // Превращаем строку в массив
    CORS_ORIGIN: result.data.CORS_ORIGIN.split(',').map(o => o.trim()),
};
//# sourceMappingURL=env.js.map