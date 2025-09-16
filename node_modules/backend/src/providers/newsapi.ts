// backend/src/providers/newsapi.ts
import axios from 'axios'
import { normalize } from '../core/normalize.js'
import type { Category } from '../core/types.js'
import { env } from '../server/env.js'

const mapToNewsApi: Partial<Record<Category, string>> = {
  tech: 'technology',
  sports: 'sports',
  economy: 'business',
  politics: 'general', // у NewsAPI нет 'politics'
  science: 'science',
  showbiz: 'entertainment',
  auto: 'general',
  incidents: 'general',
  esports: 'sports',
}

export async function fetchNewsApi({
  category,
  country = 'ru',
  page = 1,
  q,
}: { category: Category; country?: string; page?: number; q?: string }) {
  const url = new URL('https://newsapi.org/v2/top-headlines')
  url.searchParams.set('category', mapToNewsApi[category] ?? 'general')
  if (country) url.searchParams.set('country', country)
  if (q) url.searchParams.set('q', q)
  url.searchParams.set('page', String(page))
  url.searchParams.set('pageSize', '20')

  // ↓↓↓ ВРЕМЕННЫЕ ЛОГИ (потом можно убрать)
  console.log('[newsapi] GET', url.toString())

  const { data } = await axios.get(url.toString(), {
    headers: { 'X-Api-Key': env.NEWSAPI_KEY }
  })

  console.log('[newsapi] totalResults=', data?.totalResults, 'articles len=', data?.articles?.length)

  const articles = (data.articles ?? []) as any[]
  return articles.map(a => normalize.fromNewsApi(a, category))
}

export async function fetchNewsApiEverything({
  q,
  language = 'ru',
  page = 1,
}: { q: string; language?: string; page?: number }) {
  const url = new URL('https://newsapi.org/v2/everything')
  url.searchParams.set('q', q)
  url.searchParams.set('language', language)
  url.searchParams.set('sortBy', 'publishedAt')
  url.searchParams.set('page', String(page))
  url.searchParams.set('pageSize', '20')

  console.log('[newsapi][everything] GET', url.toString())

  const { data } = await axios.get(url.toString(), {
    headers: { 'X-Api-Key': env.NEWSAPI_KEY }
  })

  console.log('[newsapi][everything] totalResults=', data?.totalResults, 'articles len=', data?.articles?.length)

  const articles = (data.articles ?? []) as any[]
  // Тут мы не знаем точную категорию — пробросим "по смыслу" из запроса
  return articles.map(a => normalize.fromNewsApi(a, 'tech' as Category)) // перезапишем позже в вызывающем месте
}