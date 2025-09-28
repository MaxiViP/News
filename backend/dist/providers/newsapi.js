"use strict";
// import axios from 'axios'
// import { normalize } from '../core/normalize.js'
// import type { Category } from '../core/types.js'
// import { env } from '../server/env.js'
// const mapToNewsApi: Partial<Record<Category, string>> = {
//   tech: 'technology',
//   sports: 'sports',
//   economy: 'business',
//   politics: 'general',
//   science: 'science',
//   showbiz: 'entertainment',
//   auto: 'general',
//   incidents: 'general',
//   esports: 'sports',
// }
// const MIN_INTERVAL_MS = 1200; // не чаще 1 запр./~1.2с
// let lastCall = 0;
// const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
// async function rateLimitWait() {
//   const now = Date.now();
//   const wait = Math.max(0, MIN_INTERVAL_MS - (now - lastCall));
//   if (wait > 0) await sleep(wait);
//   lastCall = Date.now();
// }
// async function requestWithBackoff(url: URL, tryNum = 0): Promise<any> {
//   await rateLimitWait();
//   try {
//     const { data } = await axios.get(url.toString(), {
//       headers: { 'X-Api-Key': env.NEWSAPI_KEY }
//     })
//     return data
//   } catch (err: any) {
//     const status = err?.response?.status
//     const retryAfter = Number(err?.response?.headers?.['retry-after'] ?? 0)
//     if ((status === 429 || status >= 500) && tryNum < 2) {
//       const backoff = retryAfter ? retryAfter * 1000 : (500 * (2 ** tryNum)) + Math.floor(Math.random() * 250)
//       console.warn(`[newsapi] ${status} → backoff ${backoff}ms (try ${tryNum + 1})`)
//       await sleep(backoff)
//       return requestWithBackoff(url, tryNum + 1)
//     }
//     throw err
//   }
// }
// export async function fetchNewsApi({
//   category,
//   country = 'ru',
//   page = 1,
//   q,
// }: { category: Category; country?: string; page?: number; q?: string }) {
//   const url = new URL('https://newsapi.org/v2/top-headlines')
//   url.searchParams.set('category', mapToNewsApi[category] ?? 'general')
//   if (country) url.searchParams.set('country', country)
//   if (q) url.searchParams.set('q', q)
//   url.searchParams.set('page', String(page))
//   url.searchParams.set('pageSize', '20')
//   console.log('[newsapi] GET', url.toString())
//   const data = await requestWithBackoff(url)
//   const articles = (data.articles ?? []) as any[]
//   return articles.map(a => normalize.fromNewsApi(a, category))
// }
// // Fallback на /v2/everything — пригодится при пустых выхлопах
// export async function fetchNewsApiEverything({
//   q,
//   language = 'ru',
//   page = 1,
// }: { q: string; language?: string; page?: number }) {
//   const url = new URL('https://newsapi.org/v2/everything')
//   url.searchParams.set('q', q)
//   url.searchParams.set('language', language)
//   url.searchParams.set('sortBy', 'publishedAt')
//   url.searchParams.set('page', String(page))
//   url.searchParams.set('pageSize', '20')
//   console.log('[newsapi][everything] GET', url.toString())
//   const data = await requestWithBackoff(url)
//   const articles = (data.articles ?? []) as any[]
//   return articles.map(a => normalize.fromNewsApi(a, 'tech' as Category))
// }
//# sourceMappingURL=newsapi.js.map