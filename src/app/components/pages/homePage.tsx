'use client'

import { useState, useEffect } from 'react'
import GuideSection from '@/app/contents/section/GuideSection'
import AboutSection from '@/app/contents/section/AboutSection'
import UniversalNavGrid, { NavItem } from '../path/UniversalNavGrid'
import { FaBars, FaTimes, FaRoute } from 'react-icons/fa'
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
  const [showNav, setShowNav] = useState(true)
  const [modalData, setModalData] = useState<CardData | null>(null)
  const { colors } = useTheme()
  const { menus, fetchMenus } = useMenuStore()
  const { articles, fetchArticles } = useArticleStore()

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

        {detailArticle && <ArticleDetail articleId={detailArticle.id} />}        <section className="space-y-6">          <div className="flex justify-between items-center">
          <h2
            className="text-3xl font-bold"
            style={{
              color: colors.cardText,
              fontFamily: 'var(--font-header-modern)',
              fontSize: '28px',
              lineHeight: '1.2',
              fontWeight: '700'
            }}
          >
            Aktivitas Terkini
          </h2>
          <a
            href="#"
            className="text-blue-600 text-sm hover:underline transition-colors font-sharp-light"
            style={{
              fontSize: '14px'
            }}
          >
            Lebih Lengkap
          </a>
        </div>
          <CardLayout cards={cards} onReorder={handleReorder} onShowDetail={setModalData} />
        </section>        <section className="space-y-6 mt-12">
          <div className="flex justify-between items-center">
            <h2
              className="text-3xl font-bold"
              style={{
                color: colors.cardText,
                fontFamily: 'var(--font-header-modern)',
                fontSize: '28px',
                lineHeight: '1.2',
                fontWeight: '700'
              }}
            >
              Program Mendatang
            </h2>
            <a
              href="#"
              className="text-blue-600 text-sm hover:underline transition-colors"
              style={{
                fontFamily: 'var(--font-sharp-light)',
                fontSize: '14px'
              }}
            >
              Lihat Semua
            </a>
          </div>
          <CardLayout cards={upcomingCards} onReorder={handleReorderUpcoming} onShowDetail={setModalData} />
        </section>        <section className="space-y-6 mt-12">
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{
              color: colors.cardText,
              fontFamily: 'var(--font-header-masjid)',
              fontSize: '34px',
              lineHeight: '1.2',
              fontWeight: '900',
              letterSpacing: '-0.02em'
            }}
          >
            Bantuan Keagamaan Kami
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
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
        </section>        <section className="space-y-6 mt-12">
          <h2
            className="text-3xl font-bold text-center mb-8"
            style={{
              color: colors.cardText,
              fontFamily: 'var(--font-header-masjid)',
              fontSize: '34px',
              lineHeight: '1.2',
              fontWeight: '900',
              letterSpacing: '-0.02em'
            }}
          >
            Berita Utama
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
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

      <ActivityModal data={modalData} onClose={() => setModalData(null)} />
      <Footer />

      {/* Modal Donasi */}
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
              fontSize: '16px',
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
              fontSize: '12px'
            }}
          >
            Rekening: 1234567890 (Bank Syariah)
          </span>
        </div>        <form className="space-y-3">
          <input
            type="text"
            placeholder="Nama Donatur"
            className="w-full px-3 py-2 rounded border transition-colors"
            style={{
              background: colors.card,
              color: colors.cardText,
              border: `1px solid ${colors.border}`,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: '14px'
            }}
          />
          <input
            type="number"
            placeholder="Nominal Donasi"
            className="w-full px-3 py-2 rounded border transition-colors"
            style={{
              background: colors.card,
              color: colors.cardText,
              border: `1px solid ${colors.border}`,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: '14px'
            }}
          />
          <button
            type="button"
            className="w-full py-2 rounded-lg font-semibold transition"
            style={{
              background: colors.accent,
              color: colors.card,
              border: `1px solid ${colors.accent}`,
              fontFamily: 'var(--font-sharp-bold)',
              fontSize: '16px'
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
            fontSize: '11px'
          }}
        >
          Simulasi Payment Gateway (QRIS, Transfer, dll)
        </div>
      </UniversalModal>

      <UniversalModal
        open={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        title={selectedNews?.title}
        description={undefined}
        maxWidth="max-w-2xl"
      >
        {selectedNews?.image && (
          <div className="mb-6 w-full h-80 relative rounded-xl overflow-hidden">
            <img src={selectedNews.image} alt={selectedNews.title} className="object-cover w-full h-full" />
          </div>
        )}        {selectedNews?.detail && (
          <div
            className="mb-4 text-xs text-right"
            style={{
              color: colors.detail,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: '12px'
            }}
          >
            {selectedNews.detail}
          </div>
        )}
        {selectedNews?.description && (
          <div
            className="text-base leading-relaxed whitespace-pre-line"
            style={{
              color: colors.cardText,
              maxHeight: 350,
              overflowY: 'auto',
              fontFamily: 'var(--font-sharp-light)',
              fontSize: '16px',
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