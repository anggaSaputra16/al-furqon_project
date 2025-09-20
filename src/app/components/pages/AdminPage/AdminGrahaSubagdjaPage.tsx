'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaArrowLeft,
    FaBuilding,
    FaHandshake,
    FaImages,
    FaQuestionCircle,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSave,
    FaTimes,
    FaUpload,
    FaEye,
    FaPhone,
    FaInstagram,
    FaWhatsapp
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface UMKMPartner {
    id: number
    name: string
    category: string
    description: string
    services: string[]
    contact: {
        phone: string
        whatsapp: string
        instagram: string
    }
    image: string
}

interface GalleryImage {
    id: number
    title: string
    image: string
    category: 'facility' | 'event' | 'ceremony'
}

interface FAQ {
    id: number
    question: string
    answer: string
}

interface FacilityInfo {
    id: number
    title: string
    description: string
    capacity: string
    facilities: string[]
    price: string
    contact: string
}

interface AdminGrahaSubagdjaPageProps {
    onBack: () => void
}

export default function AdminGrahaSubagdjaPage({ onBack }: AdminGrahaSubagdjaPageProps) {
    const { colors } = useTheme()
    const [activeTab, setActiveTab] = useState<'partners' | 'gallery' | 'faq' | 'facility'>('partners')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [formData, setFormData] = useState<any>({})

    // Mock data - dalam implementasi nyata, data ini akan diambil dari API
    const [umkmPartners, setUmkmPartners] = useState<UMKMPartner[]>([
        {
            id: 1,
            name: "Barokah Event Organizer",
            category: "Event Organizer",
            description: "Spesialis event organizer untuk acara keagamaan dan pernikahan Islami",
            services: [
                "Wedding Organizer",
                "Aqiqah & Khitanan",
                "Halal Bihalal",
                "Kajian & Seminar",
                "Event Keagamaan",
                "Dekorasi Islami"
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
        }
    ])

    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
        {
            id: 1,
            title: "Main Hall",
            image: "/images/gambar8.jpg",
            category: "facility"
        },
        {
            id: 2,
            title: "Wedding Ceremony",
            image: "/images/gambar9.jpg",
            category: "ceremony"
        }
    ])

    const [faqs, setFaqs] = useState<FAQ[]>([
        {
            id: 1,
            question: "Bagaimana cara booking Graha Subagdja?",
            answer: "Anda dapat menghubungi kami melalui WhatsApp atau telepon untuk melakukan reservasi. Tim kami akan membantu mengatur jadwal dan kebutuhan acara Anda."
        },
        {
            id: 2,
            question: "Apakah ada paket all-in untuk acara pernikahan?",
            answer: "Ya, kami menyediakan berbagai paket pernikahan yang dapat disesuaikan dengan budget dan kebutuhan Anda. Hubungi UMKM partner kami untuk detail lengkap."
        }
    ])

    const [facilityInfo, setFacilityInfo] = useState<FacilityInfo>({
        id: 1,
        title: "Graha Subagdja Al-Furqon",
        description: "Gedung serbaguna yang nyaman dan elegan untuk berbagai acara keagamaan dan pernikahan Islami",
        capacity: "200-300 tamu",
        facilities: [
            "Sound System Professional",
            "Lighting System",
            "Air Conditioning",
            "Kitchen & Pantry",
            "Parking Area",
            "Prayer Room",
            "Bridal Room"
        ],
        price: "Mulai dari Rp 5.000.000",
        contact: "0812-3456-7890"
    })

    const tabs = [
        { id: 'partners', label: 'UMKM Partners', icon: FaHandshake },
        { id: 'gallery', label: 'Gallery', icon: FaImages },
        { id: 'faq', label: 'FAQ', icon: FaQuestionCircle },
        { id: 'facility', label: 'Facility Info', icon: FaBuilding }
    ]

    const handleAddNew = (type: string) => {
        setEditingItem(null)
        setFormData({})
        setIsModalOpen(true)
    }

    const handleEdit = (item: any, type: string) => {
        setEditingItem({ ...item, type })
        setFormData(item)
        setIsModalOpen(true)
    }

    const handleDelete = (id: number, type: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
            switch (type) {
                case 'partners':
                    setUmkmPartners(prev => prev.filter(item => item.id !== id))
                    break
                case 'gallery':
                    setGalleryImages(prev => prev.filter(item => item.id !== id))
                    break
                case 'faq':
                    setFaqs(prev => prev.filter(item => item.id !== id))
                    break
            }
        }
    }

    const handleSave = () => {
        const type = editingItem?.type || activeTab

        if (editingItem) {
            // Update existing item
            switch (type) {
                case 'partners':
                    setUmkmPartners(prev => prev.map(item =>
                        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
                    ))
                    break
                case 'gallery':
                    setGalleryImages(prev => prev.map(item =>
                        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
                    ))
                    break
                case 'faq':
                    setFaqs(prev => prev.map(item =>
                        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
                    ))
                    break
                case 'facility':
                    setFacilityInfo({ ...formData, id: 1 })
                    break
            }
        } else {
            // Add new item
            const newId = Date.now()
            switch (type) {
                case 'partners':
                    setUmkmPartners(prev => [...prev, { ...formData, id: newId }])
                    break
                case 'gallery':
                    setGalleryImages(prev => [...prev, { ...formData, id: newId }])
                    break
                case 'faq':
                    setFaqs(prev => [...prev, { ...formData, id: newId }])
                    break
            }
        }

        setIsModalOpen(false)
        setEditingItem(null)
        setFormData({})
    }

    const renderPartners = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: colors.cardText }}>
                    UMKM Partners ({umkmPartners.length})
                </h3>
                <button
                    onClick={() => handleAddNew('partners')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                        backgroundColor: colors.accent,
                        color: 'white'
                    }}
                >
                    <FaPlus size={14} />
                    <span>Tambah Partner</span>
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {umkmPartners.map((partner) => (
                    <motion.div
                        key={partner.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + '30'
                        }}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-semibold" style={{ color: colors.cardText }}>
                                    {partner.name}
                                </h4>
                                <p className="text-sm" style={{ color: colors.detail }}>
                                    {partner.category}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(partner, 'partners')}
                                    className="p-2 rounded text-blue-600 hover:bg-blue-50"
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(partner.id, 'partners')}
                                    className="p-2 rounded text-red-600 hover:bg-red-50"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>

                        <p className="text-sm mb-3" style={{ color: colors.detail }}>
                            {partner.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                            {partner.services.slice(0, 3).map((service, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 rounded text-xs"
                                    style={{
                                        backgroundColor: colors.accent + '20',
                                        color: colors.accent
                                    }}
                                >
                                    {service}
                                </span>
                            ))}
                            {partner.services.length > 3 && (
                                <span className="text-xs" style={{ color: colors.detail }}>
                                    +{partner.services.length - 3} lainnya
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-3 text-sm">
                            <div className="flex items-center space-x-1">
                                <FaPhone size={12} style={{ color: colors.detail }} />
                                <span style={{ color: colors.detail }}>{partner.contact.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <FaWhatsapp size={12} style={{ color: '#25D366' }} />
                                <span style={{ color: colors.detail }}>{partner.contact.whatsapp}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )

    const renderGallery = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: colors.cardText }}>
                    Gallery ({galleryImages.length})
                </h3>
                <button
                    onClick={() => handleAddNew('gallery')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                        backgroundColor: colors.accent,
                        color: 'white'
                    }}
                >
                    <FaPlus size={14} />
                    <span>Tambah Gambar</span>
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {galleryImages.map((image) => (
                    <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                    >
                        <div
                            className="aspect-square rounded-lg overflow-hidden"
                            style={{ backgroundColor: colors.border + '20' }}
                        >
                            <img
                                src={image.image}
                                alt={image.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                            <button
                                onClick={() => handleEdit(image, 'gallery')}
                                className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50"
                            >
                                <FaEdit size={14} />
                            </button>
                            <button
                                onClick={() => handleDelete(image.id, 'gallery')}
                                className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>

                        <div className="mt-2">
                            <h4 className="font-medium text-sm" style={{ color: colors.cardText }}>
                                {image.title}
                            </h4>
                            <p className="text-xs" style={{ color: colors.detail }}>
                                {image.category}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )

    const renderFAQ = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: colors.cardText }}>
                    FAQ ({faqs.length})
                </h3>
                <button
                    onClick={() => handleAddNew('faq')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                        backgroundColor: colors.accent,
                        color: 'white'
                    }}
                >
                    <FaPlus size={14} />
                    <span>Tambah FAQ</span>
                </button>
            </div>

            <div className="space-y-3">
                {faqs.map((faq) => (
                    <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + '30'
                        }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold pr-4" style={{ color: colors.cardText }}>
                                {faq.question}
                            </h4>
                            <div className="flex space-x-2 flex-shrink-0">
                                <button
                                    onClick={() => handleEdit(faq, 'faq')}
                                    className="p-2 rounded text-blue-600 hover:bg-blue-50"
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(faq.id, 'faq')}
                                    className="p-2 rounded text-red-600 hover:bg-red-50"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm" style={{ color: colors.detail }}>
                            {faq.answer}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    )

    const renderFacilityInfo = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{ color: colors.cardText }}>
                    Facility Information
                </h3>
                <button
                    onClick={() => handleEdit(facilityInfo, 'facility')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                        backgroundColor: colors.accent,
                        color: 'white'
                    }}
                >
                    <FaEdit size={14} />
                    <span>Edit Info</span>
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-lg border"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border + '30'
                }}
            >
                <h4 className="text-xl font-bold mb-2" style={{ color: colors.cardText }}>
                    {facilityInfo.title}
                </h4>
                <p className="text-base mb-4" style={{ color: colors.detail }}>
                    {facilityInfo.description}
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <h5 className="font-semibold mb-2" style={{ color: colors.cardText }}>
                            Kapasitas
                        </h5>
                        <p style={{ color: colors.detail }}>{facilityInfo.capacity}</p>
                    </div>
                    <div>
                        <h5 className="font-semibold mb-2" style={{ color: colors.cardText }}>
                            Harga
                        </h5>
                        <p style={{ color: colors.detail }}>{facilityInfo.price}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <h5 className="font-semibold mb-2" style={{ color: colors.cardText }}>
                        Fasilitas
                    </h5>
                    <div className="grid md:grid-cols-2 gap-2">
                        {facilityInfo.facilities.map((facility, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors.accent }}
                                />
                                <span style={{ color: colors.detail }}>{facility}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h5 className="font-semibold mb-2" style={{ color: colors.cardText }}>
                        Kontak
                    </h5>
                    <div className="flex items-center space-x-2">
                        <FaWhatsapp style={{ color: '#25D366' }} />
                        <span style={{ color: colors.detail }}>{facilityInfo.contact}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )

    const renderModal = () => {
        const type = editingItem?.type || activeTab

        return (
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
                            style={{ backgroundColor: colors.card }}
                        >
                            {/* Modal Header */}
                            <div
                                className="px-6 py-4 border-b"
                                style={{ borderColor: colors.border + '30' }}
                            >
                                <div className="flex items-center justify-between">
                                    <h3
                                        className="text-xl font-bold"
                                        style={{
                                            color: colors.cardText,
                                            fontFamily: 'var(--font-header-modern)'
                                        }}
                                    >
                                        {editingItem ? 'Edit' : 'Tambah'} {
                                            type === 'partners' ? 'UMKM Partner' :
                                                type === 'gallery' ? 'Gallery Image' :
                                                    type === 'faq' ? 'FAQ' :
                                                        'Facility Info'
                                        }
                                    </h3>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 rounded-lg transition-colors duration-200"
                                        style={{
                                            backgroundColor: colors.background,
                                            color: colors.detail
                                        }}
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-6">

                                <div className="space-y-4">
                                    {type === 'partners' && (
                                        <>
                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Nama Partner
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name || ''}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Masukkan nama partner"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Kategori
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.category || ''}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Contoh: Event Organizer"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Deskripsi
                                                </label>
                                                <textarea
                                                    value={formData.description || ''}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Deskripsi singkat tentang partner"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Layanan (pisahkan dengan koma)
                                                </label>
                                                <textarea
                                                    value={formData.services ? formData.services.join(', ') : ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        services: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                                    })}
                                                    rows={2}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Wedding Organizer, Aqiqah & Khitanan, dll"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        className="block text-sm font-medium mb-2"
                                                        style={{ color: colors.cardText }}
                                                    >
                                                        Telepon
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.contact?.phone || ''}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            contact: { ...formData.contact, phone: e.target.value }
                                                        })}
                                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                        style={{
                                                            backgroundColor: colors.background,
                                                            color: colors.cardText,
                                                            borderColor: colors.border,
                                                            '--tw-ring-color': colors.accent
                                                        } as React.CSSProperties}
                                                        placeholder="021-xxxx-xxxx"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        className="block text-sm font-medium mb-2"
                                                        style={{ color: colors.cardText }}
                                                    >
                                                        WhatsApp
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.contact?.whatsapp || ''}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            contact: { ...formData.contact, whatsapp: e.target.value }
                                                        })}
                                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                        style={{
                                                            backgroundColor: colors.background,
                                                            color: colors.cardText,
                                                            borderColor: colors.border,
                                                            '--tw-ring-color': colors.accent
                                                        } as React.CSSProperties}
                                                        placeholder="08xx-xxxx-xxxx"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Instagram
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.contact?.instagram || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        contact: { ...formData.contact, instagram: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="@username"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    URL Gambar
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.image || ''}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="/images/partner.jpg"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {type === 'gallery' && (
                                        <>
                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Judul Gambar
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.title || ''}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Masukkan judul gambar"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Kategori
                                                </label>
                                                <select
                                                    value={formData.category || ''}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                >
                                                    <option value="">Pilih kategori</option>
                                                    <option value="facility">Fasilitas</option>
                                                    <option value="event">Event</option>
                                                    <option value="ceremony">Ceremony</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    URL Gambar
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.image || ''}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="/images/gallery.jpg"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {type === 'faq' && (
                                        <>
                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Pertanyaan
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.question || ''}
                                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Masukkan pertanyaan"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Jawaban
                                                </label>
                                                <textarea
                                                    value={formData.answer || ''}
                                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                                    rows={4}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Masukkan jawaban"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {type === 'facility' && (
                                        <>
                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Judul
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.title || ''}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Nama fasilitas"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Deskripsi
                                                </label>
                                                <textarea
                                                    value={formData.description || ''}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Deskripsi fasilitas"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        className="block text-sm font-medium mb-2"
                                                        style={{ color: colors.cardText }}
                                                    >
                                                        Kapasitas
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.capacity || ''}
                                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                        style={{
                                                            backgroundColor: colors.background,
                                                            color: colors.cardText,
                                                            borderColor: colors.border,
                                                            '--tw-ring-color': colors.accent
                                                        } as React.CSSProperties}
                                                        placeholder="200-300 tamu"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        className="block text-sm font-medium mb-2"
                                                        style={{ color: colors.cardText }}
                                                    >
                                                        Harga
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.price || ''}
                                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                        style={{
                                                            backgroundColor: colors.background,
                                                            color: colors.cardText,
                                                            borderColor: colors.border,
                                                            '--tw-ring-color': colors.accent
                                                        } as React.CSSProperties}
                                                        placeholder="Mulai dari Rp 5.000.000"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Fasilitas (pisahkan dengan koma)
                                                </label>
                                                <textarea
                                                    value={formData.facilities ? formData.facilities.join(', ') : ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        facilities: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                                    })}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="Sound System, AC, Parking Area, dll"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    className="block text-sm font-medium mb-2"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    Kontak
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.contact || ''}
                                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                                    style={{
                                                        backgroundColor: colors.background,
                                                        color: colors.cardText,
                                                        borderColor: colors.border,
                                                        '--tw-ring-color': colors.accent
                                                    } as React.CSSProperties}
                                                    placeholder="0812-xxxx-xxxx"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div
                                className="px-6 py-4 border-t flex justify-end space-x-3"
                                style={{ borderColor: colors.border + '30' }}
                            >
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                                    style={{
                                        backgroundColor: colors.accent,
                                        color: 'white'
                                    }}
                                >
                                    <FaSave size={14} />
                                    <span>Simpan</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        )
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            <div className="p-4 md:p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                            backgroundColor: colors.card,
                            color: colors.cardText
                        }}
                    >
                        <FaArrowLeft size={18} />
                    </button>
                    <div>
                        <h1
                            className="text-2xl md:text-3xl font-bold"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-header-modern)'
                            }}
                        >
                            Kelola Graha Subagdja
                        </h1>
                        <p style={{ color: colors.detail }}>
                            Kelola UMKM partners, gallery, FAQ, dan informasi fasilitas
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: colors.card }}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium ${activeTab === tab.id ? 'shadow-sm' : ''
                                        }`}
                                    style={{
                                        backgroundColor: activeTab === tab.id ? colors.accent : 'transparent',
                                        color: activeTab === tab.id ? 'white' : colors.cardText
                                    }}
                                >
                                    <Icon size={16} />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'partners' && renderPartners()}
                    {activeTab === 'gallery' && renderGallery()}
                    {activeTab === 'faq' && renderFAQ()}
                    {activeTab === 'facility' && renderFacilityInfo()}
                </motion.div>
            </div>

            {renderModal()}
        </div>
    )
}