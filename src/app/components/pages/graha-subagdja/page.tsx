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
import MasjidHeader from '../../path/MasjidHeader'
import Footer from '../../path/Footer'
import ThemeToggle from '../../path/ThemeToggle'
import FacilityInfoModal from '../../path/FacilityInfoModal'

interface GalleryImage {
    id: number
    src: string
    alt: string
    category: 'interior' | 'exterior' | 'event' | 'facility'
}

interface FAQ {
    id: number
    question: string
    answer: string
    isOpen: boolean
}

interface UMKMPartner {
    id: number
    name: string
    category: string
    description: string
    services: string[]
    contact: {
        phone: string
        whatsapp: string
        instagram?: string
    }
    image: string
}

export default function GrahaSubagdjaPage() {
    const { colors } = useTheme()
    const [showScrollToTop, setShowScrollToTop] = useState(false)
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
    const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'umkm' | 'contact'>('overview')
    const [faqs, setFaqs] = useState<FAQ[]>([
        {
            id: 1,
            question: "Bagaimana cara menghubungi UMKM partner yang berafiliasi?",
            answer: "Anda dapat langsung menghubungi UMKM partner melalui kontak yang tersedia (WhatsApp atau Instagram). Setiap partner telah diverifikasi dan dipercaya untuk melayani acara di Graha Subagdja.",
            isOpen: false
        },
        {
            id: 2,
            question: "Berapa kapasitas maksimal Graha Subagdja?",
            answer: "Graha Subagdja dapat menampung hingga 300 orang untuk acara resepsi pernikahan, 200 orang untuk seminar/rapat kerja, dan 150 orang untuk akad nikah. Kapasitas dapat disesuaikan dengan jenis acara dan arrangement meja.",
            isOpen: false
        },
        {
            id: 3,
            question: "Apakah UMKM partner ini terpercaya dan sudah diverifikasi?",
            answer: "Ya, semua UMKM partner yang tercantum telah melalui proses verifikasi dan seleksi ketat. Mereka memiliki pengalaman, kualitas pelayanan yang baik, dan telah bekerja sama dengan Graha Subagdja dalam berbagai acara.",
            isOpen: false
        },
        {
            id: 4,
            question: "Berapa lama durasi maksimal penggunaan fasilitas?",
            answer: "Durasi penggunaan maksimal adalah 8 jam untuk satu acara. Waktu ini sudah termasuk persiapan dan bersih-bersih. Jika memerlukan waktu tambahan, dapat didiskusikan dengan admin masjid.",
            isOpen: false
        },
        {
            id: 5,
            question: "Bisakah saya menggunakan jasa di luar UMKM partner yang tercantum?",
            answer: "Tentu saja! UMKM partner yang kami tampilkan hanya sebagai rekomendasi. Anda bebas menggunakan jasa dari vendor lain sesuai kebutuhan dan budget Anda. Namun, partner yang tercantum sudah terjamin kualitas dan pengalamannya.",
            isOpen: false
        }
    ])

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
        { id: 1, src: '/images/gambar1.jpg', alt: 'Interior Graha Subagdja', category: 'interior' },
        { id: 2, src: '/images/gambar2.jpg', alt: 'Setup Resepsi Pernikahan', category: 'event' },
        { id: 3, src: '/images/gambar3.jpg', alt: 'Area Panggung', category: 'interior' },
        { id: 4, src: '/images/gambar4.jpg', alt: 'Setup Seminar', category: 'event' },
        { id: 5, src: '/images/gambar5.jpg', alt: 'Fasilitas Sound System', category: 'facility' },
        { id: 6, src: '/images/gambar6.jpg', alt: 'Area Parkir', category: 'exterior' },
        { id: 7, src: '/images/gambar7.jpg', alt: 'Ruang Persiapan', category: 'interior' },
        { id: 8, src: '/images/gambar8.jpg', alt: 'Setup Kajian', category: 'event' }
    ]

    const umkmPartners: UMKMPartner[] = [
        {
            id: 1,
            name: "Barokah Event Organizer",
            category: "Event Organizer",
            description: "Spesialis penyelenggaraan acara pernikahan, seminar, dan event corporate dengan pengalaman 10+ tahun",
            services: [
                "Wedding Planning",
                "Corporate Event",
                "Seminar & Workshop",
                "Dekorasi Pelaminan",
                "Sound System & Lighting",
                "Photography & Videography"
            ],
            contact: {
                phone: "021-8765-4321",
                whatsapp: "0812-3456-7890",
                instagram: "@barokahevent"
            },
            image: "/images/gambar2.jpg"
        },
        {
            id: 2,
            name: "Sari Ayu Wedding Organizer",
            category: "Wedding Organizer",
            description: "Mengkhususkan diri dalam pernikahan Islami dengan konsep elegant dan berkesan",
            services: [
                "Full Wedding Package",
                "Akad Nikah Organizer",
                "Resepsi Pernikahan",
                "Henna & Siraman",
                "Koordinator Acara",
                "Konsultasi Pernikahan Islami"
            ],
            contact: {
                phone: "021-5432-1098",
                whatsapp: "0813-9876-5432",
                instagram: "@sariayuwedding"
            },
            image: "/images/gambar3.jpg"
        },
        {
            id: 3,
            name: "Cantik MUA & Hairdo",
            category: "Make Up Artist",
            description: "Make up artist profesional untuk pengantin dengan teknik natural dan hijab-friendly",
            services: [
                "Bridal Make Up",
                "Hijab Styling",
                "Family Make Up",
                "Pre-Wedding Make Up",
                "Traditional Make Up",
                "Hair Styling & Sanggul"
            ],
            contact: {
                phone: "0856-7890-1234",
                whatsapp: "0856-7890-1234",
                instagram: "@cantikmua"
            },
            image: "/images/gambar4.jpg"
        },
        {
            id: 4,
            name: "Berkah Catering",
            category: "Catering",
            description: "Penyedia catering halal dengan menu nusantara dan internasional untuk berbagai acara",
            services: [
                "Catering Pernikahan",
                "Catering Aqiqah",
                "Nasi Box Event",
                "Prasmanan Lengkap",
                "Snack & Coffee Break",
                "Dessert & Traditional Cake"
            ],
            contact: {
                phone: "021-9876-5432",
                whatsapp: "0817-6543-2109",
                instagram: "@berkahcatering"
            },
            image: "/images/gambar5.jpg"
        },
        {
            id: 5,
            name: "Cahaya Photography",
            category: "Photography & Videography",
            description: "Jasa foto dan video profesional untuk dokumentasi momen berharga Anda",
            services: [
                "Wedding Photography",
                "Cinematic Videography",
                "Pre-Wedding Session",
                "Event Documentation",
                "Drone Photography",
                "Same Day Edit Video"
            ],
            contact: {
                phone: "0878-1234-5678",
                whatsapp: "0878-1234-5678",
                instagram: "@cahayaphoto"
            },
            image: "/images/gambar6.jpg"
        },
        {
            id: 6,
            name: "Flower Decoration",
            category: "Dekorasi & Florist",
            description: "Spesialis dekorasi bunga dan pelaminan dengan konsep modern dan tradisional",
            services: [
                "Dekorasi Pelaminan",
                "Buket Pengantin",
                "Centerpiece Meja",
                "Backdrop Photobooth",
                "Corsage & Boutonniere",
                "Fresh Flower Arrangement"
            ],
            contact: {
                phone: "0819-2345-6789",
                whatsapp: "0819-2345-6789",
                instagram: "@flowerdeco"
            },
            image: "/images/gambar7.jpg"
        }
    ]

    const facilities = [
        {
            icon: FaUsers,
            title: "Kapasitas Besar",
            description: "Hingga 300 orang",
            color: colors.accent
        },
        {
            icon: FaMicrophone,
            title: "Sound System Pro",
            description: "Audio jernih & wireless mic",
            color: colors.accent
        },
        {
            icon: FaSnowflake,
            title: "Full AC",
            description: "Udara sejuk & nyaman",
            color: colors.accent
        },
        {
            icon: FaCar,
            title: "Parkir Luas",
            description: "100+ kendaraan",
            color: colors.accent
        },
        {
            icon: FaWifi,
            title: "WiFi Gratis",
            description: "Internet berkecepatan tinggi",
            color: colors.accent
        },
        {
            icon: FaShieldAlt,
            title: "Keamanan 24/7",
            description: "CCTV & security",
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

    const toggleFAQ = (id: number) => {
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
        { id: 'gallery', label: 'Galeri', icon: FaMapMarkedAlt },
        { id: 'umkm', label: 'UMKM Partner', icon: FaCalendarAlt },
        { id: 'contact', label: 'Kontak', icon: FaPhone }
    ]

    return (
        <main style={{ background: colors.background, color: colors.cardText }} className="transition-colors duration-500">
            <MasjidHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 mt-5">
                {/* Back Button */}
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
                            lineHeight: '1.6'
                        }}
                    >
                        Aula serbaguna modern di lingkungan Masjid Al-Furqon yang menjadi pilihan utama untuk berbagai acara penting seperti pernikahan, seminar, kajian, dan event komunitas lainnya.
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
                        {[
                            { number: '300', label: 'Kapasitas Orang' },
                            { number: '100+', label: 'Parkir Mobil' },
                            { number: '8', label: 'Jam Maksimal' },
                            { number: '24/7', label: 'Keamanan' }
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
                                {galleryImages.map((image, index) => (
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
                            <h2
                                className="text-3xl font-bold text-center"
                                style={{
                                    color: colors.heading,
                                    fontFamily: 'var(--font-header-modern)'
                                }}
                            >
                                Kontak & Booking
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                <div className="space-y-6">
                                    <h3
                                        className="text-2xl font-bold mb-6"
                                        style={{
                                            color: colors.heading,
                                            fontFamily: 'var(--font-header-modern)'
                                        }}
                                    >
                                        Informasi Kontak
                                    </h3>

                                    {[
                                        {
                                            icon: FaPhone,
                                            title: "Telepon/WhatsApp",
                                            info: "+62 821-1234-5678",
                                            action: "tel:+6282112345678"
                                        },
                                        {
                                            icon: FaEnvelope,
                                            title: "Email",
                                            info: "info@alfurqon-bekasi.com",
                                            action: "mailto:info@alfurqon-bekasi.com"
                                        },
                                        {
                                            icon: FaMapMarkedAlt,
                                            title: "Alamat",
                                            info: "Jl. Raya Bekasi Barat, Bekasi, Jawa Barat",
                                            action: "#"
                                        },
                                        {
                                            icon: FaClock,
                                            title: "Jam Operasional",
                                            info: "Senin - Minggu: 08.00 - 21.00 WIB",
                                            action: "#"
                                        }
                                    ].map((contact, index) => {
                                        const Icon = contact.icon
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start gap-4 p-6 rounded-xl"
                                                style={{
                                                    backgroundColor: colors.card,
                                                    border: `1px solid ${colors.border}`
                                                }}
                                            >
                                                <div
                                                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{
                                                        backgroundColor: colors.accent + '20',
                                                        color: colors.accent
                                                    }}
                                                >
                                                    <Icon size={20} />
                                                </div>
                                                <div>
                                                    <h4
                                                        className="font-bold mb-1"
                                                        style={{
                                                            color: colors.cardText,
                                                            fontFamily: 'var(--font-header-modern)'
                                                        }}
                                                    >
                                                        {contact.title}
                                                    </h4>
                                                    {contact.action.startsWith('#') ? (
                                                        <p
                                                            className="text-sm"
                                                            style={{
                                                                color: colors.detail,
                                                                fontFamily: 'var(--font-body)'
                                                            }}
                                                        >
                                                            {contact.info}
                                                        </p>
                                                    ) : (
                                                        <a
                                                            href={contact.action}
                                                            className="text-sm hover:underline transition-colors"
                                                            style={{
                                                                color: colors.accent,
                                                                fontFamily: 'var(--font-body)'
                                                            }}
                                                        >
                                                            {contact.info}
                                                        </a>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>

                                <div
                                    className="p-8 rounded-2xl"
                                    style={{
                                        backgroundColor: colors.card,
                                        border: `1px solid ${colors.border}`
                                    }}
                                >
                                    <h3
                                        className="text-2xl font-bold mb-6"
                                        style={{
                                            color: colors.heading,
                                            fontFamily: 'var(--font-header-modern)'
                                        }}
                                    >
                                        Prosedur Booking
                                    </h3>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                step: 1,
                                                title: "Konsultasi Awal",
                                                description: "Hubungi admin untuk diskusi kebutuhan acara, tanggal, dan estimasi tamu"
                                            },
                                            {
                                                step: 2,
                                                title: "Survey Lokasi",
                                                description: "Kunjungi langsung Graha Subagdja untuk melihat fasilitas dan layout ruangan"
                                            },
                                            {
                                                step: 3,
                                                title: "Booking & DP",
                                                description: "Lakukan booking dengan membayar uang muka sesuai ketentuan yang berlaku"
                                            },
                                            {
                                                step: 4,
                                                title: "Koordinasi Partner",
                                                description: "Pilih dan koordinasi dengan UMKM partner untuk kebutuhan catering, dekorasi, dll"
                                            },
                                            {
                                                step: 5,
                                                title: "Pelaksanaan Acara",
                                                description: "Tim akan membantu koordinasi selama acara berlangsung"
                                            }
                                        ].map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex gap-4"
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                                                    style={{
                                                        backgroundColor: colors.accent,
                                                        color: 'white',
                                                        fontFamily: 'var(--font-sharp-bold)'
                                                    }}
                                                >
                                                    {item.step}
                                                </div>
                                                <div>
                                                    <h4
                                                        className="font-bold mb-1"
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
                                                            fontFamily: 'var(--font-body)'
                                                        }}
                                                    >
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div
                                        className="mt-8 p-4 rounded-lg"
                                        style={{
                                            backgroundColor: colors.accent + '10',
                                            border: `1px solid ${colors.accent}20`
                                        }}
                                    >
                                        <h4
                                            className="font-bold mb-2"
                                            style={{
                                                color: colors.cardText,
                                                fontFamily: 'var(--font-header-modern)'
                                            }}
                                        >
                                            💡 Tips Booking
                                        </h4>
                                        <ul className="text-sm space-y-1">
                                            <li
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                • Booking minimal 2 minggu sebelum acara
                                            </li>
                                            <li
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                • Siapkan alternatif tanggal untuk fleksibilitas
                                            </li>
                                            <li
                                                style={{
                                                    color: colors.detail,
                                                    fontFamily: 'var(--font-body)'
                                                }}
                                            >
                                                • Konsultasikan kebutuhan khusus terlebih dahulu
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-6 text-center">
                                        <a
                                            href="https://wa.me/6282112345678"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                                            style={{
                                                backgroundColor: '#25D366',
                                                color: 'white',
                                                fontFamily: 'var(--font-sharp-bold)'
                                            }}
                                        >
                                            💬 Mulai Konsultasi via WhatsApp
                                        </a>
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