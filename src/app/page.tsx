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

export default function Page() {
  const [showNav, setShowNav] = useState(true)
  const [modalData, setModalData] = useState<CardData | null>(null)
  const { colors } = useTheme()

  const { menus, fetchMenus } = useMenuStore()

  useEffect(() => {
    fetchMenus()
  }, [])

  const navItems: NavItem[] = menus.map((menu) => {
    const Icon = iconMap[menu.icon] || FaRoute
    return {
      title: menu.title,
      href: `/${menu.slug}`,
      icon: <Icon />,
    }
  })

  const [cards, setCards] = useState<CardData[]>([
    {
      id: '1',
      title: 'Kajian Tematik setiap Ahad Pagi minggu ke Lima',
      description: 'Program - 3 Feb 2024',
      detail: 'Pembahasan tema khusus bersama ustadz tamu setiap akhir bulan. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
      image: '/images/gambar1.jpg',
      size: 'large',
    },
    {
      id: '2',
      title: 'Kajian Spesial Akhir Bulan',
      description: 'Program - 24 Feb 2024',
      detail: 'Kajian eksklusif akhir bulan dengan bahasan fiqh kontemporer. loeem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/images/gambar2.jpg',
      size: 'small',
    },
    {
      id: '3',
      title: 'Pembinaan Remaja Masjid',
      description: 'Program - 10 Feb 2024',
      detail: 'Program khusus untuk pembinaan akhlak dan organisasi remaja masjid.',
      image: '/images/gambar3.jpg',
      size: 'small',
    },
    {
      id: '4',
      title: 'Pembinaan Remaja Masjid',
      description: 'Program - 10 Feb 2024',
      detail: 'Program khusus untuk pembinaan akhlak dan organisasi remaja masjid. lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: '/images/gambar3.jpg',
      size: 'small',
    },
    {
      id: '5',
      title: 'Pembinaan Remaja Masjid',
      description: 'Program - 10 Feb 2024',
      detail: 'Program khusus untuk pembinaan akhlak dan organisasi remaja masjid. lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: '/images/gambar3.jpg',
      size: 'small',
    },
    {
      id: '6',
      title: 'Pembinaan Remaja Masjid',
      description: 'Program - 10 Feb 2024',
      detail: 'Program khusus untuk pembinaan akhlak dan organisasi remaja masjid. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/images/gambar3.jpg',
      size: 'small',
    },
    {
      id: '7',
      title: 'Pembinaan Remaja Masjid',
      description: 'Program - 10 Feb 2024',
      detail: 'Program khusus untuk pembinaan akhlak dan organisasi remaja masjid. lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: '/images/gambar3.jpg',
      size: 'small',
    },
    {
      id: '8',
      title: 'Pembinaan Remaja Masjid',
      description: 'Program - 10 Feb 2024',
      detail: 'Program khusus untuk pembinaan akhlak dan organisasi remaja masjid. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/images/gambar3.jpg',
      size: 'small',
    },
    {
      id: '9',
      title: 'Pembinaan Remaja Masjid',
      description: 'Program - 10 Feb 2024',
      detail: 'Program khusus untuk pembinaan akhlak dan organisasi remaja masjid. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/images/gambar3.jpg',
      size: 'small',
    },
    // ... tambahkan card lainnya sesuai format ini
  ])

  const [upcomingCards, setUpcomingCards] = useState<CardData[]>([
    {
      id: '4',
      title: 'Kajian Spesial Awal Bulan',
      description: 'Program - 10 Maret 2024',
      detail: 'Mengawali bulan dengan kajian ruhiyah dan muhasabah.',
      image: '/images/gambar1.jpg',
      size: 'large',
    },
    {
      id: '5',
      title: 'Pembinaan Remaja Masjid no 2',
      description: 'Program - 12 Maret 2024',
      detail: 'Lanjutan pembinaan sesi pertama untuk remaja masjid.',
      image: '/images/gambar2.jpg',
      size: 'small',
    },
    {
      id: '6',
      title: 'Kajian Ramadhan',
      description: 'Program - 1 April 2024',
      detail: 'Persiapan ruhiyah dan ilmu menyambut bulan suci Ramadhan.',
      image: '/images/gambar3.jpg',
      size: 'small',
    },
    // ... tambahkan card lainnya sesuai format ini
  ])

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
      <main
      style={{ background: colors.background, color: colors.cardText }}
      className="transition-colors duration-500"
    >
      <MasjidHeader />

      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <ThemeToggle />
            <button
              onClick={() => setShowNav(prev => !prev)}
              className="text-xl p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle Navigation"
            >
              {showNav ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Nav Grid */}
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

        {/* Cards */}
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

        <GuideSection />
        <AboutSection />
      </div>

      <ActivityModal data={modalData} onClose={() => setModalData(null)} />
      <Footer />
    </main>
  )
}
