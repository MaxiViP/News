import cors from 'cors'

const allowedOrigins = (
	process.env.CORS_ORIGIN || 'http://localhost:5173,https://newsandnews.ru,https://maxivip-news-9235.twc1.net'
)
	.split(',')
	.map(s => s.trim())
	.filter(Boolean)

console.log('🔐 CORS Allowed origins:', allowedOrigins)

export const corsMiddleware = cors({
	origin: function (origin, callback) {
		// Разрешаем запросы без origin
		if (!origin) return callback(null, true)

		if (allowedOrigins.includes(origin)) {
			return callback(null, true)
		} else {
			console.log(`❌ CORS blocked: ${origin}. Allowed: ${allowedOrigins.join(', ')}`)
			return callback(new Error(`CORS blocked: ${origin}`))
		}
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
})
