import { Router } from 'express'
import { newsHandler } from '../handlers/news.js'

export const apiRouter = Router()

// ✅ теперь это будет доступно по /api/news
// потому что в server/index.ts стоит app.use('/api', apiRouter)
apiRouter.get('/news', newsHandler)

// можно добавить healthcheck (удобно для проверки)
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})
