import express, { Router } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import listEndpoints from 'express-list-endpoints';
import { apiRouter } from './routes/index.js';
import { logger } from '../utils/logger.js';
import { env } from './env.js';
// -------------------- APP --------------------
const app = express();
// CORS с использованием env
const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
            return cb(null, true);
        }
        return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));
// health
app.get('/api/health', (_req, res) => res.json({ ok: true }));
// все API через apiRouter
app.use('/api', apiRouter);
// статика
const distPath = path.resolve(process.cwd(), 'frontend/dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use((_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}
else {
    logger.warn(`Frontend dist not found at ${distPath}`);
}
// -------------------- MATCHES ROUTER --------------------
const matchesRouter = Router();
const FOOTBALL_API = 'https://api.football-data.org/v4';
const API_KEY = env.FOOTBALL_API_TOKEN || '';
async function fetchFromFootball(endpoint) {
    if (!API_KEY) {
        throw new Error('Football API token not configured');
    }
    const res = await fetch(`${FOOTBALL_API}${endpoint}`, {
        headers: { 'X-Auth-Token': API_KEY },
    });
    if (!res.ok)
        throw new Error(`football-data.org error: ${res.status}`);
    return res.json();
}
matchesRouter.get('/', async (_req, res) => {
    try {
        const data = await fetchFromFootball('/matches?status=SCHEDULED,TIMED');
        res.json({ matches: data.matches || [] });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
matchesRouter.get('/live', async (_req, res) => {
    try {
        const data = await fetchFromFootball('/matches?status=IN_PLAY,PAUSED');
        res.json({ matches: data.matches || [] });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.use('/api/matches', matchesRouter);
// -------------------- START --------------------
app.listen(env.PORT, '0.0.0.0', () => {
    logger.info(`✅ Server running on http://0.0.0.0:${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(listEndpoints(app));
});
//# sourceMappingURL=index.js.map