import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { apiRouter } from './routes/index.js'

const app = express()

// CORS
app.use(cors())

// API
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

// Раздача фронта
const distPath = path.resolve(__dirname, '../../frontend/dist')
app.use(express.static(distPath))

// SPA fallback
app.use((_req, res) => {
	res.sendFile(path.join(distPath, 'index.html'))
})

// PORT
const PORT = Number(process.env.PORT) || 8080

// Запуск
app.listen(PORT, '0.0.0.0', () => {
	console.log(`✅ Server running on http://0.0.0.0:${PORT}`)
})

// Глобальный catch
process.on('uncaughtException', err => {
	console.error('❌ Uncaught Exception:', err)
})
process.on('unhandledRejection', err => {
	console.error('❌ Unhandled Rejection:', err)
})
