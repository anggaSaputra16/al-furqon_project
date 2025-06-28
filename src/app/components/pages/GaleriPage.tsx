'use client'

import { useEffect, useState } from 'react'
import { useGalleryStore } from '../../stores/useGalleryStore'
import GalleryMasonry from '@/app/components/path/GalleryMasonry'
import GalleryModal from '@/app/components/path/GalleryModal'
import MasjidHeader from '@/app/components/path/MasjidHeader'
import Footer from '@/app/components/path/Footer'
import { FaBars, FaTimes, FaRoute } from 'react-icons/fa'
import UniversalNavGrid, { NavItem } from '@/app/components/path/UniversalNavGrid'
import { AnimatePresence, motion } from 'framer-motion'
import { useMenuStore } from '@/app/stores/useMenuStore'
import { iconMap } from '@/app/utils/iconMapper'
import { useSearchStore } from '@/app/stores/useSearchStore'
import { useTheme } from '@/context/themeContext'

export default function GaleriPage() {
  const { setImages, images } = useGalleryStore()
  const { search } = useSearchStore()
  const [showNav, setShowNav] = useState(true)
  const { menus, fetchMenus } = useMenuStore()
  const { colors } = useTheme()

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
  }, [])

  const navItems: NavItem[] = menus.map((menu) => {
    const Icon = iconMap[menu.icon] || FaRoute
    return {
      title: menu.title,
      href: `/${menu.slug}`,
      icon: <Icon />,
    }
  })

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

        <section className="space-y-4">
          <h1 className="text-2xl font-bold">Galeri</h1>
          <GalleryMasonry images={filteredImages} />
        </section>
      </div>

      <GalleryModal />
      <Footer />
    </main>
  )
}
