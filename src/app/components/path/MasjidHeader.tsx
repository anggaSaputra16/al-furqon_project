'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa'
import banner1 from '@/app/assets/images/banner1.jpg'
import banner2 from '@/app/assets/images/banner2.jpg'
import { useSearchStore } from '@/app/stores/useSearchStore'
import { useTheme } from '@/context/themeContext'
import { fetchJadwalSholat } from '@/app/utils/fetchJadwalSholat'

export default function MasjidHeader() {
  const { colors } = useTheme()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [bannerIndex, setBannerIndex] = useState<number>(0)
  const [hovered, setHovered] = useState<boolean>(false)
  const [minimized, setMinimized] = useState<boolean>(false)

  const { search, setSearch } = useSearchStore()

  const banners = [banner1, banner2]

  const [jadwalSholat, setJadwalSholat] = useState([
    { name: 'Fajr', time: '04:33' },
    { name: 'Dhuhr', time: '12:00' },
    { name: 'Asr', time: '15:30' },
    { name: 'Maghrib', time: '18:10' },
    { name: 'Isha', time: '19:20' },
  ])

  const jadwalSholatRange = [
    { name: 'Fajr', time: '04:33', start: '04:33', end: '12:00' },
    { name: 'Dhuhr', time: '12:00', start: '12:00', end: '15:30' },
    { name: 'Asr', time: '15:30', start: '15:30', end: '18:10' },
    { name: 'Maghrib', time: '18:10', start: '18:10', end: '19:20' },
    { name: 'Isha', time: '19:20', start: '19:20', end: '04:33' },
  ]

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

  useEffect(() => {
    // Bekasi kota id: 703 (lihat dokumentasi API jika ingin kota lain)
    const kotaId = '703'
    const today = new Date()
    const tanggal = today.toISOString().slice(0, 10)
    fetchJadwalSholat(kotaId, tanggal)
      .then((jadwal) => {
        setJadwalSholat([
          { name: 'Fajr', time: jadwal.subuh },
          { name: 'Dhuhr', time: jadwal.dzuhur },
          { name: 'Asr', time: jadwal.ashar },
          { name: 'Maghrib', time: jadwal.maghrib },
          { name: 'Isha', time: jadwal.isya },
        ])
      })
      .catch(() => {/* fallback ke default jika error */})
  }, [])

  const handleSwitchBanner = () => {
    setBannerIndex((prev) => (prev + 1) % banners.length)
  }

  return (
    <div
      className={`relative w-full overflow-hidden shadow-md transition-all duration-300 ${
        minimized ? 'h-[80px]' : 'h-[500px]'
      }`}
      style={{ background: colors.background, color: colors.cardText }}
    >
      <button
        onClick={() => setMinimized((v) => !v)}
        className="absolute top-4 left-4 z-30 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs shadow transition-colors duration-200"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {minimized ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      {!minimized && (
        <Image
          src={banners[bannerIndex]}
          alt="Masjid Banner"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      )}

      {!minimized && (
        <button
          onClick={handleSwitchBanner}
          className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-xs shadow transition-colors duration-200"
        >
          Ganti Gambar
        </button>
      )}

      {!minimized && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
          style={{ color: colors.cardText }}
        >
          <div className="bg-black/40 px-8 py-6 rounded-2xl flex flex-col gap-2 items-center shadow-lg">
            <div className="text-2xl font-bold tracking-widest mb-2" style={{ fontFamily: 'monospace, monospace' }}>
              Jadwal Sholat
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              {jadwalSholat.map((item) => {
                const isActive = item.name === currentSholat.name
                return (
                  <div key={item.name}>
                    <div className={`text-xs uppercase ${isActive ? 'text-yellow-400 font-bold' : 'text-gray-200'}`}>
                      {item.name}
                    </div>
                    <div className={`text-2xl font-mono font-extrabold ${isActive ? 'text-yellow-300' : ''}`}>
                      {item.time}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 p-4 rounded-t-xl shadow-lg transition-all duration-300 z-10 ${
          minimized ? 'bg-opacity-90 bg-black/60' : ''
        }`}
        style={{ background: minimized ? colors.card : colors.card, color: colors.cardText }}
      >
        <div className="flex items-center gap-2">
          <img
            src="/images/logoMasjid.png"
            alt="Logo"
            className="h-10 w-10 object-contain rounded-full bg-white p-1 shadow"
          />
          <span className="text-lg font-bold tracking-widest">Al-Furqon</span>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 shadow ${
            hovered ? 'w-full sm:w-96' : 'w-10 justify-center'
          }`}
          style={{ background: colors.background, color: colors.cardText, minWidth: minimized ? 120 : undefined }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <FaSearch style={{ color: colors.secondary }} />
          {hovered && (
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400"
              style={{ color: colors.cardText }}
            />
          )}
        </div>

        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold uppercase">{currentSholat.name}</span>
          <span className="text-lg font-mono font-extrabold">{currentTime}</span>
        </div>
      </div>
    </div>
  )
}
