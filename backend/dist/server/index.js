import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { apiRouter } from '../routes/index.js';
import { logger } from '../utils/logger.js';
const app = express();
// ✅ ВСЕ разрешённые origins
const allowedOrigins = [
    'http://localhost:5173',
    'https://newsandnews.ru',
    'http://newsandnews.ru',
    'https://maxivip-news-5c50.twc1.net',
    'https://maxivip-news-9235.twc1.net',
];
// ✅ Простой CORS (временно разрешаем все origins)
app.use(cors({
    origin: true,
    credentials: true,
}));
// ✅ Логирование всех запросов
app.use((req, _res, next) => {
    logger.info(`🌐 ${req.method} ${req.url} from origin: ${req.headers.origin}`);
    next();
});
// ✅ API healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }));
// ✅ Подключение всех API роутов
app.use('/api', apiRouter);
// ✅ Отдаём фронтенд dist
const distPath = path.resolve(process.cwd(), 'frontend/dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use((_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}
else {
    logger.warn(`⚠️ Frontend dist not found at ${distPath}`);
}
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`✅ Server running on http://0.0.0.0:${PORT}`);
    logger.info(`🔐 Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});
//# sourceMappingURL=index.js.map