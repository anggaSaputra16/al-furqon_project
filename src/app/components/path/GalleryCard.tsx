import { GalleryImage, useGalleryStore } from '../../stores/useGalleryStore'
import { useTheme } from '@/context/themeContext'

export default function GalleryCard(props: GalleryImage) {
  const { colors } = useTheme()
  const setSelectedImage = useGalleryStore((s) => s.setSelectedImage)

  return (
    <div
      onClick={() => setSelectedImage(props)}
      className="relative overflow-hidden rounded-lg group cursor-pointer"
      style={{ background: colors.card }}
    >
      <img
        src={props.src}
        alt={props.alt}
        className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 p-4 flex flex-col justify-end"
        style={{ background: 'rgba(0,0,0,0.45)', color: colors.cardText }}
      >
        <p className="text-sm font-semibold">{props.description}</p>
        <span className="text-xs mt-1">📷 {props.author}</span>
      </div>
    </div>
  )
}
