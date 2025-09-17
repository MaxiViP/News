import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { apiRouter } from './routes/index.js'

const app = express()

// CORS (для теста пока разрешим всем)
app.use(cors({ origin: '*' }))

// API
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

// PORT (берём из окружения)
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080

// Запуск (обязательно 0.0.0.0 для Timeweb)
app.listen(PORT, '0.0.0.0', () => {
	console.log(`✅ API running on http://0.0.0.0:${PORT}`)
})

// Глобальный catch
process.on('uncaughtException', err => {
	console.error('❌ Uncaught Exception:', err)
})
process.on('unhandledRejection', err => {
	console.error('❌ Unhandled Rejection:', err)
})
