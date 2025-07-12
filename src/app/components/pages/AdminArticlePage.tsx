'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter,
    FaCalendarAlt, FaUser, FaTags, FaFileAlt, FaArrowLeft,
    FaSave, FaImage, FaTimes, FaCheck
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface Article {
    id: string
    title: string
    description: string
    content: string
    image: string
    author: string
    publishedAt: string
    status: 'published' | 'draft' | 'pending'
    category: string
    tags: string[]
    views: number
    featured: boolean
}

interface AdminArticlePageProps {
    onBack: () => void
}

export default function AdminArticlePage({ onBack }: AdminArticlePageProps) {
    const { colors } = useTheme()
    const [articles, setArticles] = useState<Article[]>([
        {
            id: '1',
            title: 'Kajian Rutin Minggu Pagi',
            description: 'Kajian rutin setiap minggu pagi membahas tafsir Al-Quran',
            content: 'Content lengkap kajian...',
            image: '/images/kajian.jpg',
            author: 'Ustadz Ahmad',
            publishedAt: '2024-01-15',
            status: 'published',
            category: 'Kajian',
            tags: ['kajian', 'tafsir', 'minggu'],
            views: 125,
            featured: true
        },
        {
            id: '2',
            title: 'Pengumuman Libur Hari Raya',
            description: 'Pengumuman jadwal libur dan kegiatan hari raya',
            content: 'Pengumuman lengkap...',
            image: '/images/pengumuman.jpg',
            author: 'Admin',
            publishedAt: '2024-01-10',
            status: 'draft',
            category: 'Pengumuman',
            tags: ['pengumuman', 'libur'],
            views: 45,
            featured: false
        }
    ])

    const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list')
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'pending'>('all')
    const [isLoading, setIsLoading] = useState(false)

    // Form state for create/edit
    const [formData, setFormData] = useState<Partial<Article>>({
        title: '',
        description: '',
        content: '',
        image: '',
        category: '',
        tags: [],
        status: 'draft',
        featured: false
    })

    const categories = ['Kajian', 'Pengumuman', 'Kegiatan', 'Berita', 'Program']

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || article.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const handleCreate = () => {
        setFormData({
            title: '',
            description: '',
            content: '',
            image: '',
            category: '',
            tags: [],
            status: 'draft',
            featured: false
        })
        setSelectedArticle(null)
        setCurrentView('create')
    }

    const handleEdit = (article: Article) => {
        setFormData(article)
        setSelectedArticle(article)
        setCurrentView('edit')
    }

    const handleDelete = async (articleId: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            setIsLoading(true)
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500))
                setArticles(prev => prev.filter(article => article.id !== articleId))
            } catch (error) {
                console.error('Error deleting article:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleSave = async () => {
        if (!formData.title || !formData.description || !formData.content) {
            alert('Mohon lengkapi semua field yang wajib')
            return
        }

        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (currentView === 'create') {
                const newArticle: Article = {
                    ...formData as Article,
                    id: Date.now().toString(),
                    author: 'Admin',
                    publishedAt: new Date().toISOString().split('T')[0],
                    views: 0
                }
                setArticles(prev => [newArticle, ...prev])
            } else if (currentView === 'edit' && selectedArticle) {
                setArticles(prev => prev.map(article =>
                    article.id === selectedArticle.id
                        ? { ...article, ...formData }
                        : article
                ))
            }

            setCurrentView('list')
            alert('Artikel berhasil disimpan!')
        } catch (error) {
            console.error('Error saving article:', error)
            alert('Terjadi kesalahan saat menyimpan artikel')
        } finally {
            setIsLoading(false)
        }
    }

    const handleFormChange = (field: keyof Article, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleTagAdd = (tag: string) => {
        if (tag && !formData.tags?.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tag]
            }))
        }
    }

    const handleTagRemove = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
        }))
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return '#10b981'
            case 'draft': return '#f59e0b'
            case 'pending': return '#ef4444'
            default: return colors.detail
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'published': return 'Dipublikasi'
            case 'draft': return 'Draft'
            case 'pending': return 'Menunggu'
            default: return status
        }
    }

    // List View
    if (currentView === 'list') {
        return (
            <div
                className="min-h-screen"
                style={{ backgroundColor: colors.background }}
            >
                {/* Header */}
                <div
                    className="sticky top-0 z-50 px-6 py-4 border-b backdrop-blur-md"
                    style={{
                        backgroundColor: colors.card + 'CC',
                        borderColor: colors.border + '30'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="p-2 rounded-lg transition-colors duration-200"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText
                                }}
                            >
                                <FaArrowLeft size={18} />
                            </button>
                            <h1
                                className="text-2xl font-bold"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-header-modern)'
                                }}
                            >
                                Kelola Artikel
                            </h1>
                            <div
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: colors.accent + '20',
                                    color: colors.accent
                                }}
                            >
                                {articles.length} Artikel
                            </div>
                        </div>

                        <button
                            onClick={handleCreate}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                            style={{
                                backgroundColor: colors.accent,
                                color: 'white'
                            }}
                        >
                            <FaPlus size={16} />
                            <span>Buat Artikel</span>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <FaSearch
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                size={16}
                                style={{ color: colors.detail }}
                            />
                            <input
                                type="text"
                                placeholder="Cari artikel..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                            />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{
                                backgroundColor: colors.card,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`
                            }}
                        >
                            <option value="all">Semua Status</option>
                            <option value="published">Dipublikasi</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Menunggu</option>
                        </select>
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="rounded-xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border + '30'
                                }}
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {article.featured && (
                                        <div
                                            className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium"
                                            style={{
                                                backgroundColor: colors.accent,
                                                color: 'white'
                                            }}
                                        >
                                            Featured
                                        </div>
                                    )}
                                    <div
                                        className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium"
                                        style={{
                                            backgroundColor: getStatusColor(article.status) + '20',
                                            color: getStatusColor(article.status)
                                        }}
                                    >
                                        {getStatusText(article.status)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3
                                        className="font-bold text-lg mb-2 line-clamp-2"
                                        style={{ color: colors.cardText }}
                                    >
                                        {article.title}
                                    </h3>
                                    <p
                                        className="text-sm line-clamp-2 mb-3"
                                        style={{ color: colors.detail }}
                                    >
                                        {article.description}
                                    </p>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between text-xs mb-4" style={{ color: colors.detail }}>
                                        <span>By {article.author}</span>
                                        <span>{article.views} views</span>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {article.tags.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 rounded-full text-xs"
                                                style={{
                                                    backgroundColor: colors.accent + '15',
                                                    color: colors.accent
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(article)}
                                                className="p-2 rounded-lg transition-colors duration-200"
                                                style={{
                                                    backgroundColor: colors.accent + '20',
                                                    color: colors.accent
                                                }}
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="p-2 rounded-lg transition-colors duration-200"
                                                style={{
                                                    backgroundColor: '#ef444420',
                                                    color: '#ef4444'
                                                }}
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                        <span className="text-xs" style={{ color: colors.detail }}>
                                            {article.publishedAt}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-12">
                            <FaFileAlt size={48} style={{ color: colors.detail }} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2" style={{ color: colors.cardText }}>
                                Tidak ada artikel ditemukan
                            </p>
                            <p style={{ color: colors.detail }}>
                                {searchTerm || filterStatus !== 'all'
                                    ? 'Coba ubah filter atau kata kunci pencarian'
                                    : 'Mulai dengan membuat artikel pertama Anda'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Create/Edit Form View
    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: colors.background }}
        >
            {/* Header */}
            <div
                className="sticky top-0 z-50 px-6 py-4 border-b backdrop-blur-md"
                style={{
                    backgroundColor: colors.card + 'CC',
                    borderColor: colors.border + '30'
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setCurrentView('list')}
                            className="p-2 rounded-lg transition-colors duration-200"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText
                            }}
                        >
                            <FaArrowLeft size={18} />
                        </button>
                        <h1
                            className="text-2xl font-bold"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-header-modern)'
                            }}
                        >
                            {currentView === 'create' ? 'Buat Artikel Baru' : 'Edit Artikel'}
                        </h1>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: colors.accent,
                            color: 'white'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <FaSave size={16} />
                                <span>Simpan</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="p-6 max-w-4xl mx-auto">
                <div
                    className="rounded-xl border p-6"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border + '30'
                    }}
                >
                    <form className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                Judul Artikel *
                            </label>
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => handleFormChange('title', e.target.value)}
                                placeholder="Masukkan judul artikel"
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                Deskripsi *
                            </label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => handleFormChange('description', e.target.value)}
                                placeholder="Masukkan deskripsi singkat artikel"
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                                required
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                Konten *
                            </label>
                            <textarea
                                value={formData.content || ''}
                                onChange={(e) => handleFormChange('content', e.target.value)}
                                placeholder="Masukkan konten lengkap artikel"
                                rows={10}
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                                required
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                URL Gambar
                            </label>
                            <input
                                type="url"
                                value={formData.image || ''}
                                onChange={(e) => handleFormChange('image', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                            />
                        </div>

                        {/* Category and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                    Kategori
                                </label>
                                <select
                                    value={formData.category || ''}
                                    onChange={(e) => handleFormChange('category', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText,
                                        border: `1px solid ${colors.border}`
                                    }}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                    Status
                                </label>
                                <select
                                    value={formData.status || 'draft'}
                                    onChange={(e) => handleFormChange('status', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText,
                                        border: `1px solid ${colors.border}`
                                    }}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Dipublikasi</option>
                                    <option value="pending">Menunggu Review</option>
                                </select>
                            </div>
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured || false}
                                onChange={(e) => handleFormChange('featured', e.target.checked)}
                                className="w-5 h-5 rounded"
                                style={{ accentColor: colors.accent }}
                            />
                            <label htmlFor="featured" className="text-sm font-medium" style={{ color: colors.cardText }}>
                                Jadikan artikel unggulan
                            </label>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.tags?.map(tag => (
                                    <span
                                        key={tag}
                                        className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm"
                                        style={{
                                            backgroundColor: colors.accent + '20',
                                            color: colors.accent
                                        }}
                                    >
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleTagRemove(tag)}
                                            className="ml-1"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Tambahkan tag (tekan Enter)"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        const target = e.target as HTMLInputElement
                                        handleTagAdd(target.value.trim())
                                        target.value = ''
                                    }
                                }}
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
