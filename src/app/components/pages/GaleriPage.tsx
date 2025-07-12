'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { FaRoute, FaChevronUp, FaSearch, FaTimes, FaImages } from 'react-icons/fa'

import { useMenuStore } from '../../stores/useMenuStore'
import { useSearchStore } from '../../stores/useSearchStore'
import { useTheme } from '@/context/themeContext'
import { iconMap } from '@/app/utils/iconMapper'
import { useFeaturedArticles } from '../../hooks/useHomePageApi'

import GalleryMasonry from '@/app/components/path/GalleryMasonry'
import GalleryModal from '@/app/components/path/GalleryModal'
import MasjidHeader from '@/app/components/path/MasjidHeader'
import Footer from '@/app/components/path/Footer'
import UniversalNavGrid, { NavItem } from '@/app/components/path/UniversalNavGrid'

export default function GaleriPage() {
  // Use API hook to get articles and extract images
  const { articles: apiArticles, loading: articlesLoading, error: articlesError } = useFeaturedArticles(100)
  const { search, setSearch } = useSearchStore()
  const { menus, fetchMenus } = useMenuStore()
  const { colors } = useTheme()
  const searchParams = useSearchParams()

  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFromURL, setFilterFromURL] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const IMAGES_PER_PAGE = 50

  // Transform articles to gallery images format
  const images = useMemo(() => {
    if (!apiArticles || apiArticles.length === 0) {
      return []
    }

    // Extract images from articles
    return apiArticles.map((article, index) => ({
      id: article.id,
      src: article.image,
      alt: article.title,
      author: article.author?.name || 'Admin Al-Furqon',
      description: article.description || article.title,
      detail: article.content ? article.content.substring(0, 200) + '...' : article.description,
      articleTitle: article.title,
      articleDate: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : undefined,
      category: article.category
    }))
  }, [apiArticles])

  // Filter images based on search
  const filteredImages = useMemo(() => {
    if (!searchQuery && !search) return images

    const searchTerm = (searchQuery || search).toLowerCase()
    return images.filter((img) => {
      const searchWords = searchTerm.split(' ').filter(Boolean)
      const combinedText = [img.alt, img.description, img.detail, img.author, img.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchWords.every((word) => combinedText.includes(word))
    })
  }, [images, searchQuery, search])

  // Pagination calculations
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE)
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE
  const endIndex = startIndex + IMAGES_PER_PAGE
  const paginatedImages = filteredImages.slice(startIndex, endIndex)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, search])

  // Handle URL filter parameter
  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam) {
      setSearchQuery(filterParam)
      setSearch(filterParam)
      setFilterFromURL(true)
    }
  }, [searchParams, setSearch])

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

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSearch(value)
    setFilterFromURL(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearch('')
    setFilterFromURL(false)
  }

  // Loading State
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
              Memuat galeri foto...
            </p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Error State
  if (articlesError && images.length === 0) {
    return (
      <main
        style={{ background: colors.background, color: colors.cardText }}
        className="transition-colors duration-500"
      >
        <MasjidHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 mt-5">
          <div className="text-center py-20">
            <div className="text-red-500 text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.cardText, fontFamily: 'var(--font-header-modern)' }}>
              Gagal Memuat Galeri
            </h3>
            <p className="text-base mb-6" style={{ color: colors.detail, fontFamily: 'var(--font-body)' }}>
              Terjadi kesalahan saat memuat foto dari artikel. Silakan refresh halaman atau coba lagi nanti.
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
        {/* Navigation Grid */}
        <div>
          <UniversalNavGrid
            items={navItems}
            variant="default"
            customClass="mb-8"
          />
        </div>

        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-8 sm:py-12"
        >
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
              Galeri Foto
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
              Dokumentasi kegiatan dan momen-momen berkesan di Masjid Al-Furqon
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <FaSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari foto berdasarkan deskripsi, penulis, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.cardText,
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px'
                }}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaTimes className="text-gray-400" size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div
              className="text-sm font-medium"
              style={{
                color: colors.detail,
                fontFamily: 'var(--font-body)'
              }}
            >
              {search ? (
                <>Ditemukan {filteredImages.length} dari {images.length} foto</>
              ) : (
                <>Menampilkan {images.length} foto dari {apiArticles.length} artikel</>
              )}
              {articlesLoading && (
                <span className="ml-2 text-xs animate-pulse" style={{ color: colors.accent }}>
                  • Memuat data...
                </span>
              )}
              {filteredImages.length > IMAGES_PER_PAGE && (
                <span className="ml-2 text-xs opacity-75">
                  (Menampilkan {IMAGES_PER_PAGE} per halaman)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {search && (
                <div
                  className="text-xs px-3 py-1 rounded-full flex items-center gap-2"
                  style={{
                    backgroundColor: colors.accent + '15',
                    color: colors.accent,
                    fontFamily: 'var(--font-sharp-bold)'
                  }}
                >
                  <span>Pencarian: "{search}"</span>
                  {filterFromURL && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      dari fasilitas
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Gallery Section */}
        <section className="space-y-6 sm:space-y-8">
          {filteredImages.length > 0 ? (
            <div className="space-y-6">
              {/* Gallery Header */}
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
                  {search ? 'Hasil Pencarian' : 'Semua Foto'}
                </h2>
                <div
                  className="text-sm px-4 py-2 rounded-full flex items-center gap-2"
                  style={{
                    backgroundColor: colors.accent + '20',
                    color: colors.accent,
                    fontFamily: 'var(--font-sharp-bold)',
                    fontSize: '14px'
                  }}
                >
                  <FaImages size={14} />
                  {filteredImages.length} foto
                  {totalPages > 1 && (
                    <span className="ml-1 opacity-75">
                      • Hal {currentPage}/{totalPages}
                    </span>
                  )}
                </div>
              </div>

              {/* Gallery Masonry - Show paginated images */}
              <GalleryMasonry images={paginatedImages} />

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t"
                  style={{ borderColor: colors.border }}
                >
                  {/* Page Info */}
                  <div
                    className="text-sm"
                    style={{
                      color: colors.detail,
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    Halaman {currentPage} dari {totalPages} - Menampilkan {startIndex + 1} hingga {Math.min(endIndex, filteredImages.length)} dari {filteredImages.length} foto
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
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

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1
                        const isCurrentPage = pageNumber === currentPage

                        // Show first page, last page, current page, and pages around current page
                        const shouldShow =
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          Math.abs(pageNumber - currentPage) <= 1

                        if (!shouldShow) {
                          // Show ellipsis for gaps
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

                    {/* Next Button */}
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
                  🖼️
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-header-modern)'
                  }}
                >
                  Tidak Ada Foto Ditemukan
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-body)',
                    lineHeight: '1.6'
                  }}
                >
                  Maaf, tidak ada foto yang sesuai dengan pencarian Anda. Silakan coba dengan kata kunci yang berbeda.
                </p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: colors.accent,
                    color: 'white',
                    fontFamily: 'var(--font-sharp-bold)'
                  }}
                >
                  Lihat Semua Foto
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Scroll to Top Button */}
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

      <GalleryModal />
      <Footer />
    </main>
  )
}
