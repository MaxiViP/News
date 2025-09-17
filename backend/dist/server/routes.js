import { Router } from 'express';
import { newsHandler } from './handlers/news.js';
export const apiRouter = Router();
// GET https://maxivip-news-ba8f.twc1.net/api/news?category=tech&country=ru&page=1
apiRouter.get('/news', newsHandler);
