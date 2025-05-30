'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import UniversalModal from './UniversalModal'
import RelatedArticles from './RelatedArticles'
import { useMenuStore } from '../../stores/useMenuStore'
import { useTheme } from '@/context/themeContext'
import { Article } from '../../stores/useArticleStore'

type ArticleCardProps = Article & {
  showRelated?: boolean
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  description,
  detail,
  image,
  imagePosition = 'left',
  links = [],
  category,
  showRelated = true,
}) => {
  const { menus } = useMenuStore()
  const { colors } = useTheme()
  const [modal, setModal] = useState<{ open: boolean; label?: string } | null>(null)
  const router = useRouter()

  const handleLinkClick = (label: string, href: string, e: React.MouseEvent) => {
    const menu = menus.find((m) => m.title.toLowerCase() === label.toLowerCase())
    if (menu) {
      router.push(`/${menu.slug}?filter=${encodeURIComponent(title)}`)
    } else {
      e.preventDefault()
      setModal({ open: true, label })
    }
  }

  return (
    <>
      <div
        className={`flex flex-col md:flex-row rounded-3xl overflow-hidden my-8 transition-colors duration-200 ${
          imagePosition === 'right' ? 'md:flex-row-reverse' : ''
        }`}
        style={{
          background: colors.card,
          border: `1.5px solid ${colors.border}`,
          boxShadow: colors.shadow,
          color: colors.cardText,
        }}
      >
        {/* Image */}
        <div
          className="md:w-1/3 p-6 flex items-center justify-center"
          style={{ background: colors.muted }}
        >
          <div className="relative w-full h-56">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover rounded-2xl shadow-md border"
              style={{ borderColor: colors.border }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="md:w-2/3 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: colors.heading }}>
              {title}
            </h3>
            {description && (
              <p className="text-base mb-2 font-semibold" style={{ color: colors.subheading }}>
                {description}
              </p>
            )}
            {detail && (
              <p className="mb-6 text-[15px] leading-relaxed" style={{ color: colors.detail }}>
                {detail}
              </p>
            )}
          </div>

          {links.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link.label, link.href, e)}
                  className="text-base font-semibold hover:underline cursor-pointer transition-colors duration-200"
                  style={{ color: colors.link }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Artikel terkait */}
      {showRelated && category && <RelatedArticles category={category} excludeId={id} />}

      {/* Modal fallback */}
      <UniversalModal
        open={!!modal?.open}
        onClose={() => setModal(null)}
        title={modal?.label || 'Info'}
        description={`Halaman untuk "${modal?.label}" belum tersedia atau tidak ditemukan.`}
      />
    </>
  )
}

export default ArticleCard
