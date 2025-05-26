'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { FaBookOpen } from 'react-icons/fa' // Ikon diganti untuk relevansi
import type { CardData } from '@/app/layouts/CardLayout'
import { useTheme } from '@/context/themeContext'

type Props = CardData & {
  onShowDetail?: (card: CardData) => void
}

export default function CustomCard({
  id,
  title,
  description,
  detail,
  image,
  size = 'large',
  onShowDetail,
}: Props) {
  const { colors } = useTheme()
  const isLarge = size === 'large'

  return (
    <div
      className={clsx(
        'relative rounded-xl shadow-md hover:shadow-lg transition-all p-4',
        isLarge ? 'flex flex-col' : 'flex flex-row items-center gap-3'
      )}
      style={{ background: colors.card, color: colors.cardText }}
    >
      {/* Tombol Detail (kanan atas) */}
      {onShowDetail && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onShowDetail({ id, title, description, detail, image, size })
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full text-white transition-colors duration-200"
          style={{ background: colors.accent }}
          title="Tampilkan Detail"
        >
          <FaBookOpen size={14} />
        </button>
      )}

      {/* Gambar */}
      <div
        className={clsx(
          'relative overflow-hidden rounded-md',
          isLarge ? 'w-full h-34' : 'w-20 h-20 flex-shrink-0'
        )}
      >
        <Image src={image} alt={title} fill className="object-cover rounded-md" />
      </div>

      {/* Konten */}
      <div className={clsx(isLarge ? 'mt-3' : 'flex-1')}>
        <h3 className={clsx('font-semibold', isLarge ? 'text-xl' : 'text-sm')} style={{ color: colors.cardText }}>
          {title}
        </h3>
        <p className={clsx(isLarge ? 'text-base' : 'text-xs')} style={{ color: colors.cardText + 'cc' }}>
          {description}
        </p>
      </div>
    </div>
  )
}
