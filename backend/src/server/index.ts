import 'dotenv/config'
import express from 'express'
import cors from 'cors'

// ✅ обязательно указываем .js, чтобы tsc под NodeNext не ругался
import { apiRouter } from './routes/index.js'

const app = express()

// --- CORS (разрешаем фронт с домена timeweb)
const allowed = (process.env.CORS_ORIGIN ?? '').split(',').filter(Boolean)
app.use(
	cors({
		origin: (origin, cb) => {
			if (!origin || allowed.length === 0 || allowed.includes(origin)) {
				return cb(null, true)
			}
			return cb(new Error(`CORS blocked: ${origin}`))
		},
		credentials: true,
	})
)

// --- API endpoints
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

// --- PORT
const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, '0.0.0.0', () => {
	console.log(`✅ API server running on http://0.0.0.0:${PORT}`)
})
