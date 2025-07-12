'use client'

import { useState, useEffect, useMemo } from 'react'
import UniversalNavGrid, { NavItem } from '../path/UniversalNavGrid'
import { FaRoute, FaChevronUp } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from '../path/Footer'
import CardLayout, { CardData } from '../../layouts/CardLayout'
import MasjidHeader from '../path/MasjidHeader'
import { useMenuStore } from '../../stores/useMenuStore'
import { iconMap } from '../../utils/iconMapper'
import ActivityModal from '../path/ActivityModal'
import { useTheme } from '@/context/themeContext'
import HomeHeader from '../path/HomeHeader'
import ActivityCarousel from '../path/ActivityCarousel'
import { useArticleStore } from '../../stores/useArticleStore'
import UniversalModal from '../path/UniversalModal'
import { donationCards as donationCardsStatic, newsCards, activityCards as activityCardsStatic, upcomingCards as upcomingCardsStatic } from '../../utils/staticData'

import {
  useHomePageData,
  useFeaturedArticles,
  useActiveDonations,
  useLatestNews,
  useHomeStats,
  useDonationSubmission
} from '../../hooks/useHomePageApi'

export default function HomePage() {
  const [modalData, setModalData] = useState<CardData | null>(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const { colors } = useTheme()
  const { menus, fetchMenus } = useMenuStore()
  const { articles, fetchArticles } = useArticleStore()

  // New API hooks for backend data
  const { data: homePageData, loading: homeLoading, error: homeError, refetch: refetchHome } = useHomePageData()
  const { articles: featuredArticles, loading: articlesLoading, error: articlesError } = useFeaturedArticles()
  const { donations: donationPrograms, loading: donationsLoading } = useActiveDonations()
  const { news: latestNews, loading: newsLoading } = useLatestNews()
  const { submitDonation, submitting: donationSubmitting } = useDonationSubmission()

  // Smart fallback logic - use backend data if available, otherwise static data
  const hasBackendArticles = featuredArticles && featuredArticles.length > 0
  const hasBackendDonations = donationPrograms && donationPrograms.length > 0
  const hasBackendNews = latestNews && latestNews.length > 0

  // Fix: Use fallback data only when loading is complete and no backend data is available
  const useFallbackData = !articlesLoading && !donationsLoading && !newsLoading &&
    !hasBackendArticles && !hasBackendDonations && !hasBackendNews

  // Fix: Determine if we should show loading state
  const isInitialLoading = (articlesLoading || donationsLoading || newsLoading) &&
    !hasBackendArticles && !hasBackendDonations && !hasBackendNews

  // Optimized: useMemo for derived data
  const activityCards = useMemo(() => (
    hasBackendArticles ? featuredArticles?.map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      image: article.image,
      category: 'kegiatan' as const,
      size: article.featured ? 'large' as const : 'small' as const,
      details: {
        date: article.publishedAt,
        author: article.author?.name || 'Admin',
        views: article.views,
        likes: article.likes
      },
      extra: {
        content: article.content,
        tags: article.tags,
        slug: article.slug
      }
    })) || [] : activityCardsStatic.map(card => ({
      ...card,
      size: card.size as 'large' | 'small',
      category: 'kegiatan' as const
    }))
  ), [hasBackendArticles, featuredArticles])

  const donationCards = useMemo(() => {
    try {
      // Fix: Check for backend donations first
      if (hasBackendDonations) {
        return donationPrograms?.map((donation: any) => {
          return {
            id: donation.id,
            title: donation.title,
            description: donation.description,
            image: donation.image,
            category: 'sumbangan' as const,
            size: 'large' as const,
            details: {
              target: donation.target,
              collected: donation.collected,
              percentage: donation.percentage,
              donors: donation.donors?.total || 0
            },
            extra: {
              bankAccount: donation.bankAccount,
              status: donation.status
            }
          }
        }) || []
      } else {
        // Use static data when no backend data
        return donationCardsStatic.map(card => ({
          ...card,
          size: card.size as 'large' | 'small',
          // Ensure donors structure exists for fallback data
          donors: { total: Math.floor(Math.random() * 50) + 20, recent: [] }
        }))
      }
    } catch (error) {
      // Fallback to static data if there's any error
      return donationCardsStatic.map(card => ({
        ...card,
        size: card.size as 'large' | 'small',
        donors: { total: Math.floor(Math.random() * 50) + 20, recent: [] }
      }))
    }
  }, [hasBackendDonations, donationPrograms])

  const upcomingCards = useMemo(() => {
    try {
      // Fix: Check for backend news first
      if (hasBackendNews) {
        return latestNews?.map((news: any) => {
          // Ensure safe access to nested properties
          const authorName = news.author?.name || news.author || 'Admin Al-Furqon'

          return {
            id: news.id,
            title: news.title,
            description: news.description,
            image: news.image,
            category: 'berita' as const,
            size: 'large' as const,
            details: {
              date: news.publishedAt,
              author: typeof authorName === 'string' ? authorName : 'Admin Al-Furqon',
              priority: news.priority,
              views: news.views
            }
          }
        }) || []
      } else {
        // Use static data when no backend data
        return upcomingCardsStatic.map(card => ({ ...card, size: card.size as 'large' | 'small' }))
      }
    } catch (error) {
      // Fallback to static data if there's any error
      return upcomingCardsStatic.map(card => ({ ...card, size: card.size as 'large' | 'small' }))
    }
  }, [hasBackendNews, latestNews])

  // Only fetchMenus/fetchArticles once on mount
  useEffect(() => {
    fetchMenus()
    fetchArticles()
  }, [])


  
  // Handle scroll to show scroll-to-top button only
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

  // Donation modal functions
  const handleQuickAmount = (amount: number) => {
    setDonationAmount(amount.toString())
  }

  const handleCloseDonationModal = () => {
    setShowDonationModal(null)
    setDonationAmount('')
    setDonorName('')
  }

  const handleDonationSubmit = async () => {
    if (!donorName.trim() || !donationAmount.trim() || !showDonationModal?.id) {
      alert('Mohon lengkapi nama dan nominal donasi')
      return
    }

    try {
      const result = await submitDonation({
        donationId: showDonationModal.id,
        donorName: donorName.trim(),
        amount: parseInt(donationAmount),
        paymentMethod: 'bank_transfer'
      })

      if (result.success) {
        alert(`Terima kasih ${donorName} atas donasi Rp ${parseInt(donationAmount).toLocaleString('id-ID')}. ${result.data?.paymentUrl ? 'Silakan lanjutkan ke pembayaran.' : 'Donasi Anda akan segera diproses.'}`)

        // Redirect to payment if available
        if (result.data?.paymentUrl) {
          window.open(result.data.paymentUrl, '_blank')
        }
      } else {
        alert(`Terjadi kesalahan: ${result.error}`)
      }
    } catch (error) {
      alert('Terjadi kesalahan saat memproses donasi. Silakan coba lagi.')
    } finally {
      handleCloseDonationModal()
    }
  }

  const navItems: NavItem[] = menus.map((menu) => {
    const Icon = iconMap[menu.icon] || FaRoute
    return {
      title: menu.title,
      href: `/${menu.slug}`,
      icon: <Icon />,
    }
  })

  // Legacy state variables for reorder functionality (will be removed when API fully integrated)
  const [cards, setCards] = useState<CardData[]>(
    activityCardsStatic.map(card => ({ ...card, size: card.size as 'large' | 'small' }))
  )

  // Modal and form state
  const [showDonationModal, setShowDonationModal] = useState<CardData | null>(null)
  const [donationAmount, setDonationAmount] = useState<string>('')
  const [donorName, setDonorName] = useState<string>('')

  const [selectedNews, setSelectedNews] = useState<{
    image: string;
    title: string;
    description: string;
    detail?: string;
  } | null>(null)

  const handleReorder = (from: number, to: number) => {
    // Legacy function - will be removed when API fully integrated
    const newCards = [...cards]
    const [moved] = newCards.splice(from, 1)
    newCards.splice(to, 0, moved)
    setCards(newCards)
  }

  // Fix: Determine if we have any data to show (backend or static)
  const hasAnyData = hasBackendArticles || hasBackendDonations || hasBackendNews ||
    activityCards.length > 0 || donationCards.length > 0 || upcomingCards.length > 0

  // ...existing code...

  // Loading component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-24"></div>
        ))}
      </div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
        ))}
      </div>
    </div>
  )

  // Error component with retry
  const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="text-center py-12 space-y-4">
      <div className="text-red-500 text-lg font-semibold">
        Terjadi kesalahan saat memuat data
      </div>
      <div className="text-gray-600 dark:text-gray-400 text-sm">
        {error}
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  )

  // Fix: Show loading state only when initially loading and no data available
  if (isInitialLoading && !hasAnyData) {
    return (
      <main style={{ background: colors.background, color: colors.cardText }} className="transition-colors duration-500">
        <MasjidHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
          <LoadingSkeleton />
        </div>
      </main>
    )
  }

  // Fix: Show error state only if all requests failed and no fallback data
  if ((homeError || articlesError) && !hasAnyData) {
    return (
      <main style={{ background: colors.background, color: colors.cardText }} className="transition-colors duration-500">
        <MasjidHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5">
          <ErrorState error={homeError || articlesError || 'Unknown error'} onRetry={refetchHome} />
        </div>
      </main>
    )
  }

  return (
    <main style={{ background: colors.background, color: colors.cardText }} className="transition-colors duration-500">
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

        {/* Home Header Section */}
        <HomeHeader />

        {/* Aktivitas Terkini Section */}
        <section className="space-y-4 sm:space-y-6">
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
              Aktivitas Terkini
            </h2>
            <a
              href="/artikel"
              className="text-sm hover:underline transition-all duration-200 font-sharp-bold self-start sm:self-auto hover:gap-1 flex items-center gap-1"
              style={{
                color: colors.accent,
                fontSize: 'clamp(13px, 3vw, 14px)'
              }}
            >
              Lebih Lengkap
              <span className="transition-transform duration-200 hover:translate-x-0.5">→</span>
            </a>
          </div>

          {/* Show loading indicator only for this section if still loading */}
          {articlesLoading && !hasBackendArticles ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.accent }}></div>
              <span className="ml-3 text-sm" style={{ color: colors.detail }}>
                Memuat aktivitas...
              </span>
            </div>
          ) : (
            <ActivityCarousel
              articles={hasBackendArticles ?
                featuredArticles?.map((article: any) => ({
                  ...article,
                  author: article.author?.name || article.author || 'Admin'
                })) :
                articles
              }
              autoplay={true}
              autoplayInterval={10000}
            />
          )}
        </section>

        {/* Bantuan Keagamaan Section */}
        <section className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 sm:mb-8">
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
              Bantuan Keagamaan Kami
            </h2>
            <a
              href="/donasi"
              className="text-sm hover:underline transition-all duration-200 font-sharp-bold self-start sm:self-auto hover:gap-1 flex items-center gap-1"
              style={{
                color: colors.accent,
                fontSize: 'clamp(13px, 3vw, 14px)'
              }}
            >
              Lihat Semua Program
              <span className="transition-transform duration-200 hover:translate-x-0.5">→</span>
            </a>
          </div>

          {/* Show loading indicator only for this section if still loading */}
          {donationsLoading && !hasBackendDonations ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.accent }}></div>
              <span className="ml-3 text-sm" style={{ color: colors.detail }}>
                Memuat program donasi...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {donationCards.map((card: any, index: number) => (
                <div
                  key={card.id}
                  className="group"
                >
                  <div
                    className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full border"
                    style={{
                      backgroundColor: colors.card,
                      border: `1px solid ${colors.border}20`,
                      transform: 'translateY(0)',
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      {/* Title */}
                      <h3
                        className="font-bold text-lg mb-3 line-clamp-2 leading-tight"
                        style={{
                          color: colors.cardText,
                          fontFamily: 'var(--font-header-modern)',
                          fontSize: 'clamp(16px, 3vw, 18px)'
                        }}
                      >
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-sm line-clamp-3 mb-4 leading-relaxed"
                        style={{
                          color: colors.detail,
                          fontFamily: 'var(--font-sharp-light)',
                          fontSize: 'clamp(13px, 2.5vw, 14px)'
                        }}
                      >
                        {card.description}
                      </p>

                      {/* CTA Button */}
                      <button
                        onClick={() => setShowDonationModal(card)}
                        className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation group/btn"
                        style={{
                          backgroundColor: colors.accent,
                          color: colors.card,
                          border: `1px solid ${colors.accent}`,
                          fontFamily: 'var(--font-sharp-bold)',
                          fontSize: 'clamp(14px, 3vw, 15px)'
                        }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          Donasi Sekarang
                          <span className="transition-transform duration-200 group-hover/btn:translate-x-1">💝</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Berita Utama Section */}
        <section className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 sm:mb-8">
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
              Berita Utama
            </h2>
            <a
              href="/berita"
              className="text-sm hover:underline transition-all duration-200 font-sharp-bold self-start sm:self-auto hover:gap-1 flex items-center gap-1"
              style={{
                color: colors.accent,
                fontSize: 'clamp(13px, 3vw, 14px)'
              }}
            >
              Lihat Semua Berita
              <span className="transition-transform duration-200 hover:translate-x-0.5">→</span>
            </a>
          </div>

          {/* Show loading indicator only for this section if still loading */}
          {newsLoading && !hasBackendNews ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.accent }}></div>
              <span className="ml-3 text-sm" style={{ color: colors.detail }}>
                Memuat berita...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(hasBackendNews ? upcomingCards : newsCards).map((news: any, idx: number) => (
                <motion.div
                  key={news.title + idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.1,
                    ease: 'easeOut'
                  }}
                  className="group"
                >
                  <div
                    className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full border"
                    style={{
                      backgroundColor: colors.card,
                      border: `1px solid ${colors.border}20`,
                      transform: 'translateY(0)',
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Date Badge */}
                      {news.detail && (
                        <div
                          className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-md"
                          style={{
                            backgroundColor: `${colors.accent}90`,
                            color: colors.card,
                            fontFamily: 'var(--font-sharp-bold)',
                            fontSize: 'clamp(10px, 2.5vw, 11px)'
                          }}
                        >
                          {news.detail}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      {/* Title */}
                      <h3
                        className="font-bold text-lg mb-3 line-clamp-2 leading-tight"
                        style={{
                          color: colors.cardText,
                          fontFamily: 'var(--font-header-modern)',
                          fontSize: 'clamp(16px, 3vw, 18px)'
                        }}
                      >
                        {news.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-sm line-clamp-3 mb-4 leading-relaxed"
                        style={{
                          color: colors.detail,
                          fontFamily: 'var(--font-sharp-light)',
                          fontSize: 'clamp(13px, 2.5vw, 14px)'
                        }}
                      >
                        {news.description}
                      </p>

                      {/* CTA Button */}
                      <button
                        onClick={() => setSelectedNews(news)}
                        className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation group/btn border-2 border-transparent hover:border-current"
                        style={{
                          backgroundColor: 'transparent',
                          color: colors.accent,
                          border: `2px solid ${colors.accent}`,
                          fontFamily: 'var(--font-sharp-bold)',
                          fontSize: 'clamp(14px, 3vw, 15px)'
                        }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          Baca Selengkapnya
                          <span className="transition-transform duration-200 group-hover/btn:translate-x-1">📖</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Scroll to Top Button - Enhanced for both desktop and mobile */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={scrollToTop}
            className="scroll-to-top-mobile fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation group"
            style={{
              backgroundColor: colors.accent,
              color: colors.card,
              border: `2px solid ${colors.accent}`,
              minWidth: '52px',
              minHeight: '52px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)'
            }}
            aria-label="Scroll to top"
          >
            <motion.div
              className="flex items-center justify-center"
              initial={{ y: 0 }}
              animate={{ y: [-1, 0, -1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FaChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <ActivityModal data={modalData} onClose={() => setModalData(null)} />
      <Footer />

      {/* Modal Donasi - Enhanced UI */}
      <UniversalModal
        open={!!showDonationModal}
        onClose={handleCloseDonationModal}
        title={showDonationModal?.title}
        description={showDonationModal?.description}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          {/* Progress Indicator */}
          {showDonationModal?.target && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}08`, border: `1px solid ${colors.accent}15` }}>
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-sm font-medium"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-sharp-bold)',
                    fontSize: 'clamp(13px, 3vw, 14px)'
                  }}
                >
                  Target Donasi
                </span>
                <span
                  className="text-sm font-bold"
                  style={{
                    color: colors.accent,
                    fontFamily: 'var(--font-sharp-bold)',
                    fontSize: 'clamp(13px, 3vw, 14px)'
                  }}
                >
                  Rp {showDonationModal.target.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: `${colors.accent}20` }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: colors.accent,
                    width: `${Math.min((showDonationModal.collected || 0) / showDonationModal.target * 100, 100)}%`
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-2">
                <span
                  className="text-xs"
                  style={{
                    color: colors.subheading,
                    fontFamily: 'var(--font-sharp-light)',
                    fontSize: 'clamp(11px, 2.5vw, 12px)'
                  }}
                >
                  Terkumpul: Rp {(showDonationModal.collected || 0).toLocaleString('id-ID')}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{
                    color: colors.accent,
                    fontFamily: 'var(--font-sharp-bold)',
                    fontSize: 'clamp(11px, 2.5vw, 12px)'
                  }}
                >
                  {Math.min(Math.round((showDonationModal.collected || 0) / showDonationModal.target * 100), 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Program Details */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.accent}10`, border: `1px solid ${colors.accent}20` }}>
            <div className="flex items-start gap-3">
              <div
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: colors.accent }}
              />
              <div>
                <span
                  className="block text-sm mb-1 font-medium"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-sharp-bold)',
                    fontSize: 'clamp(14px, 3vw, 15px)',
                    lineHeight: '1.5'
                  }}
                >
                  {showDonationModal?.detail}
                </span>
                <span
                  className="block text-xs"
                  style={{
                    color: colors.subheading,
                    fontFamily: 'var(--font-sharp-light)',
                    fontSize: 'clamp(11px, 2.5vw, 12px)'
                  }}
                >
                  Bank Syariah Indonesia • Rekening: 1234567890
                </span>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <form className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{
                  color: colors.cardText,
                  fontFamily: 'var(--font-sharp-bold)',
                  fontSize: 'clamp(13px, 3vw, 14px)'
                }}
              >
                Nama Donatur
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 touch-manipulation"
                style={{
                  backgroundColor: colors.card,
                  color: colors.cardText,
                  border: `1px solid ${colors.border}40`,
                  fontFamily: 'var(--font-sharp-light)',
                  fontSize: 'clamp(14px, 3vw, 16px)'
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{
                  color: colors.cardText,
                  fontFamily: 'var(--font-sharp-bold)',
                  fontSize: 'clamp(13px, 3vw, 14px)'
                }}
              >
                Nominal Donasi
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm"
                  style={{ color: colors.subheading }}
                >
                  Rp
                </span>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 touch-manipulation"
                  style={{
                    backgroundColor: colors.card,
                    color: colors.cardText,
                    border: `1px solid ${colors.border}40`,
                    fontFamily: 'var(--font-sharp-light)',
                    fontSize: 'clamp(14px, 3vw, 16px)'
                  }}
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[50000, 100000, 250000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleQuickAmount(amount)}
                    className="py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
                    style={{
                      backgroundColor: donationAmount === amount.toString() ? colors.accent : `${colors.accent}15`,
                      color: donationAmount === amount.toString() ? colors.card : colors.accent,
                      border: `1px solid ${colors.accent}30`,
                      fontFamily: 'var(--font-sharp-bold)'
                    }}
                  >
                    Rp {amount.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDonationSubmit}
              disabled={donationSubmitting}
              className="w-full py-4 rounded-lg font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.accent,
                color: colors.card,
                border: `1px solid ${colors.accent}`,
                fontFamily: 'var(--font-sharp-bold)',
                fontSize: 'clamp(15px, 3.5vw, 16px)',
                boxShadow: `0 4px 12px ${colors.accent}30`
              }}
            >
              <span className="flex items-center justify-center gap-2">
                {donationSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    💝 Donasi Sekarang
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </>
                )}
              </span>
            </button>
          </form>

          <div
            className="mt-4 text-center text-xs p-3 rounded-lg"
            style={{
              color: colors.subheading,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: 'clamp(10px, 2vw, 11px)',
              backgroundColor: `${colors.background}50`,
              border: `1px solid ${colors.border}20`
            }}
          >
            🔒 Transaksi Aman • QRIS • Transfer Bank • E-Wallet
          </div>
        </div>
      </UniversalModal>

      {/* Modal Berita - Mobile Optimized */}
      <UniversalModal
        open={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        title={selectedNews?.title}
        description={undefined}
        maxWidth="max-w-2xl"
      >
        {selectedNews?.image && (
          <div className="mb-4 sm:mb-6 w-full h-60 sm:h-80 relative rounded-xl overflow-hidden">
            <img
              src={selectedNews.image}
              alt={selectedNews.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {selectedNews?.detail && (
          <div
            className="mb-3 sm:mb-4 text-xs text-right"
            style={{
              color: colors.detail,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: 'clamp(11px, 2.5vw, 12px)'
            }}
          >
            {selectedNews.detail}
          </div>
        )}

        {selectedNews?.description && (
          <div
            className="text-base leading-relaxed whitespace-pre-line mobile-scroll"
            style={{
              color: colors.cardText,
              maxHeight: 'clamp(300px, 50vh, 350px)',
              overflowY: 'auto',
              fontFamily: 'var(--font-sharp-light)',
              fontSize: 'clamp(15px, 3.5vw, 16px)',
              lineHeight: '1.6'
            }}
          >
            {selectedNews.description}
          </div>
        )}
      </UniversalModal>
    </main>
  )
}