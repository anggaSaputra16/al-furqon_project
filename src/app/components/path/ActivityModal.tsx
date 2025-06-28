'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import { CardData } from '@/app/layouts/CardLayout'
import { FaTimes } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface Props {
  data: CardData | null
  onClose: () => void
}

export default function ActivityModal({ data, onClose }: Props) {
  const { colors } = useTheme()
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (data) {
      setImageLoaded(false)
    }
  }, [data])

  if (!data) return null

  return (
    <Transition appear show={!!data} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Enhanced backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-md"
          leave="ease-in duration-300"
          leaveFrom="opacity-100 backdrop-blur-md"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div
            className="fixed inset-0 backdrop-blur-md transition-all duration-300"
            style={{ backgroundColor: colors.background + 'E6' }}
            onClick={onClose}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-2 sm:px-4 py-4 sm:py-8 flex items-end sm:items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0 scale-90 translate-y-8"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-90 translate-y-8"
          >
            <Dialog.Panel
              className="relative w-full max-w-4xl lg:max-w-5xl mx-auto transform overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl transition-all"
              style={{ backgroundColor: colors.card }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-3 rounded-full transition-all duration-200 group hover:scale-110 touch-manipulation"
                style={{
                  backgroundColor: colors.background + 'F0',
                  color: colors.cardText
                }}
                aria-label="Tutup modal"
              >
                <FaTimes className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              </button>

              {/* Image container - responsive height */}
              <div className="relative w-full h-64 sm:h-80 lg:h-[500px] overflow-hidden rounded-t-3xl">
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className={`object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                    }`}
                  onLoad={() => setImageLoaded(true)}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />

                {/* Loading skeleton */}
                {!imageLoaded && (
                  <div
                    className="absolute inset-0 animate-pulse"
                    style={{ backgroundColor: colors.background + '40' }}
                  />
                )}

                {/* Gradient overlay for better text readability */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, transparent 40%, ${colors.background}40 70%, ${colors.background}B0 100%)`
                  }}
                />
              </div>

              {/* Content section - responsive padding */}
              <div className="p-4 sm:p-6 lg:p-10 space-y-4 sm:space-y-6 max-h-[60vh] sm:max-h-none overflow-y-auto">
                <Dialog.Title
                  as="h2"
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-header-display)',
                  }}
                >
                  {data.title}
                </Dialog.Title>

                <div
                  className="prose prose-sm sm:prose-lg max-w-none leading-relaxed"
                  style={{
                    color: colors.cardText + 'E6',
                    fontFamily: 'var(--font-body-light)',
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}
                >
                  {data.detail ? (
                    <div className="whitespace-pre-line">
                      {data.detail}
                    </div>
                  ) : (
                    <p className="italic opacity-75">
                      Tidak ada detail tambahan untuk kegiatan ini.
                    </p>
                  )}
                </div>

                {/* Mobile-friendly action buttons */}
                <div className="pt-4 border-t border-opacity-20 flex flex-col sm:flex-row gap-3 sm:gap-2" style={{ borderColor: colors.cardText }}>
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 touch-manipulation"
                    style={{
                      backgroundColor: colors.accent + '20',
                      color: colors.accent,
                      border: `1px solid ${colors.accent}40`
                    }}
                  >
                    Tutup
                  </button>

                  {/* Optional share button for mobile */}
                  <button
                    className="w-full sm:w-auto px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 touch-manipulation sm:hidden"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.card,
                      border: `1px solid ${colors.accent}`
                    }}
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: data.title,
                          text: data.detail || data.title,
                          url: window.location.href
                        })
                      }
                    }}
                  >
                    Bagikan
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
