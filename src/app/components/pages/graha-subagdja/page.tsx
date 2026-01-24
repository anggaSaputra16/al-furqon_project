'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaArrowLeft,
    FaUsers,
    FaMicrophone,
    FaCar,
    FaSnowflake,
    FaWifi,
    FaShieldAlt,
    FaClock,
    FaMapMarkedAlt,
    FaPhone,
    FaEnvelope,
    FaCalendarAlt,
    FaChevronUp,
    FaChevronDown,
    FaTimes,
    FaInfoCircle
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'
import { useGraha } from '../../../hooks/useGraha'
import MasjidHeader from '../../path/MasjidHeader'
import Footer from '../../path/Footer'
import ThemeToggle from '../../path/ThemeToggle'
import FacilityInfoModal from '../../path/FacilityInfoModal'
import { grahaSubagdjaUseCases } from '@/app/useCases/grahaSubagdjaUseCases'
import type { GalleryImage as BackendGalleryImage, UMKMPartner, FAQ as BackendFAQ } from '@/app/repositories/grahaSubagdjaRepository'

interface GalleryImage {
    id: string
    src: string
    alt: string
    category: 'interior' | 'exterior' | 'event' | 'facility' | 'ceremony'
}

interface FAQLocal {
    id: string
    question: string
    answer: string
    isOpen: boolean
}

export default function GrahaSubagdjaPage() {
    const { colors } = useTheme()

    const {
        umkmPartners: backendUmkmPartners,
        gallery: backendGallery,
        faqs: backendFaqs,
        facilityInfo,
        loading,
        error,
        fetchAllData,
        getGalleryByCategory,
        getUMKMPartnersByCategory
    } = useGraha()

    const [showScrollToTop, setShowScrollToTop] = useState(false)
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
    const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'umkm' | 'contact'>('overview')
    const [faqs, setFaqs] = useState<FAQLocal[]>([])

    const [modalInfo, setModalInfo] = useState<{
        isOpen: boolean
        type: 'tata-tertib' | 'prasarana' | 'kapasitas' | 'fasilitas-umum'
        facilityName: string
    }>({
        isOpen: false,
        type: 'tata-tertib',
        facilityName: 'Graha Subagdja'
    })

    const galleryImages: GalleryImage[] = [
        { id: "1", src: '/images/gambar1.jpg', alt: 'Interior Graha Subagdja', category: 'interior' },
        { id: "2", src: '/images/gambar2.jpg', alt: 'Setup Resepsi Pernikahan', category: 'event' },
        { id: "3", src: '/images/gambar3.jpg', alt: 'Area Panggung', category: 'interior' },
        { id: "4", src: '/images/gambar4.jpg', alt: 'Setup Seminar', category: 'event' },
        { id: "5", src: '/images/gambar5.jpg', alt: 'Fasilitas Sound System', category: 'facility' },
        { id: "6", src: '/images/gambar6.jpg', alt: 'Area Parkir', category: 'exterior' },
        { id: "7", src: '/images/gambar7.jpg', alt: 'Ruang Persiapan', category: 'interior' },
        { id: "8", src: '/images/gambar8.jpg', alt: 'Setup Kajian', category: 'event' }
    ]

    const umkmPartners = backendUmkmPartners || []

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    useEffect(() => {
        if (backendFaqs.length > 0) {
            const formattedFaqs = backendFaqs.map(faq => ({
                id: faq.id,
                question: faq.question,
                answer: faq.answer,
                isOpen: false
            }))
            setFaqs(formattedFaqs)
        }
    }, [backendFaqs])

    const galleryImagesFromBackend: GalleryImage[] = backendGallery.map(item => ({
        id: item.id,
        src: item.image,
        alt: item.title,
        category: item.category
    }))

    const allGalleryImages = galleryImagesFromBackend.length > 0 ? galleryImagesFromBackend : galleryImages

    const facilities = [
        {
            icon: FaUsers,
            title: "Kapasitas Besar",
            description: "1000 orang (resepsi), 800 orang (seminar), 1200 orang (PHBI)",
            color: colors.accent
        },
        {
            icon: FaMicrophone,
            title: "Sound System Profesional",
            description: "Audio berkualitas tinggi dengan wireless microphone & mixer digital",
            color: colors.accent
        },
        {
            icon: FaSnowflake,
            title: "AC Standing",
            description: "Sistem pendingin berkapasitas besar untuk kenyamanan maksimal",
            color: colors.accent
        },
        {
            icon: FaCar,
            title: "Area Parkir Luas",
            description: "100+ mobil dan 200+ motor dengan akses mudah",
            color: colors.accent
        },
        {
            icon: FaWifi,
            title: "Panggung Pelaminan",
            description: "Ukuran 4M × 12M dengan backdrop profesional",
            color: colors.accent
        },
        {
            icon: FaShieldAlt,
            title: "Keamanan 24/7",
            description: "Sistem CCTV dan petugas terlatih",
            color: colors.accent
        }
    ]

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const toggleFAQ = (id: string) => {
        setFaqs(faqs.map(faq =>
            faq.id === id ? { ...faq, isOpen: !faq.isOpen } : { ...faq, isOpen: false }
        ))
    }

    const openModal = (type: 'tata-tertib' | 'prasarana' | 'kapasitas' | 'fasilitas-umum') => {
        setModalInfo({
            isOpen: true,
            type,
            facilityName: 'Graha Subagdja'
        })
    }

    const closeModal = () => {
        setModalInfo(prev => ({ ...prev, isOpen: false }))
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FaInfoCircle },
        { id: 'umkm', label: 'UMKM Partner', icon: FaCalendarAlt },
        { id: 'contact', label: 'Reservasi', icon: FaPhone },
        { id: 'gallery', label: 'Galeri', icon: FaMapMarkedAlt },
    ]

    return (
        <main style={{ background: colors.background, color: colors.cardText }} className="transition-colors duration-500">
            <MasjidHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 mt-5">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                        style={{
                            backgroundColor: colors.card,
                            color: colors.cardText,
                            border: `2px solid ${colors.accent}`,
                            fontFamily: 'var(--font-sharp-bold)'
                        }}
                    >
                        <FaArrowLeft />
                        Kembali
                    </button>
                </motion.div>

                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 py-12"
                >
                    <div className="relative">
                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
                            style={{
                                color: colors.heading,
                                fontFamily: 'var(--font-header-masjid)',
                                lineHeight: '1.1',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Graha Subagdja
                        </h1>
                        <div
                            className="w-24 h-1 mx-auto rounded-full"
                            style={{ backgroundColor: colors.accent }}
                        />
                    </div>

                    <p
                        className="text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed"
                        style={{
                            color: colors.detail,
                            fontFamily: 'var(--font-body)',
                            lineHeight: '1.7'
                        }}
                    >
                        Ruang serbaguna dengan fasilitas modern untuk berbagai kebutuhan acara Anda. Graha Subagdja menyediakan ruang indoor modern dengan luas 20M × 30M (total 600M²) tanpa tiang di tengah, dilengkapi AC Standing, sound system profesional, dan berbagai fasilitas pendukung.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
                        {[
                            { number: '1200', label: 'Kapasitas Maksimal' },
                            { number: '600 M²', label: 'Luas Ruangan' },
                            { number: '100+', label: 'Area Parkir' },
                            { number: 'AC Full', label: 'Sistem Pendingin' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-4 rounded-xl"
                                style={{
                                    backgroundColor: colors.card,
                                    border: `1px solid ${colors.border}`
                                }}
                            >
                                <div
                                    className="text-2xl font-bold"
                                    style={{
                                        color: colors.accent,
                                        fontFamily: 'var(--font-sharp-bold)'
                                    }}
                                >
                                    {stat.number}
                                </div>
                                <div
                                    className="text-sm mt-1"
                                    style={{
                                        color: colors.detail,
                                        fontFamily: 'var(--font-body)'
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl"
                    style={{
                        backgroundColor: colors.card,
                        border: `1px solid ${colors.border}`
                    }}
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab.id ? 'shadow-lg' : 'hover:scale-105'
                                    }`}
                                style={{
                                    backgroundColor: activeTab === tab.id ? colors.accent : 'transparent',
                                    color: activeTab === tab.id ? 'white' : colors.cardText,
                                    fontFamily: 'var(--font-sharp-bold)'
                                }}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        )
                    })}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >

                            <section>
                                <div className="text-center mb-12">
                                    <h2
                                        className="text-3xl font-bold mb-4"
                                        style={{
                                            color: colors.heading,
                                            fontFamily: 'var(--font-header-modern)'
                                        }}
                                    >
                                        Paket Layanan
                                    </h2>
                                    <p
                                        className="text-lg max-w-2xl mx-auto"
                                        style={{
                                            color: colors.detail,
                                            fontFamily: 'var(--font-body)',
                                            lineHeight: '1.7'
                                        }}
                                    >
                                        Pilih paket yang sesuai dengan kebutuhan acara Anda dengan harga yang kompetitif
                                    </p>
                                </div>

                                {/* Paket 1: Akad Nikah & Resepsi */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mb-8 rounded-2xl overflow-hidden border"
                                    style={{
                                        backgroundColor: colors.card,
                                        border: `2px solid ${colors.accent}30`
                                    }}
                                >
                                    <div
                                        className="px-6 py-4"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.accent}05 100%)`,
                                            borderBottom: `1px solid ${colors.border}`
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">💒</span>
                                            <div>
                                                <h3
                                                    className="text-xl font-bold"
                                                    style={{
                                                        color: colors.heading,
                                                        fontFamily: 'var(--font-header-modern)'
                                                    }}
                                                >
                                                    Akad Nikah & Resepsi Pernikahan
                                                </h3>
                                                <p
                                                    className="text-sm mt-1"
                                                    style={{
                                                        color: colors.detail,
                                                        fontFamily: 'var(--font-body)'
                                                    }}
                                                >
                                                    Paket lengkap untuk acara sakral pernikahan Anda
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr style={{ backgroundColor: colors.background + '80' }}>
                                                    <th
                                                        className="px-6 py-4 text-left text-sm font-bold"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}`
                                                        }}
                                                    >
                                                        Hari
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-center text-sm font-bold"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}`
                                                        }}
                                                    >
                                                        Durasi
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-right text-sm font-bold"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}`
                                                        }}
                                                    >
                                                        Harga
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                                                    <td
                                                        className="px-6 py-4"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-body)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                                                            Sabtu & Minggu
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-center font-medium"
                                                        style={{
                                                            color: colors.detail,
                                                            fontFamily: 'var(--font-body)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        8 Jam
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-right font-bold text-lg"
                                                        style={{
                                                            color: colors.accent,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        Rp 8.000.000
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                                                    <td
                                                        className="px-6 py-4"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-body)'
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                                                            Senin - Jumat
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-center font-medium"
                                                        style={{
                                                            color: colors.detail,
                                                            fontFamily: 'var(--font-body)'
                                                        }}
                                                    >
                                                        8 Jam
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-right font-bold text-lg"
                                                        style={{
                                                            color: colors.accent,
                                                            fontFamily: 'var(--font-sharp-bold)'
                                                        }}
                                                    >
                                                        Rp 6.550.000
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>

                                {/* Paket 2: Resepsi Pernikahan */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-8 rounded-2xl overflow-hidden border"
                                    style={{
                                        backgroundColor: colors.card,
                                        border: `2px solid ${colors.accent}30`
                                    }}
                                >
                                    <div
                                        className="px-6 py-4"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.accent}05 100%)`,
                                            borderBottom: `1px solid ${colors.border}`
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">🎉</span>
                                            <div>
                                                <h3
                                                    className="text-xl font-bold"
                                                    style={{
                                                        color: colors.heading,
                                                        fontFamily: 'var(--font-header-modern)'
                                                    }}
                                                >
                                                    Resepsi Pernikahan
                                                </h3>
                                                <p
                                                    className="text-sm mt-1"
                                                    style={{
                                                        color: colors.detail,
                                                        fontFamily: 'var(--font-body)'
                                                    }}
                                                >
                                                    Khusus untuk acara resepsi pernikahan
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr style={{ backgroundColor: colors.background + '80' }}>
                                                    <th
                                                        className="px-6 py-4 text-left text-sm font-bold"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}`
                                                        }}
                                                    >
                                                        Hari
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-center text-sm font-bold"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}`
                                                        }}
                                                    >
                                                        Durasi
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-right text-sm font-bold"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}`
                                                        }}
                                                    >
                                                        Harga
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                                                    <td
                                                        className="px-6 py-4"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-body)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                                                            Sabtu & Minggu
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-center font-medium"
                                                        style={{
                                                            color: colors.detail,
                                                            fontFamily: 'var(--font-body)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        8 Jam
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-right font-bold text-lg"
                                                        style={{
                                                            color: colors.accent,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        Rp 7.450.000
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                                                    <td
                                                        className="px-6 py-4"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-body)'
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                                                            Senin - Jumat
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-center font-medium"
                                                        style={{
                                                            color: colors.detail,
                                                            fontFamily: 'var(--font-body)'
                                                        }}
                                                    >
                                                        8 Jam
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-right font-bold text-lg"
                                                        style={{
                                                            color: colors.accent,
                                                            fontFamily: 'var(--font-sharp-bold)'
                                                        }}
                                                    >
                                                        Rp 5.960.000
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>

                                {/* Paket 3: Seminar / Rapat Kerja */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-8 rounded-2xl overflow-hidden border"
                                    style={{
                                        backgroundColor: colors.card,
                                        border: `2px solid ${colors.accent}30`
                                    }}
                                >
                                    <div
                                        className="px-6 py-4"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.accent}05 100%)`,
                                            borderBottom: `1px solid ${colors.border}`
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">📊</span>
                                            <div>
                                                <h3
                                                    className="text-xl font-bold"
                                                    style={{
                                                        color: colors.heading,
                                                        fontFamily: 'var(--font-header-modern)'
                                                    }}
                                                >
                                                    Seminar / Rapat Kerja
                                                </h3>
                                                <p
                                                    className="text-sm mt-1"
                                                    style={{
                                                        color: colors.detail,
                                                        fontFamily: 'var(--font-body)'
                                                    }}
                                                >
                                                    Ideal untuk acara formal dan korporat
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr style={{ backgroundColor: colors.background + '80' }}>
                                                    <th
                                                        className="px-6 py-4 text-left text-sm font-bold"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}`
                                                        }}
                                                    >
                                                        Hari
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-center text-sm font-bold"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}`
                                                        }}
                                                    >
                                                        Durasi
                                                    </th>
                                                    <th
                                                        className="px-6 py-4 text-right text-sm font-bold"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}`
                                                        }}
                                                    >
                                                        Harga
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                                                    <td
                                                        className="px-6 py-4"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-body)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                        rowSpan={2}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                                                            Sabtu & Minggu
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-center font-medium"
                                                        style={{
                                                            color: colors.detail,
                                                            fontFamily: 'var(--font-body)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        4 Jam
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-right font-bold text-lg"
                                                        style={{
                                                            color: colors.accent,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        Rp 3.000.000
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                                                    <td
                                                        className="px-6 py-4 text-center font-medium"
                                                        style={{
                                                            color: colors.detail,
                                                            fontFamily: 'var(--font-body)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        8 Jam
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-right font-bold text-lg"
                                                        style={{
                                                            color: colors.accent,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        Rp 6.000.000
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                                                    <td
                                                        className="px-6 py-4"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-body)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                        rowSpan={2}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }}></span>
                                                            Senin - Jumat
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-center font-medium"
                                                        style={{
                                                            color: colors.detail,
                                                            fontFamily: 'var(--font-body)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        4 Jam
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-right font-bold text-lg"
                                                        style={{
                                                            color: colors.accent,
                                                            fontFamily: 'var(--font-sharp-bold)',
                                                            borderBottom: `1px solid ${colors.border}30`
                                                        }}
                                                    >
                                                        Rp 2.500.000
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-opacity-50 transition-colors" style={{ backgroundColor: 'transparent' }}>
                                                    <td
                                                        className="px-6 py-4 text-center font-medium"
                                                        style={{
                                                            color: colors.detail,
                                                            fontFamily: 'var(--font-body)'
                                                        }}
                                                    >
                                                        8 Jam
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-right font-bold text-lg"
                                                        style={{
                                                            color: colors.accent,
                                                            fontFamily: 'var(--font-sharp-bold)'
                                                        }}
                                                    >
                                                        Rp 5.000.000
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>

                                {/* Info Tambahan & Fasilitas Optional */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="grid md:grid-cols-2 gap-6"
                                >
                                    {/* Syarat & Ketentuan */}
                                    <div
                                        className="p-6 rounded-2xl border"
                                        style={{
                                            backgroundColor: colors.card,
                                            border: `1px solid ${colors.accent}20`
                                        }}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: colors.accent + '20' }}
                                            >
                                                <span className="text-xl">📋</span>
                                            </div>
                                            <h4
                                                className="font-bold text-lg"
                                                style={{
                                                    color: colors.heading,
                                                    fontFamily: 'var(--font-header-modern)'
                                                }}
                                            >
                                                Catatan Penting
                                            </h4>
                                        </div>
                                        <ul className="space-y-2">
                                            <li
                                                className="flex items-start gap-2 text-sm"
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                <span style={{ color: colors.accent }}>•</span>
                                                <span>Syarat serta ketentuan lainnya yang berlaku</span>
                                            </li>
                                            <li
                                                className="flex items-start gap-2 text-sm"
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                <span style={{ color: colors.accent }}>•</span>
                                                <span>Harga dapat berubah sewaktu-waktu</span>
                                            </li>
                                            <li
                                                className="flex items-start gap-2 text-sm"
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                <span style={{ color: colors.accent }}>•</span>
                                                <span>Reservasi minimal 2 minggu sebelum acara</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Fasilitas Optional */}
                                    <div
                                        className="p-6 rounded-2xl border"
                                        style={{
                                            backgroundColor: colors.card,
                                            border: `1px solid ${colors.accent}20`
                                        }}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: colors.accent + '20' }}
                                            >
                                                <span className="text-xl">✨</span>
                                            </div>
                                            <h4
                                                className="font-bold text-lg"
                                                style={{
                                                    color: colors.heading,
                                                    fontFamily: 'var(--font-header-modern)'
                                                }}
                                            >
                                                Fasilitas Optional
                                            </h4>
                                        </div>
                                        <ul className="space-y-2">
                                            <li
                                                className="flex items-start gap-2 text-sm"
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                <span style={{ color: colors.accent }}>📸</span>
                                                <span>Foto & Video Dokumentasi</span>
                                            </li>
                                            <li
                                                className="flex items-start gap-2 text-sm"
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                <span style={{ color: colors.accent }}>📽️</span>
                                                <span>Multimedia Infocus & Video Streaming</span>
                                            </li>
                                            <li
                                                className="flex items-start gap-2 text-sm"
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                <span style={{ color: colors.accent }}>🏠</span>
                                                <span>Ruang Menginap</span>
                                            </li>
                                        </ul>
                                    </div>
                                </motion.div>

                                {/* CTA Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="text-center mt-10"
                                >
                                </motion.div>
                            </section>

                            <section>
                                <h2
                                    className="text-3xl font-bold text-center mb-8"
                                    style={{
                                        color: colors.heading,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Fasilitas Unggulan
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {facilities.map((facility, index) => {
                                        const Icon = facility.icon
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                className="text-center p-6 rounded-2xl border group"
                                                style={{
                                                    backgroundColor: colors.card,
                                                    border: `1px solid ${colors.border}`
                                                }}
                                            >
                                                <div
                                                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                                                    style={{
                                                        backgroundColor: colors.accent + '20',
                                                        color: colors.accent
                                                    }}
                                                >
                                                    <Icon size={24} />
                                                </div>
                                                <h3
                                                    className="text-lg font-bold mb-2"
                                                    style={{
                                                        color: colors.cardText,
                                                        fontFamily: 'var(--font-header-modern)'
                                                    }}
                                                >
                                                    {facility.title}
                                                </h3>
                                                <p
                                                    className="text-sm"
                                                    style={{
                                                        color: colors.detail,
                                                        fontFamily: 'var(--font-body)'
                                                    }}
                                                >
                                                    {facility.description}
                                                </p>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </section>

                            <section>
                                <h2
                                    className="text-3xl font-bold text-center mb-8"
                                    style={{
                                        color: colors.heading,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Informasi Detail
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { type: 'kapasitas', title: 'Kapasitas', desc: 'Info lengkap kapasitas' },
                                        { type: 'fasilitas-umum', title: 'Fasilitas', desc: 'Daftar fasilitas tersedia' },
                                        { type: 'tata-tertib', title: 'Tata Tertib', desc: 'Aturan & ketentuan' },
                                        { type: 'prasarana', title: 'Prasarana', desc: 'Sarana pendukung' }
                                    ].map((info, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => openModal(info.type as any)}
                                            className="p-6 rounded-xl text-left border transition-colors duration-300"
                                            style={{
                                                backgroundColor: colors.card,
                                                border: `1px solid ${colors.border}`,
                                                color: colors.cardText
                                            }}
                                        >
                                            <h3
                                                className="font-bold text-lg mb-2"
                                                style={{
                                                    fontFamily: 'var(--font-header-modern)'
                                                }}
                                            >
                                                {info.title}
                                            </h3>
                                            <p
                                                className="text-sm mb-3"
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                {info.desc}
                                            </p>
                                            <div
                                                className="text-sm font-semibold"
                                                style={{
                                                    color: colors.accent,
                                                    fontFamily: 'var(--font-sharp-bold)'
                                                }}
                                            >
                                                Lihat Detail →
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2
                                    className="text-3xl font-bold text-center mb-8"
                                    style={{
                                        color: colors.heading,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Pertanyaan Umum
                                </h2>

                                <div className="max-w-4xl mx-auto space-y-4">
                                    {faqs.map((faq) => (
                                        <motion.div
                                            key={faq.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="border rounded-xl overflow-hidden"
                                            style={{
                                                backgroundColor: colors.card,
                                                border: `1px solid ${colors.border}`
                                            }}
                                        >
                                            <button
                                                onClick={() => toggleFAQ(faq.id)}
                                                className="w-full p-6 text-left flex justify-between items-center hover:opacity-80 transition-opacity"
                                            >
                                                <h3
                                                    className="font-bold text-lg pr-4"
                                                    style={{
                                                        color: colors.cardText,
                                                        fontFamily: 'var(--font-header-modern)'
                                                    }}
                                                >
                                                    {faq.question}
                                                </h3>
                                                <motion.div
                                                    animate={{ rotate: faq.isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    style={{ color: colors.accent }}
                                                >
                                                    <FaChevronDown />
                                                </motion.div>
                                            </button>

                                            <AnimatePresence>
                                                {faq.isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div
                                                            className="px-6 pb-6 border-t"
                                                            style={{ borderColor: colors.border }}
                                                        >
                                                            <p
                                                                className="text-base leading-relaxed mt-4"
                                                                style={{
                                                                    color: colors.detail,
                                                                    fontFamily: 'var(--font-body)'
                                                                }}
                                                            >
                                                                {faq.answer}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'gallery' && (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h2
                                className="text-3xl font-bold text-center"
                                style={{
                                    color: colors.heading,
                                    fontFamily: 'var(--font-header-modern)'
                                }}
                            >
                                Galeri Foto
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {allGalleryImages.map((image, index) => (
                                    <motion.div
                                        key={image.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm text-center px-2">
                                                {image.alt}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'umkm' && (
                        <motion.div
                            key="umkm"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <h2
                                className="text-3xl font-bold text-center"
                                style={{
                                    color: colors.heading,
                                    fontFamily: 'var(--font-header-modern)'
                                }}
                            >
                                UMKM Partner Terpercaya
                            </h2>

                            <p
                                className="text-center text-lg max-w-3xl mx-auto"
                                style={{
                                    color: colors.detail,
                                    fontFamily: 'var(--font-body)'
                                }}
                            >
                                Berikut adalah mitra UMKM terpercaya yang berafiliasi dengan Graha Subagdja untuk melengkapi kebutuhan acara Anda
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {umkmPartners.map((partner, index) => (
                                    <motion.div
                                        key={partner.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        className="relative p-6 rounded-2xl border"
                                        style={{
                                            backgroundColor: colors.card,
                                            border: `1px solid ${colors.border}`
                                        }}
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                <img
                                                    src={partner.image}
                                                    alt={partner.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3
                                                            className="font-bold text-lg mb-1"
                                                            style={{
                                                                color: colors.heading,
                                                                fontFamily: 'var(--font-header-modern)'
                                                            }}
                                                        >
                                                            {partner.name}
                                                        </h3>
                                                        <div
                                                            className="text-sm font-medium px-2 py-1 rounded-lg inline-block"
                                                            style={{
                                                                backgroundColor: colors.accent + '20',
                                                                color: colors.accent,
                                                                fontFamily: 'var(--font-sharp-bold)'
                                                            }}
                                                        >
                                                            {partner.category}
                                                        </div>
                                                    </div>
                                                </div>

                                                <p
                                                    className="text-sm mb-3 leading-relaxed"
                                                    style={{
                                                        color: colors.detail,
                                                        fontFamily: 'var(--font-body)'
                                                    }}
                                                >
                                                    {partner.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h4
                                                className="font-semibold mb-2"
                                                style={{
                                                    color: colors.cardText,
                                                    fontFamily: 'var(--font-header-modern)'
                                                }}
                                            >
                                                Layanan:
                                            </h4>
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {partner.services.slice(0, 4).map((service, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs px-2 py-1 rounded-lg"
                                                        style={{
                                                            backgroundColor: colors.background,
                                                            color: colors.detail,
                                                            fontFamily: 'var(--font-body)'
                                                        }}
                                                    >
                                                        {service}
                                                    </span>
                                                ))}
                                                {partner.services.length > 4 && (
                                                    <span
                                                        className="text-xs px-2 py-1 rounded-lg"
                                                        style={{
                                                            backgroundColor: colors.accent + '20',
                                                            color: colors.accent,
                                                            fontFamily: 'var(--font-sharp-bold)'
                                                        }}
                                                    >
                                                        +{partner.services.length - 4} lainnya
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <a
                                                href={`https://wa.me/${partner.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-2 px-4 rounded-lg text-center font-semibold text-sm transition-all duration-300 hover:scale-105"
                                                style={{
                                                    backgroundColor: '#25D366',
                                                    color: 'white',
                                                    fontFamily: 'var(--font-sharp-bold)'
                                                }}
                                            >
                                                WhatsApp
                                            </a>
                                            {partner.contact.instagram && (
                                                <a
                                                    href={`https://instagram.com/${partner.contact.instagram.replace('@', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 py-2 px-4 rounded-lg text-center font-semibold text-sm transition-all duration-300 hover:scale-105"
                                                    style={{
                                                        backgroundColor: '#E4405F',
                                                        color: 'white',
                                                        fontFamily: 'var(--font-sharp-bold)'
                                                    }}
                                                >
                                                    Instagram
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div
                                className="text-center p-6 rounded-xl"
                                style={{
                                    backgroundColor: colors.accent + '10',
                                    border: `1px solid ${colors.accent}20`
                                }}
                            >
                                <h3
                                    className="font-bold text-lg mb-2"
                                    style={{
                                        color: colors.heading,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Ingin Bermitra dengan Kami?
                                </h3>
                                <p
                                    className="text-sm mb-4"
                                    style={{
                                        color: colors.detail,
                                        fontFamily: 'var(--font-body)'
                                    }}
                                >
                                    Jika Anda adalah UMKM yang ingin bergabung sebagai partner Graha Subagdja, silakan hubungi kami untuk informasi lebih lanjut
                                </p>
                                <button
                                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                                    style={{
                                        backgroundColor: colors.accent,
                                        color: 'white',
                                        fontFamily: 'var(--font-sharp-bold)'
                                    }}
                                >
                                    Hubungi Admin
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* Header Section */}
                            <div className="text-center mb-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6"
                                    style={{
                                        backgroundColor: colors.accent + '10',
                                        border: `1.5px solid ${colors.accent}40`
                                    }}
                                >
                                    <span className="text-xl">📅</span>
                                    <span
                                        className="text-xs font-bold uppercase tracking-widest"
                                        style={{
                                            color: colors.accent,
                                            fontFamily: 'var(--font-sharp-bold)',
                                            letterSpacing: '0.1em'
                                        }}
                                    >
                                        Reservasi Mudah & Cepat
                                    </span>
                                </motion.div>

                                <h2
                                    className="text-3xl font-bold mb-4"
                                    style={{
                                        color: colors.heading,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Reservasi Graha Subagdja
                                </h2>
                                <p
                                    className="text-lg max-w-2xl mx-auto"
                                    style={{
                                        color: colors.detail,
                                        fontFamily: 'var(--font-body)',
                                        lineHeight: '1.7'
                                    }}
                                >
                                    Ikuti langkah mudah di bawah ini untuk mereservasi Graha Subagdja untuk acara Anda
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                {/* Prosedur Reservasi */}
                                <div className="space-y-6">
                                    <div
                                        className="p-6 rounded-2xl border"
                                        style={{
                                            backgroundColor: colors.card,
                                            border: `2px solid ${colors.accent}30`
                                        }}
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                                style={{
                                                    backgroundColor: colors.accent + '20',
                                                    color: colors.accent
                                                }}
                                            >
                                                <FaCalendarAlt size={20} />
                                            </div>
                                            <h3
                                                className="text-2xl font-bold"
                                                style={{
                                                    color: colors.heading,
                                                    fontFamily: 'var(--font-header-modern)'
                                                }}
                                            >
                                                Langkah Reservasi
                                            </h3>
                                        </div>

                                        <div className="space-y-5">
                                            {[
                                                {
                                                    step: 1,
                                                    icon: '📞',
                                                    title: "Konsultasi Awal",
                                                    description: "Hubungi admin via WhatsApp untuk diskusi kebutuhan acara, tanggal, dan estimasi jumlah tamu"
                                                },
                                                {
                                                    step: 2,
                                                    icon: '🏛️',
                                                    title: "Survey Lokasi",
                                                    description: "Kunjungi Graha Subagdja untuk melihat langsung fasilitas, layout ruangan, dan diskusi detail teknis"
                                                },
                                                {
                                                    step: 3,
                                                    icon: '💳',
                                                    title: "Booking & DP",
                                                    description: "Lakukan reservasi dengan membayar uang muka (DP) sesuai paket yang dipilih"
                                                },
                                                {
                                                    step: 4,
                                                    icon: '🤝',
                                                    title: "Koordinasi Partner",
                                                    description: "Pilih UMKM partner untuk catering, dekorasi, dokumentasi, dan kebutuhan lainnya"
                                                },
                                                {
                                                    step: 5,
                                                    icon: '✅',
                                                    title: "Konfirmasi Final",
                                                    description: "Review dan finalisasi semua detail acara 1 minggu sebelum hari-H"
                                                },
                                                {
                                                    step: 6,
                                                    icon: '🎉',
                                                    title: "Pelaksanaan Acara",
                                                    description: "Tim kami siap membantu koordinasi selama acara berlangsung"
                                                }
                                            ].map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.08 }}
                                                    className="flex gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md"
                                                    style={{
                                                        backgroundColor: colors.background + '40',
                                                        border: `1px solid ${colors.border}15`
                                                    }}
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div
                                                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                                                            style={{
                                                                backgroundColor: colors.accent,
                                                                color: 'white',
                                                                fontFamily: 'var(--font-sharp-bold)'
                                                            }}
                                                        >
                                                            {item.step}
                                                        </div>
                                                        <span className="text-2xl">{item.icon}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4
                                                            className="font-bold mb-2 text-base"
                                                            style={{
                                                                color: colors.cardText,
                                                                fontFamily: 'var(--font-header-modern)'
                                                            }}
                                                        >
                                                            {item.title}
                                                        </h4>
                                                        <p
                                                            className="text-sm leading-relaxed"
                                                            style={{
                                                                color: colors.detail,
                                                                fontFamily: 'var(--font-body)',
                                                                lineHeight: '1.6'
                                                            }}
                                                        >
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info & CTA */}
                                <div className="space-y-6">
                                    {/* Info Kontak */}
                                    <div
                                        className="p-6 rounded-2xl border"
                                        style={{
                                            backgroundColor: colors.card,
                                            border: `2px solid ${colors.accent}30`
                                        }}
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                                style={{
                                                    backgroundColor: colors.accent + '20',
                                                    color: colors.accent
                                                }}
                                            >
                                                <FaPhone size={20} />
                                            </div>
                                            <h3
                                                className="text-2xl font-bold"
                                                style={{
                                                    color: colors.heading,
                                                    fontFamily: 'var(--font-header-modern)'
                                                }}
                                            >
                                                Hubungi Kami
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                {
                                                    icon: FaPhone,
                                                    label: "Telepon/WhatsApp",
                                                    value: "+62 821-1234-5678",
                                                    action: "https://wa.me/6282112345678"
                                                },
                                                {
                                                    icon: FaEnvelope,
                                                    label: "Email",
                                                    value: "graha@alfurqon-bekasi.com",
                                                    action: "mailto:graha@alfurqon-bekasi.com"
                                                },
                                                {
                                                    icon: FaClock,
                                                    label: "Jam Operasional",
                                                    value: "Senin - Minggu: 08.00 - 21.00 WIB",
                                                    action: null
                                                },
                                                {
                                                    icon: FaMapMarkedAlt,
                                                    label: "Lokasi",
                                                    value: "Masjid Al-Furqon, Jl. Jambu Air VIII No.1, Bekasi Barat",
                                                    action: null
                                                }
                                            ].map((contact, index) => {
                                                const Icon = contact.icon
                                                return (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="flex items-start gap-3 p-4 rounded-xl"
                                                        style={{
                                                            backgroundColor: colors.background + '40'
                                                        }}
                                                    >
                                                        <div
                                                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                                            style={{
                                                                backgroundColor: colors.accent + '15',
                                                                color: colors.accent
                                                            }}
                                                        >
                                                            <Icon size={16} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4
                                                                className="font-semibold text-sm mb-1"
                                                                style={{
                                                                    color: colors.cardText,
                                                                    fontFamily: 'var(--font-sharp-bold)'
                                                                }}
                                                            >
                                                                {contact.label}
                                                            </h4>
                                                            {contact.action ? (
                                                                <a
                                                                    href={contact.action}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm hover:underline transition-colors"
                                                                    style={{
                                                                        color: colors.accent,
                                                                        fontFamily: 'var(--font-body)'
                                                                    }}
                                                                >
                                                                    {contact.value}
                                                                </a>
                                                            ) : (
                                                                <p
                                                                    className="text-sm"
                                                                    style={{
                                                                        color: colors.detail,
                                                                        fontFamily: 'var(--font-body)',
                                                                        lineHeight: '1.5'
                                                                    }}
                                                                >
                                                                    {contact.value}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Tips & Persyaratan */}
                                    <div
                                        className="p-6 rounded-2xl border"
                                        style={{
                                            backgroundColor: colors.card,
                                            border: `1px solid ${colors.accent}20`
                                        }}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-2xl">💡</span>
                                            <h4
                                                className="font-bold text-lg"
                                                style={{
                                                    color: colors.heading,
                                                    fontFamily: 'var(--font-header-modern)'
                                                }}
                                            >
                                                Tips & Persyaratan Booking
                                            </h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {[
                                                "Reservasi minimal 2 minggu sebelum tanggal acara",
                                                "Siapkan 2-3 alternatif tanggal untuk fleksibilitas",
                                                "DP sebesar 30% dari total biaya saat booking",
                                                "Pelunasan maksimal H-7 sebelum acara",
                                                "Konsultasikan kebutuhan khusus terlebih dahulu",
                                                "Tersedia paket bundling dengan UMKM partner"
                                            ].map((tip, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-2 text-sm"
                                                    style={{
                                                        color: colors.detail,
                                                        fontFamily: 'var(--font-body)'
                                                    }}
                                                >
                                                    <span style={{ color: colors.accent }}>•</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA WhatsApp */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="text-center"
                                    >
                                        <motion.a
                                            href="https://wa.me/6282112345678?text=Assalamu'alaikum,%20saya%20ingin%20reservasi%20Graha%20Subagdja"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300"
                                            style={{
                                                backgroundColor: '#25D366',
                                                color: 'white',
                                                fontFamily: 'var(--font-header-modern)',
                                                boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)'
                                            }}
                                        >
                                            <span className="text-2xl">💬</span>
                                            Reservasi via WhatsApp
                                            <motion.span
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                →
                                            </motion.span>
                                        </motion.a>
                                        <p
                                            className="text-sm mt-4"
                                            style={{
                                                color: colors.detail,
                                                fontFamily: 'var(--font-body)'
                                            }}
                                        >
                                            ⌛ Respon cepat dalam 1-2 jam kerja
                                        </p>
                                    </motion.div>

                                    {/* Info Tambahan */}
                                    <div
                                        className="p-5 rounded-xl text-center"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.accent}08 0%, ${colors.accent}03 100%)`,
                                            border: `1px solid ${colors.accent}15`
                                        }}
                                    >
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: colors.detail,
                                                fontFamily: 'var(--font-body)',
                                                lineHeight: '1.6'
                                            }}
                                        >
                                            <strong style={{ color: colors.accent }}>🎁 Promo Spesial:</strong> Dapatkan diskon 10% untuk booking di hari Senin-Jumat dan gratis tambahan 1 jam untuk booking 2 bulan sebelum acara!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                className="w-full h-full object-contain"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                            >
                                <FaTimes />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-white font-bold text-lg">
                                    {selectedImage.alt}
                                </h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
                        style={{
                            backgroundColor: colors.accent,
                            color: 'white'
                        }}
                    >
                        <FaChevronUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Facility Info Modal */}
            <FacilityInfoModal
                isOpen={modalInfo.isOpen}
                onClose={closeModal}
                type={modalInfo.type}
                facilityName={modalInfo.facilityName}
            />

            <Footer />
            <ThemeToggle />
        </main>
    )
}