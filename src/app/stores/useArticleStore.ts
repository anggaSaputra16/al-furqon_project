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
      // This will now use the external backend through apiRepository
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/articles?limit=100`)
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const apiResponse = await res.json()
      
      // Handle external backend response format
      if (apiResponse.success && apiResponse.data) {
        const articles = Array.isArray(apiResponse.data) ? apiResponse.data : apiResponse.data.data || []
        
        const parsed: Article[] = articles.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || item.summary,
          detail: item.content,
          content: item.content,
          image: item.imageUrl || item.image,
          date: item.publishedAt,
          category: item.category,
          tag: item.tags?.[0] || item.category,
          imagePosition: 'left' as ImagePosition,
          imageSize: 'medium' as ImageSize,
          mode: 'normal' as ArticleMode,
          links: []
        }))
        set({ articles: parsed })
      } else {
        throw new Error('Invalid backend response format')
      }
    } catch (err) {
      set({ articles: staticArticles })
    }
  },
}))
