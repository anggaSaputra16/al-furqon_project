'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'dusk'

// 🎨 Warna tema light
const lightTheme = {
  background: '#f9f6f2', // warm white
  foreground: '#2d2d2d', // soft dark gray
  card: '#ffffff', // pure white for cards
  cardText: '#7c5c3b', // brown for text (lihat gambar)
  accent: '#e29547', // warm orange accent
  footer: '#f3ede7', // pastel cream for footer
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
  footer: '#111', // solid black for footer
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
  footer: '#241106',            // coklat tua
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
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')
  const [colors, setColors] = useState(lightTheme)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const root = document.documentElement

    if (storedTheme === 'dark') {
      setTheme('dark')
      setColors(darkTheme)
      root.classList.add('dark')
    } else if (storedTheme === 'dusk') {
      setTheme('dusk')
      setColors(duskTheme)
      root.classList.remove('dark')
    } else {
      setTheme('light')
      setColors(lightTheme)
      root.classList.remove('dark')
    }
  }, [])

  const setThemeAndColors = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)

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

  const toggleTheme = () => {
    const nextTheme: Theme =
      theme === 'light' ? 'dusk' : theme === 'dusk' ? 'dark' : 'light'
    setThemeAndColors(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context)
    throw new Error('useTheme must be used within ThemeProvider')
  return context
}
