'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useArticleStore } from '@/app/stores/useArticleStore'
import ArticleDetail from '@/app/components/path/ArticleDetail'
import { FaArrowLeft } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

export default function ArtikelPage() {
  const { id } = useParams()
  const router = useRouter()
  const { articles, fetchArticles } = useArticleStore()
  const { colors } = useTheme()

  useEffect(() => {
    if (articles.length === 0) {
      fetchArticles()
    }
  }, [articles.length, fetchArticles])

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        background: colors.background,
        color: colors.cardText,
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors duration-300"
          style={{
            background: colors.card,
            color: colors.accent,
            border: `1px solid ${colors.accent}`,
          }}
        >
          <FaArrowLeft /> Kembali
        </button>

        {/* Konten Artikel */}
        {typeof id === 'string' ? (
          <ArticleDetail articleId={id} />
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Artikel tidak ditemukan atau ID tidak valid.
          </p>
        )}
      </div>
    </div>
  )
}
