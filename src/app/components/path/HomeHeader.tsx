'use client'

import { useTheme } from '@/context/themeContext'

export default function HomeHeader() {
  const { colors } = useTheme()

  const title = "Masjid Besar Al-Furqon"
  const image = "/images/al-furqon.png"
  const content = `Masjid Besar Al-Furqon, Bekasi Barat bukan hanya tempat ibadah yang luas dan nyaman, tetapi juga pusat kegiatan umat yang menghadirkan berbagai fasilitas penunjang di bawah naungan Yayasan Pondok Mulya Bekasi.

Dilengkapi dengan aula serbaguna Graha Subagdja, masjid ini siap menjadi pilihan untuk berbagai acara penting seperti pertemuan komunitas, kajian, hingga resepsi pernikahan yang berkesan.

Area parkir yang luas memberikan kenyamanan bagi para jamaah, sementara ruang belajar TPO menjadi wadah pembinaan generasi Qurani sejak dini. Tersedia pula ruang keserikatan yang mendukung kolaborasi dan kegiatan sosial masyarakat. Semua hadir dalam suasana yang teduh, bersih, dan penuh berkah.`

  return (
    <section className="space-y-6 md:space-y-8 mb-8">
      <div className="block md:hidden">
        <div className="flex flex-col min-h-screen">
          <h1
            className="text-2xl font-bold leading-tight text-center mt-4 mb-8"
            style={{
              color: colors.cardText,
              fontFamily: 'var(--font-header-masjid)',
              fontSize: 'clamp(30px, 7vw, 38px)',
              lineHeight: '1.2',
              fontWeight: '700',
              letterSpacing: '-0.01em'
            }}
          >
            {title}
          </h1>

          <div className="flex-grow flex items-center justify-center py-8">
            <div className="relative w-full h-60 sm:h-64 rounded-xl overflow-hidden shadow-lg max-w-md mx-auto">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div
            className="space-y-3 text-justify whitespace-pre-line mt-8 mb-8"
            style={{
              color: colors.detail,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: 'clamp(16px, 4vw, 18px)',
              lineHeight: '1.6'
            }}
          >
            {content}
          </div>
        </div>
      </div>

      <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-4 lg:space-y-6">
          <h1
            className="text-3xl font-bold leading-tight"
            style={{
              color: colors.cardText,
              fontFamily: 'var(--font-header-masjid)',
              fontSize: 'clamp(32px, 4vw, 42px)',
              lineHeight: '1.2',
              fontWeight: '700',
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </h1>

          <div
            className="space-y-4 text-justify whitespace-pre-line"
            style={{
              color: colors.detail,
              fontFamily: 'var(--font-sharp-light)',
              fontSize: '16px',
              lineHeight: '1.6'
            }}
          >
            {content}
          </div>
        </div>

        <div className="relative w-full h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
