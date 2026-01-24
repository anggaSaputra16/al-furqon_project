'use client'

import { useState, useEffect, useMemo } from 'react'
import UniversalNavGrid, { NavItem } from '../path/UniversalNavGrid'
import { FaRoute, FaChevronUp, FaHeart, FaInfoCircle, FaMapMarkedAlt, FaCalendarAlt, FaPhone, FaUsers, FaMicrophone, FaSnowflake, FaCar, FaWifi, FaShieldAlt, FaTimes, FaClock, FaEnvelope, FaChevronDown } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import Footer from '../path/Footer'
import { CardData } from '../../layouts/CardLayout'
import MasjidHeader from '../path/MasjidHeader'
import { useMenuStore } from '../../stores/useMenuStore'
import { iconMap } from '../../utils/iconMapper'
import ActivityModal from '../path/ActivityModal'
import { useTheme } from '@/context/themeContext'
import HomeHeader from '../path/HomeHeader'
import ActivityCarousel from '../path/ActivityCarousel'
import UniversalModal from '../path/UniversalModal'
import ArticleDetail from '../path/ArticleDetail'
import VideoGalleryPage from './VideoGalleryPage'

import {
  useHomePageData,
  useFeaturedArticles,
  usePublishedArticles,
  useActiveDonations,
  useLatestNews,
  useDonationSubmission
} from '../../hooks/useHomePageApi'

export default function HomePage() {
  const [modalData, setModalData] = useState<CardData | null>(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const { colors } = useTheme()
  const { menus, fetchMenus } = useMenuStore()

  const { error: homeError, refetch: refetchHome } = useHomePageData()
  const { articles: publishedArticles, loading: articlesLoading, error: articlesError } = usePublishedArticles(20)
  const { donations: donationPrograms, loading: donationsLoading } = useActiveDonations()
  const { news: latestNews, loading: newsLoading } = useLatestNews()
  const { submitDonation, submitting: donationSubmitting } = useDonationSubmission()

  const hasBackendArticles = publishedArticles && publishedArticles.length > 0
  const hasBackendDonations = donationPrograms && donationPrograms.length > 0
  const hasBackendNews = latestNews && latestNews.length > 0

  const isInitialLoading = (articlesLoading || donationsLoading || newsLoading) &&
    !hasBackendArticles && !hasBackendDonations && !hasBackendNews

  const donationCards = useMemo(() => {
    if (!hasBackendDonations || !donationPrograms) {
      return []
    }

    try {
      return donationPrograms.map((donation: any) => ({
        id: donation.id,
        title: donation.title,
        description: donation.description,
        image: donation.image,
        category: 'sumbangan' as const,
        size: 'large' as const,
        target: donation.target,
        collected: donation.collected,
        percentage: donation.percentage || Math.round((donation.collected / donation.target) * 100),
        details: {
          target: donation.target,
          collected: donation.collected,
          percentage: donation.percentage || Math.round((donation.collected / donation.target) * 100),
          donors: donation.donors?.total || 0
        },
        extra: {
          bankAccount: donation.bankAccount,
          status: donation.status
        }
      }))
    } catch (error) {
      console.error('Error processing donation data:', error)
      return []
    }
  }, [hasBackendDonations, donationPrograms])

  const upcomingCards = useMemo(() => {
    if (!hasBackendNews || !latestNews) {
      return []
    }

    try {
      return latestNews.map((news: any) => {
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
      })
    } catch (error) {
      console.error('Error processing news data:', error)
      return []
    }
  }, [hasBackendNews, latestNews])

  useEffect(() => {
    fetchMenus()
  }, [])

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

  const [showDonationModal, setShowDonationModal] = useState<CardData | null>(null)
  const [donationAmount, setDonationAmount] = useState<string>('')
  const [donorName, setDonorName] = useState<string>('')

  const [selectedNews, setSelectedNews] = useState<{
    image: string;
    title: string;
    description: string;
    detail?: string;
  } | null>(null)

  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  const [grahaActiveTab, setGrahaActiveTab] = useState<'overview' | 'gallery' | 'umkm' | 'contact'>('overview')
  const [selectedGrahaImage, setSelectedGrahaImage] = useState<{ id: string, src: string, alt: string } | null>(null)

  const hasAnyData = hasBackendArticles || hasBackendDonations || hasBackendNews

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

      {selectedArticle ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 mt-5">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{
                  backgroundColor: colors.card,
                  color: colors.cardText,
                  border: `2px solid ${colors.accent}`,
                  fontFamily: 'var(--font-sharp-bold)',
                  fontSize: '16px'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
              </button>
            </div>

            <div
              className="rounded-2xl overflow-hidden shadow-xl"
              style={{
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="p-8 sm:p-12">
                <ArticleDetail articleId={selectedArticle} showRelated={false} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 mt-5">
          <div>
            <UniversalNavGrid
              items={navItems}
              variant="default"
              customClass="mb-8"
            />
          </div>

          <HomeHeader />

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

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16 sm:py-20"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-12 sm:mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5"
                  style={{
                    color: colors.heading,
                    fontFamily: 'var(--font-header-masjid)',
                    lineHeight: '1.15',
                    letterSpacing: '-0.025em',
                    fontSize: 'clamp(32px, 6vw, 56px)'
                  }}
                >
                  Aula Graha Subagdja
                </motion.h2>
              </div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
                style={{
                  backgroundColor: colors.card,
                  border: `1px solid ${colors.border}30`
                }}
                onClick={() => window.location.href = '/graha-subagdja'}
              >
                <div className="relative h-[350px] sm:h-[450px] lg:h-[550px] overflow-hidden">
                  <img
                    src="/images/aulagraha2.jpeg"
                    alt="Graha Subagdja"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute bottom-8 left-6 right-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { value: '1200', label: 'Orang', subtitle: 'Kapasitas Maksimal' },
                      { value: '600', label: 'M²', subtitle: 'Luas Ruangan' },
                      { value: '100+', label: 'Unit', subtitle: 'Area Parkir' },
                      { value: 'AC', label: 'Full', subtitle: 'Sistem Pendingin' }
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="backdrop-blur-lg rounded-2xl p-4 text-center"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(12px)'
                        }}
                      >
                        <div className="flex items-baseline justify-center gap-1 mb-1">
                          <span
                            className="text-2xl sm:text-3xl font-bold text-white"
                            style={{
                              fontFamily: 'var(--font-header-modern)',
                              letterSpacing: '-0.02em'
                            }}
                          >
                            {stat.value}
                          </span>
                          <span
                            className="text-sm text-white/90"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {stat.label}
                          </span>
                        </div>
                        <div
                          className="text-xs text-white/70"
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '11px'
                          }}
                        >
                          {stat.subtitle}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Content Section - Improved Typography */}
                <div className="p-8 sm:p-12 lg:p-14">
                  <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 mb-10">
                    {/* Left Column - Better Spacing */}
                    <div className="space-y-7">
                      <h3
                        className="text-2xl sm:text-3xl font-bold"
                        style={{
                          color: colors.heading,
                          fontFamily: 'var(--font-header-modern)',
                          lineHeight: '1.3',
                          letterSpacing: '-0.015em',
                          fontSize: 'clamp(24px, 4vw, 30px)'
                        }}
                      >
                        Fasilitas Lengkap untuk Acara Anda
                      </h3>

                      <div className="space-y-5">
                        <p
                          className="text-base sm:text-lg"
                          style={{
                            color: colors.detail,
                            fontFamily: 'var(--font-body)',
                            lineHeight: '1.8',
                            fontSize: 'clamp(16px, 2.5vw, 18px)',
                            fontWeight: '400'
                          }}
                        >
                          Graha Subagdja menyediakan ruang indoor modern dengan luas 20M × 30M (total 600M²) tanpa tiang di tengah,
                          memberikan fleksibilitas maksimal untuk berbagai tata letak acara. Ruangan dilengkapiAC Standing berkapasitas
                          besar yang menjamin kenyamanan tamu Anda dalam berbagai kondisi cuaca.
                        </p>

                        <p
                          className="text-base sm:text-lg"
                          style={{
                            color: colors.detail,
                            fontFamily: 'var(--font-body)',
                            lineHeight: '1.8',
                            fontSize: 'clamp(16px, 2.5vw, 18px)',
                            fontWeight: '400'
                          }}
                        >
                          Sound system profesional dengan wireless microphone dan mixer digital memastikan
                          audio berkualitas tinggi untuk presentasi, ceramah, atau hiburan. Sistem pencahayaan yang dapat disesuaikan menciptakan
                          suasana yang tepat untuk setiap momen acara Anda.
                        </p>

                        <p
                          className="text-base sm:text-lg"
                          style={{
                            color: colors.detail,
                            fontFamily: 'var(--font-body)',
                            lineHeight: '1.8',
                            fontSize: 'clamp(16px, 2.5vw, 18px)',
                            fontWeight: '400'
                          }}
                        >
                          Area parkir luas dapat menampung100+ mobil dan 200+ motor,
                          dengan akses mudah dari jalan utama. Keamanan 24/7 dengan sistem CCTV dan petugas terlatih memastikan ketenangan pikiran selama
                          acara berlangsung.
                        </p>
                      </div>

                      {/* Event Types - More Professional */}
                      <div>
                        <h4
                          className="text-sm font-bold mb-4 uppercase"
                          style={{
                            color: colors.accent,
                            fontFamily: 'var(--font-sharp-bold)',
                            letterSpacing: '0.08em',
                            fontSize: '12px'
                          }}
                        >
                          Cocok Untuk Berbagai Acara
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                          {['Resepsi Pernikahan', 'Wisuda', 'Seminar', 'Rapat Kerja', 'PHBI', 'Acara Keluarga'].map((item, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                              style={{
                                backgroundColor: colors.accent + '12',
                                color: colors.accent,
                                fontFamily: 'var(--font-body)',
                                border: `1px solid ${colors.accent}25`,
                                fontSize: '14px',
                                fontWeight: '500'
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Professional Feature List */}
                    <div className="space-y-4">
                      <h4
                        className="text-sm font-bold mb-5 uppercase"
                        style={{
                          color: colors.accent,
                          fontFamily: 'var(--font-sharp-bold)',
                          letterSpacing: '0.08em',
                          fontSize: '12px'
                        }}
                      >
                        Fasilitas Utama
                      </h4>

                      {[
                        { icon: '🎭', title: 'Panggung Pelaminan', desc: 'Ukuran 4M × 12M dengan backdrop profesional' },
                        { icon: '🎤', title: 'Sound System', desc: 'Audio profesional berkualitas tinggi' },
                        { icon: '💒', title: 'Ruang Rias', desc: '2 Ruangan terpisah (Pria & Wanita)' },
                        { icon: '🍽️', title: 'Ruang Catering', desc: 'Dapur bersih dengan meja buffet lengkap' },
                        { icon: '🪑', title: '100 Kursi Eterna', desc: 'Cover putih premium siap pakai' },
                        { icon: '🔒', title: 'Keamanan 24/7', desc: 'Sistem CCTV dan petugas terlatih' }
                      ].map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.08 }}
                          className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md hover:translate-x-1"
                          style={{
                            backgroundColor: colors.background + '40',
                            border: `1px solid ${colors.border}15`
                          }}
                        >
                          <span className="text-3xl flex-shrink-0 mt-0.5">{feature.icon}</span>
                          <div className="flex-1">
                            <h5
                              className="font-bold text-base mb-1.5"
                              style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-header-modern)',
                                fontSize: '15px',
                                letterSpacing: '-0.01em'
                              }}
                            >
                              {feature.title}
                            </h5>
                            <p
                              className="text-sm"
                              style={{
                                color: colors.detail,
                                fontFamily: 'var(--font-body)',
                                lineHeight: '1.6',
                                fontSize: '13px'
                              }}
                            >
                              {feature.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Section - Professional Design */}
                  <div
                    className="rounded-2xl p-8 sm:p-10 text-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent}08 0%, ${colors.accent}03 100%)`,
                      border: `1.5px solid ${colors.accent}20`
                    }}
                  >
                    <p
                      className="text-base sm:text-lg mb-7 max-w-2xl mx-auto"
                      style={{
                        color: colors.cardText,
                        fontFamily: 'var(--font-body)',
                        lineHeight: '1.7',
                        fontSize: 'clamp(15px, 2.5vw, 17px)',
                        fontWeight: '400'
                      }}
                    >
                      Setiap penggunaan fasilitas menggunakan <strong style={{ color: colors.accent, fontFamily: 'var(--font-sharp-bold)' }}>sistem INFAQ</strong> yang membantu pemeliharaan masjid.
                      Kontribusi Anda adalah amal jariah yang berkelanjutan.
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg shadow-lg"
                      style={{
                        backgroundColor: colors.accent,
                        color: 'white',
                        fontFamily: 'var(--font-header-modern)',
                        boxShadow: `0 8px 24px ${colors.accent}35`,
                        fontSize: 'clamp(16px, 2.5vw, 18px)',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      Lihat Detail & Reservasi Sekarang
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-xl"
                      >
                        →
                      </motion.span>
                    </motion.button>

                    <p
                      className="text-xs mt-5"
                      style={{
                        color: colors.detail,
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px'
                      }}
                    >
                      💡 Reservasi minimal 2 minggu sebelum tanggal acara
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

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
                href="/kegiatan"
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
            ) : hasBackendArticles && publishedArticles && publishedArticles.length > 0 ? (
              <ActivityCarousel
                articles={publishedArticles.map((article: any) => ({
                  ...article,
                  author: article.author?.name || article.author || 'Admin'
                }))}
                autoplay={true}
                autoplayInterval={10000}
                onArticleClick={(articleId: string) => setSelectedArticle(articleId)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div
                  className="text-6xl mb-4"
                  style={{ color: colors.detail }}
                >
                  📚
                </div>
                <h3
                  className="text-xl font-semibold"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-header-modern)'
                  }}
                >
                  Belum Ada Aktivitas
                </h3>
                <p
                  className="text-sm text-center max-w-md"
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-sharp-light)'
                  }}
                >
                  Aktivitas terbaru akan ditampilkan di sini. Silakan kembali lagi nanti.
                </p>
              </div>
            )}
          </section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6 mt-8 sm:mt-12"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 sm:mb-8">
                <div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold mb-2"
                    style={{
                      color: colors.cardText,
                      fontFamily: 'var(--font-header-modern)',
                      fontSize: 'clamp(26px, 5vw, 32px)',
                      lineHeight: '1.2',
                      fontWeight: '700',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Video Kajian & Ceramah
                  </h2>
                  <p
                    className="text-sm sm:text-base"
                    style={{
                      color: colors.detail,
                      fontFamily: 'var(--font-sharp-light)',
                      fontSize: 'clamp(13px, 3vw, 15px)',
                      lineHeight: '1.6'
                    }}
                  >
                    Koleksi video kajian Islam, ceramah, dan siraman rohani
                  </p>
                </div>
                <a
                  href="/video"
                  className="text-sm hover:underline transition-all duration-200 font-sharp-bold self-start sm:self-auto hover:gap-1 flex items-center gap-1"
                  style={{
                    color: colors.accent,
                    fontSize: 'clamp(13px, 3vw, 14px)'
                  }}
                >
                  Lihat Semua Video
                  <span className="transition-transform duration-200 hover:translate-x-0.5">→</span>
                </a>
              </div>

              <VideoGalleryPage showHeader={false} maxVideos={6} />
            </div>
          </motion.section>

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

            {donationsLoading && !hasBackendDonations ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.accent }}></div>
                <span className="ml-3 text-sm" style={{ color: colors.detail }}>
                  Memuat program donasi...
                </span>
              </div>
            ) : hasBackendDonations && donationCards.length > 0 ? (
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
                      <div className="relative h-48 sm:h-52 overflow-hidden">
                        <img
                          src={card.image || '/images/placeholder.jpg'}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="p-4 sm:p-5">
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
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div
                  className="text-6xl mb-4"
                  style={{ color: colors.detail }}
                >
                  💝
                </div>
                <h3
                  className="text-xl font-semibold"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-header-modern)'
                  }}
                >
                  Belum Ada Program Donasi
                </h3>
                <p
                  className="text-sm text-center max-w-md"
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-sharp-light)'
                  }}
                >
                  Program donasi akan ditampilkan di sini ketika tersedia. Silakan kembali lagi nanti.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

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

      <UniversalModal
        open={!!showDonationModal}
        onClose={handleCloseDonationModal}
        title={showDonationModal?.title}
        description={showDonationModal?.description}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
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
              src={selectedNews.image || '/images/placeholder.jpg'}
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