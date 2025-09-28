import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { apiRouter } from './routes/index.js'
import { logger } from '../utils/logger.js'
import listEndpoints from 'express-list-endpoints'
import { env } from './env.js' // 👈 импортируем env

const app = express()

// CORS с использованием env
const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim())
app.use(
	cors({
		origin: (origin, cb) => {
			if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
				return cb(null, true)
			}
			return cb(new Error(`CORS blocked: ${origin}`))
		},
		credentials: true,
	})
)

// health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// все API через apiRouter
app.use('/api', apiRouter)

// статика
const distPath = path.resolve(process.cwd(), 'frontend/dist')
if (fs.existsSync(distPath)) {
	app.use(express.static(distPath))
	app.use((_req, res) => res.sendFile(path.join(distPath, 'index.html')))
} else {
	logger.warn(`Frontend dist not found at ${distPath}`)
}

// Используем PORT из env
app.listen(env.PORT, '0.0.0.0', () => {
	logger.info(`✅ Server running on http://0.0.0.0:${env.PORT} in ${env.NODE_ENV} mode`)
	console.log(listEndpoints(app))
})
