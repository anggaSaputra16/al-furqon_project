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
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4" style={{ color: colors.cardText }}>
        Artikel Terkait
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {related.map((article) => (
          <Link
            key={article.id}
            href={`/artikel/${article.id}`}
            className="flex items-center rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            style={{
              background: colors.card,
              color: colors.cardText,
              border: `1px solid ${colors.border || '#e5e7eb'}`,
            }}
          >
            <div className="w-[65px] h-[65px] min-w-[65px] relative">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover rounded-l-xl"
              />
            </div>
            <div className="p-3 pr-4 overflow-hidden">
              <h3
                className="text-sm font-semibold truncate"
                style={{ color: colors.cardText }}
              >
                {article.title}
              </h3>
              {article.date && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  Program - {article.date}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
