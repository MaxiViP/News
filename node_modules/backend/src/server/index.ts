import express from 'express'
import cors from 'cors'
import { env } from './env.js'
import { newsHandler } from './routes.js'

const app = express()
app.use(cors({ origin: env.CORS_ORIGIN }))
app.get('/api/news', newsHandler)

app.listen(env.PORT, () => {
  console.log(`API on http://localhost:${env.PORT}`)
})
