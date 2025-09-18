
'use client'

import { useParams } from 'next/navigation'
import FasilitasPage from '../components/pages/FasilitasPage'
import KegiatanPage from '../components/pages/KegiatanPage'
import SejarahPage from '../components/pages/SejarahPage'
import GaleriPage from '../components/pages/GaleriPage'
import GrahaSubagdjaPage from '../components/pages/graha-subagdja/page'
import { notFound } from 'next/navigation'

export default function DynamicMenuPage() {
  const { slug } = useParams<{ slug: string }>()

  const renderPage = () => {
    switch (slug) {
      case 'fasilitas':
        return <FasilitasPage />
      case 'kegiatan':
        return <KegiatanPage />
      case 'sejarah':
        return <SejarahPage />
      case 'galeri':
        return <GaleriPage />
      case 'graha-subagdja':
        return <GrahaSubagdjaPage />
      default:
        notFound()
    }
  }

  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-500">
      {renderPage()}
    </main>
  )
}
