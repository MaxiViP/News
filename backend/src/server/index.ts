import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { apiRouter } from './routes/index.js'

const app = express()

// ✅ CORS (пока можно разрешить всем, чтобы проверить)
app.use(cors({ origin: '*' }))

// ✅ API endpoints
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

// ✅ PORT (берём из переменной окружения, fallback 8080)
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080

app.listen(PORT, '0.0.0.0', () => {
	console.log(`✅ API Server running on http://0.0.0.0:${PORT}`)
})

// ✅ Глобальные обработчики ошибок
process.on('uncaughtException', err => {
	console.error('❌ Uncaught Exception:', err)
})
process.on('unhandledRejection', err => {
	console.error('❌ Unhandled Rejection:', err)
})
