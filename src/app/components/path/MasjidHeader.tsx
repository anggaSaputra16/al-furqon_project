'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp, FaSun, FaCloudSun, FaCloudMoon, FaMoon, FaRegClock } from 'react-icons/fa'
import banner1 from '@/app/assets/images/banner1.jpg'
import banner2 from '@/app/assets/images/banner2.jpg'
import banner3 from '@/app/assets/images/banner3.jpg'
import { useTheme } from '@/context/themeContext'
import { fetchJadwalSholat } from '@/app/utils/fetchJadwalSholat'
import ThemeToggle from '@/app/components/path/ThemeToggle'

export default function MasjidHeader() {
  const { colors, theme, toggleTheme } = useTheme()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [bannerIndex, setBannerIndex] = useState<number>(0)
  const [showArabicName, setShowArabicName] = useState<boolean>(false)
  const [scrollY, setScrollY] = useState<number>(0)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // Pilih banner sesuai theme
  const banners = theme === 'dark' ? [banner1] : theme === 'dusk' ? [banner3] : [banner2]

  const [jadwalSholat, setJadwalSholat] = useState([
    { name: 'Fajr', time: '04:44' },
    { name: 'Dhuhr', time: '12:01' },
    { name: 'Asr', time: '15:22' },
    { name: 'Maghrib', time: '17:54' },
    { name: 'Isha', time: '19:08' },
  ])

  // Generate jadwalSholatRange dinamis berdasarkan data API
  const jadwalSholatRange = jadwalSholat.map((item, index) => {
    const nextIndex = (index + 1) % jadwalSholat.length
    const endTime = jadwalSholat[nextIndex].time
    return {
      name: item.name,
      time: item.time,
      start: item.time,
      end: endTime
    }
  })

  function getCurrentSholat() {
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    for (let i = 0; i < jadwalSholatRange.length; i++) {
      const start = jadwalSholatRange[i].start.split(':')
      const end = jadwalSholatRange[i].end.split(':')
      const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1])
      let endMinutes = parseInt(end[0]) * 60 + parseInt(end[1])
      if (endMinutes <= startMinutes) endMinutes += 24 * 60
      let nowCheck = nowMinutes
      if (nowMinutes < startMinutes) nowCheck += 24 * 60
      if (nowCheck >= startMinutes && nowCheck < endMinutes) {
        return jadwalSholatRange[i]
      }
    }
    return jadwalSholatRange[0]
  }
  // Function untuk mendapatkan sholat selanjutnya
  function getNextSholat() {
    const currentIndex = jadwalSholat.findIndex(j => j.name === currentSholat.name)
    const nextIndex = (currentIndex + 1) % jadwalSholat.length
    return jadwalSholat[nextIndex]
  }

  // Function untuk format hari dan tanggal
  function getDateInfo() {
    const now = new Date()
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

    const dayName = days[now.getDay()]
    const date = now.getDate()
    const month = months[now.getMonth()]
    const year = now.getFullYear()

    return {
      dayName,
      dateString: `${date} ${month} ${year}`
    }
  }

  // Get current sholat berdasarkan jadwalSholatRange yang dinamis
  const currentSholat = getCurrentSholat()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Animasi transisi nama masjid
  useEffect(() => {
    const interval = setInterval(() => {
      setShowArabicName(prev => !prev)
    }, 4000) // Ganti setiap 4 detik

    return () => clearInterval(interval)
  }, [])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 100) // Hide theme toggle after 100px scroll
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    handleResize()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    // Bekasi kota id: 1221 (KOTA BEKASI)
    const kotaId = '1221'
    const today = new Date()
    const tanggal = today.toISOString().slice(0, 10)
    fetchJadwalSholat(kotaId, tanggal)
      .then((jadwal) => {
        // Update jadwal sholat dengan data dari API
        setJadwalSholat([
          { name: 'Fajr', time: jadwal.subuh },
          { name: 'Dhuhr', time: jadwal.dzuhur },
          { name: 'Asr', time: jadwal.ashar },
          { name: 'Maghrib', time: jadwal.maghrib },
          { name: 'Isha', time: jadwal.isya },
        ])
      })
      .catch((error) => {
        console.warn('Gagal mengambil jadwal sholat dari API, menggunakan fallback:', error)
        // fallback sudah ada di initial state
      })
  }, [])

  // --- Auto theme by waktu sholat ---
  useEffect(() => {
    if (!jadwalSholat.length) return;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const getMinutes = (time: string) => {
      const [h, m] = time.split(":");
      return parseInt(h) * 60 + parseInt(m);
    };
    const fajr = jadwalSholat.find(j => j.name === 'Fajr')?.time || '04:44';
    const ashr = jadwalSholat.find(j => j.name === 'Asr')?.time || '15:22';
    const maghrib = jadwalSholat.find(j => j.name === 'Maghrib')?.time || '17:54';
    const isha = jadwalSholat.find(j => j.name === 'Isha')?.time || '19:08';
    const fajrM = getMinutes(fajr);
    const ashrM = getMinutes(ashr);
    const maghribM = getMinutes(maghrib);
    const ishaM = getMinutes(isha);
    let nextTheme = 'light';
    if (nowMinutes >= ashrM && nowMinutes < ishaM) {
      nextTheme = 'dusk'; // Senja
    } else if (nowMinutes >= ishaM || nowMinutes < fajrM) {
      nextTheme = 'dark'; // Malam
    } else if (nowMinutes >= fajrM && nowMinutes < ashrM) {
      nextTheme = 'light'; // Siang
    }
    if (theme !== nextTheme) {
      toggleTheme(); // toggleTheme sudah cycle, jadi akan sync
    }
    // eslint-disable-next-line
  }, [jadwalSholat]);

  // Ganti handleSwitchBanner agar tidak error jika hanya 1 banner
  const handleSwitchBanner = () => {
    if (banners.length > 1) {
      setBannerIndex((prev) => (prev + 1) % banners.length)
    }
  }

  // Pilih icon sesuai waktu sholat selanjutnya
  const nextSholat = getNextSholat()
  const dateInfo = getDateInfo()

  let nextSholatIcon = <FaRegClock className="text-3xl text-white" />
  if (nextSholat?.name === 'Fajr') nextSholatIcon = <FaSun className="text-3xl text-yellow-400" />
  else if (nextSholat?.name === 'Dhuhr') nextSholatIcon = <FaCloudSun className="text-3xl text-yellow-500" />
  else if (nextSholat?.name === 'Asr') nextSholatIcon = <FaCloudSun className="text-3xl text-orange-400" />
  else if (nextSholat?.name === 'Maghrib') nextSholatIcon = <FaCloudMoon className="text-3xl text-orange-500" />
  else if (nextSholat?.name === 'Isha') nextSholatIcon = <FaMoon className="text-3xl text-blue-400" />

  return (
    <div
      className="relative w-full overflow-hidden shadow-md h-[500px]"
      style={{ background: colors.background, color: colors.cardText }}
    >
      {/* Header Top Bar: Theme Toggle - Only visible when not scrolled */}
      <div className={`absolute top-4 left-4 flex items-center gap-2 z-30 transition-all duration-500 ${isScrolled ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'
        }`}>
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <div className="rounded-full bg-white/80 dark:bg-gray-800/80 shadow p-1 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <ThemeToggle />
            <span
              className="ml-2 text-xs font-semibold uppercase tracking-wide"
              style={{
                color: colors.accent,
                fontFamily: 'var(--font-sharp-light)',
                fontSize: '11px',
                letterSpacing: '0.08em'
              }}
            >
              {theme === 'light'}
            </span>
          </div>
        </div>
      </div>

      <Image
        src={banners[bannerIndex]}
        alt="Masjid Banner"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />

      {banners.length > 1 && (
        <button
          onClick={handleSwitchBanner}
          className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-xs shadow transition-colors duration-200"
        >
          Ganti Gambar
        </button>
      )}

      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
        style={{ color: colors.cardText }}
      >
        <div className="bg-black/50 backdrop-blur-sm px-4 md:px-8 py-4 md:py-6 rounded-2xl flex flex-col md:flex-row gap-4 md:gap-10 items-center shadow-2xl border border-white/20 max-w-sm md:max-w-5xl mx-4">
          {/* Date Info Section */}
          <div className="text-center min-w-[120px] md:min-w-[140px]">
            <div
              className="text-lg md:text-2xl font-semibold text-white mb-1 md:mb-2"
              style={{
                fontFamily: 'var(--font-header-modern)',
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '600'
              }}
            >
              {dateInfo.dayName}
            </div>
            <div
              className="text-sm md:text-lg text-white/80"
              style={{
                fontFamily: 'var(--font-sharp-light)',
                fontSize: isMobile ? '14px' : '18px'
              }}
            >
              {dateInfo.dateString}
            </div>
          </div>

          {/* Divider - Horizontal on mobile, Vertical on desktop */}
          <div className="w-16 h-[1px] md:w-[1px] md:h-20 bg-white/30"></div>

          {/* Quick Prayer Times - Responsive Layout */}
          <div className="grid grid-cols-5 md:flex gap-2 md:gap-6 text-center w-full md:w-auto">
            {jadwalSholat.map((item) => {
              const isNext = item.name === nextSholat?.name
              const isCurrent = item.name === currentSholat.name
              return (
                <div
                  key={item.name}
                  className={`transition-all duration-300 min-w-[45px] md:min-w-[70px] ${isNext ? 'scale-105 md:scale-110 opacity-100' :
                    isCurrent ? 'opacity-80' : 'opacity-60'
                    }`}
                >
                  <div
                    className={`text-xs md:text-base uppercase ${isNext ? 'text-yellow-300' :
                      isCurrent ? 'text-white/70' : 'text-white/50'
                      }`}
                    style={{
                      fontFamily: 'var(--font-sharp-light)',
                      fontSize: isMobile ? '10px' : '14px',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    className={`text-sm md:text-2xl font-mono ${isNext ? 'text-yellow-300 font-bold' :
                      isCurrent ? 'text-white/80' : 'text-white/60'
                      }`}
                    style={{
                      fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", monospace',
                      fontSize: isMobile ? '14px' : '20px',
                      fontWeight: '700',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.time}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar - Logo, Animated Name, Time */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 md:gap-3 p-3 md:p-4 rounded-t-xl shadow-lg transition-all duration-300 z-10"
        style={{ background: colors.card, color: colors.cardText }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="/images/logoMasjid.png"
            alt="Logo"
            className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-full bg-white p-1 shadow"
          />
          <div className="relative h-6 md:h-8 flex items-center min-w-[120px] md:min-w-[140px]">
            <span
              className={`text-lg md:text-xl font-bold tracking-widest transition-all duration-700 absolute whitespace-nowrap ${showArabicName ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              style={{
                fontFamily: 'var(--font-header-masjid)',
                fontSize: isMobile ? '20px' : '26px',
                letterSpacing: '0.15em',
                fontWeight: '900',
                transform: showArabicName ? 'translateY(8px)' : 'translateY(0px)'
              }}
            >
              Al-Furqon
            </span>
            <span
              className={`text-lg md:text-xl font-bold tracking-widest transition-all duration-700 absolute whitespace-nowrap ${showArabicName ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              style={{
                fontFamily: 'var(--font-arabic)',
                fontSize: isMobile ? '22px' : '28px',
                letterSpacing: '0.15em',
                fontWeight: '900',
                transform: showArabicName ? 'translateY(0px)' : 'translateY(-8px)'
              }}
            >
              الفرقان
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span
            className="text-xl md:text-2xl font-mono font-extrabold tracking-wider"
            style={{
              fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", monospace',
              fontSize: isMobile ? '20px' : '24px',
              letterSpacing: '0.1em'
            }}
          >
            {currentTime}
          </span>
        </div>
      </div>
    </div>
  )
}
