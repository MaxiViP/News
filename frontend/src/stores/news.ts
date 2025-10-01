import { defineStore } from 'pinia'
import { api } from '../services/api'

type Category = 'politics' | 'economy' | 'showbiz' | 'science' | 'tech' | 'sports' | 'incidents' | 'auto' | 'esports'

type Filters = { category: Category; country: string; q?: string }

interface Article {
	id?: string
	url?: string
	title: string
	summary?: string
	content?: string
	imageUrl?: string
	source?: { name?: string }
	publishedAt?: string
	[key: string]: any
}

export const useNews = defineStore('news', {
	state: () => ({
		items: [] as Article[], // показываем на экране
		allItems: [] as Article[], // все загруженные новости (все категории)
		loading: false,
		page: 1,
		hasMore: true,
		filters: { category: 'tech' as Category, country: 'ru' } as Filters,
	}),
	actions: {
		// 📥 загрузка только одной категории (для списков категорий)
		async load(reset = false) {
			if (this.loading) return
			this.loading = true
			try {
				const page = reset ? 1 : this.page

				const res = await api.get('/news', {
					params: {
						category: this.filters.category,
						country: this.filters.country,
						page,
					},
				})

				const data = res.data

				if (reset) {
					this.allItems = data.items
				} else {
					this.allItems = [...this.allItems, ...data.items]
				}

				this.items = reset ? data.items : [...this.items, ...data.items]

				this.page = page + 1
				this.hasMore = data.items?.length > 0
			} catch (err) {
				console.error('Ошибка загрузки новостей:', err)
			} finally {
				this.loading = false
			}
		},

		// 📥 загрузка всех категорий параллельно (для глобального поиска)
		async loadAllCategories() {
			if (this.loading) return
			this.loading = true
			try {
				const categories: Category[] = [
					'politics',
					'economy',
					'showbiz',
					'science',
					'tech',
					'sports',
					'incidents',
					'auto',
					'esports',
				]

				// запускаем все запросы параллельно
				const requests = categories.map(cat =>
					api.get('/news', {
						params: { category: cat, country: this.filters.country, page: 1 },
					})
				)

				const results = await Promise.all(requests)

				// собираем все статьи
				this.allItems = results.flatMap(res => res.data.items || [])

				this.items = this.allItems
			} catch (err) {
				console.error('Ошибка загрузки всех категорий:', err)
			} finally {
				this.loading = false
			}
		},

		// 🔍 глобальный поиск по всем категориям
		async search(query: string) {
			// ⚡ всегда подгружаем все категории для поиска
			if (!this.allItems.length || this.allItems.length < 50) {
				// проверка чтобы не гонять каждый раз, а только если пусто/мало
				await this.loadAllCategories()
			}

			if (!query) {
				this.items = this.allItems
				return
			}

			const normalizedQuery = this.normalize(query)
			const tokens = normalizedQuery.split(' ')

			this.items = this.allItems
				.map(a => {
					const score = this.scoreArticle(a, tokens)
					return { a, score }
				})
				.filter(x => x.score > 0)
				.sort((a, b) => b.score - a.score)
				.map(x => x.a)
		},
		// 📌 нормализация строки (убираем регистр, диакритику, лишние символы)
		normalize(s = '') {
			return s
				.toLowerCase()
				.normalize('NFKD')
				.replace(/[\u0300-\u036f]/g, '') // убрать диакритику
				.replace(/[^\p{L}\p{N}\s]+/gu, ' ') // убрать лишние символы
				.replace(/\s+/g, ' ')
				.trim()
		},

		// 📌 подсчёт релевантности статьи
		scoreArticle(article: Article, tokens: string[]) {
			const text = this.normalize(
				`${article.title ?? ''} ${article.summary ?? ''} ${article.content ?? ''} ${article.source?.name ?? ''}`
			)

			let score = 0
			let matched = false

			for (const t of tokens) {
				if (!t) continue

				// точные совпадения слова → +10
				const re = new RegExp(`\\b${t}\\b`, 'g')
				const exact = (text.match(re) || []).length
				if (exact > 0) {
					score += 10 * exact
					matched = true
					continue
				}

				// подстрочное совпадение → +3
				if (text.includes(t)) {
					score += 3
					matched = true
				}
			}

			return matched ? score : 0
		},

		// 📌 смена категории
		setCategory(cat: Category) {
			this.filters.category = cat
			this.page = 1
		},
	},
})
