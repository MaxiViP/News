import type { Request, Response } from 'express'
import { fetchFromProviders } from '../providers/index.js'
import { cache } from '../core/cache.js'
import { z } from 'zod'

const QuerySchema = z.object({
  category: z.enum(['politics','economy','showbiz','science','tech','sports','incidents','auto','esports']),
  country: z.string().default('ru'),
  page: z.coerce.number().min(1).default(1),
  q: z.string().optional(),
})

export async function newsHandler(req: Request, res: Response) {
  const parsed = QuerySchema.safeParse(req.query)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const { category, country, page, q } = parsed.data
  const key = `news:${category}:${country}:${page}:${q ?? ''}`
  const cached = await cache.get<{ items: any[]; page: number; hasMore: boolean }>(key)
  if (cached) return res.json(cached)

  const items = await fetchFromProviders({ category, country, page, q })
  const payload = { items, page, hasMore: items.length > 0 }
  await cache.set(key, payload, 60)
  res.json(payload)
}
