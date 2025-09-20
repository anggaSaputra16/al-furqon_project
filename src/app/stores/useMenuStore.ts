import { create } from 'zustand'

interface MenuItem {
  title: string
  slug: string
  icon: string
}

interface MenuStore {
  menus: MenuItem[]
  fetchMenus: () => void
}

export const useMenuStore = create<MenuStore>((set) => ({
  menus: [],
  fetchMenus: () => {
    const staticMenus: MenuItem[] = [
      {
        title: 'Home',
        slug: '',
        icon: 'home',
      },
      {
        title: 'Fasilitas',
        slug: 'fasilitas',
        icon: 'FaMosque',
      },
      {
        title: 'Kegiatan',
        slug: 'kegiatan',
        icon: 'FaRoute',
      },
      {
        title: 'Sejarah',
        slug: 'sejarah',
        icon: 'FaUserTie',
      },
      {
        title: 'Galeri',
        slug: 'galeri',
        icon: 'FaImages',
      },
      {
        title: 'Video',
        slug: 'video',
        icon: 'FaVideo',
      },
    ]
    set({ menus: staticMenus })
  },
}))
