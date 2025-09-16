import crypto from 'crypto'
import type { Article, Category } from './types.js'

export const normalize = {
  fromNewsApi(a: any, category: Category): Article {
    const id = crypto.createHash('sha1').update(String(a.url || a.title || '')).digest('hex')
    return {
      id,
      title: a.title ?? '',
      summary: a.description ?? '',
      url: a.url ?? '',
      imageUrl: a.urlToImage ?? undefined,
      source: { id: a.source?.id, name: a.source?.name ?? 'Unknown' },
      publishedAt: a.publishedAt ?? new Date().toISOString(),
      category,
    }
  }
}
