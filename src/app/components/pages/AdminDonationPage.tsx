'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaSave,
    FaTimes,
    FaMoneyBillWave,
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface DonationItem {
    id: string
    title: string
    description: string
    image: string
    targetAmount: number
    currentAmount: number
    category: string
    status: 'active' | 'completed' | 'paused'
    createdAt: string
    updatedAt: string
}

interface AdminDonationPageProps {
    onBack: () => void
}

export default function AdminDonationPage({ onBack }: AdminDonationPageProps) {
    const { colors } = useTheme()
    const [donations, setDonations] = useState<DonationItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDonation, setEditingDonation] = useState<DonationItem | null>(null)
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        const mockDonations: DonationItem[] = [
            {
                id: '1',
                title: 'Renovasi Masjid Al-Furqon',
                description: 'Dana untuk renovasi dan perbaikan masjid agar lebih nyaman untuk beribadah',
                image: '/images/money.jpg',
                targetAmount: 500000000,
                currentAmount: 250000000,
                category: 'infrastruktur',
                status: 'active',
                createdAt: '2024-01-15',
                updatedAt: '2024-01-20'
            },
            {
                id: '2',
                title: 'Program Bantuan Anak Yatim',
                description: 'Bantuan pendidikan dan kebutuhan sehari-hari untuk anak-anak yatim',
                image: '/images/kids.jpg',
                targetAmount: 100000000,
                currentAmount: 75000000,
                category: 'sosial',
                status: 'active',
                createdAt: '2024-02-01',
                updatedAt: '2024-02-10'
            },
            {
                id: '3',
                title: 'Santunan Ramadhan',
                description: 'Program santunan untuk keluarga kurang mampu di bulan Ramadhan',
                image: '/images/infaq.jpg',
                targetAmount: 50000000,
                currentAmount: 50000000,
                category: 'sosial',
                status: 'completed',
                createdAt: '2024-03-01',
                updatedAt: '2024-03-25'
            }
        ]
        setDonations(mockDonations)
    }, [])

    const categories = [
        { value: 'all', label: 'Semua Kategori' },
        { value: 'infrastruktur', label: 'Infrastruktur' },
        { value: 'sosial', label: 'Program Sosial' },
        { value: 'pendidikan', label: 'Pendidikan' },
        { value: 'kesehatan', label: 'Kesehatan' }
    ]

    const statuses = [
        { value: 'all', label: 'Semua Status' },
        { value: 'active', label: 'Aktif' },
        { value: 'completed', label: 'Selesai' },
        { value: 'paused', label: 'Dijeda' }
    ]

    const filteredDonations = donations.filter(donation => {
        const matchesSearch = donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || donation.category === selectedCategory
        const matchesStatus = selectedStatus === 'all' || donation.status === selectedStatus

        return matchesSearch && matchesCategory && matchesStatus
    })

    const handleAddDonation = () => {
        setEditingDonation(null)
        setIsModalOpen(true)
    }

    const handleEditDonation = (donation: DonationItem) => {
        setEditingDonation(donation)
        setIsModalOpen(true)
    }

    const handleDeleteDonation = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus program donasi ini?')) {
            setDonations(prev => prev.filter(d => d.id !== id))
        }
    }

    const handleSaveDonation = (donationData: Partial<DonationItem>) => {
        if (editingDonation) {

            setDonations(prev => prev.map(d =>
                d.id === editingDonation.id
                    ? { ...d, ...donationData, updatedAt: new Date().toISOString().split('T')[0] }
                    : d
            ))
        } else {

            const newDonation: DonationItem = {
                id: Date.now().toString(),
                title: donationData.title || '',
                description: donationData.description || '',
                image: donationData.image || '/images/money.jpg',
                targetAmount: donationData.targetAmount || 0,
                currentAmount: donationData.currentAmount || 0,
                category: donationData.category || 'sosial',
                status: donationData.status || 'active',
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: new Date().toISOString().split('T')[0]
            }
            setDonations(prev => [newDonation, ...prev])
        }
        setIsModalOpen(false)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#10b981'
            case 'completed': return '#3b82f6'
            case 'paused': return '#f59e0b'
            default: return colors.detail
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Aktif'
            case 'completed': return 'Selesai'
            case 'paused': return 'Dijeda'
            default: return status
        }
    }

    return (
        <div style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
            {/* Header */}
            <div
                className="sticky top-0 z-10 border-b"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                                style={{ backgroundColor: colors.accent + '20', color: colors.accent }}
                            >
                                ←
                            </button>
                            <div>
                                <h1
                                    className="text-2xl font-bold"
                                    style={{
                                        color: colors.cardText,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Kelola Program Donasi
                                </h1>
                                <p
                                    className="text-sm mt-1"
                                    style={{
                                        color: colors.detail,
                                        fontFamily: 'var(--font-body)'
                                    }}
                                >
                                    Mengelola program donasi dan infaq masjid
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleAddDonation}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                            style={{
                                backgroundColor: colors.accent,
                                color: 'white',
                                fontFamily: 'var(--font-sharp-bold)'
                            }}
                        >
                            <FaPlus size={14} />
                            <span>Tambah Program</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch size={16} style={{ color: colors.detail }} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari program donasi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border transition-colors"
                            style={{
                                backgroundColor: colors.card,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 rounded-lg border transition-colors"
                        style={{
                            backgroundColor: colors.card,
                            color: colors.cardText,
                            border: `1px solid ${colors.border}`,
                            fontFamily: 'var(--font-body)'
                        }}
                    >
                        {categories.map(category => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 rounded-lg border transition-colors"
                        style={{
                            backgroundColor: colors.card,
                            color: colors.cardText,
                            border: `1px solid ${colors.border}`,
                            fontFamily: 'var(--font-body)'
                        }}
                    >
                        {statuses.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>

                    {/* Stats */}
                    <div
                        className="flex items-center justify-center px-3 py-2 rounded-lg"
                        style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
                    >
                        <span
                            className="text-sm font-semibold"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-sharp-bold)'
                            }}
                        >
                            {filteredDonations.length} Program
                        </span>
                    </div>
                </div>

                {/* Donations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDonations.map((donation, index) => {
                        const progressPercentage = (donation.currentAmount / donation.targetAmount) * 100

                        return (
                            <motion.div
                                key={donation.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="rounded-xl overflow-hidden shadow-lg border group"
                                style={{
                                    backgroundColor: colors.card,
                                    border: `1px solid ${colors.border}30`
                                }}
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={donation.image}
                                        alt={donation.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span
                                            className="px-2 py-1 rounded-full text-xs font-semibold"
                                            style={{
                                                backgroundColor: getStatusColor(donation.status),
                                                color: 'white'
                                            }}
                                        >
                                            {getStatusLabel(donation.status)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3
                                        className="font-bold text-lg mb-2 line-clamp-2"
                                        style={{
                                            color: colors.cardText,
                                            fontFamily: 'var(--font-header-modern)'
                                        }}
                                    >
                                        {donation.title}
                                    </h3>

                                    <p
                                        className="text-sm line-clamp-2 mb-4"
                                        style={{
                                            color: colors.detail,
                                            fontFamily: 'var(--font-body)'
                                        }}
                                    >
                                        {donation.description}
                                    </p>

                                    {/* Progress */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span style={{ color: colors.detail }}>Progress</span>
                                            <span style={{ color: colors.cardText }}>{progressPercentage.toFixed(1)}%</span>
                                        </div>
                                        <div
                                            className="w-full bg-gray-200 rounded-full h-2"
                                            style={{ backgroundColor: colors.border + '40' }}
                                        >
                                            <div
                                                className="h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.min(progressPercentage, 100)}%`,
                                                    backgroundColor: colors.accent
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs mt-1">
                                            <span style={{ color: colors.detail }}>
                                                {formatCurrency(donation.currentAmount)}
                                            </span>
                                            <span style={{ color: colors.detail }}>
                                                {formatCurrency(donation.targetAmount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditDonation(donation)}
                                            className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                                            style={{
                                                backgroundColor: colors.accent + '20',
                                                color: colors.accent
                                            }}
                                        >
                                            <FaEdit size={12} />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDonation(donation.id)}
                                            className="flex items-center justify-center p-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                                            style={{
                                                backgroundColor: '#dc262620',
                                                color: '#dc2626'
                                            }}
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredDonations.length === 0 && (
                    <div className="text-center py-12">
                        <FaMoneyBillWave
                            size={48}
                            style={{ color: colors.detail }}
                            className="mx-auto mb-4 opacity-50"
                        />
                        <h3
                            className="text-lg font-semibold mb-2"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-header-modern)'
                            }}
                        >
                            Tidak ada program donasi
                        </h3>
                        <p
                            className="text-sm"
                            style={{
                                color: colors.detail,
                                fontFamily: 'var(--font-body)'
                            }}
                        >
                            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                                ? 'Coba ubah filter pencarian'
                                : 'Belum ada program donasi yang dibuat'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit Donation */}
            <DonationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                donation={editingDonation}
                onSave={handleSaveDonation}
                colors={colors}
            />
        </div>
    )
}


interface DonationModalProps {
    isOpen: boolean
    onClose: () => void
    donation: DonationItem | null
    onSave: (donation: Partial<DonationItem>) => void
    colors: any
}

function DonationModal({ isOpen, onClose, donation, onSave, colors }: DonationModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        targetAmount: 0,
        currentAmount: 0,
        category: 'sosial',
        status: 'active' as 'active' | 'completed' | 'paused'
    })

    useEffect(() => {
        if (donation) {
            setFormData({
                title: donation.title,
                description: donation.description,
                image: donation.image,
                targetAmount: donation.targetAmount,
                currentAmount: donation.currentAmount,
                category: donation.category,
                status: donation.status
            })
        } else {
            setFormData({
                title: '',
                description: '',
                image: '',
                targetAmount: 0,
                currentAmount: 0,
                category: 'sosial',
                status: 'active'
            })
        }
    }, [donation, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                style={{ backgroundColor: colors.card }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-6 border-b"
                    style={{ borderColor: colors.border }}
                >
                    <h2
                        className="text-xl font-bold"
                        style={{
                            color: colors.cardText,
                            fontFamily: 'var(--font-header-modern)'
                        }}
                    >
                        {donation ? 'Edit Program Donasi' : 'Tambah Program Donasi'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                        style={{ backgroundColor: colors.border + '20' }}
                    >
                        <FaTimes size={16} style={{ color: colors.detail }} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label
                            className="block text-sm font-semibold mb-2"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-sharp-bold)'
                            }}
                        >
                            Judul Program
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Masukkan judul program donasi"
                            required
                            className="w-full px-3 py-2 rounded-lg border transition-colors"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            className="block text-sm font-semibold mb-2"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-sharp-bold)'
                            }}
                        >
                            Deskripsi
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Masukkan deskripsi program donasi"
                            rows={3}
                            required
                            className="w-full px-3 py-2 rounded-lg border transition-colors resize-none"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label
                            className="block text-sm font-semibold mb-2"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-sharp-bold)'
                            }}
                        >
                            URL Gambar
                        </label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="/images/example.jpg"
                            className="w-full px-3 py-2 rounded-lg border transition-colors"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                fontFamily: 'var(--font-body)'
                            }}
                        />
                    </div>

                    {/* Target and Current Amount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-sharp-bold)'
                                }}
                            >
                                Target Dana (Rp)
                            </label>
                            <input
                                type="number"
                                value={formData.targetAmount}
                                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: parseInt(e.target.value) || 0 }))}
                                placeholder="0"
                                min="0"
                                required
                                className="w-full px-3 py-2 rounded-lg border transition-colors"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`,
                                    fontFamily: 'var(--font-body)'
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-sharp-bold)'
                                }}
                            >
                                Dana Terkumpul (Rp)
                            </label>
                            <input
                                type="number"
                                value={formData.currentAmount}
                                onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: parseInt(e.target.value) || 0 }))}
                                placeholder="0"
                                min="0"
                                className="w-full px-3 py-2 rounded-lg border transition-colors"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`,
                                    fontFamily: 'var(--font-body)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Category and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-sharp-bold)'
                                }}
                            >
                                Kategori
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg border transition-colors"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`,
                                    fontFamily: 'var(--font-body)'
                                }}
                            >
                                <option value="infrastruktur">Infrastruktur</option>
                                <option value="sosial">Program Sosial</option>
                                <option value="pendidikan">Pendidikan</option>
                                <option value="kesehatan">Kesehatan</option>
                            </select>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-sharp-bold)'
                                }}
                            >
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'completed' | 'paused' }))}
                                className="w-full px-3 py-2 rounded-lg border transition-colors"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`,
                                    fontFamily: 'var(--font-body)'
                                }}
                            >
                                <option value="active">Aktif</option>
                                <option value="completed">Selesai</option>
                                <option value="paused">Dijeda</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors"
                            style={{
                                backgroundColor: colors.border + '20',
                                color: colors.detail,
                                fontFamily: 'var(--font-sharp-bold)'
                            }}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                            style={{
                                backgroundColor: colors.accent,
                                color: 'white',
                                fontFamily: 'var(--font-sharp-bold)'
                            }}
                        >
                            <FaSave size={14} />
                            <span>{donation ? 'Update' : 'Simpan'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
