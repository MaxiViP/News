import { Router } from 'express'
import { newsHandler } from './handlers/news.js'
import matchesRouter from './matches.js'

export const apiRouter = Router()

// матчи
apiRouter.use(matchesRouter)

// новости
apiRouter.get('/news', newsHandler)

// health внутри apiRouter
apiRouter.get('/health', (_req, res) => res.json({ status: 'ok' }))
