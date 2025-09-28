// import cors from 'cors'

// const allowedOrigins = (process.env.CORS_ORIGIN || '')
// 	.split(',')
// 	.map(s => s.trim())
// 	.filter(Boolean)

// // fallback на случай, если переменная окружения не задана
// if (allowedOrigins.length === 0) {
// 	allowedOrigins.push('http://localhost:5173', 'https://newsandnews.ru', 'https://maxivip-news-9235.twc1.net')
// }

// console.log('🔐 CORS Allowed origins:', allowedOrigins)

// export const corsMiddleware = cors({
// 	origin(origin, callback) {
// 		console.log('🌍 Incoming origin:', origin)

// 		// разрешаем запросы без Origin (например, Postman или curl)
// 		if (!origin) return callback(null, true)

// 		// проверка: начинаются ли строки одинаково (чтобы не споткнуться на "/")
// 		if (allowedOrigins.some(o => origin.startsWith(o))) {
// 			console.log('✅ CORS allowed:', origin)
// 			return callback(null, true)
// 		} else {
// 			console.log(`❌ CORS blocked: ${origin}. Allowed: ${allowedOrigins.join(', ')}`)
// 			return callback(new Error(`CORS blocked: ${origin}`))
// 		}
// 	},
// 	credentials: true,
// 	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// 	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
// })
