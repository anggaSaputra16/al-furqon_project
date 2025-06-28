'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/themeContext'
import { FaChevronLeft, FaChevronRight, FaCalendar, FaUser, FaArrowRight } from 'react-icons/fa'

interface Article {
  id: string
  title: string
  description?: string
  detail?: string
  content?: string
  image: string
  date?: string
  author?: string
  category?: string
}

interface ActivityCarouselProps {
  articles?: Article[]
  autoplay?: boolean
  autoplayInterval?: number
}

export default function ActivityCarousel({ 
  articles = [], 
  autoplay = true, 
  autoplayInterval = 10000 // 10 seconds
}: ActivityCarouselProps) {
  const { colors } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // Use latest 5 articles
  const latestArticles = articles.slice(0, 5)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || latestArticles.length <= 1) return

    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => {
        // Same logic as goToNext for autoplay
        const isDesktop = window.innerWidth >= 768
        const maxIndex = isDesktop 
          ? Math.max(0, latestArticles.length - 3) 
          : latestArticles.length - 1
        
        const nextIndex = prevIndex + 1
        return nextIndex > maxIndex ? 0 : nextIndex
      })
    }, autoplayInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, latestArticles.length, autoplayInterval])

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setDirection(1)
    // For desktop: move by 1, for mobile: move through all articles
    const maxIndex = window.innerWidth >= 768 
      ? Math.max(0, latestArticles.length - 3) // Desktop: stop when showing last 3 articles
      : latestArticles.length - 1 // Mobile: go through all articles
    
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex > maxIndex ? 0 : nextIndex
    })
    setIsAutoPlaying(false)
  }

  const goToPrev = () => {
    setDirection(-1)
    const maxIndex = window.innerWidth >= 768 
      ? Math.max(0, latestArticles.length - 3)
      : latestArticles.length - 1
    
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1
      return nextIndex < 0 ? maxIndex : nextIndex
    })
    setIsAutoPlaying(false)
  }

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const formatDate = (dateString: string) => {
    // Handle different date formats
    if (!dateString) return 'Tanggal tidak tersedia'
    
    // Try to parse the date string
    let date: Date
    
    // Check if it's already in DD Month YYYY format (Indonesian)
    if (dateString.includes(' ')) {
      // For dates like "27 Mei 2025", we need to convert to valid format
      const monthMap: { [key: string]: string } = {
        'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
        'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
        'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
      }
      
      const parts = dateString.split(' ')
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0')
        const month = monthMap[parts[1]] || '01'
        const year = parts[2]
        date = new Date(`${year}-${month}-${day}`)
      } else {
        date = new Date(dateString)
      }
    } else {
      date = new Date(dateString)
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString // Return original string if can't parse
    }
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // If no articles, show placeholder
  if (!latestArticles.length) {
    return (
      <div className="text-center py-8" style={{ color: colors.subheading }}>
        <p>Belum ada artikel terbaru</p>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mobile: Show 1 card at a time with smooth transition */}
      <div className="block md:hidden">
        <div 
          className="relative overflow-hidden rounded-xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="flex"
            animate={{
              x: `-${currentIndex * 100}%`
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.6
            }}
          >
            {latestArticles.map((article, index) => (
              <div
                key={article.id}
                className="w-full flex-shrink-0 px-2"
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                  style={{
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.border}20`
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Mobile Card Content */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                    {article.category && (
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: colors.accent + '20',
                            color: colors.accent
                          }}
                        >
                          {article.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Meta info */}
                    <div className="flex items-center gap-3 mb-3 text-xs">
                      <div 
                        className="flex items-center gap-1"
                        style={{ color: colors.subheading }}
                      >
                        <FaCalendar className="w-3 h-3" />
                        <span>{article.date ? formatDate(article.date) : 'Tanggal tidak tersedia'}</span>
                      </div>
                      {article.author && (
                        <div 
                          className="flex items-center gap-1"
                          style={{ color: colors.subheading }}
                        >
                          <FaUser className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="font-bold text-lg mb-2 line-clamp-2 leading-tight"
                      style={{
                        color: colors.cardText,
                        fontFamily: 'var(--font-header-modern)',
                        fontSize: 'clamp(16px, 4vw, 18px)'
                      }}
                    >
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm line-clamp-3 mb-4 leading-relaxed"
                      style={{
                        color: colors.detail,
                        fontFamily: 'var(--font-sharp-light)',
                        fontSize: 'clamp(13px, 3vw, 14px)'
                      }}
                    >
                      {article.description || article.content || 'Tidak ada deskripsi tersedia.'}
                    </p>

                    {/* Read more button */}
                    <button
                      className="flex items-center gap-2 group transition-all duration-200 hover:gap-3 font-sharp-bold"
                      style={{
                        color: colors.accent,
                        fontSize: 'clamp(13px, 3vw, 14px)'
                      }}
                    >
                      <span className="text-sm">
                        Baca Selengkapnya
                      </span>
                      <FaArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mobile - No navigation arrows, users know to swipe */}
      </div>

      {/* Desktop: Show multiple cards */}
      <div className="hidden md:block">
        <div className="relative overflow-hidden rounded-xl">
          <motion.div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`
            }}
          >
            {latestArticles.map((article, index) => (
              <div
                key={article.id}
                className="w-1/3 flex-shrink-0 px-2"
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                  style={{
                    backgroundColor: colors.card,
                    border: `1px solid ${colors.border}20`
                  }}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Desktop Card Content - same as before */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {article.category && (
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: colors.accent + '20',
                            color: colors.accent
                          }}
                        >
                          {article.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-5">
                    {/* Meta info */}
                    <div className="flex items-center gap-4 mb-3 text-xs">
                      <div 
                        className="flex items-center gap-1"
                        style={{ color: colors.subheading }}
                      >
                        <FaCalendar className="w-3 h-3" />
                        <span>{article.date ? formatDate(article.date) : 'Tanggal tidak tersedia'}</span>
                      </div>
                      {article.author && (
                        <div 
                          className="flex items-center gap-1"
                          style={{ color: colors.subheading }}
                        >
                          <FaUser className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="font-bold text-lg mb-2 line-clamp-2 leading-tight"
                      style={{
                        color: colors.cardText,
                        fontFamily: 'var(--font-header-modern)',
                        fontSize: 'clamp(16px, 3vw, 18px)'
                      }}
                    >
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm line-clamp-3 mb-4 leading-relaxed"
                      style={{
                        color: colors.detail,
                        fontFamily: 'var(--font-sharp-light)',
                        fontSize: 'clamp(13px, 2.5vw, 14px)'
                      }}
                    >
                      {article.description || article.content || 'Tidak ada deskripsi tersedia.'}
                    </p>

                    {/* Read more button */}
                    <button
                      className="flex items-center gap-2 group transition-all duration-200 hover:gap-3 font-sharp-bold"
                      style={{
                        color: colors.accent,
                        fontSize: 'clamp(13px, 2.5vw, 14px)'
                      }}
                    >
                      <span className="text-sm">
                        Baca Selengkapnya
                      </span>
                      <FaArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Navigation Arrows */}
        {latestArticles.length > 3 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
              style={{
                backgroundColor: colors.card,
                color: colors.cardText,
                border: `2px solid ${colors.border}20`
              }}
              aria-label="Previous slide"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
              style={{
                backgroundColor: colors.card,
                color: colors.cardText,
                border: `2px solid ${colors.border}20`
              }}
              aria-label="Next slide"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Dots Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {/* For desktop: show dots based on number of possible slides */}
        {(() => {
          const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768
          const totalDots = isDesktop 
            ? Math.max(1, latestArticles.length - 2) // Desktop: number of possible slide positions
            : latestArticles.length // Mobile: one dot per article
          
          return Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 touch-manipulation ${
                index === currentIndex 
                  ? 'w-8 h-2 opacity-100' 
                  : 'w-2 h-2 opacity-50 hover:opacity-75'
              }`}
              style={{
                backgroundColor: colors.accent
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))
        })()}
      </div>

      {/* Mobile swipe indicators */}
      <div className="md:hidden text-center mt-4">
        <div className="flex items-center justify-center gap-2">
          <span
            className="text-xs"
            style={{
              color: colors.subheading,
              fontFamily: 'var(--font-sharp-light)'
            }}
          >
            Geser untuk melihat artikel lainnya
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-current opacity-30 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-current opacity-50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-current opacity-70 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        
        {/* Auto-play progress indicator */}
        {isAutoPlaying && latestArticles.length > 1 && (
          <div className="mt-2 mx-auto w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: colors.accent }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ 
                duration: autoplayInterval / 1000,
                ease: 'linear',
                repeat: Infinity
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
