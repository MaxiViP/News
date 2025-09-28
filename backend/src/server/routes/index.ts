import { Router } from 'express'
import { newsHandler } from './handlers/news.js'
import matchesRouter from './matches.js'

export const apiRouter = Router()

// эндпоинты для матчей
apiRouter.use('/', matchesRouter)

// эндпоинт для новостей
apiRouter.get('/news', newsHandler)

// healthcheck
apiRouter.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})
