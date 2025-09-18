
import { create } from 'zustand'

type CardSize = 'small' | 'large'

type Card = {
  id: string
  title: string
  description: string
  image: string
  size: CardSize
}

type State = {
  cards: Card[]
  reorderCards: (from: number, to: number) => void
}

export const useCardStore = create<State>((set) => ({
  cards: [
    {
      id: '1',
      title: 'Kajian Tematik setiap Ahad Pagi minggu ke Lima',
      description: 'Program - 3 Feb 2024',
      image: '/images/orange.jpg',
      size: 'large',
    },
    {
      id: '2',
      title: 'Kajian Tematik...',
      description: 'Program - 3 Feb 2024',
      image: '/images/orange.jpg',
      size: 'small',
    },
    
  ],
  reorderCards: (from, to) =>
    set((state) => {
      const updated = [...state.cards]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return { cards: updated }
    }),
}))
