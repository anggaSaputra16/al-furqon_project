'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBars, FaTimes, FaRoute } from 'react-icons/fa'

import { useArticleStore } from '../../stores/useArticleStore'
import { useSearchStore } from '../../stores/useSearchStore'
import { useMenuStore } from '../../stores/useMenuStore'
import { useTheme } from '@/context/themeContext'
import { iconMap } from '@/app/utils/iconMapper'

import MasjidHeader from '../path/MasjidHeader'
import Footer from '../path/Footer'
import ThemeToggle from '../path/ThemeToggle'
import ArticleCard from '../path/ArticleCard'
import ArticleDetail from '../path/ArticleDetail'
import UniversalNavGrid, { NavItem } from '../path/UniversalNavGrid'

export default function FasilitasPage() {
  const { colors } = useTheme()
  const articles = useArticleStore((state) => state.articles)
  const fetchArticles = useArticleStore((state) => state.fetchArticles)
  const { search } = useSearchStore()
  const { menus, fetchMenus } = useMenuStore()
  const [showNav, setShowNav] = useState(true)

  useEffect(() => {
    fetchMenus()
    fetchArticles()
  }, [fetchMenus, fetchArticles])

  const navItems: NavItem[] = menus.map((menu) => {
    const Icon = iconMap[menu.icon] || FaRoute
    return {
      title: menu.title,
      href: `/${menu.slug}`,
      icon: <Icon />,
    }
  })

  const introArticle = articles.find(
    (a) => a.category === 'fasilitas' && a.mode === 'detail'
  )

  const filteredArticles = articles.filter((article) => {
    const searchWords = search.toLowerCase().split(' ').filter(Boolean)
    const title = article.title?.toLowerCase() || ''
    return (
      article.category === 'fasilitas' &&
      article.mode === 'card' &&
      searchWords.every((word) => title.includes(word))
    )
  })

  return (
    <main
      style={{ background: colors.background, color: colors.cardText }}
      className="transition-colors duration-500"
    >
      <MasjidHeader />

      <div className="max-w-7xl mx-auto px-6 space-y-8 mt-5">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowNav((prev) => !prev)}
              className="text-xl p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle Navigation"
            >
              {showNav ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showNav && (
            <motion.div
              key="navgrid"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <UniversalNavGrid items={navItems} />
            </motion.div>
          )}
        </AnimatePresence>

        <section className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center" style={{ color: colors.cardText }}>
            Fasilitas
          </h1>

          {/* Tampilkan detail jika tersedia */}
          {articles.length === 0 ? (
            <p className="text-center text-sm text-gray-400">Memuat artikel...</p>
          ) : introArticle ? (
            <ArticleDetail articleId={introArticle.id} showRelated={false} />
          ) : (
            <p className="text-center text-sm text-gray-400">Artikel pengantar tidak ditemukan.</p>
          )}

          <div className="space-y-8">
            {articles.length === 0 ? (
              <p className="text-center text-gray-400">Memuat data...</p>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  description={article.description || ''}
                  detail={article.detail || article.content || ''}
                  image={article.image}
                  imagePosition={article.imagePosition}
                  links={article.links}
                  category={article.category}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400" style={{ color: colors.cardText }}>
                Tidak ada hasil untuk pencarian.
              </p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
