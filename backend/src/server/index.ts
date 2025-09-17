import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { apiRouter } from './routes/index'

const app = express()

// пока без строгих настроек
app.use(cors())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, '0.0.0.0', () => {
	console.log(`✅ API server running on http://0.0.0.0:${PORT}`)
})
