'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useTheme } from '@/context/themeContext'

export interface NavItem {
  icon: React.ReactNode
  title: string
  href: string
}

interface UniversalNavGridProps {
  items: NavItem[]
  customClass?: string
  variant?: 'default' | 'compact'
}

export default function UniversalNavGrid({
  items,
  customClass = '',
  variant = 'default'
}: UniversalNavGridProps) {
  const { colors } = useTheme()
  const pathname = usePathname()
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Update mobile state on resize
  useEffect(() => {
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < 768)
    }

    updateMobileState() // Call once on mount
    window.addEventListener('resize', updateMobileState, { passive: true })
    return () => window.removeEventListener('resize', updateMobileState)
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          setScrollY(currentScrollY)

          // Simplified show/hide logic
          if (currentScrollY > 150) {
            setIsVisible(false)
          } else {
            setIsVisible(true)
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine if we should show compact mode - only for mobile
  const isCompact = variant === 'compact' && isMobile

  return (
    <div className={clsx('w-full flex justify-center', customClass)}>
      <div
        className={clsx(
          'w-full transition-all duration-500 ease-in-out',
          isCompact && scrollY > 150 && isMobile
            ? 'fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t md:relative md:backdrop-blur-none md:border-t-0'
            : 'relative',
          !isVisible && isCompact && isMobile && 'translate-y-full opacity-0'
        )}
        style={{
          backgroundColor: isCompact && scrollY > 150 && isMobile
            ? colors.background + 'F5'
            : 'transparent',
          borderTopColor: isCompact && scrollY > 150 && isMobile
            ? colors.cardText + '20'
            : 'transparent',
          boxShadow: isCompact && scrollY > 150 && isMobile
            ? `0 -4px 20px 0 ${colors.background}40`
            : 'none',
        }}
      >
        <div
          className={clsx(
            'max-w-5xl mx-auto flex flex-wrap gap-2 sm:gap-4 md:gap-4 justify-center items-center px-2 sm:px-4 transition-all duration-300',
            isCompact && scrollY > 150 && isMobile ? 'py-2 sm:py-3' : 'py-4 sm:py-6'
          )}
        >
          {items.map((item, index) => {
            const isActive = pathname === item.href
            const shouldShowCompact = isCompact && scrollY > 150 && isMobile

            return (
              <Link href={item.href} key={index}>
                <div
                  className={clsx(
                    'group relative transition-all duration-300 flex flex-col justify-center items-center border border-opacity-30 hover:border-opacity-60 touch-manipulation',
                    shouldShowCompact
                      ? 'w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:scale-110'
                      : 'w-[100px] h-[90px] sm:w-[120px] sm:h-[105px] md:w-[130px] md:h-[115px] rounded-2xl hover:scale-105 hover:shadow-lg',
                    isActive && !shouldShowCompact && 'ring-2 ring-opacity-50 shadow-lg',
                    isActive && shouldShowCompact && 'ring-2 ring-opacity-60'
                  )}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${colors.accent}, ${colors.accent}E0)`
                      : shouldShowCompact
                        ? colors.card + 'E0'
                        : colors.card,
                    color: isActive ? '#fff' : colors.cardText,
                    borderColor: isActive ? colors.accent : colors.cardText + '30',
                    ['--tw-ring-color' as any]: colors.accent,
                    backdropFilter: shouldShowCompact ? 'blur(10px)' : 'none'
                  }}
                >
                  {/* Icon */}
                  <div
                    className={clsx(
                      'transition-all duration-300 flex items-center justify-center',
                      shouldShowCompact
                        ? 'text-base sm:text-lg'
                        : 'text-[22px] sm:text-[28px] md:text-[30px] mb-1'
                    )}
                    style={{ color: isActive ? '#fff' : colors.cardText }}
                  >
                    {item.icon}
                  </div>

                  {/* Title - always show on desktop, conditional on mobile */}
                  {!shouldShowCompact && (
                    <span
                      className="text-xs sm:text-sm md:text-base font-medium text-center leading-tight transition-colors duration-300 px-1"
                      style={{
                        color: isActive ? '#fff' : colors.cardText,
                        fontFamily: 'var(--font-body-light)'
                      }}
                    >
                      {item.title}
                    </span>
                  )}

                  {/* Tooltip for compact mode */}
                  {shouldShowCompact && (
                    <div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                      style={{
                        backgroundColor: colors.background + 'F0',
                        color: colors.cardText,
                        border: `1px solid ${colors.cardText}20`
                      }}
                    >
                      {item.title}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
