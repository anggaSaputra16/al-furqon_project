'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useArticleStore } from '../../stores/useArticleStore'
import RelatedArticles from './RelatedArticles'
import { useTheme } from '@/context/themeContext'

interface Props {
  articleId: string
  showRelated?: boolean
}

export default function ArticleDetail({ articleId, showRelated = true }: Props) {
  const { articles } = useArticleStore()
  const { colors } = useTheme()

  const article = articles.find((a) => a.id === articleId)

  if (!article) return <p style={{ color: colors.cardText }}>Artikel tidak ditemukan.</p>

  const {
    title,
    content,
    category,
    image,
    tag,
    imageSize = 'medium',
    imagePosition = 'right',
    date,
    id,
  } = article

  const imageClasses = clsx('relative rounded-xl overflow-hidden shadow-lg', {
    'aspect-square': imageSize === 'large',
    'aspect-[4/3]': imageSize === 'medium',
    'aspect-[3/2]': imageSize === 'small',
  })

  const isImageLeft = imagePosition === 'left'

  return (
    <article className="w-full space-y-6 md:space-y-8">
      {/* Header Section */}
      <header className="space-y-3">
        {tag && (
          <span
            className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              color: colors.accent,
              backgroundColor: `${colors.accent}20`,
              fontFamily: 'var(--font-sharp-bold)',
            }}
          >
            {tag}
          </span>
        )}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
          style={{
            color: colors.heading,
            fontFamily: 'var(--font-header-masjid)',
            fontWeight: '900',
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </h1>
        {date && (
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" style={{ color: colors.subheading }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span
              style={{
                color: colors.subheading,
                fontFamily: 'var(--font-sharp-light)',
              }}
            >
              {date}
            </span>
          </div>
        )}
      </header>

      {/* Content Section */}
      <div className="grid gap-6 lg:gap-8">
        {/* Mobile: Stack vertically */}
        <div className="block lg:hidden space-y-6">
          <div className={imageClasses}>
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
          <div
            className="space-y-4 text-justify leading-relaxed"
            style={{
              color: colors.detail,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: '16px',
              lineHeight: '1.7'
            }}
          >
            {(content || '').split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>

        {/* Desktop: Side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {isImageLeft && (
            <div className={imageClasses}>
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          )}
          <div
            className="space-y-4 text-justify leading-relaxed"
            style={{
              color: colors.detail,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: '16px',
              lineHeight: '1.7'
            }}
          >
            {(content || '').split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>
          {!isImageLeft && (
            <div className={imageClasses}>
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      {showRelated && category && (
        <div className="mt-8 pt-8 border-t" style={{ borderColor: colors.border }}>
          <RelatedArticles category={category} excludeId={id} />
        </div>
      )}
    </article>
  )
}
