'use client'

import { useGalleryStore } from '../../stores/useGalleryStore'
import GalleryCard from './GalleryCard'
import { useTheme } from '@/context/themeContext'

export default function GalleryMasonry({ images: filteredImages }: { images: any[] }) {
  const { colors } = useTheme()
  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3 px-2" style={{ background: colors.background }}>
      {filteredImages.map((img) => (
        <div key={img.id} className="break-inside-avoid">
          <GalleryCard {...img} />
        </div>
      ))}
    </div>
  )
}
