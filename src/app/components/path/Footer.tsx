'use client'

import React from 'react'
import { useTheme } from '@/context/themeContext'

const Footer: React.FC = () => {
  const { colors, theme } = useTheme()

  // Dynamic text color based on theme for better contrast
  const footerTextColor = theme === 'light' ? '#f9f6f2' : colors.cardText

  return (
    <footer
      className="w-full py-8 mt-12 transition-colors duration-200 pb-20 border-t relative overflow-hidden"
      style={{
        background: colors.footer,
        color: footerTextColor,
        borderColor: `${colors.border}40`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${footerTextColor} 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informasi Masjid */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{
                color: footerTextColor,
                fontFamily: 'var(--font-header-modern)'
              }}
            >
              Masjid Besar Al - Furqon
            </h3>
            <div
              className="space-y-1 text-sm leading-relaxed"
              style={{
                color: `${footerTextColor}E6`,
                fontFamily: 'var(--font-sharp-light)'
              }}
            >
              <p>Bekasi Barat</p>
              <p>Jalan Jambu Air VIII No.1</p>
              <p>RT.001/RW.016, Kelurahan Kotabaru</p>
              <p>Kecamatan Bekasi Barat</p>
              <p>Kota Bekasi, Jawa Barat 17133</p>
            </div>
          </div>

          {/* Kontak */}
          <div>
            <h3
              className="text-lg font-bold mb-4"
              style={{
                color: footerTextColor,
                fontFamily: 'var(--font-header-modern)'
              }}
            >
              Hubungi Kami
            </h3>
            <div
              className="space-y-1 text-sm"
              style={{
                color: `${footerTextColor}E6`,
                fontFamily: 'var(--font-sharp-light)'
              }}
            >
              <p>+62 888 8888 8888</p>
              <p>+62 888 8888 8888</p>
              <p>alfurqonhrb@mail.com</p>
            </div>
          </div>

          {/* Powered By */}
          <div className="md:text-right">
            <a
              href="https://www.nuiiapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm mt-4 md:mt-0 hover:underline transition-colors duration-200 inline-block"
              style={{
                color: `${footerTextColor}B3`,
                fontFamily: 'var(--font-sharp-light)'
              }}
            >
              Powered by - NUII
            </a>
          </div>
        </div>

        {/* Copyright/Bottom section */}
        <div
          className="mt-8 pt-6 border-t text-center text-xs"
          style={{
            borderColor: `${footerTextColor}20`,
            color: `${footerTextColor}99`,
            fontFamily: 'var(--font-sharp-light)'
          }}
        >
          <p>© 2025 Masjid Besar Al-Furqon. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
