// import { Router } from 'express'
// import fetch from 'node-fetch'
// import { env } from './env.js' // 👈 импортируем env

// const matchesRouter = Router()

// const FOOTBALL_API = 'https://api.football-data.org/v4'
// const API_KEY = env.FOOTBALL_API_TOKEN || '' // 👈 используем env

// async function fetchFromFootball(endpoint: string): Promise<any> {
// 	if (!API_KEY) {
// 		throw new Error('Football API token not configured')
// 	}

// 	const res = await fetch(`${FOOTBALL_API}${endpoint}`, {
// 		headers: { 'X-Auth-Token': API_KEY },
// 	})
// 	if (!res.ok) throw new Error(`football-data.org error: ${res.status}`)
// 	return res.json()
// }

// // GET /api/matches
// matchesRouter.get('/', async (_req, res) => {
// 	try {
// 		const data = await fetchFromFootball('/matches?status=SCHEDULED,TIMED')
// 		res.json({ matches: data.matches || [] })
// 	} catch (err: any) {
// 		res.status(500).json({ error: err.message })
// 	}
// })

// // GET /api/matches/live
// matchesRouter.get('/live', async (_req, res) => {
// 	try {
// 		const data = await fetchFromFootball('/matches?status=IN_PLAY,PAUSED')
// 		res.json({ matches: data.matches || [] })
// 	} catch (err: any) {
// 		res.status(500).json({ error: err.message })
// 	}
// })

// export default matchesRouter
