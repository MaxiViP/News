import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { apiRouter } from '../routes/index.js'
import { logger } from '../utils/logger.js'

const app = express()

// ✅ CORS — читаем список из env
const allowedOrigins = (
	process.env.CORS_ORIGIN || 'http://localhost:5173,https://newsandnews.ru,https://maxivip-news-9235.twc1.net'
)
	.split(',')
	.map(s => s.trim())
	.filter(Boolean)

logger.info(`🔐 Allowed origins: ${allowedOrigins.join(', ') || 'none'}`)

app.use(
	cors({
		origin: function (origin, callback) {
			// Разрешаем запросы без origin (например, из мобильных приложений или Postman)
			if (!origin) return callback(null, true)

			if (allowedOrigins.includes(origin)) {
				return callback(null, true)
			} else {
				logger.warn(`❌ CORS blocked: ${origin}. Allowed: ${allowedOrigins.join(', ')}`)
				return callback(new Error(`CORS blocked: ${origin}`))
			}
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	})
)

// ✅ Обработка preflight запросов
app.options('*', cors())

// ✅ healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ✅ подключаем все API роуты (включая /matches и /matches/live)
app.use('/api', apiRouter)

// ✅ фронтенд (Vue dist)
const distPath = path.resolve(process.cwd(), 'frontend/dist')
if (fs.existsSync(distPath)) {
	app.use(express.static(distPath))
	// SPA fallback
	app.use((_req, res) => {
		res.sendFile(path.join(distPath, 'index.html'))
	})
} else {
	logger.warn(`⚠️ Frontend dist not found at ${distPath}`)
}

// ✅ запуск сервера
const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, '0.0.0.0', () => {
	logger.info(`✅ Server running on http://0.0.0.0:${PORT}`)
	logger.info(`🔐 CORS enabled for: ${allowedOrigins.join(', ')}`)
})
