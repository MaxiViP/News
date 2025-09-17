import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';
const app = express();
// Логирование для дебаггинга
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
// --- CORS
const allowedOrigins = (process.env.CORS_ORIGIN ?? '').split(',').filter(Boolean);
app.use(cors({
    origin: (origin, callback) => {
        // Разрешить запросы без origin (например, из curl/postman)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`CORS blocked: ${origin}`);
        return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));
// --- API endpoints
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', apiRouter);
app.use((err, _req, res, next) => {
    if (err.message.includes('CORS blocked')) {
        return res.status(403).json({ error: 'CORS error' });
    }
    next(err);
});
app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
// --- PORT
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ API server running on http://0.0.0.0:${PORT}`);
    console.log(`Allowed CORS origins:`, allowedOrigins);
});
