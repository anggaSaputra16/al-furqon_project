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
    const res = await fetch('/api/guide-cards')
    const data = await res.json()
    set({ cards: data })
  },
}))
