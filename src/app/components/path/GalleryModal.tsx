'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaCompress,
  FaDownload,
  FaShare,
  FaHeart,
  FaInfo,
  FaUser
} from 'react-icons/fa'

import { useGalleryStore } from '../../stores/useGalleryStore'
import { useTheme } from '@/context/themeContext'

export default function GalleryModal() {
  const { selectedImage, setSelectedImage, images } = useGalleryStore()
  const { colors } = useTheme()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (selectedImage && images) {
      const index = images.findIndex(img => img.id === selectedImage.id)
      setCurrentIndex(index)
    }
  }, [selectedImage, images])

  const goToPrevious = useCallback(() => {
    if (images && currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1])
      setIsLoading(true)
    }
  }, [images, currentIndex, setSelectedImage])

  const goToNext = useCallback(() => {
    if (images && currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1])
      setIsLoading(true)
    }
  }, [images, currentIndex, setSelectedImage])


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return

      switch (e.key) {
        case 'Escape':
          setSelectedImage(null)
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case 'f':
        case 'F':
          setIsFullscreen(prev => !prev)
          break
        case 'i':
        case 'I':
          setShowInfo(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, setSelectedImage, goToPrevious, goToNext])


  const handleDownload = async () => {
    if (!selectedImage) return

    try {
      const response = await fetch(selectedImage.src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${selectedImage.alt || 'image'}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
    }
  }


  const handleShare = async () => {
    if (!selectedImage) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedImage.alt,
          text: selectedImage.description,
          url: window.location.href
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link disalin ke clipboard!')
    }
  }

  if (!selectedImage) return null

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: isFullscreen ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={() => setSelectedImage(null)}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`relative ${isFullscreen ? 'w-full h-full' : 'max-w-7xl w-full mx-4 my-8'} rounded-2xl overflow-hidden shadow-2xl`}
          style={{ backgroundColor: colors.card }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Controls */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`absolute top-0 left-0 right-0 z-30 ${isFullscreen ? 'p-2' : 'p-3 sm:p-4'}`}
          >
            {isFullscreen ? (
              /* Fullscreen Mode - Completely transparent overlay */
              <div className="flex justify-between items-center">
                <span
                  className="text-white/70 text-xs font-medium px-2 py-1 rounded"
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
                    fontWeight: '500',
                    fontSize: '11px',
                    textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                  }}
                >
                  {currentIndex + 1} / {images?.length || 1}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowInfo(prev => !prev)}
                    className="p-1.5 rounded text-white/70 hover:text-white transition-all duration-200"
                    title="Toggle Info (I)"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    <FaInfo size={14} />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(prev => !prev)}
                    className="p-1.5 rounded text-white/70 hover:text-white transition-all duration-200"
                    title="Exit Fullscreen (F)"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    <FaCompress size={14} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-1.5 rounded text-white/70 hover:text-red-400 transition-all duration-200"
                    title="Close (Esc)"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Mode - Structured layout */
              <div className="flex justify-between items-start gap-4">
                {/* Left side - Counter */}
                <div className="flex-shrink-0">
                  <span
                    className="inline-block text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full backdrop-blur-md"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      fontFamily: 'system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                    }}
                  >
                    {currentIndex + 1} / {images?.length || 1}
                  </span>
                </div>

                {/* Right side - Action buttons */}
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full p-1"
                    style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
                  >
                    <button
                      onClick={() => setShowInfo(prev => !prev)}
                      className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
                      title="Toggle Info (I)"
                    >
                      <FaInfo size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsFullscreen(prev => !prev)}
                      className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
                      title="Fullscreen (F)"
                    >
                      <FaExpand size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
                      title="Download"
                    >
                      <FaDownload size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
                      title="Share"
                    >
                      <FaShare size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-red-500/50 text-white transition-all duration-200"
                      title="Close (Esc)"
                    >
                      <FaTimes size={12} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Content */}
          <div className={`flex ${isFullscreen ? 'h-full' : 'h-[80vh]'} ${showInfo ? 'flex-col lg:flex-row' : 'flex-col'} ${isFullscreen ? 'pt-6' : 'pt-16'}`}>
            {/* Image Section */}
            <div className={`relative ${showInfo && !isFullscreen ? 'lg:w-2/3' : 'w-full'} ${isFullscreen ? 'h-full' : 'h-2/3 lg:h-full'} bg-black flex items-center justify-center`}>
              {/* Loading Spinner */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
                  >
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Image */}
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  onLoad={() => setIsLoading(false)}
                  priority
                />
              </motion.div>

              {/* Navigation Arrows */}
              <AnimatePresence>
                {images && images.length > 1 && (
                  <>
                    {currentIndex > 0 && (
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-200 z-10"
                        title="Previous (←)"
                      >
                        <FaChevronLeft size={20} />
                      </motion.button>
                    )}

                    {currentIndex < images.length - 1 && (
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-200 z-10"
                        title="Next (→)"
                      >
                        <FaChevronRight size={20} />
                      </motion.button>
                    )}
                  </>
                )}
              </AnimatePresence>

              {/* Like Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => setIsLiked(prev => !prev)}
                className="absolute bottom-4 right-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-200 z-10"
              >
                <FaHeart
                  size={20}
                  className={`transition-colors duration-200 ${isLiked ? 'text-red-500' : 'text-white'}`}
                />
              </motion.button>
            </div>

            {/* Info Panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, x: isFullscreen ? 0 : 20, y: isFullscreen ? 20 : 0 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: isFullscreen ? 0 : 20, y: isFullscreen ? 20 : 0 }}
                  className={`${isFullscreen ? 'absolute bottom-0 left-0 right-0 bg-black/85 backdrop-blur-md' : 'lg:w-1/3 w-full'} overflow-y-auto`}
                  style={{
                    backgroundColor: isFullscreen ? 'transparent' : colors.card,
                    color: colors.cardText,
                    maxHeight: isFullscreen ? '45vh' : 'auto',
                    padding: isFullscreen ? '1.5rem' : '1.5rem'
                  }}
                >
                  <div className="space-y-4">
                    {/* Title and Author Section */}
                    <div className="space-y-3">
                      <h2
                        className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight"
                        style={{
                          color: isFullscreen ? 'white' : colors.heading,
                          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontWeight: '700',
                          letterSpacing: '-0.025em',
                          lineHeight: '1.2'
                        }}
                      >
                        {selectedImage.description}
                      </h2>

                      {/* Author and Date Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaUser
                            size={12}
                            style={{ color: isFullscreen ? 'rgba(255,255,255,0.7)' : colors.accent }}
                          />
                          <span
                            style={{
                              color: isFullscreen ? 'rgba(255,255,255,0.9)' : colors.detail,
                              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              fontWeight: '500'
                            }}
                          >
                            {selectedImage.author}
                          </span>
                        </div>

                        {selectedImage.articleDate && (
                          <div
                            className="text-xs opacity-75"
                            style={{ color: isFullscreen ? 'rgba(255,255,255,0.7)' : colors.detail }}
                          >
                            {selectedImage.articleDate}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description Section */}
                    <div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: isFullscreen ? 'rgba(255,255,255,0.85)' : colors.detail,
                          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          lineHeight: '1.5',
                          fontWeight: '400'
                        }}
                      >
                        {selectedImage.detail || selectedImage.alt || 'Tidak ada deskripsi tambahan tersedia.'}
                      </p>
                    </div>

                    {/* Keyboard Shortcuts */}
                    {!isFullscreen && (
                      <div className="pt-6 mt-6 border-t" style={{ borderColor: colors.border }}>
                        <p
                          className="text-xs mb-3 font-bold"
                          style={{
                            color: colors.detail,
                            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            fontWeight: '700',
                            letterSpacing: '0.5px'
                          }}
                        >
                          Pintasan Keyboard:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-mono"
                              style={{
                                backgroundColor: colors.border + '40',
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                opacity: 0.8
                              }}
                            >
                              ← →
                            </span>
                            <span
                              style={{
                                color: colors.detail,
                                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                fontWeight: '500'
                              }}
                            >
                              Navigasi
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-mono"
                              style={{
                                backgroundColor: colors.border + '40',
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                opacity: 0.8
                              }}
                            >
                              F
                            </span>
                            <span
                              style={{
                                color: colors.detail,
                                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                fontWeight: '500'
                              }}
                            >
                              Layar Penuh
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-mono"
                              style={{
                                backgroundColor: colors.border + '40',
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                opacity: 0.8
                              }}
                            >
                              I
                            </span>
                            <span
                              style={{
                                color: colors.detail,
                                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                fontWeight: '500'
                              }}
                            >
                              Info
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-mono"
                              style={{
                                backgroundColor: colors.border + '40',
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                opacity: 0.8
                              }}
                            >
                              Esc
                            </span>
                            <span
                              style={{
                                color: colors.detail,
                                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                fontWeight: '500'
                              }}
                            >
                              Tutup
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Thumbnail Strip (Only in fullscreen) */}
          {isFullscreen && images && images.length > 1 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm"
            >
              {images.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((img, index) => {
                const actualIndex = Math.max(0, currentIndex - 2) + index
                return (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-12 h-12 rounded overflow-hidden transition-all duration-200 ${actualIndex === currentIndex
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-70 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
