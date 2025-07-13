import { useEffect, useCallback } from 'react'
import { useArticleStore, useArticleActions, useArticleOperations } from '../stores/adminArticleStore'
import { articleUseCases } from '../useCases/articleUseCases'
import { AdminArticle, CreateArticleRequest, UpdateArticleRequest, GetArticlesRequest } from '../repositories/articleRepository'

/**
 * Main hook for article management
 */
export const useArticles = () => {
    const {
        articles,
        pagination,
        selectedArticle,
        isLoading,
        error,
        filters,
        currentView,
        categories,
        popularTags,
        lastFetch,
        isDataFresh
    } = useArticleStore()

    const {
        setArticles,
        addArticle,
        updateArticle,
        removeArticle,
        setSelectedArticle,
        setLoading,
        setError,
        setFilters,
        resetFilters,
        setCurrentView,
        clearError
    } = useArticleActions()

    const {
        isCreating,
        isUpdating,
        isDeleting,
        setCreating,
        setUpdating,
        setDeleting
    } = useArticleOperations()

    // Load articles with current filters
    const loadArticles = useCallback(async (forceRefresh = false) => {
        try {
            setError(null)
            setLoading(true)

            // Get current state without subscription
            const currentArticles = useArticleStore.getState().articles
            const currentFilters = useArticleStore.getState().filters
            const currentPagination = useArticleStore.getState().pagination
            const isCurrentDataFresh = useArticleStore.getState().isDataFresh

            // Check if we need to refresh data
            const shouldRefresh = forceRefresh || !isCurrentDataFresh() || currentArticles.length === 0

            if (!shouldRefresh && currentArticles.length > 0) {
                setLoading(false)
                return
            }

            const request: GetArticlesRequest = {
                page: currentPagination?.page || 1,
                limit: 12, // Show 12 articles per page
                search: currentFilters.search || undefined,
                status: currentFilters.status !== 'all' ? currentFilters.status : undefined,
                category: currentFilters.category || undefined,
                sortBy: currentFilters.sortBy,
                sortOrder: currentFilters.sortOrder
            }

            const result = await articleUseCases.getArticles(request)
            
            if (result) {
                setArticles(result)
            } else {
                throw new Error('Failed to load articles')
            }
        } catch (err: any) {
            console.error('Error loading articles:', err)
            setError(err.message || 'Failed to load articles')
        } finally {
            setLoading(false)
        }
    }, [setArticles, setError, setLoading]) // Remove problematic dependencies

    // Create new article
    const createArticle = useCallback(async (data: CreateArticleRequest): Promise<AdminArticle | null> => {
        try {
            setError(null)
            setCreating(true)

            // Validate data
            const validation = articleUseCases.validateArticleData(data)
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '))
            }

            const newArticle = await articleUseCases.createArticle(data)
            
            if (newArticle) {
                addArticle(newArticle)
                setCurrentView('list')
                return newArticle
            } else {
                throw new Error('Failed to create article')
            }
        } catch (err: any) {
            console.error('Error creating article:', err)
            setError(err.message || 'Failed to create article')
            throw err
        } finally {
            setCreating(false)
        }
    }, [addArticle, setCreating, setError, setCurrentView])

    // Update existing article
    const updateExistingArticle = useCallback(async (data: UpdateArticleRequest): Promise<AdminArticle | null> => {
        try {
            setError(null)
            setUpdating(true)

            if (!data.id) {
                throw new Error('Article ID is required for update')
            }

            const updatedArticle = await articleUseCases.updateArticle(data)
            
            if (updatedArticle) {
                updateArticle(updatedArticle)
                setCurrentView('list')
                return updatedArticle
            } else {
                throw new Error('Failed to update article')
            }
        } catch (err: any) {
            console.error('Error updating article:', err)
            setError(err.message || 'Failed to update article')
            throw err
        } finally {
            setUpdating(false)
        }
    }, [updateArticle, setUpdating, setError, setCurrentView])

    // Delete article
    const deleteArticle = useCallback(async (id: string): Promise<boolean> => {
        try {
            setError(null)
            setDeleting(true)

            const success = await articleUseCases.deleteArticle(id)
            
            if (success) {
                removeArticle(id)
                return true
            } else {
                throw new Error('Failed to delete article')
            }
        } catch (err: any) {
            console.error('Error deleting article:', err)
            setError(err.message || 'Failed to delete article')
            return false
        } finally {
            setDeleting(false)
        }
    }, [removeArticle, setDeleting, setError])

    // Toggle featured status
    const toggleFeatured = useCallback(async (id: string): Promise<boolean> => {
        try {
            setError(null)

            const updatedArticle = await articleUseCases.toggleFeatured(id)
            
            if (updatedArticle) {
                updateArticle(updatedArticle)
                return true
            } else {
                throw new Error('Failed to toggle featured status')
            }
        } catch (err: any) {
            console.error('Error toggling featured status:', err)
            setError(err.message || 'Failed to toggle featured status')
            return false
        }
    }, [updateArticle, setError])

    // Load categories and tags
    const loadMetadata = useCallback(async () => {
        try {
            const [categoriesResult, tagsResult] = await Promise.all([
                articleUseCases.getCategories(),
                articleUseCases.getPopularTags(20)
            ])

            useArticleStore.getState().setCategories(categoriesResult)
            useArticleStore.getState().setPopularTags(tagsResult)
        } catch (err) {
            console.error('Error loading article metadata:', err)
        }
    }, [])

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
        setFilters(newFilters)
    }, [setFilters])

    // Handle pagination
    const handlePageChange = useCallback((page: number) => {
        setFilters({ ...filters, page } as any)
    }, [filters, setFilters])

    // Auto-load articles when component mounts or filters change
    useEffect(() => {
        let isCancelled = false
        
        const loadData = async () => {
            try {
                setError(null)
                setLoading(true)

                // Get current state without subscription
                const currentArticles = useArticleStore.getState().articles
                const currentFilters = useArticleStore.getState().filters
                const currentPagination = useArticleStore.getState().pagination
                const isCurrentDataFresh = useArticleStore.getState().isDataFresh

                // Check if we need to refresh data
                const shouldRefresh = !isCurrentDataFresh() || currentArticles.length === 0

                if (!shouldRefresh && currentArticles.length > 0) {
                    setLoading(false)
                    return
                }

                const request: GetArticlesRequest = {
                    page: currentPagination?.page || 1,
                    limit: 12,
                    search: currentFilters.search || undefined,
                    status: currentFilters.status !== 'all' ? currentFilters.status : undefined,
                    category: currentFilters.category || undefined,
                    sortBy: currentFilters.sortBy,
                    sortOrder: currentFilters.sortOrder
                }

                const result = await articleUseCases.getArticles(request)
                
                if (!isCancelled && result) {
                    setArticles(result)
                }
            } catch (err: any) {
                if (!isCancelled) {
                    console.error('Error loading articles:', err)
                    setError(err.message || 'Failed to load articles')
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false)
                }
            }
        }
        
        loadData()
        
        return () => {
            isCancelled = true
        }
    }, [setArticles, setError, setLoading]) // Remove filters dependency

    // Load metadata on mount only
    useEffect(() => {
        let isCancelled = false
        
        const loadData = async () => {
            try {
                const [categoriesResult, tagsResult] = await Promise.all([
                    articleUseCases.getCategories(),
                    articleUseCases.getPopularTags(20)
                ])

                if (!isCancelled) {
                    // Update store with metadata if needed
                    console.log('Categories loaded:', categoriesResult)
                    console.log('Tags loaded:', tagsResult)
                }
            } catch (err: any) {
                if (!isCancelled) {
                    console.error('Error loading metadata:', err)
                }
            }
        }
        
        loadData()
        
        return () => {
            isCancelled = true
        }
    }, []) // Empty dependency array - load once on mount

    return {
        // Data
        articles,
        pagination,
        selectedArticle,
        categories,
        popularTags,
        
        // State
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        error,
        filters,
        currentView,
        
        // Actions
        loadArticles,
        createArticle,
        updateArticle: updateExistingArticle,
        deleteArticle,
        toggleFeatured,
        
        // UI Actions
        setSelectedArticle,
        setCurrentView,
        handleFilterChange,
        handlePageChange,
        resetFilters,
        clearError,
        
        // Utils
        refreshData: () => loadArticles(true),
        formatArticle: articleUseCases.formatArticleForDisplay
    }
}

/**
 * Hook for article form management
 */
export const useArticleForm = (initialData?: AdminArticle) => {
    const { createArticle, updateArticle } = useArticles()
    const { isCreating, isUpdating } = useArticleOperations()

    const handleSave = useCallback(async (data: Partial<AdminArticle>) => {
        try {
            if (initialData?.id) {
                // Update existing article
                return await updateArticle({
                    id: initialData.id,
                    ...data
                } as UpdateArticleRequest)
            } else {
                // Create new article
                return await createArticle(data as CreateArticleRequest)
            }
        } catch (error) {
            throw error
        }
    }, [initialData?.id, createArticle, updateArticle])

    const validateForm = useCallback((data: Partial<CreateArticleRequest>) => {
        return articleUseCases.validateArticleData(data)
    }, [])

    return {
        handleSave,
        validateForm,
        isLoading: isCreating || isUpdating,
        isEditing: !!initialData?.id
    }
}

/**
 * Hook for article statistics
 */
export const useArticleStats = () => {
    const { articles } = useArticles()

    const stats = {
        total: articles.length,
        published: articles.filter(a => a.status === 'published').length,
        draft: articles.filter(a => a.status === 'draft').length,
        pending: articles.filter(a => a.status === 'pending').length,
        featured: articles.filter(a => a.featured).length,
        totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0)
    }

    return stats
}
