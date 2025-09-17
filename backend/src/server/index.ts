import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { apiRouter } from './routes/index.js'

const app = express()

// ✅ CORS (ограничения по доменам, можно убрать в продакшене если фронт и бэк вместе)
const allowed = (process.env.CORS_ORIGIN ?? '').split(',')
app.use(
	cors({
		origin(origin, cb) {
			if (!origin) return cb(null, true)
			if (allowed.includes(origin)) return cb(null, true)
			return cb(new Error(`CORS: ${origin} not allowed`))
		},
		credentials: false,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

// ✅ API endpoints
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

// ✅ Путь до собранного фронта (dist)
const distPath = path.resolve(__dirname, '../../frontend/dist')
app.use(express.static(distPath))

// ✅ SPA fallback (Vue router)
app.use((_req, res) => {
	res.sendFile(path.join(distPath, 'index.html'))
})

// ✅ Запуск
const PORT = Number(process.env.PORT) || 8080

app.listen(PORT, '0.0.0.0', () => {
	console.log(`✅ Server listening on http://0.0.0.0:${PORT}`)
})
