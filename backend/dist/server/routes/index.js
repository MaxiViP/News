import { Router } from 'express';
import { newsHandler } from './handlers/news.js';
export const apiRouter = Router();
// эндпоинт для новостей
apiRouter.get('/news', newsHandler);
// healthcheck
apiRouter.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
//# sourceMappingURL=index.js.map