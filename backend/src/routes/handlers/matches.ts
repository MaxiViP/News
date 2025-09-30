import { Router } from 'express'
import fetch from 'node-fetch'
import { cache } from '../../core/cache.js'

const router = Router()

const FOOTBALL_API = 'https://api.football-data.org/v4'
const API_KEY = process.env.FOOTBALL_API_TOKEN || ''

// Типы ответа API
interface Team {
	id: number
	name: string
	shortName: string
	tla: string
	crest: string
}

interface ScorePart {
	home: number | null
	away: number | null
}

interface Score {
	winner: string | null
	duration: string
	fullTime: ScorePart
	halfTime: ScorePart
}

export interface Match {
	id: number
	utcDate: string
	status: string
	matchday: number
	stage: string
	group: string | null
	homeTeam: Team
	awayTeam: Team
	score: Score
}

export interface FootballResponse {
	filters: Record<string, unknown>
	resultSet: {
		count: number
		first: string
		last: string
		played: number
	}
	competition: {
		id: number
		name: string
		code: string
		type: string
		emblem: string
	}
	matches: Match[]
}

// Универсальная функция для запросов с кэшем
async function fetchFromFootball<T>(endpoint: string, cacheKey: string, ttlSec = 60): Promise<T> {
	return cache.getOrSet(cacheKey, ttlSec, async () => {
		const res = await fetch(`${FOOTBALL_API}${endpoint}`, {
			headers: { 'X-Auth-Token': API_KEY },
		})
		if (!res.ok) {
			throw new Error(`football-data.org error: ${res.status}`)
		}
		return (await res.json()) as T
	})
}

// 📅 Upcoming (SCHEDULED + TIMED)
router.get('/', async (_req, res) => {
	try {
		const data = await fetchFromFootball<FootballResponse>('/matches?status=SCHEDULED,TIMED', 'matches_upcoming', 60)
		res.json({ matches: data.matches || [] })
	} catch (err: any) {
		res.status(500).json({ error: err.message })
	}
})

// ⚡ Live (IN_PLAY + PAUSED)
router.get('/live', async (_req, res) => {
	try {
		const data = await fetchFromFootball<FootballResponse>(
			'/matches?status=IN_PLAY,PAUSED',
			'matches_live',
			20 // live чаще обновляем
		)
		res.json({ matches: data.matches || [] })
	} catch (err: any) {
		res.status(500).json({ error: err.message })
	}
})

export default router
