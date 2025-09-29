import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch'; // 👈 добавляем fetch
import { apiRouter } from '../routes/index.js';
import { logger } from '../utils/logger.js';
const app = express();
// CORS
// backend/src/server/index.ts
const allowed = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
// Always allow localhost for dev
if (!allowed.includes('http://localhost:5173')) {
    allowed.push('http://localhost:5173');
}
app.use(cors({
    origin(origin, cb) {
        if (!origin || allowed.length === 0 || allowed.includes(origin)) {
            return cb(null, true);
        }
        return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));
// API healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }));
// 🎯 Football-data.org proxy routes
const FOOTBALL_API = 'https://api.football-data.org/v4';
const FOOTBALL_TOKEN = process.env.FOOTBALL_API_TOKEN;
app.get('/api/matches', async (_req, res) => {
    try {
        const r = await fetch(`${FOOTBALL_API}/matches?status=SCHEDULED`, {
            headers: { 'X-Auth-Token': FOOTBALL_TOKEN ?? '' },
        });
        const data = await r.json();
        res.json(data);
    }
    catch (err) {
        logger.error('FD proxy error (SCHEDULED):', err);
        res.status(500).json({ error: 'proxy_failed' });
    }
});
app.get('/api/matches/live', async (_req, res) => {
    try {
        const r = await fetch(`${FOOTBALL_API}/matches?status=LIVE`, {
            headers: { 'X-Auth-Token': FOOTBALL_TOKEN ?? '' },
        });
        const data = await r.json();
        res.json(data);
    }
    catch (err) {
        logger.error('FD proxy error (LIVE):', err);
        res.status(500).json({ error: 'proxy_failed' });
    }
});
// Подключаем твои API роуты
app.use('/api', apiRouter);
// Статические файлы фронтенда
const distPath = path.resolve(process.cwd(), 'frontend/dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // SPA fallback
    app.use((_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}
else {
    logger.warn(`Frontend dist not found at ${distPath}`);
}
// Порт
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`✅ Server running on http://0.0.0.0:${PORT}`);
});
//# sourceMappingURL=index.js.map