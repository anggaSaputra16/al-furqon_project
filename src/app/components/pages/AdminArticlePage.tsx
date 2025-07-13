'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter,
    FaCalendarAlt, FaUser, FaTags, FaFileAlt, FaArrowLeft,
    FaSave, FaImage, FaTimes, FaCheck, FaStar, FaSync
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'
import { useArticles } from '../../hooks/useArticles'
import { useArticleStore, useArticles as useArticleSelectors, usePagination, useSelectedArticle, useArticleLoading } from '../../stores/adminArticleStore'
import { useAdminUI } from '../../stores/adminStore'
import { AdminArticle, articleRepository } from '../../repositories/articleRepository'

interface AdminArticlePageProps {
    onBack: () => void
}

export default function AdminArticlePage({ onBack }: AdminArticlePageProps) {
    const { colors } = useTheme()
    const ui = useAdminUI()

    // Use individual store selectors to avoid infinite loops
    const articles = useArticleSelectors()
    const pagination = usePagination()
    const selectedArticle = useSelectedArticle()
    const isLoading = useArticleLoading()
    const categories = useArticleStore(state => state.categories)
    const error = useArticleStore(state => state.error)
    const filters = useArticleStore(state => state.filters)
    const currentView = useArticleStore(state => state.currentView)

    // Use store actions directly
    const setSelectedArticle = useArticleStore(state => state.setSelectedArticle)
    const setCurrentView = useArticleStore(state => state.setCurrentView)
    const setFilters = useArticleStore(state => state.setFilters)
    const clearError = useArticleStore(state => state.clearError)

    // Create stable action functions to avoid re-renders
    const handleFilterChange = (newFilters: any) => {
        const currentState = useArticleStore.getState()
        currentState.setFilters(newFilters)
    }

    // Manual refresh function
    const handleRefresh = async () => {
        const currentState = useArticleStore.getState()

        try {
            currentState.setLoading(true)
            const response = await articleRepository.getArticles({
                page: 1,
                limit: 12
            })

            if (response?.data) {
                currentState.setArticles(response.data)
                currentState.markDataAsFresh()
                console.log('✅ Articles refreshed successfully')

                // Show success notification
                ui.addNotification({
                    id: Date.now().toString(),
                    type: 'success',
                    title: 'Data Diperbarui',
                    message: 'Daftar artikel berhasil dimuat ulang',
                    timestamp: new Date().toISOString(),
                    autoClose: true,
                    duration: 2000
                })
            }
        } catch (error) {
            console.error('Error refreshing articles:', error)
            currentState.setError('Gagal memuat ulang artikel')

            // Show error notification
            ui.addNotification({
                id: Date.now().toString(),
                type: 'error',
                title: 'Gagal Memuat Ulang',
                message: 'Terjadi kesalahan saat memuat ulang data artikel',
                timestamp: new Date().toISOString(),
                autoClose: true,
                duration: 4000
            })
        } finally {
            currentState.setLoading(false)
        }
    }

    // Create stable functions for article operations
    const deleteArticle = async (articleId: string): Promise<boolean> => {
        try {
            const response = await articleRepository.deleteArticle(articleId)
            if (response?.success) {
                const currentState = useArticleStore.getState()
                currentState.removeArticle(articleId)

                // Refresh the list to ensure consistency
                try {
                    const refreshResponse = await articleRepository.getArticles({
                        page: 1,
                        limit: 12
                    })
                    if (refreshResponse?.data) {
                        currentState.setArticles(refreshResponse.data)
                        currentState.markDataAsFresh()
                    }
                } catch (refreshError) {
                    console.warn('Failed to refresh after delete:', refreshError)
                }

                return true
            }
            return false
        } catch (error) {
            console.error('Error deleting article:', error)
            return false
        }
    }

    const toggleFeatured = async (articleId: string): Promise<boolean> => {
        try {
            const currentState = useArticleStore.getState()
            const article = currentState.articles.find(a => a.id === articleId)
            if (!article) return false

            const response = await articleRepository.updateArticle({
                id: articleId,
                featured: !article.featured
            })

            if (response?.data) {
                currentState.updateArticle(response.data)

                // Refresh the list to ensure consistency
                try {
                    const refreshResponse = await articleRepository.getArticles({
                        page: 1,
                        limit: 12
                    })
                    if (refreshResponse?.data) {
                        currentState.setArticles(refreshResponse.data)
                        currentState.markDataAsFresh()
                    }
                } catch (refreshError) {
                    console.warn('Failed to refresh after toggle featured:', refreshError)
                }

                return true
            }
            return false
        } catch (error) {
            console.error('Error toggling featured:', error)
            return false
        }
    }

    // Form state for create/edit
    const [formData, setFormData] = useState<Partial<AdminArticle>>({
        title: '',
        description: '',
        content: '',
        image: '',
        category: '',
        tags: [],
        status: 'draft',
        featured: false,
        allowComments: true
    })

    // Local UI state
    const [tagInput, setTagInput] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    // Computed values
    const isEditing = currentView === 'edit' && !!selectedArticle
    const editingArticle = selectedArticle

    // Clear save error
    const clearSaveError = () => setSaveError(null)

    // Form handlers
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, title: e.target.value }))
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, description: e.target.value }))
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, content: e.target.value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, image: e.target.value }))
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, category: e.target.value }))
    }

    const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, featured: e.target.checked }))
    }

    const handleCommentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, allowComments: e.target.checked }))
    }

    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const tag = tagInput.trim()
            if (tag && !formData.tags?.includes(tag)) {
                setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }))
                setTagInput('')
            }
        }
    }

    const removeTag = (index: number) => {
        const newTags = [...(formData.tags || [])]
        newTags.splice(index, 1)
        setFormData(prev => ({ ...prev, tags: newTags }))
    }

    const handleBackToList = () => {
        setCurrentView('list')
        setSelectedArticle(null)
        setFormData({
            title: '',
            description: '',
            content: '',
            image: '',
            category: '',
            tags: [],
            status: 'draft',
            featured: false,
            allowComments: true
        })
        setSaveError(null)
    }

    const handleSave = async (status: 'draft' | 'published') => {
        try {
            setIsSubmitting(true)
            setSaveError(null)

            // Validate required fields for published articles
            if (status === 'published') {
                if (!formData.title?.trim()) {
                    throw new Error('Judul artikel harus diisi')
                }
                if (!formData.content?.trim()) {
                    throw new Error('Konten artikel harus diisi')
                }
            }

            const articleData = {
                ...formData,
                status,
                publishedAt: status === 'published' ? new Date().toISOString() : formData.publishedAt
            } as AdminArticle

            let response: any = null

            if (isEditing && selectedArticle) {
                const { id, ...updateData } = articleData
                response = await articleRepository.updateArticle({
                    id: selectedArticle.id,
                    ...updateData
                })
            } else {
                response = await articleRepository.createArticle(articleData)
            }

            // Update the store with the new/updated article
            const currentState = useArticleStore.getState()
            if (response?.data) {
                if (isEditing) {
                    // Update existing article in store
                    currentState.updateArticle(response.data)
                } else {
                    // Add new article to store
                    currentState.addArticle(response.data)
                }
            }

            // Refresh articles list from backend to ensure consistency
            try {
                const refreshResponse = await articleRepository.getArticles({
                    page: 1,
                    limit: 12
                })
                if (refreshResponse?.data) {
                    currentState.setArticles(refreshResponse.data)
                    currentState.markDataAsFresh()
                }
            } catch (refreshError) {
                console.warn('Failed to refresh articles list:', refreshError)
                // Don't throw error - the save operation was successful
            }

            // Show success notification
            ui.addNotification({
                id: Date.now().toString(),
                type: 'success',
                title: isEditing ? 'Artikel Diperbarui' : 'Artikel Dibuat',
                message: isEditing
                    ? `Artikel "${articleData.title}" berhasil diperbarui`
                    : `Artikel "${articleData.title}" berhasil dibuat`,
                timestamp: new Date().toISOString(),
                autoClose: true,
                duration: 3000
            })

            // Success - go back to list
            handleBackToList()
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Terjadi kesalahan')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Initialize form data when editing - use stable dependency
    useEffect(() => {
        if (currentView === 'edit' && selectedArticle?.id) {
            setFormData(selectedArticle)
        } else if (currentView === 'create') {
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
        }
    }, [currentView, selectedArticle?.id]) // Only depend on view and article ID, not the full object

    // Filter articles based on current filters
    const filteredArticles = articles.filter(article => {
        const matchesSearch = !filters.search ||
            article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            article.description.toLowerCase().includes(filters.search.toLowerCase())
        const matchesStatus = filters.status === 'all' || article.status === filters.status
        const matchesCategory = !filters.category || article.category === filters.category
        return matchesSearch && matchesStatus && matchesCategory
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

    const handleEdit = (article: AdminArticle) => {
        setSelectedArticle(article)
        setCurrentView('edit')
    }

    const handleDelete = async (articleId: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            const success = await deleteArticle(articleId)
            if (success) {
                // Show success notification
                ui.addNotification({
                    id: Date.now().toString(),
                    type: 'success',
                    title: 'Artikel Dihapus',
                    message: 'Artikel berhasil dihapus',
                    timestamp: new Date().toISOString(),
                    autoClose: true,
                    duration: 3000
                })
            } else {
                // Show error notification
                ui.addNotification({
                    id: Date.now().toString(),
                    type: 'error',
                    title: 'Gagal Menghapus',
                    message: 'Terjadi kesalahan saat menghapus artikel',
                    timestamp: new Date().toISOString(),
                    autoClose: true,
                    duration: 4000
                })
            }
        }
    }

    const handleToggleFeatured = async (articleId: string) => {
        const success = await toggleFeatured(articleId)
        if (success) {
            // Show success notification
            ui.addNotification({
                id: Date.now().toString(),
                type: 'success',
                title: 'Status Featured Diperbarui',
                message: 'Status featured artikel berhasil diubah',
                timestamp: new Date().toISOString(),
                autoClose: true,
                duration: 2000
            })
        } else {
            // Show error notification
            ui.addNotification({
                id: Date.now().toString(),
                type: 'error',
                title: 'Gagal Mengubah Status',
                message: error || 'Terjadi kesalahan saat mengubah status featured',
                timestamp: new Date().toISOString(),
                autoClose: true,
                duration: 4000
            })
        }
    }

    const handleFormChange = (field: keyof AdminArticle, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleTagAdd = (tag: string) => {
        if (tag.trim() && !formData.tags?.includes(tag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tag.trim()]
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

    // Clear error when component unmounts - use stable reference
    useEffect(() => {
        return () => {
            const currentState = useArticleStore.getState()
            currentState.clearError()
        }
    }, []) // Empty deps - only run on mount/unmount

    // Load articles on component mount if needed
    useEffect(() => {
        const loadArticlesOnMount = async () => {
            const currentState = useArticleStore.getState()

            // Only load if we don't have fresh data
            if (!currentState.isDataFresh() || currentState.articles.length === 0) {
                try {
                    currentState.setLoading(true)
                    const response = await articleRepository.getArticles({
                        page: 1,
                        limit: 12
                    })

                    if (response?.data) {
                        currentState.setArticles(response.data)
                        currentState.markDataAsFresh()
                    }
                } catch (error) {
                    console.error('Error loading articles:', error)
                    currentState.setError('Failed to load articles')
                } finally {
                    currentState.setLoading(false)
                }
            }
        }

        loadArticlesOnMount()
    }, []) // Empty deps - only run once on mount

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
                                {filteredArticles.length} Artikel
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                                title="Refresh artikel"
                            >
                                <FaSync size={14} className={isLoading ? 'animate-spin' : ''} />
                                <span>Refresh</span>
                            </button>

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
                </div>

                <div className="p-6">
                    {/* Error Display */}
                    {error && (
                        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-red-700 text-sm">{error}</p>
                            <button
                                onClick={clearError}
                                className="text-red-500 hover:text-red-700 text-xs mt-2"
                            >
                                Tutup
                            </button>
                        </div>
                    )}

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
                                value={filters.search}
                                onChange={(e) => handleFilterChange({ search: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                                onFocus={(e) => {
                                    e.target.style.outline = 'none'
                                    e.target.style.boxShadow = `0 0 0 2px ${colors.accent}50`
                                }}
                            />
                        </div>

                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange({ status: e.target.value as any })}
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

                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange({ category: e.target.value })}
                            className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{
                                backgroundColor: colors.card,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`
                            }}
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                <span style={{ color: colors.detail }}>Memuat artikel...</span>
                            </div>
                        </div>
                    )}

                    {/* Articles Grid */}
                    {!isLoading && (
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
                                            src={article.image || '/images/placeholder.jpg'}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
                                            }}
                                        />
                                        {article.featured && (
                                            <div
                                                className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1"
                                                style={{
                                                    backgroundColor: colors.accent,
                                                    color: 'white'
                                                }}
                                            >
                                                <FaStar size={10} />
                                                <span>Featured</span>
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

                                        {/* Category */}
                                        {article.category && (
                                            <div className="mb-3">
                                                <span
                                                    className="px-2 py-1 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: colors.detail + '20',
                                                        color: colors.detail
                                                    }}
                                                >
                                                    {article.category}
                                                </span>
                                            </div>
                                        )}

                                        {/* Meta Info */}
                                        <div className="flex items-center justify-between text-xs mb-4" style={{ color: colors.detail }}>
                                            <span>By {article.author}</span>
                                            <span>{article.views || 0} views</span>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {article.tags?.slice(0, 3).map(tag => (
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
                                                    title="Edit artikel"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleFeatured(article.id)}
                                                    className="p-2 rounded-lg transition-colors duration-200"
                                                    style={{
                                                        backgroundColor: article.featured ? '#f59e0b20' : colors.detail + '20',
                                                        color: article.featured ? '#f59e0b' : colors.detail
                                                    }}
                                                    title={article.featured ? 'Hapus dari featured' : 'Jadikan featured'}
                                                >
                                                    <FaStar size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="p-2 rounded-lg transition-colors duration-200"
                                                    style={{
                                                        backgroundColor: '#ef444420',
                                                        color: '#ef4444'
                                                    }}
                                                    title="Hapus artikel"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                            <span className="text-xs" style={{ color: colors.detail }}>
                                                {new Date(article.publishedAt).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredArticles.length === 0 && (
                        <div className="text-center py-12">
                            <FaFileAlt size={48} style={{ color: colors.detail }} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2" style={{ color: colors.cardText }}>
                                Tidak ada artikel ditemukan
                            </p>
                            <p style={{ color: colors.detail }}>
                                {filters.search || filters.status !== 'all' || filters.category
                                    ? 'Coba ubah filter atau kata kunci pencarian'
                                    : 'Mulai dengan membuat artikel pertama Anda'
                                }
                            </p>
                            {(!filters.search && filters.status === 'all' && !filters.category) && (
                                <button
                                    onClick={handleCreate}
                                    className="mt-4 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                                    style={{
                                        backgroundColor: colors.accent,
                                        color: 'white'
                                    }}
                                >
                                    Buat Artikel Pertama
                                </button>
                            )}
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
                            onClick={handleBackToList}
                            className="p-2 rounded-lg transition-colors duration-200"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText
                            }}
                        >
                            <FaArrowLeft size={18} />
                        </button>
                        <div>
                            <h1
                                className="text-2xl font-bold"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-header-modern)'
                                }}
                            >
                                {isEditing ? 'Edit Artikel' : 'Buat Artikel Baru'}
                            </h1>
                            {isEditing && (
                                <p className="text-sm" style={{ color: colors.detail }}>
                                    ID: {formData.id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Save as Draft */}
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                            style={{
                                backgroundColor: colors.detail + '20',
                                color: colors.detail
                            }}
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Draft'}
                        </button>

                        {/* Publish */}
                        <button
                            onClick={() => handleSave('published')}
                            disabled={isSubmitting || !(formData.title || '').trim() || !(formData.content || '').trim()}
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                            style={{
                                backgroundColor: colors.accent,
                                color: 'white'
                            }}
                        >
                            {isSubmitting ? 'Mempublikasi...' : 'Publikasikan'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                {/* Error Display */}
                {saveError && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                        <div className="flex items-center justify-between">
                            <p className="text-red-700 text-sm">{saveError}</p>
                            <button
                                onClick={clearSaveError}
                                className="text-red-500 hover:text-red-700"
                            >
                                <span className="text-xs">✕</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {formData.id && !saveError && !isSubmitting && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-green-700 text-sm">
                            Artikel berhasil {isEditing ? 'diperbarui' : 'dibuat'}!
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                Judul Artikel *
                            </label>
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={handleTitleChange}
                                placeholder="Masukkan judul artikel..."
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                            />
                            <p className="text-xs mt-1" style={{ color: colors.detail }}>
                                Slug: {formData.slug || 'akan-dibuat-otomatis'}
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                Deskripsi Singkat
                            </label>
                            <textarea
                                value={formData.description || ''}
                                onChange={handleDescriptionChange}
                                placeholder="Deskripsi singkat artikel..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                                Konten Artikel *
                            </label>
                            <textarea
                                value={formData.content || ''}
                                onChange={handleContentChange}
                                placeholder="Tulis konten artikel di sini..."
                                rows={20}
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-y"
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                            />
                            <p className="text-xs mt-1" style={{ color: colors.detail }}>
                                {(formData.content || '').length} karakter
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Featured Image */}
                        <div
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border + '30'
                            }}
                        >
                            <h3 className="font-medium mb-3" style={{ color: colors.cardText }}>
                                Gambar Utama
                            </h3>
                            <div className="space-y-3">
                                <input
                                    type="url"
                                    value={formData.image || ''}
                                    onChange={handleImageChange}
                                    placeholder="URL gambar..."
                                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText,
                                        border: `1px solid ${colors.border}`
                                    }}
                                />
                                {formData.image && (
                                    <div className="relative">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border + '30'
                            }}
                        >
                            <h3 className="font-medium mb-3" style={{ color: colors.cardText }}>
                                Kategori
                            </h3>
                            <select
                                value={formData.category || ''}
                                onChange={handleCategoryChange}
                                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                            >
                                <option value="">Pilih kategori...</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border + '30'
                            }}
                        >
                            <h3 className="font-medium mb-3" style={{ color: colors.cardText }}>
                                Tags
                            </h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleTagKeyPress}
                                    placeholder="Ketik tag dan tekan Enter..."
                                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText,
                                        border: `1px solid ${colors.border}`
                                    }}
                                />
                                <div className="flex flex-wrap gap-2">
                                    {(formData.tags || []).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs"
                                            style={{
                                                backgroundColor: colors.accent + '20',
                                                color: colors.accent
                                            }}
                                        >
                                            <span>{tag}</span>
                                            <button
                                                onClick={() => removeTag(index)}
                                                className="hover:bg-red-500 hover:text-white rounded-full p-0.5 transition-colors"
                                            >
                                                <span className="text-xs">×</span>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border + '30'
                            }}
                        >
                            <h3 className="font-medium mb-3" style={{ color: colors.cardText }}>
                                Pengaturan
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured || false}
                                        onChange={handleFeaturedChange}
                                        className="rounded focus:ring-2 focus:ring-opacity-50"
                                        style={{ accentColor: colors.accent }}
                                    />
                                    <span className="text-sm" style={{ color: colors.cardText }}>
                                        Jadikan artikel unggulan
                                    </span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowComments || false}
                                        onChange={handleCommentsChange}
                                        className="rounded focus:ring-2 focus:ring-opacity-50"
                                        style={{ accentColor: colors.accent }}
                                    />
                                    <span className="text-sm" style={{ color: colors.cardText }}>
                                        Izinkan komentar
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Meta Information */}
                        {isEditing && (
                            <div
                                className="p-4 rounded-lg border"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border + '30'
                                }}
                            >
                                <h3 className="font-medium mb-3" style={{ color: colors.cardText }}>
                                    Informasi
                                </h3>
                                <div className="space-y-2 text-sm" style={{ color: colors.detail }}>
                                    <div>Status: <span style={{ color: getStatusColor(formData.status || 'draft') }}>
                                        {getStatusText(formData.status || 'draft')}
                                    </span></div>
                                    <div>Penulis: {formData.author || 'Tidak diketahui'}</div>
                                    {formData.createdAt && (
                                        <div>Dibuat: {new Date(formData.createdAt).toLocaleDateString('id-ID')}</div>
                                    )}
                                    {formData.publishedAt && (
                                        <div>Dipublikasi: {new Date(formData.publishedAt).toLocaleDateString('id-ID')}</div>
                                    )}
                                    <div>Views: {formData.views || 0}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
