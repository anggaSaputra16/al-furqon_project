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
import ArticleDetail from '../path/ArticleDetail'
import { useArticleStore } from '../../stores/useArticleStore'
import { ArticleMode } from '../../types/articleTypes'
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

  const navItems: NavItem[] = menus.map((menu) => {
    const Icon = iconMap[menu.icon] || FaRoute
    return {
      title: menu.title,
      href: `/${menu.slug}`,
      icon: <Icon />,
    }
  })

  const detailArticle = articles.find((a) => a.id === 'masjid-overview' && a.mode === ArticleMode.DETAIL)

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

        {detailArticle && <ArticleDetail articleId={detailArticle.id} />}

        {/* Aktivitas Terkini Section */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{
                color: colors.cardText,
                fontFamily: 'var(--font-header-modern)',
                fontSize: 'clamp(24px, 4vw, 28px)',
                lineHeight: '1.2',
                fontWeight: '700'
              }}
            >
              Aktivitas Terkini
            </h2>
            <a
              href="#"
              className="text-blue-600 text-sm hover:underline transition-colors font-sharp-light self-start sm:self-auto"
              style={{
                fontSize: '13px'
              }}
            >
              Lebih Lengkap
            </a>
          </div>
          <CardLayout cards={cards} onReorder={handleReorder} onShowDetail={setModalData} />
        </section>

        {/* Program Mendatang Section */}
        <section className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{
                color: colors.cardText,
                fontFamily: 'var(--font-header-modern)',
                fontSize: 'clamp(24px, 4vw, 28px)',
                lineHeight: '1.2',
                fontWeight: '700'
              }}
            >
              Program Mendatang
            </h2>
            <a
              href="#"
              className="text-blue-600 text-sm hover:underline transition-colors self-start sm:self-auto"
              style={{
                fontFamily: 'var(--font-sharp-light)',
                fontSize: '13px'
              }}
            >
              Lihat Semua
            </a>
          </div>
          <CardLayout cards={upcomingCards} onReorder={handleReorderUpcoming} onShowDetail={setModalData} />
        </section>

        {/* Bantuan Keagamaan Section */}
        <section className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8"
            style={{
              color: colors.cardText,
              fontFamily: 'var(--font-header-masjid)',
              fontSize: 'clamp(26px, 5vw, 34px)',
              lineHeight: '1.2',
              fontWeight: '900',
              letterSpacing: '-0.02em'
            }}
          >
            Bantuan Keagamaan Kami
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {donationCards.map((card) => (
              <UniversalCard
                key={card.id}
                image={card.image}
                title={card.title}
                description={card.description}
                detail={card.detail}
                onButtonClick={() => setShowDonationModal(card)}
                buttonLabel="Donasi Sekarang"
              />
            ))}
          </div>
        </section>

        {/* Berita Utama Section */}
        <section className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8"
            style={{
              color: colors.cardText,
              fontFamily: 'var(--font-header-masjid)',
              fontSize: 'clamp(26px, 5vw, 34px)',
              lineHeight: '1.2',
              fontWeight: '900',
              letterSpacing: '-0.02em'
            }}
          >
            Berita Utama
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {newsCards.map((news, idx) => (
              <UniversalCard
                key={news.title + idx}
                variant="modern"
                image={news.image}
                title={news.title}
                description={news.description}
                detail={news.detail}
                buttonLabel="Baca Selengkapnya"
                onButtonClick={() => setSelectedNews(news)}
              />
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

      {/* Modal Donasi - Mobile Optimized */}
      <UniversalModal
        open={!!showDonationModal}
        onClose={() => setShowDonationModal(null)}
        title={showDonationModal?.title}
        description={showDonationModal?.description}
        maxWidth="max-w-md"
      >
        <div className="mb-4">
          <span
            className="block text-sm mb-1"
            style={{
              color: colors.detail,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: 'clamp(14px, 3vw, 16px)',
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
            Rekening: 1234567890 (Bank Syariah)
          </span>
        </div>

        <form className="space-y-3">
          <input
            type="text"
            placeholder="Nama Donatur"
            className="w-full px-3 py-3 sm:py-2 rounded border transition-colors touch-manipulation"
            style={{
              background: colors.card,
              color: colors.cardText,
              border: `1px solid ${colors.border}`,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: 'clamp(14px, 3vw, 16px)'
            }}
          />
          <input
            type="number"
            placeholder="Nominal Donasi"
            className="w-full px-3 py-3 sm:py-2 rounded border transition-colors touch-manipulation"
            style={{
              background: colors.card,
              color: colors.cardText,
              border: `1px solid ${colors.border}`,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: 'clamp(14px, 3vw, 16px)'
            }}
          />
          <button
            type="button"
            className="w-full py-3 sm:py-2 rounded-lg font-semibold transition touch-manipulation"
            style={{
              background: colors.accent,
              color: colors.card,
              border: `1px solid ${colors.accent}`,
              fontFamily: 'var(--font-sharp-bold)',
              fontSize: 'clamp(15px, 3.5vw, 16px)'
            }}
          >
            Bayar Sekarang
          </button>
        </form>
        <div
          className="mt-4 text-center text-xs"
          style={{
            color: colors.subheading,
            fontFamily: 'var(--font-sharp-light)',
            fontSize: 'clamp(10px, 2vw, 11px)'
          }}
        >
          Simulasi Payment Gateway (QRIS, Transfer, dll)
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