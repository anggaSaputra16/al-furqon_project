import { create } from 'zustand'

type GuideCard = {
  id: number
  title: string
  description: string
  image: string
}

type GuideStore = {
  cards: GuideCard[]
  fetchCards: () => Promise<void>
}

export const useGuideStore = create<GuideStore>((set) => ({
  cards: [],
  fetchCards: async () => {
    try {
      const res = await fetch('/api/guide-cards')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      set({ cards: data })
    } catch (error) {
      console.warn('Failed to fetch guide cards, using empty array:', error)
      set({ cards: [] }) 
    }
  },
}))
