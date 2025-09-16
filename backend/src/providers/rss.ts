import Parser from 'rss-parser'
import axios from 'axios'
import * as iconv from 'iconv-lite'
import { normalize } from '../core/normalize.js'
import type { Article, Category } from '../core/types.js'

/** Карта лент по категориям (UTF-8 ленты) */
const FEEDS: Record<Category, string[]> = {
  politics: [
    'https://ria.ru/export/rss2/politics/index.xml',
    'https://lenta.ru/rss', // общий — пригодится как подстраховка
  ],
  economy: [
    'https://ria.ru/export/rss2/economy/index.xml',
    'https://rssexport.rbc.ru/rbcnews/economics/20/full.rss',
  ],
  showbiz: [
    'https://ria.ru/export/rss2/culture/index.xml',
    'https://lenta.ru/rss',
  ],
  science: [
    'https://ria.ru/export/rss2/science/index.xml',
  ],
  tech: [
    'https://habr.com/ru/rss/news/?fl=ru',
    'https://lenta.ru/rss',
  ],
  sports: [
    'https://rsport.ria.ru/export/rss2/archive/index.xml',
    'https://rssexport.rbc.ru/rbcnews/sport/20/full.rss',
  ],
  incidents: [
    'https://ria.ru/export/rss2/incidents/index.xml',
    
    'https://lenta.ru/rss',
  ],
  auto: [
    'https://rssexport.rbc.ru/rbcnews/news/30/full.rss',
    'https://rssexport.rbc.ru/rbcnews/auto/20/full.rss',
  ],
  esports: [
    'https://lenta.ru/rss', // специализированных RU-лент по киберспорту мало — добираем общими
  ],
}

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'NewsPortal/1.0 (+contact: you@example.com)' },
})

/** Скачиваем XML сами (чтобы уметь cp1251), затем парсим */
async function loadAndParse(url: string) {
  const resp = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer', validateStatus: () => true })
  if (resp.status >= 400) throw new Error(`HTTP ${resp.status}`)
  const ct = String(resp.headers['content-type'] || '').toLowerCase()
  const is1251 = ct.includes('windows-1251') || ct.includes('cp1251')
  const xml = is1251
    ? iconv.decode(Buffer.from(resp.data), 'win1251')
    : Buffer.from(resp.data).toString('utf8')
  return parser.parseString(xml)
}

export async function fetchRss(opts: { category: Category; page?: number }): Promise<Article[]> {
  const urls = FEEDS[opts.category] ?? []
  const rows: Article[] = []

  for (const url of urls) {
    try {
      const feed = await loadAndParse(url)
      for (const it of feed.items ?? []) {
        rows.push(normalize.fromRss({
          title: it.title ?? '',
          link: it.link ?? '',
          summary: (it.contentSnippet ?? it.content ?? it.summary ?? '').toString(),
          image: (it as any).enclosure?.url || (it as any)['media:content']?.url,
          pubDate: (it as any).isoDate ?? it.pubDate ?? new Date().toISOString(),
          sourceName: feed.title ?? new URL(url).host,
        }, opts.category))
      }
    } catch (e: any) {
      console.warn('[rss] fail', url, e?.message)
    }
    // Не душим источники
    await new Promise(r => setTimeout(r, 200))
  }

  // Дедуп и «пагинация»
  const seen = new Set<string>()
  const uniq = rows.filter(a => {
    const k = a.url || a.id
    if (!k || seen.has(k)) return false
    seen.add(k); return true
  })

  const PAGE = 20
  const page = Math.max(1, opts.page ?? 1)
  const start = (page - 1) * PAGE
  return uniq.slice(start, start + PAGE)
}
