import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { apiRouter } from './routes/index.js'

const app = express()

const ORIGIN = process.env.CORS_ORIGIN ?? '*'
app.use(cors({
  origin: ORIGIN,
  credentials: false,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))
// app.options('*', cors()) // ← УДАЛИ или замени на строку ниже
// app.options('/(.*)', cors())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

const PORT = Number(process.env.PORT ?? 8080)
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
