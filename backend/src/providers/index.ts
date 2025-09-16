// backend/src/providers/index.ts
import { fetchNewsApi, fetchNewsApiEverything } from './newsapi.js'
import type { Category, Article } from '../core/types.js'

const FALLBACK_Q: Record<Category, { q: string; cat: Category }> = {
  tech:       { q: 'технологии OR technology', cat: 'tech' },
  science:    { q: 'наука OR science',         cat: 'science' },
  sports:     { q: 'спорт OR sports',          cat: 'sports' },
  economy:    { q: 'экономика OR business',    cat: 'economy' },
  politics:   { q: 'политика OR politics',     cat: 'politics' },
  showbiz:    { q: 'шоу-бизнес OR entertainment', cat: 'showbiz' },
  incidents:  { q: 'происшествия OR incidents',   cat: 'incidents' },
  auto:       { q: 'авто OR cars',             cat: 'auto' },
  esports:    { q: 'киберспорт OR esports',    cat: 'esports' },
}

export async function fetchFromProviders(opts: {
  category: Category, country?: string, page?: number, q?: string
}): Promise<Article[]> {
  // 1) Пытаемся через top-headlines
  let a = await fetchNewsApi(opts)

  // 2) Если пусто — fallback на everything с ключевым словом по категории
  if (!a.length && !opts.q) {
    const fb = FALLBACK_Q[opts.category]
    const b = await fetchNewsApiEverything({ q: fb.q, page: opts.page, language: 'ru' })
    // Проставим правильную категорию для карточек
    a = b.map(x => ({ ...x, category: fb.cat }))
  }

  // Дедуп
  const seen = new Set<string>()
  return a.filter(x => {
    const k = x.url || x.id
    if (seen.has(k)) return false
    seen.add(k); return true
  })
}
