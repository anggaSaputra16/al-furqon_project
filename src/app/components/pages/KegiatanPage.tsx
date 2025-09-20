'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { FaSearch, FaRoute, FaChevronUp } from 'react-icons/fa'

import { useMenuStore } from '../../stores/useMenuStore'
import { useArticleStore } from '../../stores/adminArticleStore'
import { useTheme } from '@/context/themeContext'
import { iconMap } from '@/app/utils/iconMapper'
import { useFeaturedArticles } from '../../hooks/useHomePageApi'

import MasjidHeader from '../path/MasjidHeader'
import Footer from '../path/Footer'
import ArticleDetail from '../path/ArticleDetail'
import UniversalNavGrid, { NavItem } from '../path/UniversalNavGrid'

export default function KegiatanPage() {
  const { colors } = useTheme()
  const { articles: apiArticles, loading: articlesLoading, error: articlesError } = useFeaturedArticles(100)
  const { menus, fetchMenus } = useMenuStore()
  const categories = useArticleStore(state => state.categories)
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterFromURL, setFilterFromURL] = useState(false)

  const ARTICLES_PER_PAGE = 8

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam) {
      setSearchQuery(filterParam)
      setFilterFromURL(true)
    }
  }, [searchParams])

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

  const articles = useMemo(() => {
    return apiArticles.map(article => {

      const getCategoryName = (backendCategory: string) => {
        const categoryMap: { [key: string]: string } = {
          'kegiatan': 'Kegiatan',
          'berita': 'Berita',
          'pengumuman': 'Pengumuman',
          'kajian': 'Kajian',
          'program': 'Program',
          'sumbangan': 'Program',
          'fasilitas': 'Kegiatan',
          'profil': 'Pengumuman'
        }
        return categoryMap[backendCategory.toLowerCase()] || 'Kegiatan'
      }

      return {
        id: article.id,
        title: article.title,
        description: article.description,
        detail: article.content,
        content: article.content,
        image: article.image,
        category: getCategoryName(article.category),
        date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : undefined,
        tag: article.tags?.[0] || article.category
      }
    })
  }, [apiArticles])


  const displayCategories = useMemo(() => {
    const categoryMapping: { [key: string]: string } = {
      'Kajian': 'Kajian',
      'Pengumuman': 'Pengumuman',
      'Kegiatan': 'Kegiatan',
      'Berita': 'Berita',
      'Program': 'Program'
    }

    return categories.map(cat => categoryMapping[cat] || cat)
  }, [categories])

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === '' ||
        selectedCategory === article.category

      return matchesSearch && matchesCategory
    })
  }, [articles, searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE)
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const endIndex = startIndex + ARTICLES_PER_PAGE
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

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

  const clearAllFilters = () => {
    setSelectedCategory('')
    setSearchQuery('')
    setFilterFromURL(false)
  }

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== ''

  if (articlesLoading) {
    return (
      <main
        style={{ background: colors.background, color: colors.cardText }}
        className="transition-colors duration-500"
      >
        <MasjidHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 mt-5">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.accent }}></div>
            <p style={{ color: colors.detail, fontFamily: 'var(--font-body)' }}>
              Memuat artikel...
            </p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (articlesError && articles.length === 0) {
    return (
      <main
        style={{ background: colors.background, color: colors.cardText }}
        className="transition-colors duration-500"
      >
        <MasjidHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 mt-5">
          <div className="text-center py-20">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.cardText, fontFamily: 'var(--font-header-modern)' }}>
              Gagal Memuat Artikel
            </h3>
            <p className="text-base mb-6" style={{ color: colors.detail, fontFamily: 'var(--font-body)' }}>
              Terjadi kesalahan saat memuat artikel. Silakan refresh halaman atau coba lagi nanti.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: colors.accent,
                color: 'white',
                fontFamily: 'var(--font-sharp-bold)'
              }}
            >
              Refresh Halaman
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main
      style={{ background: colors.background, color: colors.cardText }}
      className="transition-colors duration-500"
    >
      <MasjidHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 mt-5">
        <div>
          <UniversalNavGrid
            items={navItems}
            variant="default"
            customClass="mb-8"
          />
        </div>

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
              Kegiatan & Artikel
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
              Jelajahi berbagai kegiatan, berita, dan artikel terkait Masjid Al-Furqon
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-8">
            <div className="relative flex-1">
              <FaSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari artikel berdasarkan judul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.cardText,
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px'
                }}
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full sm:w-48 px-4 py-3 pr-10 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.cardText,
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px'
                }}
              >
                <option value="">Semua Kategori</option>
                {displayCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto"
            >
              {searchQuery && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  style={{
                    backgroundColor: colors.accent + '20',
                    color: colors.accent,
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Pencarian: "{searchQuery}"
                  {filterFromURL && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">
                      dari fasilitas
                    </span>
                  )}
                </span>
              )}
              {selectedCategory && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: colors.accent + '20',
                    color: colors.accent,
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  Kategori: {selectedCategory}
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 rounded-full text-sm font-medium hover:bg-red-100"
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontFamily: 'var(--font-body)'
                }}
              >
                Hapus Semua
              </button>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div
              className="text-sm font-medium"
              style={{
                color: colors.detail,
                fontFamily: 'var(--font-body)'
              }}
            >
              Ditemukan {filteredArticles.length} dari {articles.length} artikel
              {articlesLoading && (
                <span className="ml-2 text-xs animate-pulse" style={{ color: colors.accent }}>
                  • Memuat data...
                </span>
              )}
              {filteredArticles.length > ARTICLES_PER_PAGE && (
                <span className="ml-2 text-xs opacity-75">
                  (Menampilkan {ARTICLES_PER_PAGE} per halaman)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <div
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: colors.accent + '15',
                    color: colors.accent,
                    fontFamily: 'var(--font-sharp-bold)'
                  }}
                >
                  Filter aktif
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="space-y-8 sm:space-y-12">
          {selectedArticle ? (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                  style={{
                    backgroundColor: colors.card,
                    color: colors.cardText,
                    border: `2px solid ${colors.accent}`,
                    fontFamily: 'var(--font-sharp-bold)',
                    fontSize: '16px'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali ke Daftar Artikel
                </button>
              </div>

              <div
                className="rounded-2xl overflow-hidden shadow-xl"
                style={{
                  backgroundColor: colors.card,
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="p-8 sm:p-12">
                  <ArticleDetail articleId={selectedArticle} showRelated={false} />
                </div>
              </div>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2
                  className="text-2xl sm:text-3xl font-bold"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-header-modern)',
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    lineHeight: '1.2',
                    fontWeight: '700',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Semua Artikel
                </h2>
                <div
                  className="text-sm px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: colors.accent + '20',
                    color: colors.accent,
                    fontFamily: 'var(--font-sharp-bold)',
                    fontSize: '14px'
                  }}
                >
                  {filteredArticles.length} artikel
                  {totalPages > 1 && (
                    <span className="ml-1 opacity-75">
                      • Hal {currentPage}/{totalPages}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {paginatedArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedArticle(article.id)}
                  >
                    <div
                      className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 h-full flex flex-col"
                      style={{
                        backgroundColor: colors.card,
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      <div className="relative overflow-hidden h-48 sm:h-52 flex-shrink-0">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${article.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div
                          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                          style={{
                            backgroundColor: colors.accent,
                            color: 'white',
                            fontFamily: 'var(--font-sharp-bold)'
                          }}
                        >
                          {article.category}
                        </div>

                        {article.date && (
                          <div
                            className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold shadow-lg"
                            style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              fontFamily: 'var(--font-sharp-bold)'
                            }}
                          >
                            📅 {article.date}
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div
                            className="px-4 py-2 rounded-full text-sm font-bold shadow-xl"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              color: colors.accent,
                              fontFamily: 'var(--font-sharp-bold)'
                            }}
                          >
                            Baca Artikel →
                          </div>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex-1 space-y-3">
                          <h3
                            className="text-lg font-bold leading-tight group-hover:text-opacity-80 transition-colors duration-300"
                            style={{
                              color: colors.cardText,
                              fontFamily: 'var(--font-header-modern)',
                              lineHeight: '1.3',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {article.title}
                          </h3>

                          {article.description && (
                            <p
                              className="text-sm leading-relaxed"
                              style={{
                                color: colors.detail,
                                fontFamily: 'var(--font-body)',
                                lineHeight: '1.6',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {article.description}
                            </p>
                          )}
                        </div>

                        {/* Metadata */}
                        <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: colors.border }}>
                          <div className="flex flex-col">
                            <div
                              className="text-xs font-medium opacity-75"
                              style={{
                                color: colors.detail,
                                fontFamily: 'var(--font-body)'
                              }}
                            >
                              {article.date || 'Artikel Terbaru'}
                            </div>
                            {article.tag && (
                              <div
                                className="text-xs font-medium opacity-60 mt-1"
                                style={{
                                  color: colors.accent,
                                  fontFamily: 'var(--font-sharp-bold)'
                                }}
                              >
                                #{article.tag}
                              </div>
                            )}
                          </div>
                          <div
                            className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              color: colors.accent,
                              fontFamily: 'var(--font-sharp-bold)'
                            }}
                          >
                            Klik untuk baca →
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="text-sm"
                    style={{
                      color: colors.detail,
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    Halaman {currentPage} dari {totalPages} - Menampilkan {startIndex + 1} hingga {Math.min(endIndex, filteredArticles.length)} dari {filteredArticles.length} artikel
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(prev - 1, 1))
                        scrollToTop()
                      }}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: currentPage === 1 ? 'transparent' : colors.card,
                        color: currentPage === 1 ? colors.detail : colors.cardText,
                        border: `1px solid ${colors.border}`,
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Sebelumnya
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1
                        const isCurrentPage = pageNumber === currentPage

                        const shouldShow =
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          Math.abs(pageNumber - currentPage) <= 1

                        if (!shouldShow) {
                          if (pageNumber === 2 && currentPage > 4) {
                            return (
                              <span
                                key={pageNumber}
                                className="px-2 py-1 text-sm"
                                style={{ color: colors.detail }}
                              >
                                ...
                              </span>
                            )
                          }
                          if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                            return (
                              <span
                                key={pageNumber}
                                className="px-2 py-1 text-sm"
                                style={{ color: colors.detail }}
                              >
                                ...
                              </span>
                            )
                          }
                          return null
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => {
                              setCurrentPage(pageNumber)
                              scrollToTop()
                            }}
                            className="w-10 h-10 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                            style={{
                              backgroundColor: isCurrentPage ? colors.accent : colors.card,
                              color: isCurrentPage ? 'white' : colors.cardText,
                              border: `1px solid ${isCurrentPage ? colors.accent : colors.border}`,
                              fontFamily: 'var(--font-sharp-bold)',
                              fontSize: '14px'
                            }}
                          >
                            {pageNumber}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(prev + 1, totalPages))
                        scrollToTop()
                      }}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: currentPage === totalPages ? 'transparent' : colors.card,
                        color: currentPage === totalPages ? colors.detail : colors.cardText,
                        border: `1px solid ${colors.border}`,
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Selanjutnya
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 px-6">
              <div className="max-w-md mx-auto space-y-6">
                <div
                  className="text-8xl opacity-50"
                  style={{ color: colors.detail }}
                >
                  📄
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-header-modern)'
                  }}
                >
                  Tidak Ada Artikel Ditemukan
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-body)',
                    lineHeight: '1.6'
                  }}
                >
                  Maaf, tidak ada artikel yang sesuai dengan pencarian atau filter yang Anda pilih. Silakan coba dengan kata kunci yang berbeda atau ubah filter yang dipilih.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                    style={{
                      backgroundColor: colors.accent,
                      color: 'white',
                      fontFamily: 'var(--font-sharp-bold)'
                    }}
                  >
                    Reset Semua Filter
                  </button>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                    style={{
                      backgroundColor: 'transparent',
                      color: colors.cardText,
                      border: `1px solid ${colors.border}`,
                      fontFamily: 'var(--font-sharp-bold)'
                    }}
                  >
                    Hapus Pencarian
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
            style={{
              backgroundColor: colors.accent,
              color: 'white'
            }}
          >
            <FaChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
