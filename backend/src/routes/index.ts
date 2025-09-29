// src/routes/index.ts
import { Router } from 'express'
import { newsHandler } from './handlers/news.js'
import matchesRouter from './handlers/matches.js'

export const apiRouter = Router()

// Новости
apiRouter.get('/news', newsHandler)

// Матчи
apiRouter.use('/matches', matchesRouter)

// Health-check
apiRouter.get('/health', (_req, res) => {
	res.json({ status: 'ok' })
})

// Sitemap.xml
apiRouter.get('/sitemap.xml', async (_req, res) => {
	const baseUrl = 'https://newsandnews.ru'

	const staticPages = [
		{ url: '/', priority: '1.0', changefreq: 'hourly' },
		{ url: '/contacts', priority: '0.6', changefreq: 'monthly' },
		{ url: '/currency', priority: '0.7', changefreq: 'daily' },
	]

	const categories = ['politics', 'economy', 'auto', 'sports', 'science', 'tech', 'incidents', 'esports']

	let urls = staticPages
		.map(
			p => `
		<url>
			<loc>${baseUrl}${p.url}</loc>
			<priority>${p.priority}</priority>
			<changefreq>${p.changefreq}</changefreq>
			<lastmod>${new Date().toISOString()}</lastmod>
		</url>`
		)
		.join('')

	urls += categories
		.map(
			c => `
		<url>
			<loc>${baseUrl}/category/${c}</loc>
			<priority>0.9</priority>
			<changefreq>hourly</changefreq>
			<lastmod>${new Date().toISOString()}</lastmod>
		</url>`
		)
		.join('')

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		${urls}
	</urlset>`

	res.header('Content-Type', 'application/xml')
	res.send(xml)
})
