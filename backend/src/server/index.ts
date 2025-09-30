import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { apiRouter } from '../routes/index.js'
import { logger } from '../utils/logger.js'
import { env } from './env.js'

const app = express()

// ✅ CORS: разрешаем только указанные в .env домены
app.use(
	cors({
		origin(origin, callback) {
			// если origin не указан (например, при curl) → пропускаем
			if (!origin) return callback(null, true)

			if (env.CORS_ORIGIN.includes(origin)) {
				return callback(null, true)
			}

			logger.warn(`❌ CORS blocked for origin: ${origin}`)
			return callback(new Error('Not allowed by CORS'))
		},
		credentials: true,
	})
)

// ✅ Логирование всех запросов
app.use((req, _res, next) => {
	logger.info(`🌐 ${req.method} ${req.url} from origin: ${req.headers.origin}`)
	next()
})

// ✅ API healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ✅ Подключение всех API роутов
app.use('/api', apiRouter)

// ✅ Отдаём фронтенд dist (SPA fallback)
const distPath = path.resolve(process.cwd(), 'frontend/dist')
if (fs.existsSync(distPath)) {
	app.use(express.static(distPath))
	app.use((_req, res) => {
		res.sendFile(path.join(distPath, 'index.html'))
	})
} else {
	logger.warn(`⚠️ Frontend dist not found at ${distPath}`)
}

const PORT = env.PORT
app.listen(PORT, '0.0.0.0', () => {
	logger.info(`✅ Server running on http://0.0.0.0:${PORT}`)
	logger.info(`🔐 Allowed CORS origins: ${env.CORS_ORIGIN.join(', ')}`)
})
