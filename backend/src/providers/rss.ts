import Parser from 'rss-parser'
import axios from 'axios'
import * as iconv from 'iconv-lite'
import { normalize } from '../core/normalize.js'
import type { Article, Category } from '../core/types.js'

/** Карта лент по категориям (UTF-8 ленты) */
const FEEDS: Record<Category, string[]> = {
	news: [
		'https://ria.ru/export/rss2/culture/index.xml',
		'https://news.rambler.ru/starlife/',
		'https://lenta.ru/rss',
		'https://iz.ru/xml/rss/all.xml ',
		'https://rssexport.rbc.ru/rbcnews/news/30/full.rss',
		'http://www.infox.ru/themes/auto/rss.xml',
		'https://www.mk.ru/rss/news/index.xml',

		'https://news-rss.ru/katalog-rss-kanalov/avto/',
		' http://www.gazeta.ru/export/rss/autonews.xml',
		'https://www.autostat.ru/news/rss/3/',
		' http://www.gazeta.ru/export/rss/auto.xml',

		'https://www.goha.ru/feeds/rss',
		'cyber.sports.ru/docs/rss',
		'https://www.goha.ru/rss/:Epic Games',
		'https://www.goha.ru/rss/:VALORANT',
		'https://www.goha.ru/rss/:Стратегия',
		'https://www.goha.ru/rss/:World of Warcraft',
		'https://www.goha.ru/rss/:Sony',
		'https://www.goha.ru/rss/:Киберспорт',
		'https://www.goha.ru/rss/:League of Legends',
		'https://www.goha.ru/rss/:Ubisoft',
		'https://www.goha.ru/rss/:PUBG',
		'https://www.goha.ru/rss/:The International 2025',

		'https://ria.ru/export/rss2/science/index.xml',
		'https://www.mk.ru/rss/science/index.xml',
		'https://govoritmoskva.ru/rss/news/23/',

		'https://habr.com/ru/rss/news/?fl=ru',
		'https://govoritmoskva.ru/rss/news/5/',

		'https://rsport.ria.ru/export/rss2/archive/index.xml',
		'https://rssexport.rbc.ru/rbcnews/sport/20/full.rss',
		'https://govoritmoskva.ru/rss/news/10/',
		'https://www.mk.ru/rss/sport/index.xml',
	],
	politics: ['https://ria.ru/export/rss2/politics/index.xml', 'https://www.mk.ru/rss/politics/index.xml'],
	economy: [
		'https://ria.ru/export/rss2/economy/index.xml',
		'https://rssexport.rbc.ru/rbcnews/economics/20/full.rss',
		'https://govoritmoskva.ru/rss/news/2/',
		'https://www.mk.ru/rss/economics/index.xml',
	],

	science: [
		'https://ria.ru/export/rss2/science/index.xml',
		'https://www.mk.ru/rss/science/index.xml',
		'https://govoritmoskva.ru/rss/news/23/',
	],
	tech: ['https://habr.com/ru/rss/news/?fl=ru', 'https://govoritmoskva.ru/rss/news/5/'],
	sports: [
		'https://rsport.ria.ru/export/rss2/archive/index.xml',
		'https://rssexport.rbc.ru/rbcnews/sport/20/full.rss',
		'https://govoritmoskva.ru/rss/news/10/',
		'https://www.mk.ru/rss/sport/index.xml',
	],
	incidents: [
		'https://ria.ru/export/rss2/incidents/index.xml',
		'https://www.mk.ru/rss/incident/index.xml',
		'https://govoritmoskva.ru/rss/news/7/',
	],
	auto: [
		'https://news-rss.ru/katalog-rss-kanalov/avto/',
		' http://www.gazeta.ru/export/rss/autonews.xml',
		'https://www.autostat.ru/news/rss/3/',
		' http://www.gazeta.ru/export/rss/auto.xml',
	],
	esports: [
		'https://www.goha.ru/feeds/rss',
		'cyber.sports.ru/docs/rss',
		'https://www.goha.ru/rss/:Epic Games',
		'https://www.goha.ru/rss/:VALORANT',
		'https://www.goha.ru/rss/:Стратегия',
		'https://www.goha.ru/rss/:Star Wars',
		'https://www.goha.ru/rss/:The Elder Scrolls Online',
		'https://www.goha.ru/rss/:World of Warcraft',
		'https://www.goha.ru/rss/:Naruto',
		'https://www.goha.ru/rss/:Sony',
		'https://www.goha.ru/rss/:Киберспорт',
		'https://www.goha.ru/rss/:League of Legends',
		'https://www.goha.ru/rss/:Star Trek',
		'https://www.goha.ru/rss/:Ubisoft',
		'https://www.goha.ru/rss/:PUBG',
		'https://www.goha.ru/rss/:Виртуальный автоспорт',
		'https://www.goha.ru/rss/:Mortal Online 2',
		'https://www.goha.ru/rss/:Genshin Impact',
		'https://www.goha.ru/rss/:The International 2025',
	],
}

const parser = new Parser({
	timeout: 150000,
	headers: { 'User-Agent': 'NewsPortal/1.0 (+contact: you@example.com)' },
})

/** Вытаскиваем первую картинку из description/content */
function extractImage(it: any): string | null {
	const html = it['content:encoded'] || it.content || it.description
	if (typeof html === 'string') {
		const m = html.match(/<img[^>]+src="([^">]+)"/i)
		if (m) return m[1]
	}
	return null
}

/** Скачиваем XML сами (чтобы уметь cp1251), затем парсим */
async function loadAndParse(url: string) {
	const resp = await axios.get<ArrayBuffer>(url, {
		responseType: 'arraybuffer',
		validateStatus: () => true,
	})
	if (resp.status >= 400) throw new Error(`HTTP ${resp.status}`)
	const ct = String(resp.headers['content-type'] || '').toLowerCase()
	const is1251 = ct.includes('windows-1251') || ct.includes('cp1251')
	const xml = is1251 ? iconv.decode(Buffer.from(resp.data), 'win1251') : Buffer.from(resp.data).toString('utf8')
	return parser.parseString(xml)
}

export async function fetchRss(opts: {
	category: Category
	page?: number
	mode?: 'random' | 'byDate'
}): Promise<Article[]> {
	const urls = FEEDS[opts.category] ?? []
	const rows: Article[] = []

	for (const url of urls) {
		try {
			const feed = await loadAndParse(url)
			for (const it of feed.items ?? []) {
				const img = (it as any).enclosure?.url || (it as any)['media:content']?.url || extractImage(it)

				rows.push(
					normalize.fromRss(
						{
							title: it.title ?? '',
							link: it.link ?? '',
							summary: (it.contentSnippet ?? it.content ?? it.summary ?? '').toString(),
							image: img,
							publishedAt: (it as any).isoDate ?? it.pubDate ?? new Date().toISOString(),
							sourceName: feed.title ?? new URL(url).host,
						},
						opts.category
					)
				)
			}
		} catch (e: any) {
			console.warn('[rss] fail', url, e?.message)
		}
		await new Promise(r => setTimeout(r, 200)) // не душим источники
	}

	// 🔄 Дедуп
	const seen = new Set<string>()
	let uniq = rows.filter(a => {
		const k = a.url || a.id
		if (!k || seen.has(k)) return false
		seen.add(k)
		return true
	})

	// 🔧 Сортировка/перемешивание
	if (opts.mode === 'random') {
		uniq = shuffle(uniq)
	} else {
		uniq.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
	}

	// 📄 Пагинация
	const PAGE = 60
	const page = Math.max(1, opts.page ?? 1)
	const start = (page - 1) * PAGE
	return uniq.slice(start, start + PAGE)
}

/** Перемешивание Фишера-Йетса */
function shuffle<T>(arr: T[]): T[] {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}
