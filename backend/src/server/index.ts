import express from 'express'

const app = express()

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const PORT = Number(process.env.PORT) || 8080
app.listen(PORT, '0.0.0.0', () => {
	console.log(`✅ Healthcheck server running on http://0.0.0.0:${PORT}`)
})
