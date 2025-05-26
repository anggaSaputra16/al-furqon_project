'use client'

import { useGalleryStore } from '../../stores/useGalleryStore'
import { FaTimes } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

export default function GalleryModal() {
  const { selectedImage, setSelectedImage } = useGalleryStore()
  const { colors } = useTheme();

  if (!selectedImage) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-4 py-6"
      style={{ backgroundColor: colors.background + 'CC' }}
    >
      <div
        className="relative rounded-lg shadow-lg flex flex-col lg:flex-row max-w-6xl w-full overflow-hidden"
        style={{ backgroundColor: colors.card, color: colors.cardText }}
      >

        {/* Left Section: Info */}
        <div
          className="w-full lg:w-1/2 p-6 flex flex-col justify-between"
          style={{ backgroundColor: colors.card, color: colors.cardText }}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 hover:text-red-500"
            style={{ color: colors.accent }}
          >
            <FaTimes className="text-2xl" />
          </button>
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.cardText }}>{selectedImage.description}</h2>
            <p className="text-sm mb-4" style={{ color: colors.foreground }}>
              📷 {selectedImage.author}
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: colors.cardText }}>
              {selectedImage.detail || 'Tidak ada deskripsi tambahan.'}
            </p>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="w-full lg:w-1/2 max-h-[90vh] flex items-center justify-center" style={{ backgroundColor: colors.background }}>
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="w-auto h-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}
