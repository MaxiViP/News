import { defineStore } from 'pinia'
import { api } from '../services/api'

type Category =
  | 'politics'
  | 'economy'
  | 'showbiz'
  | 'science'
  | 'tech'
  | 'sports'
  | 'incidents'
  | 'auto'
  | 'esports'

type Filters = { category: Category; country: string; q?: string }

export const useNews = defineStore('news', {
  state: () => ({
    items: [] as any[],
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
            ...(this.filters.q ? { q: this.filters.q } : {}),
          },
        })

        const data = res.data

        this.items = reset ? data.items : [...this.items, ...data.items]
        this.page = page + 1
        this.hasMore = data.items?.length > 0
      } catch (err) {
        console.error('Ошибка загрузки новостей:', err)
      } finally {
        this.loading = false
      }
    },
    setCategory(cat: Category) {
      this.filters.category = cat
      this.page = 1
    },
  },
})
