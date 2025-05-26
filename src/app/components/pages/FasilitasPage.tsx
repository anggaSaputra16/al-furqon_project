'use client'

import { useArticleStore } from '../../stores/articleStore'
import { useSearchStore } from '../../stores/useSearchStore'
import ArticleCard from '../path/ArticleCard'
import MasjidHeader from '../path/MasjidHeader'
import { useMenuStore } from '@/app/stores/useMenuStore'
import Footer from '../path/Footer'
import { FaTimes, FaBars, FaRoute } from 'react-icons/fa'
import ThemeToggle from '../path/ThemeToggle'
import { iconMap } from '@/app/utils/iconMapper'
import UniversalNavGrid, { NavItem } from '../path/UniversalNavGrid'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '@/context/themeContext'

export default function FasilitasPage() {
  const { colors } = useTheme()
  const articles = useArticleStore((state) => state.articles)
  const { search } = useSearchStore()
  const [showNav, setShowNav] = useState(true)
  const { menus, fetchMenus } = useMenuStore()

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

  const navItems: NavItem[] = menus.map((menu) => {
    const Icon = iconMap[menu.icon] || FaRoute
    return {
      title: menu.title,
      href: `/${menu.slug}`,
      icon: <Icon />,
    }
  })

  const filteredArticles = articles.filter((article) => {
    const searchWords = search.toLowerCase().split(' ').filter(Boolean)
    const title = article.title?.toLowerCase() || ''
    return searchWords.every((word) => title.includes(word))
  })

  return (
    <main
      style={{ background: colors.background, color: colors.cardText }}
      className="transition-colors duration-500"
    >
      <MasjidHeader />
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
          <ThemeToggle />
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
          <h1 className="text-2xl font-bold text-center" style={{ color: colors.cardText }}>Fasilitas</h1>
          <p className="text-center text-gray-600 dark:text-gray-300" style={{ color: colors.cardText }}>
            Masjid Besar Al-Furqon, Bekasi Barat bukan hanya tempat ibadah yang luas dan nyaman, tetapi juga pusat kegiatan umat yang menghadirkan berbagai fasilitas penunjang di bawah naungan Yayasan Pondok Mulya Bekasi. 
Dilengkapi dengan aula serbaguna Graha Subagdja, masjid ini siap menjadi pilihan untuk berbagai acara penting seperti pertemuan komunitas, kajian, hingga resepsi pernikahan yang berkesan. 
Area parkir yang luas memberikan kenyamanan bagi para jamaah, sementara ruang belajar TPO menjadi wadah pembinaan generasi Qurani sejak dini. Tersedia pula ruang keserikatan yang mendukung kolaborasi dan kegiatan sosial masyarakat. Semua hadir dalam suasana yang teduh, bersih, dan penuh berkah.
          </p>
          <div className="space-y-8">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  description={article.description}
                  detail={article.detail}
                  image={article.image}
                  imagePosition={article.imagePosition}
                  links={article.links}
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

