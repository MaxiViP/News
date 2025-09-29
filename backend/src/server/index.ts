import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'
import { apiRouter } from '../routes/index.js'
import { logger } from '../utils/logger.js'

const app = express()

// ✅ Разрешённые origin для CORS
const allowed = [
	'http://localhost:5173', // локалка
	'https://newsandnews.ru', // фронт продакшен
]

logger.info(`🔐 Allowed origins: ${allowed.join(', ')}`)

app.use(
	cors({
		origin(origin, cb) {
			if (!origin || allowed.includes(origin)) {
				return cb(null, true)
			}
			logger.warn(`❌ CORS blocked: ${origin}`)
			return cb(new Error(`CORS blocked: ${origin}`))
		},
		credentials: true,
	})
)

// ✅ API healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ✅ Football-data.org proxy
const FOOTBALL_API = 'https://api.football-data.org/v4'
const FOOTBALL_TOKEN = process.env.FOOTBALL_API_TOKEN ?? ''

app.get('/api/matches', async (_req, res) => {
	try {
		const r = await fetch(`${FOOTBALL_API}/matches?status=SCHEDULED,TIMED`, {
			headers: { 'X-Auth-Token': FOOTBALL_TOKEN },
		})
		const data = await r.json()
		res.json(data)
	} catch (err: any) {
		logger.error('FD proxy error (SCHEDULED):', err?.message || err)
		res.status(500).json({ error: 'proxy_failed' })
	}
})

app.get('/api/matches/live', async (_req, res) => {
	try {
		const r = await fetch(`${FOOTBALL_API}/matches?status=IN_PLAY,PAUSED`, {
			headers: { 'X-Auth-Token': FOOTBALL_TOKEN },
		})
		const data = await r.json()
		res.json(data)
	} catch (err: any) {
		logger.error('FD proxy error (LIVE):', err?.message || err)
		res.status(500).json({ error: 'proxy_failed' })
	}
})

// ✅ Подключаем твои API роуты
app.use('/api', apiRouter)

// ✅ Отдаём фронтенд dist
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

// ✅ Запуск сервера
const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, '0.0.0.0', () => {
	logger.info(`✅ Server running on http://0.0.0.0:${PORT}`)
})
