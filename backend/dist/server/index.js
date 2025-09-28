import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { apiRouter } from '../routes/index.js';
import { logger } from '../utils/logger.js';
import { corsMiddleware } from './cors.js';
const app = express();
// ✅ Применяем CORS ко ВСЕМ запросам
app.use(corsMiddleware);
// ✅ Обработка preflight запросов для всех routes
app.options('*', corsMiddleware);
// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ✅ healthcheck с явным CORS
app.get('/api/health', (_req, res) => {
    res.json({
        ok: true,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
    });
});
// ✅ подключаем все API роуты
app.use('/api', apiRouter);
// ✅ Глобальный обработчик ошибок с CORS заголовками
app.use((err, _req, res, _next) => {
    console.error('❌ Server error:', err);
    // Добавляем CORS заголовки даже для ошибок
    res.header('Access-Control-Allow-Origin', _req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (err.message.includes('CORS')) {
        return res.status(403).json({
            error: 'CORS blocked',
            message: err.message,
        });
    }
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    });
});
// ✅ фронтенд (Vue dist)
const distPath = path.resolve(process.cwd(), 'frontend/dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // SPA fallback
    app.use((_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}
else {
    logger.warn(`⚠️ Frontend dist not found at ${distPath}`);
}
// ✅ 404 handler с CORS
app.use((_req, res) => {
    res.header('Access-Control-Allow-Origin', _req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(404).json({ error: 'Not found' });
});
// ✅ запуск сервера
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`✅ Server running on http://0.0.0.0:${PORT}`);
    logger.info(`🔐 CORS enabled for: ${process.env.CORS_ORIGIN}`);
    logger.info(`🌐 NODE_ENV: ${process.env.NODE_ENV}`);
});
//# sourceMappingURL=index.js.map