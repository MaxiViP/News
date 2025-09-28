// routes/index.ts
import { Router } from 'express'
import { newsHandler } from './handlers/news.js'
import matchesRouter from './matches.js'

export const apiRouter = Router()

// все матчи: будут /api/matches и /api/matches/live
apiRouter.use('/matches', matchesRouter)

// эндпоинт для новостей
apiRouter.get('/news', newsHandler)

// healthcheck
apiRouter.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})
