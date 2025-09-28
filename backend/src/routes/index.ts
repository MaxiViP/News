import { Router } from 'express'
import { newsHandler } from './handlers/news.js'
import matchesRouter from './matches.js'

export const apiRouter = Router()

// эндпоинт для новостей
apiRouter.get('/news', newsHandler)

// healthcheck для мониторинга
apiRouter.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})
apiRouter.use('/', matchesRouter)
