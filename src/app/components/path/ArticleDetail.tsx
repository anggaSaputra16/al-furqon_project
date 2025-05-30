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

  const imageClasses = clsx('relative rounded-xl overflow-hidden shadow', {
    'aspect-square w-full h-full': imageSize === 'large',
    'w-full max-w-md aspect-[4/3]': imageSize === 'medium',
    'w-full max-w-xs aspect-[4/3]': imageSize === 'small',
  })

  const isImageLeft = imagePosition === 'left'

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="space-y-1">
        {tag && (
          <span
            className="text-sm font-semibold uppercase"
            style={{ color: colors.accent }}
          >
            {tag}
          </span>
        )}
        <h1 className="text-3xl font-extrabold" style={{ color: colors.heading }}>
          {title}
        </h1>
        {date && (
          <p className="text-sm" style={{ color: colors.subheading }}>
            {date}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {isImageLeft && (
          <div className={imageClasses}>
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
        )}

        <div
          className="space-y-4 text-justify whitespace-pre-line"
          style={{ color: colors.detail }}
        >
          {content}
        </div>

        {!isImageLeft && (
          <div className={imageClasses}>
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
        )}
      </div>

      {showRelated && category && <RelatedArticles category={category} excludeId={id} />}
    </section>
  )
}
