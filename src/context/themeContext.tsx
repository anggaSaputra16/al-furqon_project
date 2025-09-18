'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import ClientOnly from '@/app/components/ClientOnly'

export type Theme = 'light' | 'dark' | 'dusk'


const lightTheme = {
  background: '#f9f6f2',
  foreground: '#2d2d2d',
  card: '#ffffff',
  cardText: '#7c5c3b',
  accent: '#e29547',
  footer: '#7c5c3b',
  border: '#e7e1d7',
  secondary: '#b89c7d',
  muted: '#f3ede7',
  shadow: '0 8px 32px 0 rgba(60, 40, 20, 0.08)',
  link: '#e29547',
  heading: '#7c5c3b',
  subheading: '#b89c7d',
  detail: '#6d5c4a',
}

const darkTheme = {
  background: '#181c24',
  foreground: '#f1f5f9',
  card: '#232336',
  cardText: '#f1f5f9',
  accent: '#7f9cf5',
  footer: '#0d1117',
  border: '#232336',
  secondary: '#7f9cf5',
  muted: '#181c24',
  shadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
  link: '#7f9cf5',
  heading: '#f1f5f9',
  subheading: '#cbd5e1',
  detail: '#cbd5e1',
}


const duskTheme = {
  background: '#1a0e07',
  foreground: '#ffe7b3',
  card: '#3e2210',
  cardText: '#ffbe6a',
  accent: '#ff9900',
  footer: '#0f0704',
  border: '#a86c2c',
  secondary: '#e6a86a',
  muted: '#2a1407',
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


const getTimeBasedTheme = (): Theme => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'light'
  if (hour >= 12 && hour < 18) return 'dusk'
  return 'dark'
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')
  const [colors, setColors] = useState(lightTheme)
  const [isAutoMode, setIsAutoModeState] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)


  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const storedAutoMode = localStorage.getItem('autoMode')
    const autoMode = storedAutoMode !== 'false'

    setIsAutoModeState(autoMode)

    let initialTheme: Theme
    if (autoMode) {
      initialTheme = getTimeBasedTheme()
    } else {
      initialTheme = storedTheme || getTimeBasedTheme()
    }

    setThemeAndColors(initialTheme, false)
    setIsInitialized(true)
  }, [])


  useEffect(() => {
    if (!isAutoMode || !isInitialized) return

    const updateTheme = () => {
      const newTheme = getTimeBasedTheme()
      if (newTheme !== theme) {
        setThemeAndColors(newTheme, false)
      }
    }


    updateTheme()


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

      const timeBasedTheme = getTimeBasedTheme()
      setThemeAndColors(timeBasedTheme, false)
    }
  }

  const toggleTheme = () => {
    if (isAutoMode) {

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
