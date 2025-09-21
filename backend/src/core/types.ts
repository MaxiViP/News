export type Category =
  | 'politics'
  | 'economy'
  | 'news'
  | 'science'
  | 'tech'
  | 'sports'
  | 'incidents'
  | 'auto'
  | 'esports'

export interface Article {
  id: string
  title: string
  summary?: string
  url: string
  imageUrl?: string
  source: { id?: string; name: string }
  publishedAt: string // ISO
  category: Category
  country?: string
  language?: string
}
