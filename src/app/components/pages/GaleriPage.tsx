'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { FaRoute, FaChevronUp, FaSearch, FaTimes, FaImages } from 'react-icons/fa'

import { useGalleryStore } from '../../stores/useGalleryStore'
import { useMenuStore } from '../../stores/useMenuStore'
import { useSearchStore } from '../../stores/useSearchStore'
import { useTheme } from '@/context/themeContext'
import { iconMap } from '@/app/utils/iconMapper'

import GalleryMasonry from '@/app/components/path/GalleryMasonry'
import GalleryModal from '@/app/components/path/GalleryModal'
import MasjidHeader from '@/app/components/path/MasjidHeader'
import Footer from '@/app/components/path/Footer'
import ThemeToggle from '@/app/components/path/ThemeToggle'
import UniversalNavGrid, { NavItem } from '@/app/components/path/UniversalNavGrid'

export default function GaleriPage() {
  const { setImages, images } = useGalleryStore()
  const { search, setSearch } = useSearchStore()
  const { menus, fetchMenus } = useMenuStore()
  const { colors } = useTheme()
  const searchParams = useSearchParams()

  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFromURL, setFilterFromURL] = useState(false)

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
    setImages([
      {
        id: '1',
        src: '/images/gambar1.jpg',
        alt: 'Al-Qur’an berdiri',
        author: 'Dokumentasi Masjid',
        description: 'Al-Qur’an berdiri di atas meja',
        detail: 'Gambaran kemuliaan kitab suci dengan posisi berdiri penuh hormat.',
      },
      {
        id: '2',
        src: '/images/gambar2.jpg',
        alt: 'Al-Qur’an di atas meja kayu',
        author: 'Studio Dakwah',
        description: 'Meja kayu dengan Al-Qur’an',
        detail: 'Sederhana namun penuh makna, tempat Al-Qur’an diletakkan saat dibaca.',
      },
      {
        id: '3',
        src: '/images/gambar3.jpg',
        alt: 'Anak-anak belajar Al-Qur’an',
        author: 'TPA Al-Furqon',
        description: 'Belajar mengaji bersama',
        detail: 'Anak-anak membaca Al-Qur’an dalam bimbingan ustadz di masjid.',
      },
      {
        id: '4',
        src: '/images/gambar4.jpg',
        alt: 'Suasana masjid setelah shalat',
        author: 'Relawan Masjid',
        description: 'Masjid tenang nan megah',
        detail: 'Interior masjid menenangkan setelah jamaah menyelesaikan ibadah.',
      },
      {
        id: '5',
        src: '/images/gambar5.jpg',
        alt: 'Shalat berjamaah di luar ruangan',
        author: 'Komunitas Muslim',
        description: 'Shalat di jalan raya',
        detail: 'Momen unik umat Muslim tetap shalat berjamaah di tengah kota.',
      },
      {
        id: '6',
        src: '/images/gambar6.jpg',
        alt: 'Al-Qur’an dengan bunga',
        author: 'Muslimah Design',
        description: 'Hiasan bunga dan mushaf',
        detail: 'Menunjukkan penghormatan terhadap Al-Qur’an dalam tata artistik.',
      },
      {
        id: '7',
        src: '/images/gambar7.jpg',
        alt: 'Ayah dan anak shalat bersama',
        author: 'Keluarga Dakwah',
        description: 'Mendidik anak lewat ibadah',
        detail: 'Anak kecil belajar shalat dari sang ayah dengan penuh kasih sayang.',
      },
      {
        id: '8',
        src: '/images/gambar8.jpg',
        alt: 'Arsitektur masjid putih modern',
        author: 'Arsitektur Islami',
        description: 'Pilar dan lengkung masjid',
        detail: 'Desain arsitektur masjid bernuansa putih yang bersih dan agung.',
      },
      {
        id: '9',
        src: '/images/gambar9.jpg',
        alt: 'Al-Qur’an terbuka',
        author: 'Dokumentasi Madrasah',
        description: 'Tadabbur Al-Qur’an',
        detail: 'Mushaf terbuka dengan cahaya memancar, mengajak umat memahami ayat.',
      },
      {
        id: '10',
        src: '/images/gambar10.jpg',
        alt: 'Al-Qur’an dan cahaya terang',
        author: 'Fotografer Dakwah',
        description: 'Belajar dalam terang',
        detail: 'Cahaya dari jendela menerangi halaman Al-Qur’an yang dibaca.',
      },
      {
        id: '11',
        src: '/images/gambar11.jpg',
        alt: 'Shalat di lorong masjid',
        author: 'Santri Dokumentasi',
        description: 'Shalat di lorong',
        detail: 'Jamaah mengambil tempat di lorong masjid saat masjid utama penuh.',
      },
      {
        id: '12',
        src: '/images/gambar12.jpg',
        alt: 'Al-Qur’an dan tasbih',
        author: 'Studio Ibadah',
        description: 'Tasbih di samping mushaf',
        detail: 'Simbol zikir dan tilawah bersatu dalam foto yang menenangkan.',
      },
      {
        id: '13',
        src: '/images/gambar13.jpg',
        alt: 'Mushaf tua berornamen',
        author: 'Pustaka Islam',
        description: 'Keindahan mushaf klasik',
        detail: 'Halaman mushaf penuh warna dan kaligrafi mencerminkan sejarah Islam.',
      },
      {
        id: '14',
        src: '/images/gambar14.jpg',
        alt: 'Jamaah masjid',
        author: 'Media Masjid',
        description: 'Jamaah mendengarkan khutbah',
        detail: 'Momen hening penuh perhatian saat mendengar ceramah di masjid.',
      },
      {
        id: '15',
        src: '/images/gambar15.jpg',
        alt: 'Pemandangan dalam masjid megah',
        author: 'Arsitektur Muslim',
        description: 'Kemegahan dalam kesederhanaan',
        detail: 'Masjid dengan lampu gantung, karpet merah dan langit-langit tinggi.',
      },
      {
        id: '16',
        src: '/images/gambar16.jpg',
        alt: 'Pintu masuk masjid',
        author: 'Dokumentasi',
        description: 'Gerbang masjid',
        detail: 'Gerbang yang megah menyambut jamaah dengan keramahan dan keindahan.',
      },
    ])
  }, [setImages])

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
    setFilterFromURL(false) // Clear URL filter indicator when user manually searches
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearch('')
    setFilterFromURL(false)
  }

  const filteredImages = (images || []).filter((img) => {
    const searchWords = search.toLowerCase().split(' ').filter(Boolean)
    const combinedText = [img.alt, img.description, img.detail, img.author]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchWords.every((word) => combinedText.includes(word))
  })

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
                <>Menampilkan {images.length} foto</>
              )}
            </div>
            {search && (
              <div
                className="text-xs px-3 py-1 rounded-full flex items-center gap-2"
                style={{
                  backgroundColor: colors.accent + '15',
                  color: colors.accent,
                  fontFamily: 'var(--font-sharp-bold)'
                }}
              >
                <span>Pencarian aktif: "{search}"</span>
                {filterFromURL && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    dari fasilitas
                  </span>
                )}
              </div>
            )}
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
                </div>
              </div>

              {/* Gallery Masonry */}
              <GalleryMasonry images={filteredImages} />
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
