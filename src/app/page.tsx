'use client'

import { useState, useEffect } from 'react'
import GuideSection from '@/app/contents/section/GuideSection'
import AboutSection from '@/app/contents/section/AboutSection'
import UniversalNavGrid, { NavItem } from './components/path/UniversalNavGrid'
import { FaBars, FaTimes, FaRoute } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from './components/path/Footer'
import ThemeToggle from './components/path/ThemeToggle'
import CardLayout, { CardData } from './layouts/CardLayout'
import MasjidHeader from './components/path/MasjidHeader'
import { useMenuStore } from './stores/useMenuStore'
import { iconMap } from './utils/iconMapper'
import ActivityModal from './components/path/ActivityModal'
import { useTheme } from '@/context/themeContext'
import ArticleDetail from './components/path/ArticleDetail'
import { useArticleStore } from './stores/useArticleStore'
import { ArticleMode } from './types/articleTypes'
import UniversalModal from './components/path/UniversalModal'
import UniversalCard from './components/path/UniversalCard'
import { donationCards as donationCardsStatic, newsCards, activityCards as activityCardsStatic, upcomingCards as upcomingCardsStatic } from './utils/staticData'

export default function Page() {
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

  // Gunakan state agar tetap bisa set modal, tapi pastikan size bertipe 'large' | 'small'
  const [donationCards] = useState<CardData[]>(
    donationCardsStatic.map(card => ({ ...card, size: card.size as 'large' | 'small' }))
  );
  const [showDonationModal, setShowDonationModal] = useState<CardData | null>(null)

  // State untuk modal berita utama
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

        {detailArticle && <ArticleDetail articleId={detailArticle.id} />}

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Aktivitas Terkini</h2>
            <a href="#" className="text-blue-600 text-sm hover:underline">Lebih Lengkap</a>
          </div>
          <CardLayout cards={cards} onReorder={handleReorder} onShowDetail={setModalData} />
        </section>

        <section className="space-y-4 mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Program Mendatang</h2>
            <a href="#" className="text-blue-600 text-sm hover:underline">Lihat Semua</a>
          </div>
          <CardLayout cards={upcomingCards} onReorder={handleReorderUpcoming} onShowDetail={setModalData} />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-2">Bantuan Keagamaan Kami</h2>
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
        </section>

        <section className="space-y-4 mt-10">
          <h2 className="text-2xl font-bold text-center mb-2">Berita Utama</h2>
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
          <span className="block text-sm mb-1" style={{ color: colors.detail }}>{showDonationModal?.detail}</span>
          <span className="block text-xs" style={{ color: colors.subheading }}>Rekening: 1234567890 (Bank Syariah)</span>
        </div>
        <form className="space-y-3">
          <input type="text" placeholder="Nama Donatur" className="w-full px-3 py-2 rounded border transition-colors" style={{ background: colors.card, color: colors.cardText, border: `1px solid ${colors.border}` }} />
          <input type="number" placeholder="Nominal Donasi" className="w-full px-3 py-2 rounded border transition-colors" style={{ background: colors.card, color: colors.cardText, border: `1px solid ${colors.border}` }} />
          <button type="button" className="w-full py-2 rounded-lg font-semibold transition" style={{ background: colors.accent, color: colors.card, border: `1px solid ${colors.accent}` }}>Bayar Sekarang</button>
        </form>
        <div className="mt-4 text-center text-xs" style={{ color: colors.subheading }}>Simulasi Payment Gateway (QRIS, Transfer, dll)</div>
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
        )}
        {selectedNews?.detail && (
          <div className="mb-4 text-xs text-right" style={{ color: colors.detail }}>{selectedNews.detail}</div>
        )}
        {selectedNews?.description && (
          <div className="text-base leading-relaxed whitespace-pre-line" style={{ color: colors.cardText, maxHeight: 350, overflowY: 'auto' }}>
            {selectedNews.description}
          </div>
        )}
      </UniversalModal>
    </main>
  )
}
