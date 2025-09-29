import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'
import { apiRouter } from '../routes/index.js'
import { logger } from '../utils/logger.js'

const app = express()

// ✅ ВСЕ разрешённые origins
const allowedOrigins = [
	'http://localhost:5173',
	'https://newsandnews.ru',
	'http://newsandnews.ru',
	'https://maxivip-news-5c50.twc1.net',
	'https://maxivip-news-9235.twc1.net', // ДОБАВЬТЕ ЭТОТ!
]

// ✅ Простой CORS - разрешить всё для продакшена
// ✅ Временное решение - разрешить всё
app.use(cors({
  origin: true, // разрешить ВСЕ origins
  credentials: true,
}))

// ✅ Добавьте логирование ВСЕХ запросов для отладки
app.use((req, res, next) => {
	logger.info(`🌐 ${req.method} ${req.url} from origin: ${req.headers.origin}`)
	next()
})

// ✅ API healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ✅ Football-data.org proxy
const FOOTBALL_API = 'https://api.football-data.org/v4'
const FOOTBALL_TOKEN = process.env.FOOTBALL_API_TOKEN ?? ''

app.get('/api/matches', async (_req, res) => {
	try {
		logger.info('📡 Fetching matches from football-data.org')
		const r = await fetch(`${FOOTBALL_API}/matches?status=SCHEDULED,TIMED`, {
			headers: { 'X-Auth-Token': FOOTBALL_TOKEN },
		})
		const data = await r.json()
		logger.info('✅ Matches fetched successfully')
		res.json(data)
	} catch (err: any) {
		logger.error('❌ FD proxy error (SCHEDULED):', err?.message || err)
		res.status(500).json({ error: 'proxy_failed', message: err.message })
	}
})

app.get('/api/matches/live', async (_req, res) => {
	try {
		logger.info('📡 Fetching LIVE matches from football-data.org')
		const r = await fetch(`${FOOTBALL_API}/matches?status=IN_PLAY,PAUSED`, {
			headers: { 'X-Auth-Token': FOOTBALL_TOKEN },
		})
		const data = await r.json()
		logger.info('✅ Live matches fetched successfully')
		res.json(data)
	} catch (err: any) {
		logger.error('❌ FD proxy error (LIVE):', err?.message || err)
		res.status(500).json({ error: 'proxy_failed', message: err.message })
	}
})

app.use('/api', apiRouter)

// ✅ Отдаём фронтенд dist
const distPath = path.resolve(process.cwd(), 'frontend/dist')
if (fs.existsSync(distPath)) {
	app.use(express.static(distPath))
	app.use((_req, res) => {
		res.sendFile(path.join(distPath, 'index.html'))
	})
} else {
	logger.warn(`⚠️ Frontend dist not found at ${distPath}`)
}

const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, '0.0.0.0', () => {
	logger.info(`✅ Server running on http://0.0.0.0:${PORT}`)
	logger.info(`🔐 Allowed CORS origins: ${allowedOrigins.join(', ')}`)
})
