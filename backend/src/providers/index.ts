import type { Category, Article } from '../core/types.js'
import { fetchRss } from './rss.js'

type Opts = { category: Category; country?: string; page?: number; q?: string }

export async function fetchFromProviders(opts: Opts): Promise<Article[]> {
  const seen = new Set<string>()
  const uniq = (arr: Article[]) => arr.filter(x => {
    const k = x.url || x.id
    if (seen.has(k)) return false
    seen.add(k); return true
  })

  // 1) Для РФ — пробуем RSS (без лимитов)
  if ((opts.country ?? 'ru') === 'ru' && !opts.q) {
    const rss = await fetchRss({ category: opts.category, page: opts.page ?? 1 })
    if (rss.length) return uniq(rss)
  }

  return []
}
