import { create } from 'zustand'

export interface GalleryImage {
  id: string
  src: string
  alt: string
  author: string
  description: string // pendek
  detail?: string     // deskripsi panjang, opsional
}

interface GalleryState {
  images: GalleryImage[]
  selectedImage: GalleryImage | null
  setImages: (images: GalleryImage[]) => void
  setSelectedImage: (image: GalleryImage | null) => void
}

export const useGalleryStore = create<GalleryState>((set) => ({
  images: [],
  selectedImage: null,
  setImages: (images) => set({ images }),
  setSelectedImage: (image) => set({ selectedImage: image }),
}))
