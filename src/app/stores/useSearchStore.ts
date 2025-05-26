// src/app/stores/useSearchStore.ts
import { create } from 'zustand'

interface SearchStore {
  search: string
  setSearch: (query: string) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  search: '',
  setSearch: (query) => set({ search: query }),
}))
