import { create } from 'zustand'
import { AdminArticle, GetArticlesRequest } from '../repositories/articleRepository'
import { PaginatedResponse } from '../types/adminResponseTypes'

interface ArticleFilters {
    search: string
    status: 'all' | 'published' | 'draft' | 'pending'
    category: string
    sortBy: 'createdAt' | 'publishedAt' | 'views' | 'title'
    sortOrder: 'asc' | 'desc'
}

interface ArticleState {
    
    articles: AdminArticle[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    } | null
    selectedArticle: AdminArticle | null
    

    isLoading: boolean
    isCreating: boolean
    isUpdating: boolean
    isDeleting: boolean
    error: string | null
    

    filters: ArticleFilters
    

    currentView: 'list' | 'create' | 'edit'
    

    categories: string[]
    popularTags: string[]
    

    lastFetch: number | null
}

interface ArticleActions {

    setArticles: (data: PaginatedResponse<AdminArticle>) => void
    addArticle: (article: AdminArticle) => void
    updateArticle: (article: AdminArticle) => void
    removeArticle: (id: string) => void
    setSelectedArticle: (article: AdminArticle | null) => void
    

    setLoading: (loading: boolean) => void
    setCreating: (creating: boolean) => void
    setUpdating: (updating: boolean) => void
    setDeleting: (deleting: boolean) => void
    setError: (error: string | null) => void
    

    setFilters: (filters: Partial<ArticleFilters>) => void
    resetFilters: () => void
    

    setCurrentView: (view: 'list' | 'create' | 'edit') => void
    

    setCategories: (categories: string[]) => void
    setPopularTags: (tags: string[]) => void
    

    clearError: () => void
    reset: () => void
    markDataAsFresh: () => void
    isDataFresh: () => boolean
}

type ArticleStore = ArticleState & ArticleActions

const initialFilters: ArticleFilters = {
    search: '',
    status: 'all',
    category: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
}

const initialState: ArticleState = {

    articles: [],
    pagination: null,
    selectedArticle: null,
    

    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    

    filters: initialFilters,
    

    currentView: 'list',
    

    categories: ['Kajian', 'Pengumuman', 'Kegiatan', 'Berita', 'Program'],
    popularTags: [],
    

    lastFetch: null
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
    ...initialState,
    

    setArticles: (data: PaginatedResponse<AdminArticle>) =>
        set({
            articles: data.data,
            pagination: data.pagination,
            lastFetch: Date.now(),
            error: null
        }),
    
    addArticle: (article: AdminArticle) =>
        set((state) => ({
            articles: [article, ...state.articles],
            pagination: state.pagination ? {
                ...state.pagination,
                total: state.pagination.total + 1
            } : null
        })),
    
    updateArticle: (article: AdminArticle) =>
        set((state) => ({
            articles: state.articles.map(a => a.id === article.id ? article : a),
            selectedArticle: state.selectedArticle?.id === article.id ? article : state.selectedArticle
        })),
    
    removeArticle: (id: string) =>
        set((state) => ({
            articles: state.articles.filter(a => a.id !== id),
            selectedArticle: state.selectedArticle?.id === id ? null : state.selectedArticle,
            pagination: state.pagination ? {
                ...state.pagination,
                total: state.pagination.total - 1
            } : null
        })),
    
    setSelectedArticle: (article: AdminArticle | null) =>
        set({ selectedArticle: article }),
    

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setCreating: (creating: boolean) => set({ isCreating: creating }),
    setUpdating: (updating: boolean) => set({ isUpdating: updating }),
    setDeleting: (deleting: boolean) => set({ isDeleting: deleting }),
    setError: (error: string | null) => set({ error }),
    

    setFilters: (newFilters: Partial<ArticleFilters>) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),
    
    resetFilters: () => set({ filters: initialFilters }),
    

    setCurrentView: (view: 'list' | 'create' | 'edit') =>
        set({ currentView: view }),
    

    setCategories: (categories: string[]) => set({ categories }),
    setPopularTags: (popularTags: string[]) => set({ popularTags }),
    

    clearError: () => set({ error: null }),
    
    reset: () => set(initialState),
    
    markDataAsFresh: () => set({ lastFetch: Date.now() }),
    
    isDataFresh: (): boolean => {
        const { lastFetch } = get()
        if (!lastFetch) return false
        
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
        return lastFetch > fiveMinutesAgo
    }
}))


export const useArticles = () => useArticleStore(state => state.articles)
export const usePagination = () => useArticleStore(state => state.pagination)
export const useSelectedArticle = () => useArticleStore(state => state.selectedArticle)
export const useArticleLoading = () => useArticleStore(state => state.isLoading)
export const useArticleError = () => useArticleStore(state => state.error)
export const useArticleFilters = () => useArticleStore(state => state.filters)
export const useCurrentView = () => useArticleStore(state => state.currentView)
export const useCategories = () => useArticleStore(state => state.categories)
export const usePopularTags = () => useArticleStore(state => state.popularTags)


export const useArticleOperations = () => useArticleStore(state => ({
    isCreating: state.isCreating,
    isUpdating: state.isUpdating,
    isDeleting: state.isDeleting,
    setCreating: state.setCreating,
    setUpdating: state.setUpdating,
    setDeleting: state.setDeleting
}))

export const useArticleActions = () => useArticleStore(state => ({
    setArticles: state.setArticles,
    addArticle: state.addArticle,
    updateArticle: state.updateArticle,
    removeArticle: state.removeArticle,
    setSelectedArticle: state.setSelectedArticle,
    setLoading: state.setLoading,
    setError: state.setError,
    setFilters: state.setFilters,
    resetFilters: state.resetFilters,
    setCurrentView: state.setCurrentView,
    clearError: state.clearError
}))
