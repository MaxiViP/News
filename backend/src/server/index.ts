import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { apiRouter } from './routes/index.js'

const app = express()

// ✅ CORS (ограничиваем при необходимости)
const allowed = (process.env.CORS_ORIGIN ?? '').split(',').filter(Boolean)
app.use(
	cors({
		origin(origin, cb) {
			if (!origin || allowed.length === 0 || allowed.includes(origin)) {
				return cb(null, true)
			}
			return cb(new Error(`CORS blocked: ${origin}`))
		},
		credentials: true,
	})
)

// ✅ API
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

// ✅ Раздаём фронт (dist из frontend)
const distPath = path.resolve(process.cwd(), '../frontend/dist')
app.use(express.static(distPath))

// ✅ SPA fallback (Vue Router history mode)
app.use((_req, res) => {
	res.sendFile(path.join(distPath, 'index.html'))
})

// ✅ PORT (0.0.0.0 важно для контейнеров Timeweb)
const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, '0.0.0.0', () => {
	console.log(`✅ Server running on http://0.0.0.0:${PORT}`)
})

// ✅ Глобальный catch
process.on('uncaughtException', err => {
	console.error('❌ Uncaught Exception:', err)
})
process.on('unhandledRejection', err => {
	console.error('❌ Unhandled Rejection:', err)
})
