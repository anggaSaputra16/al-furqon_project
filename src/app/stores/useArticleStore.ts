import { create } from 'zustand'
import { articles as staticArticles } from '../utils/articles'
import { ArticleMode, ImagePosition, ImageSize } from '../types/articleTypes'

export interface Article {
  id: string
  title: string
  description?: string
  detail?: string
  content?: string
  image: string
  imagePosition?: ImagePosition
  imageSize?: ImageSize
  date?: string
  category: string
  tag?: string
  mode?: ArticleMode
  links?: { label: string; href: string }[]
}

interface ArticleStore {
  articles: Article[]
  setArticles: (articles: Article[]) => void
  fetchArticles: () => Promise<void>
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  setArticles: (articles) => set({ articles }),

  fetchArticles: async () => {
    try {
      const res = await fetch('/api/articles')
      const raw = await res.json()

      const parsed: Article[] = raw.map((item: any) => ({
        ...item,
        imagePosition: item.imagePosition as ImagePosition,
        imageSize: item.imageSize as ImageSize,
        mode: item.mode as ArticleMode,
      }))

      set({ articles: parsed })
    } catch (err) {
      console.warn('🔔 Fallback to static articles')
      set({ articles: staticArticles })
    }
  },
}))
