// Категории новостей
export type Category =
	| 'politics'
	| 'economy'
	| 'news'
	| 'science'
	| 'tech'
	| 'sports'
	| 'incidents'
	| 'auto'
	| 'esports'

// Тип новости
export interface Article {
	id: string
	title: string
	summary?: string
	url: string
	imageUrl?: string
	source: { id?: string; name: string }
	publishedAt: string // ISO
	category: Category
	country?: string
	language?: string
}

// ====================
// Типы футбольных матчей
// ====================

export interface Team {
	id: number
	name: string
	shortName: string
	tla: string
	crest: string
}

export interface ScorePart {
	home: number | null
	away: number | null
}

export interface Score {
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
