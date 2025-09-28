import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { apiRouter } from '../routes/index.js'
import { logger } from '../utils/logger.js'

const app = express()

// ✅ CORS
const allowed = ['https://maxivip-news-9235.twc1.net']
app.use(
	cors({
		origin(origin, cb) {
			if (!origin || allowed.includes(origin)) {
				return cb(null, true)
			}
			return cb(new Error(`CORS blocked: ${origin}`))
		},
		credentials: true,
	})
)

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
	logger.warn(`Frontend dist not found at ${distPath}`)
}

// ✅ запуск сервера
const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, '0.0.0.0', () => {
	logger.info(`✅ Server running on http://0.0.0.0:${PORT}`)
})
