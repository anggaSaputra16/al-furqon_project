'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { useArticleStore } from '../../stores/useArticleStore'
import { useFeaturedArticles } from '../../hooks/useHomePageApi'
import RelatedArticles from './RelatedArticles'
import { useTheme } from '@/context/themeContext'

interface Props {
  articleId: string
  showRelated?: boolean
}

export default function ArticleDetail({ articleId, showRelated = true }: Props) {
  const { articles: storeArticles, fetchArticles } = useArticleStore()
  const { articles: featuredArticles, loading: featuredLoading } = useFeaturedArticles()
  const { colors } = useTheme()
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Combine both data sources - prioritize featured articles (homepage data)
  const allArticles = featuredArticles.length > 0 ? featuredArticles : storeArticles

  // Ensure articles are loaded
  useEffect(() => {
    const loadArticles = async () => {
      if (featuredArticles.length === 0 && storeArticles.length === 0) {
        await fetchArticles()
      }
      setIsLoading(false)
    }
    loadArticles()
  }, [featuredArticles.length, storeArticles.length, fetchArticles])

  // Show loading state
  if (isLoading || featuredLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.accent }}></div>
        <p className="text-lg" style={{ color: colors.cardText }}>
          Memuat artikel...
        </p>
      </div>
    )
  }

  const article = allArticles.find((a: any) => a.id === articleId)

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-6xl mb-4" style={{ color: colors.detail }}>📝</div>
        <p className="text-lg" style={{ color: colors.cardText }}>
          Artikel tidak ditemukan.
        </p>
        <p className="text-sm" style={{ color: colors.detail }}>
          ID: {articleId}
        </p>
      </div>
    )
  }

  // Handle different data structures between featuredArticles and storeArticles
  const safeTitle = article.title
  const safeContent = (article as any).content || (article as any).description || ''
  const safeImage = article.image || '/images/al-furqon.png'
  const safeDate = (article as any).date || (article as any).publishedAt
  const safeTag = (article as any).tag || (article as any).category
  const safeCategory = article.category
  const safeId = article.id
  const imageSize = (article as any).imageSize || 'medium'
  const imagePosition = (article as any).imagePosition || 'right'

  const imageClasses = clsx('relative rounded-xl overflow-hidden shadow-lg', {
    'aspect-square': imageSize === 'large',
    'aspect-[4/3]': imageSize === 'medium',
    'aspect-[3/2]': imageSize === 'small',
  })

  const isImageLeft = imagePosition === 'left'

  // Function to render content paragraphs safely
  const renderContent = () => {
    if (!safeContent) {
      return (
        <p style={{ color: colors.detail }}>
          Konten artikel tidak tersedia.
        </p>
      )
    }

    return safeContent.split('\n').map((paragraph: string, index: number) => {
      const trimmedParagraph = paragraph.trim()
      if (!trimmedParagraph) return null

      return (
        <p key={index} className="mb-4">
          {trimmedParagraph}
        </p>
      )
    }).filter(Boolean)
  }

  return (
    <article className="w-full space-y-6 md:space-y-8">
      {/* Header Section */}
      <header className="space-y-3">
        {safeTag && (
          <span
            className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              color: colors.accent,
              backgroundColor: `${colors.accent}20`,
              fontFamily: 'var(--font-sharp-bold)',
            }}
          >
            {safeTag}
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
          {safeTitle}
        </h1>
        {safeDate && (
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
              {new Date(safeDate).toLocaleDateString('id-ID')}
            </span>
          </div>
        )}
      </header>

      {/* Content Section */}
      <div className="grid gap-6 lg:gap-8">
        {/* Mobile: Stack vertically */}
        <div className="block lg:hidden space-y-6">
          <div className={imageClasses}>
            {!imageError ? (
              <Image
                src={safeImage}
                alt={safeTitle}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: colors.border }}
              >
                <span style={{ color: colors.detail }}>Gambar tidak tersedia</span>
              </div>
            )}
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
            {renderContent()}
          </div>
        </div>

        {/* Desktop: Side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {isImageLeft && (
            <div className={imageClasses}>
              {!imageError ? (
                <Image
                  src={safeImage}
                  alt={safeTitle}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: colors.border }}
                >
                  <span style={{ color: colors.detail }}>Gambar tidak tersedia</span>
                </div>
              )}
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
            {renderContent()}
          </div>
          {!isImageLeft && (
            <div className={imageClasses}>
              {!imageError ? (
                <Image
                  src={safeImage}
                  alt={safeTitle}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: colors.border }}
                >
                  <span style={{ color: colors.detail }}>Gambar tidak tersedia</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showRelated && safeCategory && (
        <div className="mt-8 pt-8 border-t" style={{ borderColor: colors.border }}>
          <RelatedArticles category={safeCategory} excludeId={safeId} />
        </div>
      )}
    </article>
  )
}
