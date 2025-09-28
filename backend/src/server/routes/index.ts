import { Router } from 'express'
import { newsHandler } from './handlers/news.js'
import matchesRouter from './matches.js'

export const apiRouter = Router()

// Теперь все матчи будут на /api/matches и /api/matches/live
apiRouter.use(matchesRouter)

// Новости
apiRouter.get('/news', newsHandler)

// Healthcheck
apiRouter.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})
