'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { useArticleStore } from '../../stores/useArticleStore'
import { useFeaturedArticles, useLatestNews, usePublishedArticles } from '../../hooks/useHomePageApi'
import RelatedArticles from './RelatedArticles'
import { useTheme } from '@/context/themeContext'

interface Props {
  articleId: string
  showRelated?: boolean
}

export default function ArticleDetail({ articleId, showRelated = true }: Props) {
  const { articles: storeArticles, fetchArticles } = useArticleStore()
  const { articles: featuredArticles, loading: featuredLoading } = useFeaturedArticles()
  const { articles: publishedArticles, loading: publishedLoading } = usePublishedArticles(100)
  const { news: latestNews, loading: newsLoading } = useLatestNews(100)
  const { colors } = useTheme()
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const allContent = [
    ...featuredArticles,
    ...publishedArticles,
    ...latestNews,
    ...storeArticles
  ]

  useEffect(() => {
    const loadArticles = async () => {
      if (featuredArticles.length === 0 && storeArticles.length === 0 && publishedArticles.length === 0 && latestNews.length === 0) {
        await fetchArticles()
      }
      setIsLoading(false)
    }
    loadArticles()
  }, [featuredArticles.length, storeArticles.length, publishedArticles.length, latestNews.length, fetchArticles])

  const article = allContent.find((a: any) => a.id === articleId || a.slug === articleId)

  if (isLoading || featuredLoading || publishedLoading || newsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.accent }}></div>
        <p className="text-lg" style={{ color: colors.cardText }}>
          Memuat konten...
        </p>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-6xl mb-4" style={{ color: colors.detail }}>📝</div>
        <p className="text-lg" style={{ color: colors.cardText }}>
          Konten tidak ditemukan.
        </p>
        <p className="text-sm" style={{ color: colors.detail }}>
          ID: {articleId}
        </p>
        <p className="text-xs mt-2" style={{ color: colors.subheading }}>
          Total konten tersedia: {allContent.length}
        </p>
      </div>
    )
  }


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

  // Share functionality
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `${safeTitle} - Masjid Al-Furqon`

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    instagram: shareUrl, // Instagram doesn't support direct URL sharing, will copy to clipboard
  }

  const handleShare = (platform: string) => {
    if (platform === 'instagram') {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link berhasil disalin! Anda dapat membagikannya di Instagram.')
      })
    } else {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400')
    }
  }

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

        {/* Social Share Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm font-medium" style={{ color: colors.subheading }}>
            Bagikan:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 rounded-full hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: `${colors.accent}15` }}
              aria-label="Bagikan ke Twitter"
              title="Bagikan ke Twitter"
            >
              <svg className="w-5 h-5" style={{ color: colors.accent }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 rounded-full hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: `${colors.accent}15` }}
              aria-label="Bagikan ke Facebook"
              title="Bagikan ke Facebook"
            >
              <svg className="w-5 h-5" style={{ color: colors.accent }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-2 rounded-full hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: `${colors.accent}15` }}
              aria-label="Bagikan ke WhatsApp"
              title="Bagikan ke WhatsApp"
            >
              <svg className="w-5 h-5" style={{ color: colors.accent }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </button>
            <button
              onClick={() => handleShare('instagram')}
              className="p-2 rounded-full hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: `${colors.accent}15` }}
              aria-label="Salin link untuk Instagram"
              title="Salin link untuk Instagram"
            >
              <svg className="w-5 h-5" style={{ color: colors.accent }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:gap-8">
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
