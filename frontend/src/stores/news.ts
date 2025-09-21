import { defineStore } from 'pinia'
import { api } from '../services/api'

type Category = 'politics' | 'economy' | 'showbiz' | 'science' | 'tech' | 'sports' | 'incidents' | 'auto' | 'esports'

type Filters = { category: Category; country: string; q?: string }

export const useNews = defineStore('news', {
	state: () => ({
		items: [] as any[], // то, что показываем на экране
		allItems: [] as any[], // все загруженные новости
		loading: false,
		page: 1,
		hasMore: true,
		filters: { category: 'tech' as Category, country: 'ru' } as Filters,
	}),
	actions: {
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

				// сохраняем все новости
				if (reset) {
					this.allItems = data.items
				} else {
					this.allItems = [...this.allItems, ...data.items]
				}

				// по умолчанию показываем все
				this.items = reset ? data.items : [...this.items, ...data.items]

				this.page = page + 1
				this.hasMore = data.items?.length > 0
			} catch (err) {
				console.error('Ошибка загрузки новостей:', err)
			} finally {
				this.loading = false
			}
		},

		// 🔍 клиентский поиск
		search(query: string) {
			if (!query) {
				this.items = this.allItems
				return
			}
			const qLower = query.toLowerCase()
			this.items = this.allItems.filter(
				a => a.title?.toLowerCase().includes(qLower) || a.summary?.toLowerCase().includes(qLower)
			)
		},

		setCategory(cat: Category) {
			this.filters.category = cat
			this.page = 1
		},
	},
})
