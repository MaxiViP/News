import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { apiRouter } from './routes/index.js';
import { logger } from '../utils/logger.js';
import listEndpoints from 'express-list-endpoints';
const app = express();
// CORS
const allowed = ['https://maxivip-news-9235.twc1.net'];
app.use(cors({
    origin(origin, cb) {
        if (!origin || allowed.includes(origin))
            return cb(null, true);
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
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`✅ Server running on http://0.0.0.0:${PORT}`);
    console.log(listEndpoints(app)); // 👈 покажет все пути
});
