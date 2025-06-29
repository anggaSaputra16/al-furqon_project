'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import ClientOnly from '@/app/components/ClientOnly'

export type Theme = 'light' | 'dark' | 'dusk'

// 🎨 Warna tema light
const lightTheme = {
  background: '#f9f6f2', // warm white
  foreground: '#2d2d2d', // soft dark gray
  card: '#ffffff', // pure white for cards
  cardText: '#7c5c3b', // brown for text (lihat gambar)
  accent: '#e29547', // warm orange accent
  footer: '#7c5c3b', // darker brown for better contrast
  border: '#e7e1d7', // border beige
  secondary: '#b89c7d', // gold/brown secondary
  muted: '#f3ede7', // background section
  shadow: '0 8px 32px 0 rgba(60, 40, 20, 0.08)',
  link: '#e29547', // accent for link
  heading: '#7c5c3b', // heading color
  subheading: '#b89c7d', // subheading color
  detail: '#6d5c4a', // detail text
}

const darkTheme = {
  background: '#181c24', // dark blue-black
  foreground: '#f1f5f9', // light
  card: '#232336',
  cardText: '#f1f5f9',
  accent: '#7f9cf5',
  footer: '#0d1117', // darker than background for contrast
  border: '#232336',
  secondary: '#7f9cf5',
  muted: '#181c24',
  shadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
  link: '#7f9cf5',
  heading: '#f1f5f9',
  subheading: '#cbd5e1',
  detail: '#cbd5e1',
}

// 🌇 Warna tema dusk (senja)
const duskTheme = {
  background: '#1a0e07',        // gelap seperti langit senja
  foreground: '#ffe7b3',        // terang kekuningan
  card: '#3e2210',              // coklat kemerahan gelap
  cardText: '#ffbe6a',          // oranye keemasan terang
  accent: '#ff9900',            // oranye sunset hangat
  footer: '#0f0704',            // much darker brown for contrast
  border: '#a86c2c',            // coklat emas
  secondary: '#e6a86a',         // pastel oranye
  muted: '#2a1407',             // latar redup
  shadow: '0 8px 32px 0 rgba(255, 153, 0, 0.15)',
  link: '#ffb84d',
  heading: '#ffd08a',
  subheading: '#eabf99',
  detail: '#ffe7b3',
}

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
  colors: typeof lightTheme
  isAutoMode: boolean
  setAutoMode: (auto: boolean) => void
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

// Function to get theme based on time
const getTimeBasedTheme = (): Theme => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'light'    // 05:00-11:59 = pagi (light)
  if (hour >= 12 && hour < 18) return 'dusk'    // 12:00-17:59 = sore (dusk)
  return 'dark'                                  // 18:00-04:59 = malam (dark)
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')
  const [colors, setColors] = useState(lightTheme)
  const [isAutoMode, setIsAutoModeState] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize theme on client side
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const storedAutoMode = localStorage.getItem('autoMode')
    const autoMode = storedAutoMode !== 'false' // default to true if not set

    setIsAutoModeState(autoMode)

    let initialTheme: Theme
    if (autoMode) {
      initialTheme = getTimeBasedTheme()
    } else {
      initialTheme = storedTheme || getTimeBasedTheme()
    }

    setThemeAndColors(initialTheme, false) // don't save to localStorage on init
    setIsInitialized(true)
  }, [])

  // Auto-update theme based on time (only in auto mode)
  useEffect(() => {
    if (!isAutoMode || !isInitialized) return

    const updateTheme = () => {
      const newTheme = getTimeBasedTheme()
      if (newTheme !== theme) {
        setThemeAndColors(newTheme, false) // don't save to localStorage for auto updates
      }
    }

    // Update immediately
    updateTheme()

    // Set interval to check every minute
    const interval = setInterval(updateTheme, 60000)
    return () => clearInterval(interval)
  }, [isAutoMode, theme, isInitialized])

  const setThemeAndColors = (newTheme: Theme, saveToStorage = true) => {
    setTheme(newTheme)
    if (saveToStorage) {
      localStorage.setItem('theme', newTheme)
    }

    const root = document.documentElement
    if (newTheme === 'dark') {
      setColors(darkTheme)
      root.classList.add('dark')
    } else if (newTheme === 'dusk') {
      setColors(duskTheme)
      root.classList.remove('dark')
    } else {
      setColors(lightTheme)
      root.classList.remove('dark')
    }
  }

  const setAutoMode = (auto: boolean) => {
    setIsAutoModeState(auto)
    localStorage.setItem('autoMode', auto.toString())

    if (auto) {
      // Switch to time-based theme
      const timeBasedTheme = getTimeBasedTheme()
      setThemeAndColors(timeBasedTheme, false)
    }
  }

  const toggleTheme = () => {
    if (isAutoMode) {
      // First toggle turns off auto mode and sets to next theme
      setAutoMode(false)
    }

    const nextTheme: Theme =
      theme === 'light' ? 'dusk' : theme === 'dusk' ? 'dark' : 'light'
    setThemeAndColors(nextTheme, true)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, isAutoMode, setAutoMode }}>
      <ClientOnly fallback={<div style={{ opacity: 0 }}>{children}</div>}>
        {children}
      </ClientOnly>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context)
    throw new Error('useTheme must be used within ThemeProvider')
  return context
}
