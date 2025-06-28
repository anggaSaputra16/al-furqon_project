'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useArticleStore } from '../../stores/useArticleStore'
import { useTheme } from '@/context/themeContext'

interface Props {
  category: string
  excludeId?: string
}

export default function RelatedArticles({ category, excludeId }: Props) {
  const { articles } = useArticleStore()
  const { colors } = useTheme()

  const related = articles.filter(
    (a) => a.category === category && a.id !== excludeId
  )

  if (related.length === 0) return null

  return (
    <div className="w-full space-y-6">
      <h2
        className="text-xl sm:text-2xl font-bold"
        style={{
          color: colors.heading,
          fontFamily: 'var(--font-header-masjid)',
          fontWeight: '700',
          letterSpacing: '-0.01em'
        }}
      >
        Artikel Terkait
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((article) => (
          <Link
            key={article.id}
            href={`/artikel/${article.id}`}
            className="group flex items-center rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            style={{
              background: colors.card,
              color: colors.cardText,
              border: `1px solid ${colors.border || '#e5e7eb'}`,
            }}
          >
            <div className="w-[70px] h-[70px] min-w-[70px] relative overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="p-4 pr-5 overflow-hidden flex-1">
              <h3
                className="text-sm sm:text-base font-semibold overflow-hidden group-hover:text-opacity-80 transition-colors"
                style={{
                  color: colors.cardText,
                  fontFamily: 'var(--font-sharp-bold)',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                  textOverflow: 'ellipsis'
                }}
              >
                {article.title}
              </h3>
              {article.date && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded-full" style={{
                    backgroundColor: `${colors.accent}20`,
                    color: colors.accent
                  }}>
                    Program
                  </span>
                  <span className="text-xs" style={{ color: colors.subheading }}>
                    {article.date}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
