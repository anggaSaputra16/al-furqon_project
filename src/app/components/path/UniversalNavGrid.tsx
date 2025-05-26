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
}

export default function UniversalNavGrid({ items, customClass = '' }: UniversalNavGridProps) {
  const { colors } = useTheme()
  const pathname = usePathname()

  // Sticky nav state
  const [isSticky, setIsSticky] = useState(false)
  const [showNav, setShowNav] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsSticky(true)
        setShowNav(true)
      } else {
        setIsSticky(false)
        setShowNav(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={clsx('w-full flex justify-center', customClass)}>
      <div
        className={clsx(
          isSticky
            ? 'fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/80 py-2 transition-all duration-300'
            : 'relative',
          'w-full flex justify-center'
        )}
        style={{
          background: isSticky ? colors.card : 'transparent',
          color: colors.cardText,
          boxShadow: isSticky ? '0 2px 12px 0 rgba(0,0,0,0.10)' : 'none',
        }}
      >
        <div
          className={clsx(
            'max-w-5xl mx-auto flex flex-wrap gap-4 justify-center items-center px-4',
            isSticky ? 'py-2' : 'py-6'
          )}
        >
          {items.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link href={item.href} key={index}>
                <div
                  className={clsx(
                    'transition-all duration-200 flex flex-col justify-center items-center shadow-sm border',
                    isSticky
                      ? 'w-12 h-12 p-0 rounded-full bg-opacity-80'
                      : 'w-[120px] h-[105px] rounded-2xl'
                  )}
                  style={{
                    background: isActive ? colors.accent : colors.card,
                    color: isActive ? '#fff' : colors.cardText,
                    border: isActive ? '2px solid transparent' : `1px solid ${colors.card}`
                  }}
                >
                  <div
                    className={clsx(
                      isSticky ? 'text-lg mb-0' : 'text-[28px] mb-1',
                      'transition-colors duration-200'
                    )}
                    style={{ color: isActive ? '#fff' : colors.cardText }}
                  >
                    {item.icon}
                  </div>
                  {!isSticky && (
                    <span className="text-sm font-medium text-center mt-1">
                      {item.title}
                    </span>
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
