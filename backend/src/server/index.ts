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
const allowedOrigins = [
	'http://localhost:5173',
	'https://newsandnews.ru',
	'http://newsandnews.ru', // на всякий случай добавить http
]

// Более гибкая проверка CORS
app.use(
	cors({
		origin: function (origin, callback) {
			// Разрешаем запросы без origin (например, из мобильных приложений, Postman)
			if (!origin) return callback(null, true)

			// Проверяем точное совпадение
			if (allowedOrigins.includes(origin)) {
				return callback(null, true)
			}

			// Также проверяем по домену (на случай поддоменов)
			try {
				const originHostname = new URL(origin).hostname
				const isAllowed = allowedOrigins.some(allowed => {
					try {
						return new URL(allowed).hostname === originHostname
					} catch {
						return allowed.includes(originHostname)
					}
				})

				if (isAllowed) {
					return callback(null, true)
				}
			} catch (e) {
				// Если не удалось распарсить URL, продолжаем
			}

			logger.warn(`❌ CORS blocked: ${origin}`)
			callback(new Error(`CORS blocked: ${origin}`))
		},
		credentials: true,
	})
)

// ✅ Или более простое решение - разрешить все в продакшене
app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'production'
				? ['https://newsandnews.ru', 'http://newsandnews.ru']
				: ['http://localhost:5173', 'https://newsandnews.ru'],
		credentials: true,
	})
)

// Остальной код без изменений...
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
})
