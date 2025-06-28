'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaRoute, FaChevronUp } from 'react-icons/fa'

import { useArticleStore } from '../../stores/useArticleStore'
import { useSearchStore } from '../../stores/useSearchStore'
import { useMenuStore } from '../../stores/useMenuStore'
import { useTheme } from '@/context/themeContext'
import { iconMap } from '@/app/utils/iconMapper'

import MasjidHeader from '../path/MasjidHeader'
import Footer from '../path/Footer'
import ArticleCard from '../path/ArticleCard'
import UniversalNavGrid, { NavItem } from '../path/UniversalNavGrid'
import FacilityRow from '../path/FacilityRow'
import { facilityCards } from '../../utils/staticData'

export default function FasilitasPage() {
  const { colors } = useTheme()
  const articles = useArticleStore((state) => state.articles)
  const fetchArticles = useArticleStore((state) => state.fetchArticles)
  const { search } = useSearchStore()
  const { menus, fetchMenus } = useMenuStore()
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)

  useEffect(() => {
    fetchMenus()
    fetchArticles()
  }, [fetchMenus, fetchArticles])

  // Handle scroll to show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const isMobile = window.innerWidth < 768
      const scrollThreshold = isMobile ? 200 : 300
      const shouldShow = scrollY > scrollThreshold

      setShowScrollToTop(shouldShow)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 mt-5">
        {/* Navigation Grid - Always visible in default mode for both desktop and mobile */}
        <div>
          <UniversalNavGrid
            items={navItems}
            variant="default"
            customClass="mb-8"
          />
        </div>

        {/* Page Header */}
        <div className="text-center space-y-6 py-8 sm:py-12">
          <div className="space-y-4">
            <h1
              className="text-3xl sm:text-4xl font-bold"
              style={{
                color: colors.cardText,
                fontFamily: 'var(--font-header-modern)',
                fontSize: 'clamp(32px, 6vw, 48px)',
                lineHeight: '1.1',
                fontWeight: '700',
                letterSpacing: '-0.02em'
              }}
            >
              Fasilitas Masjid Al-Furqon
            </h1>
            <p
              className="text-lg sm:text-xl max-w-3xl mx-auto"
              style={{
                color: colors.detail,
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(16px, 4vw, 20px)',
                lineHeight: '1.6'
              }}
            >
              Berbagai fasilitas yang tersedia di Masjid Al-Furqon untuk mendukung aktivitas ibadah dan kegiatan keagamaan
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-8">
            <div className="text-center space-y-2">
              <div
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  color: colors.accent,
                  fontFamily: 'var(--font-header-modern)'
                }}
              >
                {facilityCards.length}
              </div>
              <div
                className="text-sm"
                style={{
                  color: colors.detail,
                  fontFamily: 'var(--font-sharp-light)'
                }}
              >
                Fasilitas
              </div>
            </div>
            <div className="text-center space-y-2">
              <div
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  color: colors.accent,
                  fontFamily: 'var(--font-header-modern)'
                }}
              >
                500+
              </div>
              <div
                className="text-sm"
                style={{
                  color: colors.detail,
                  fontFamily: 'var(--font-sharp-light)'
                }}
              >
                Kapasitas
              </div>
            </div>
            <div className="text-center space-y-2">
              <div
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  color: colors.accent,
                  fontFamily: 'var(--font-header-modern)'
                }}
              >
                24/7
              </div>
              <div
                className="text-sm"
                style={{
                  color: colors.detail,
                  fontFamily: 'var(--font-sharp-light)'
                }}
              >
                Akses
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="space-y-8 sm:space-y-12">

          {/* Facilities Grid */}
          <div className="space-y-8 sm:space-y-12">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-8">
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  color: colors.cardText,
                  fontFamily: 'var(--font-header-modern)',
                  fontSize: 'clamp(26px, 5vw, 32px)',
                  lineHeight: '1.2',
                  fontWeight: '700',
                  letterSpacing: '-0.01em'
                }}
              >
                Fasilitas Unggulan
              </h2>
              <p
                className="text-sm"
                style={{
                  color: colors.detail,
                  fontFamily: 'var(--font-sharp-light)'
                }}
              >
                {facilityCards.length} fasilitas tersedia
              </p>
            </div>

            {/* Facility Rows */}
            <div className="space-y-12 sm:space-y-16">
              {facilityCards.map((facility, index) => (
                <FacilityRow
                  key={facility.id}
                  id={facility.id}
                  title={facility.title}
                  description={facility.description}
                  detail={facility.detail}
                  image={facility.image}
                  features={facility.features}
                  index={index}
                  isReversed={index % 2 === 1} // Alternating layout: even=left, odd=right
                />
              ))}
            </div>
          </div>

          {/* Article-based Facilities (if any) */}
          {filteredArticles.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2
                  className="text-2xl sm:text-3xl font-bold"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-header-modern)',
                    fontSize: 'clamp(26px, 5vw, 32px)',
                    lineHeight: '1.2',
                    fontWeight: '700',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Informasi Tambahan
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <div
                      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      style={{
                        backgroundColor: colors.card,
                        border: `1px solid ${colors.border}`
                      }}
                    >
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
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* No Search Results (only if there are search filters and no results) */}
          {search && articles.length > 0 && filteredArticles.length === 0 && (
            <div className="text-center py-16 px-6">
              <div className="max-w-md mx-auto space-y-4">
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent + '20' }}
                >
                  <FaRoute className="text-2xl" style={{ color: colors.accent }} />
                </div>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: colors.cardText }}
                >
                  Tidak ada fasilitas ditemukan
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-sharp-light)'
                  }}
                >
                  Tidak ada hasil untuk pencarian "{search}". Coba gunakan kata kunci yang berbeda.
                </p>
              </div>
            </div>
          )}

          {/* Operation Hours & Contact Info */}
          <div
            className="rounded-2xl p-6 sm:p-8 space-y-6"
            style={{
              background: `linear-gradient(135deg, ${colors.card} 0%, ${colors.background} 100%)`,
              border: `1px solid ${colors.border}`
            }}
          >
            <div className="text-center space-y-2">
              <h3
                className="text-xl sm:text-2xl font-bold"
                style={{
                  color: colors.cardText,
                  fontFamily: 'var(--font-header-modern)',
                }}
              >
                Informasi Operasional
              </h3>
              <p
                className="text-sm"
                style={{
                  color: colors.detail,
                  fontFamily: 'var(--font-sharp-light)'
                }}
              >
                Ketentuan dan jadwal penggunaan fasilitas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                className="text-center space-y-3 p-4 rounded-xl"
                style={{ backgroundColor: colors.card }}
              >
                <div
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent + '20' }}
                >
                  <span className="text-xl" style={{ color: colors.accent }}>🕐</span>
                </div>
                <h4
                  className="font-semibold"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-sharp-bold)'
                  }}
                >
                  Jam Operasional
                </h4>
                <p
                  className="text-sm"
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-sharp-light)'
                  }}
                >
                  Senin - Minggu<br />
                  05:00 - 22:00 WIB<br />
                  (24 jam untuk ruang shalat)
                </p>
              </div>

              <div
                className="text-center space-y-3 p-4 rounded-xl"
                style={{ backgroundColor: colors.card }}
              >
                <div
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent + '20' }}
                >
                  <span className="text-xl" style={{ color: colors.accent }}>📞</span>
                </div>
                <h4
                  className="font-semibold"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-sharp-bold)'
                  }}
                >
                  Informasi & Reservasi
                </h4>
                <p
                  className="text-sm"
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-sharp-light)'
                  }}
                >
                  Kantor Administrasi<br />
                  08:00 - 17:00 WIB<br />
                  Telp: (021) 123-4567
                </p>
              </div>

              <div
                className="text-center space-y-3 p-4 rounded-xl md:col-span-2 lg:col-span-1"
                style={{ backgroundColor: colors.card }}
              >
                <div
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent + '20' }}
                >
                  <span className="text-xl" style={{ color: colors.accent }}>📋</span>
                </div>
                <h4
                  className="font-semibold"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-sharp-bold)'
                  }}
                >
                  Ketentuan Umum
                </h4>
                <p
                  className="text-sm"
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-sharp-light)'
                  }}
                >
                  Jaga kebersihan<br />
                  Patuhi etika masjid<br />
                  Daftar untuk acara khusus
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
            style={{
              backgroundColor: colors.accent,
              color: 'white'
            }}
            aria-label="Scroll to top"
          >
            <FaChevronUp className="text-lg sm:text-xl" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
