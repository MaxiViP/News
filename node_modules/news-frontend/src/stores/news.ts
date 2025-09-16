import { defineStore } from 'pinia'

type Category =
  | 'politics'|'economy'|'showbiz'|'science'|'tech'|'sports'|'incidents'|'auto'|'esports'

type Filters = { category: Category; country: string; q?: string }
const API_BASE = import.meta.env.VITE_API_BASE

export const useNews = defineStore('news', {
  state: () => ({
    items: [] as any[],
    loading: false,
    page: 1,
    hasMore: true,
    filters: { category: 'tech' as Category, country: 'ru' } as Filters
  }),
  actions: {
    async load(reset = false) {
      if (this.loading) return
      this.loading = true
      try {
        const page = reset ? 1 : this.page
        const params = new URLSearchParams({
          category: this.filters.category,
          country: this.filters.country,
          page: String(page),
          ...(this.filters.q ? { q: this.filters.q } : {})
        })
        const res = await fetch(`${API_BASE}/news?${params}`)
        const data = await res.json()
        this.items = reset ? data.items : [...this.items, ...data.items]
        this.page = page + 1
        this.hasMore = data.items?.length > 0
      } finally {
        this.loading = false
      }
    },
    setCategory(cat: Category) {
      this.filters.category = cat
      this.page = 1
    }
  }
})
