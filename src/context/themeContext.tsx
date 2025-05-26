'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

// Tambahkan custom color untuk theme
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
    } else {
      setTheme('light')
      setColors(lightTheme)
      root.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light'
    const root = document.documentElement

    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    setColors(newTheme === 'dark' ? darkTheme : lightTheme)

    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
