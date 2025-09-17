import { Router } from 'express';
import { newsHandler } from './handlers/news.js';
export const apiRouter = Router();
apiRouter.get('/news', newsHandler);
// можно добавить healthcheck (удобно для проверки)
apiRouter.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
