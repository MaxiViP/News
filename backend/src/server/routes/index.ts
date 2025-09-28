import { Router } from 'express'
import { newsHandler } from './handlers/news.js'
import matchesRouter from './matches.js'

export const apiRouter = Router()

// теперь матчи будут на /api/matches и /api/matches/live
apiRouter.use('/matches', matchesRouter)

// новости
apiRouter.get('/news', newsHandler)

// health внутри apiRouter
apiRouter.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})
