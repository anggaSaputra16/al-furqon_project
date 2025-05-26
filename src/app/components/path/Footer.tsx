'use client'

import React from 'react'
import { useTheme } from '@/context/themeContext'

const Footer: React.FC = () => {
  const { colors } = useTheme()
  return (
    <footer
      className="w-full py-6 mt-10 transition-colors duration-200"
      style={{ background: colors.footer, color: colors.cardText }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informasi Masjid */}
          <div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.cardText }}>Masjid Besar Al - Furqon</h3>
            <p>Bekasi Barat</p>
            <p>Jalan Jambu Air VIII No.1</p>
            <p>RT.001/RW.016, Kelurahan Kotabaru</p>
            <p>Kecamatan Bekasi Barat</p>
            <p>Kota Bekasi, Jawa Barat 17133</p>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.cardText }}>Hubungi Kami</h3>
            <p>+62 888 8888 8888</p>
            <p>+62 888 8888 8888</p>
            <p>alfurqonhrb@mail.com</p>
          </div>

          {/* Powered By */}
          <div className="md:text-right">
            <a
              href="https://www.nuiiapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm mt-4 md:mt-0 hover:underline"
              style={{ color: colors.cardText + '99' }}
            >
              Powered by - NUII
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
