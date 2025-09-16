import { Router } from 'express'
import { newsHandler } from '../handlers/news.js'
export const apiRouter = Router()

// GET /api/news?category=tech&country=ru&page=1
apiRouter.get('/news', newsHandler)
