import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { apiRouter } from './routes/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// ✅ CORS (для разработки, можно убрать в продакшене если фронт и бэк на одном домене)
const allowed = (process.env.CORS_ORIGIN ?? '').split(',')
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true)
    if (allowed.includes(origin)) return cb(null, true)
    return cb(new Error(`CORS: ${origin} not allowed`))
  },
  credentials: false,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

// ✅ API
app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api', apiRouter)

// ✅ Раздаём собранный фронт
const distPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(distPath))

// ✅ SPA-fallback (чтобы работали /category/... и любые роуты Vue)
app.use((_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})


const PORT = Number(process.env.PORT ?? 8080)
app.listen(PORT, () => {
  console.log(`✅ Backend + Frontend listening on http://localhost:${PORT}`)
})
