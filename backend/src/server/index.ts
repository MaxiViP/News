import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { apiRouter } from './routes/index.js'

const app = express()

// ✅ Разрешаем несколько доменов через запятую
const allowed = (process.env.CORS_ORIGIN ?? '').split(',')
app.use(cors({
  origin(origin, cb) {
    // Если origin нет (например, Postman) — пропускаем
    if (!origin) return cb(null, true)
    if (allowed.includes(origin)) return cb(null, true)
    return cb(new Error(`CORS: ${origin} not allowed`))
  },
  credentials: false,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

const PORT = Number(process.env.PORT ?? 8080)
app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`)
})
