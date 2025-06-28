'use client'

import { useState, useEffect } from 'react'
import GuideSection from '@/app/contents/section/GuideSection'
import AboutSection from '@/app/contents/section/AboutSection'
import UniversalNavGrid, { NavItem } from '../path/UniversalNavGrid'
import { FaRoute, FaChevronUp } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from '../path/Footer'
import ThemeToggle from '../path/ThemeToggle'
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
import UniversalCard from '../path/UniversalCard'
import { donationCards as donationCardsStatic, newsCards, activityCards as activityCardsStatic, upcomingCards as upcomingCardsStatic } from '../../utils/staticData'

export default function HomePage() {
  const [modalData, setModalData] = useState<CardData | null>(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const { colors } = useTheme()
  const { menus, fetchMenus } = useMenuStore()
  const { articles, fetchArticles } = useArticleStore()

  useEffect(() => {
    fetchMenus()
    fetchArticles()
  }, [fetchMenus, fetchArticles])

  // Handle scroll to show scroll-to-top button only
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY

      // Show scroll-to-top button after 200px scroll (earlier for mobile)
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

  const handleDonationSubmit = () => {
    if (!donorName.trim() || !donationAmount.trim()) {
      alert('Mohon lengkapi nama dan nominal donasi')
      return
    }

    // Here you would typically handle the donation submission
    alert(`Terima kasih ${donorName} atas donasi Rp ${parseInt(donationAmount).toLocaleString('id-ID')}. Silakan lanjutkan ke pembayaran.`)
    handleCloseDonationModal()
  }

  const navItems: NavItem[] = menus.map((menu) => {
    const Icon = iconMap[menu.icon] || FaRoute
    return {
      title: menu.title,
      href: `/${menu.slug}`,
      icon: <Icon />,
    }
  })

  const [cards, setCards] = useState<CardData[]>(
    activityCardsStatic.map(card => ({ ...card, size: card.size as 'large' | 'small' }))
  )
  const [upcomingCards, setUpcomingCards] = useState<CardData[]>(
    upcomingCardsStatic.map(card => ({ ...card, size: card.size as 'large' | 'small' }))
  )

  const [donationCards] = useState<CardData[]>(
    donationCardsStatic.map(card => ({ ...card, size: card.size as 'large' | 'small' }))
  );
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
    const newCards = [...cards]
    const [moved] = newCards.splice(from, 1)
    newCards.splice(to, 0, moved)
    setCards(newCards)
  }

  const handleReorderUpcoming = (from: number, to: number) => {
    const newCards = [...upcomingCards]
    const [moved] = newCards.splice(from, 1)
    newCards.splice(to, 0, moved)
    setUpcomingCards(newCards)
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
          <ActivityCarousel articles={articles} autoplay={true} autoplayInterval={10000} />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {donationCards.map((card, index) => (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {newsCards.map((news, idx) => (
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
              className="w-full py-4 rounded-lg font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation group"
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
                💝 Donasi Sekarang
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
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