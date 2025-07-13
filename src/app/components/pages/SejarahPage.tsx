'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FaRoute, FaChevronUp, FaClock, FaMapMarkerAlt, FaUsers, FaHeart } from 'react-icons/fa'

import { useMenuStore } from '../../stores/useMenuStore'
import { useTheme } from '@/context/themeContext'
import { iconMap } from '@/app/utils/iconMapper'

import MasjidHeader from '../path/MasjidHeader'
import Footer from '../path/Footer'
import ThemeToggle from '../path/ThemeToggle'
import UniversalNavGrid, { NavItem } from '../path/UniversalNavGrid'

export default function SejarahPage() {
  const { colors } = useTheme()
  const { menus, fetchMenus } = useMenuStore()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

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

  return (
    <main
      style={{ background: colors.background, color: colors.cardText }}
      className="transition-colors duration-500"
    >
      <MasjidHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12 mt-5">
        {/* Navigation Grid */}
        <div>
          <UniversalNavGrid
            items={navItems}
            variant="default"
            customClass="mb-8"
          />
        </div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-8 sm:py-12"
        >
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
              style={{
                color: colors.heading,
                fontFamily: 'var(--font-header-masjid)',
                fontSize: 'clamp(36px, 8vw, 64px)',
                lineHeight: '1.1',
                fontWeight: '900',
                letterSpacing: '-0.02em'
              }}
            >
              Sejarah Masjid Al-Furqon
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{
                color: colors.detail,
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(18px, 4vw, 22px)',
                lineHeight: '1.6'
              }}
            >
              Perjalanan spiritual dan pembangunan yang menginspirasi lebih dari dua dekade
            </motion.p>
          </div>

          {/* Timeline Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              backgroundColor: colors.accent + '20',
              border: `2px solid ${colors.accent}`,
            }}
          >
            <FaClock
              style={{ color: colors.accent }}
              size={20}
            />
            <span
              className="font-bold text-base"
              style={{
                color: colors.accent,
                fontFamily: 'var(--font-sharp-bold)'
              }}
            >
              1999 - 2025 | 26 Tahun Perjalanan
            </span>
          </motion.div>
        </motion.section>

        {/* Main Article Content */}
        <article className="space-y-12 sm:space-y-16">
          {/* Section 1: Awal Mula */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <h2
                  className="text-3xl sm:text-4xl font-bold"
                  style={{
                    color: colors.heading,
                    fontFamily: 'var(--font-header-masjid)',
                    lineHeight: '1.2',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Awal Mula Berdirinya
                </h2>
                <div className="space-y-4 text-justify leading-relaxed">
                  <p
                    style={{
                      color: colors.detail,
                      fontFamily: 'var(--font-body)',
                      fontSize: '17px',
                      lineHeight: '1.7'
                    }}
                  >
                    Pada tahun 1999, sekelompok warga muslim di kawasan ini merasa perlu untuk memiliki tempat ibadah yang dapat menampung kebutuhan spiritual masyarakat setempat. Dengan semangat gotong royong dan tekad yang kuat, mereka mulai mengumpulkan dana dan mencari lokasi yang strategis.
                  </p>
                  <p
                    style={{
                      color: colors.detail,
                      fontFamily: 'var(--font-body)',
                      fontSize: '17px',
                      lineHeight: '1.7'
                    }}
                  >
                    Nama "Al-Furqon" dipilih dengan penuh makna, mengacu pada salah satu nama Al-Quran yang berarti "pembeda antara yang haq dan yang bathil". Nama ini mencerminkan harapan agar masjid ini menjadi pusat pembelajaran dan pemahaman yang benar tentang Islam.
                  </p>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="/images/gambar1.jpg"
                    alt="Foto awal pembangunan Masjid Al-Furqon"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p
                      className="text-white text-sm font-medium bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Foto pembangunan awal tahun 1999
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Masa Pembangunan */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="/images/gambar2.jpg"
                    alt="Proses pembangunan masjid"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p
                      className="text-white text-sm font-medium bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Gotong royong masyarakat dalam pembangunan
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="order-1 lg:order-2 space-y-6">
                <h2
                  className="text-3xl sm:text-4xl font-bold"
                  style={{
                    color: colors.heading,
                    fontFamily: 'var(--font-header-masjid)',
                    lineHeight: '1.2',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Masa Pembangunan
                </h2>
                <div className="space-y-4 text-justify leading-relaxed">
                  <p
                    style={{
                      color: colors.detail,
                      fontFamily: 'var(--font-body)',
                      fontSize: '17px',
                      lineHeight: '1.7'
                    }}
                  >
                    Proses pembangunan berlangsung selama dua tahun dengan melibatkan seluruh lapisan masyarakat. Dari yang menyumbang dana hingga yang menyumbang tenaga, semua bergotong royong membangun rumah Allah ini. Para tukang lokal bekerja dengan penuh keikhlasan, seringkali tanpa mengambil upah penuh.
                  </p>
                  <p
                    style={{
                      color: colors.detail,
                      fontFamily: 'var(--font-body)',
                      fontSize: '17px',
                      lineHeight: '1.7'
                    }}
                  >
                    Tantangan terbesar datang dari keterbatasan dana dan akses material bangunan. Namun, dengan doa dan usaha keras, satu per satu masalah dapat teratasi. Ibu-ibu PKK bahkan mengadakan bazaar dan arisan untuk menambah dana pembangunan.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-12"
          >
            <div
              className="rounded-3xl p-8 sm:p-12"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
            >
              <h3
                className="text-2xl sm:text-3xl font-bold text-center mb-8"
                style={{
                  color: colors.heading,
                  fontFamily: 'var(--font-header-masjid)'
                }}
              >
                Masjid Al-Furqon Dalam Angka
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center space-y-3"
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.accent + '20' }}
                  >
                    <FaClock style={{ color: colors.accent }} size={24} />
                  </div>
                  <div>
                    <p
                      className="text-3xl font-bold"
                      style={{
                        color: colors.accent,
                        fontFamily: 'var(--font-sharp-bold)'
                      }}
                    >
                      26+
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: colors.detail,
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Tahun Beroperasi
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center space-y-3"
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.accent + '20' }}
                  >
                    <FaUsers style={{ color: colors.accent }} size={24} />
                  </div>
                  <div>
                    <p
                      className="text-3xl font-bold"
                      style={{
                        color: colors.accent,
                        fontFamily: 'var(--font-sharp-bold)'
                      }}
                    >
                      500+
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: colors.detail,
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Jamaah Aktif
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center space-y-3"
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.accent + '20' }}
                  >
                    <FaMapMarkerAlt style={{ color: colors.accent }} size={24} />
                  </div>
                  <div>
                    <p
                      className="text-3xl font-bold"
                      style={{
                        color: colors.accent,
                        fontFamily: 'var(--font-sharp-bold)'
                      }}
                    >
                      1200
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: colors.detail,
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Kapasitas Jamaah
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center space-y-3"
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.accent + '20' }}
                  >
                    <FaHeart style={{ color: colors.accent }} size={24} />
                  </div>
                  <div>
                    <p
                      className="text-3xl font-bold"
                      style={{
                        color: colors.accent,
                        fontFamily: 'var(--font-sharp-bold)'
                      }}
                    >
                      50+
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: colors.detail,
                        fontFamily: 'var(--font-body)'
                      }}
                    >
                      Program Sosial
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Perkembangan */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center space-y-6">
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{
                  color: colors.heading,
                  fontFamily: 'var(--font-header-masjid)',
                  lineHeight: '1.2',
                  letterSpacing: '-0.01em'
                }}
              >
                Era Perkembangan dan Renovasi
              </h2>
              <p
                className="text-lg max-w-3xl mx-auto leading-relaxed"
                style={{
                  color: colors.detail,
                  fontFamily: 'var(--font-body)',
                  lineHeight: '1.6'
                }}
              >
                Seiring berjalannya waktu, kebutuhan akan fasilitas yang lebih memadai semakin meningkat
              </p>
            </div>

            <div className="grid gap-8">
              <div className="grid lg:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
                >
                  <Image
                    src="/images/gambar3.jpg"
                    alt="Renovasi masjid tahap 1"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p
                      className="text-white text-sm font-medium bg-black/60 px-3 py-2 rounded-lg backdrop-blur-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Renovasi tahap pertama (2005)
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
                >
                  <Image
                    src="/images/gambar4.jpg"
                    alt="Penambahan fasilitas"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p
                      className="text-white text-sm font-medium bg-black/60 px-3 py-2 rounded-lg backdrop-blur-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Penambahan fasilitas (2010)
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
                >
                  <Image
                    src="/images/gambar5.jpg"
                    alt="Masjid masa kini"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p
                      className="text-white text-sm font-medium bg-black/60 px-3 py-2 rounded-lg backdrop-blur-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Wujud masa kini (2020-2025)
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4 text-justify leading-relaxed max-w-4xl mx-auto">
                <p
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-body)',
                    fontSize: '17px',
                    lineHeight: '1.7'
                  }}
                >
                  Pada tahun 2005, renovasi besar pertama dilakukan untuk memperluas ruang sholat dan menambah fasilitas wudhu. Kemudian pada 2010, dilakukan penambahan ruang serbaguna yang dapat digunakan untuk berbagai kegiatan dakwah dan sosial.
                </p>
                <p
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-body)',
                    fontSize: '17px',
                    lineHeight: '1.7'
                  }}
                >
                  Renovasi terbesar terjadi pada 2015-2017, di mana masjid mendapat tambahan lantai dua, ruang perpustakaan, dan fasilitas pembelajaran Al-Quran yang lebih memadai. Sistem audio dan AC juga dipasang untuk kenyamanan jamaah.
                </p>
                <p
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-body)',
                    fontSize: '17px',
                    lineHeight: '1.7'
                  }}
                >
                  Hingga kini, Masjid Al-Furqon terus berkembang dengan berbagai program dan fasilitas modern, namun tetap mempertahankan nilai-nilai tradisional dan semangat gotong royong yang menjadi fondasinya.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 4: Peran di Masyarakat */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <h2
                  className="text-3xl sm:text-4xl font-bold"
                  style={{
                    color: colors.heading,
                    fontFamily: 'var(--font-header-masjid)',
                    lineHeight: '1.2',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Peran di Tengah Masyarakat
                </h2>
                <div className="space-y-4 text-justify leading-relaxed">
                  <p
                    style={{
                      color: colors.detail,
                      fontFamily: 'var(--font-body)',
                      fontSize: '17px',
                      lineHeight: '1.7'
                    }}
                  >
                    Masjid Al-Furqon tidak hanya berfungsi sebagai tempat ibadah, tetapi juga sebagai pusat kegiatan sosial dan pendidikan masyarakat. Berbagai program seperti santunan anak yatim, bantuan untuk fakir miskin, dan kursus keterampilan rutin diselenggarakan.
                  </p>
                  <p
                    style={{
                      color: colors.detail,
                      fontFamily: 'var(--font-body)',
                      fontSize: '17px',
                      lineHeight: '1.7'
                    }}
                  >
                    Setiap Ramadhan, masjid menjadi pusat kegiatan iftar bersama yang dihadiri ratusan jamaah. Program tahfidz Al-Quran untuk anak-anak juga menjadi kebanggaan tersendiri, dengan puluhan hafidz cilik yang telah diluluskan.
                  </p>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="/images/gambar6.jpg"
                    alt="Kegiatan sosial masjid"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p
                      className="text-white text-sm font-medium bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Kegiatan sosial dan dakwah masyarakat
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Final Vision Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8 py-12"
          >
            <div
              className="rounded-3xl p-8 sm:p-12 space-y-6"
              style={{
                backgroundColor: colors.accent + '10',
                border: `2px solid ${colors.accent}20`
              }}
            >
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{
                  color: colors.heading,
                  fontFamily: 'var(--font-header-masjid)',
                  lineHeight: '1.2',
                  letterSpacing: '-0.01em'
                }}
              >
                Visi Masa Depan
              </h2>
              <p
                className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
                style={{
                  color: colors.detail,
                  fontFamily: 'var(--font-body)',
                  lineHeight: '1.7'
                }}
              >
                Masjid Al-Furqon berkomitmen untuk terus menjadi mercusuar spiritualitas dan pemberdayaan masyarakat. Dengan rencana pengembangan fasilitas digital, program dakwah online, dan ekspansi kegiatan sosial, kami optimis dapat melayani umat dengan lebih baik di era modern ini.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg"
                style={{
                  backgroundColor: colors.accent,
                  color: 'white',
                  fontFamily: 'var(--font-sharp-bold)'
                }}
              >
                <FaHeart size={20} />
                Bersama Membangun Masa Depan
              </motion.div>
            </div>
          </motion.section>
        </article>
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

      <Footer />
      <ThemeToggle />
    </main>
  )
}
