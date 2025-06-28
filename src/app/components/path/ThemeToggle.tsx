'use client'

import { useTheme } from '@/context/themeContext'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm focus:outline-none"
      aria-label="Toggle Theme"
      style={{ minWidth: 0, minHeight: 0 }}
    >
      {theme === 'light' ? (
        <FaSun className="text-yellow-500 text-lg" />
      ) : theme === 'dusk' ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-orange-400">
          <circle cx="10" cy="10" r="7" fill="#ffb347" />
          <ellipse cx="10" cy="15" rx="6" ry="2" fill="#e29547" fillOpacity=".5" />
        </svg>
      ) : (
        <FaMoon className="text-blue-300 text-lg" />
      )}
    </button>
  )
}
