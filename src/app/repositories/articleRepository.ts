import { ApiResponse, PaginatedResponse } from '../types/adminResponseTypes'



export interface AdminArticle {
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
    slug?: string
    createdAt?: string
    updatedAt?: string
    allowComments?: boolean
}

export interface CreateArticleRequest {
    title: string
    description: string
    content: string
    image?: string
    category: string
    tags: string[]
    status: 'published' | 'draft' | 'pending'
    featured: boolean
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
    id: string
}

export interface GetArticlesRequest {
    page?: number
    limit?: number
    search?: string
    status?: 'all' | 'published' | 'draft' | 'pending'
    category?: string
    author?: string
    sortBy?: 'createdAt' | 'publishedAt' | 'views' | 'title'
    sortOrder?: 'asc' | 'desc'
}

class ArticleRepository {
    private readonly BASE_URL = 'http://localhost:5000/api/v1/admin'
    private readonly ARTICLE_ENDPOINTS = {
        LIST: `${this.BASE_URL}/articles`,
        CREATE: `${this.BASE_URL}/articles`,
        UPDATE: (id: string) => `${this.BASE_URL}/articles/${id}`,
        DELETE: (id: string) => `${this.BASE_URL}/articles/${id}`,
        GET_BY_ID: (id: string) => `${this.BASE_URL}/articles/${id}`,
        BULK_DELETE: `${this.BASE_URL}/articles/bulk-delete`,
        TOGGLE_FEATURED: (id: string) => `${this.BASE_URL}/articles/${id}/featured`,
        DUPLICATE: (id: string) => `${this.BASE_URL}/articles/${id}/duplicate`
    }


    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('admin-auth-store')
        const parsedToken = token ? JSON.parse(token) : null
        
        return {
            'Content-Type': 'application/json',
            ...(parsedToken?.state?.token && { 'Authorization': `Bearer ${parsedToken.state.token}` })
        }
    }

    private async makeRequest<T>(
        url: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const headers = {
                ...this.getAuthHeaders(),
                ...options.headers as Record<string, string>
            }

            const response = await fetch(url, {
                ...options,
                headers,
                signal: AbortSignal.timeout(10000)
            })


            if (!response.ok) {
                const errorText = await response.text()
                console.error(`HTTP error! status: ${response.status}, body:`, errorText)
                if (response.status === 401) {
                    console.error('❌ Authentication failed! Token may be invalid or expired.')
                }
                

                try {
                    const parsedError = JSON.parse(errorText)
                    throw new Error(parsedError.message || `HTTP error! status: ${response.status}`)
                } catch {
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
                }
            }

            const responseData = await response.json()

            return responseData
        } catch (error: any) {
            console.error('❌ Article Repository Error:', {
                message: error.message,
                url: url,
                method: options.method || 'GET'
            })
            throw error
        }
    }

    async getArticles(request: GetArticlesRequest = {}): Promise<ApiResponse<PaginatedResponse<AdminArticle>>> {
        try {
            const params = new URLSearchParams()
            
            if (request.page) params.append('page', request.page.toString())
            if (request.limit) params.append('limit', request.limit.toString())
            if (request.search) params.append('search', request.search)
            if (request.status && request.status !== 'all') params.append('status', request.status)
            if (request.category) params.append('category', request.category)
            if (request.author) params.append('author', request.author)
            if (request.sortBy) params.append('sortBy', request.sortBy)
            if (request.sortOrder) params.append('sortOrder', request.sortOrder)

            const queryString = params.toString()
            const url = `${this.ARTICLE_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`

            return await this.makeRequest<PaginatedResponse<AdminArticle>>(url)
        } catch (error) {
            console.error('Error fetching articles:', error)
            throw error
        }
    }

    async getArticlesWithFallback(request: GetArticlesRequest = {}): Promise<PaginatedResponse<AdminArticle>> {
        try {
            const response = await this.getArticles(request)
            if (response.success && response.data) {
                return response.data
            }
            throw new Error('Backend response not successful')
        } catch (error) {
            console.warn('Using fallback mock data for articles:', error)
            

            const mockArticles: AdminArticle[] = [
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
                    featured: true,
                    createdAt: '2024-01-15',
                    updatedAt: '2024-01-15'
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
                    featured: false,
                    createdAt: '2024-01-10',
                    updatedAt: '2024-01-10'
                },
                {
                    id: '3',
                    title: 'Program Tahfidz Untuk Anak',
                    description: 'Program menghafal Al-Quran untuk anak-anak usia 6-12 tahun',
                    content: 'Detail program tahfidz...',
                    image: '/images/kids.jpg',
                    author: 'Ustadz Rahman',
                    publishedAt: '2024-01-08',
                    status: 'published',
                    category: 'Program',
                    tags: ['tahfidz', 'anak', 'program'],
                    views: 89,
                    featured: false,
                    createdAt: '2024-01-08',
                    updatedAt: '2024-01-08'
                }
            ]


            let filteredArticles = [...mockArticles]

            if (request.search) {
                const searchLower = request.search.toLowerCase()
                filteredArticles = filteredArticles.filter(article =>
                    article.title.toLowerCase().includes(searchLower) ||
                    article.description.toLowerCase().includes(searchLower) ||
                    article.category.toLowerCase().includes(searchLower)
                )
            }

            if (request.status && request.status !== 'all') {
                filteredArticles = filteredArticles.filter(article => article.status === request.status)
            }

            if (request.category) {
                filteredArticles = filteredArticles.filter(article => article.category === request.category)
            }


            const page = request.page || 1
            const limit = request.limit || 10
            const total = filteredArticles.length
            const totalPages = Math.ceil(total / limit)
            const startIndex = (page - 1) * limit
            const endIndex = startIndex + limit

            return {
                data: filteredArticles.slice(startIndex, endIndex),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        }
    }

    async getArticleById(id: string): Promise<ApiResponse<AdminArticle>> {
        try {
            return await this.makeRequest<AdminArticle>(this.ARTICLE_ENDPOINTS.GET_BY_ID(id))
        } catch (error) {
            console.error('Error fetching article by ID:', error)
            throw error
        }
    }

    async createArticle(request: CreateArticleRequest): Promise<ApiResponse<AdminArticle>> {
        try {
            return await this.makeRequest<AdminArticle>(this.ARTICLE_ENDPOINTS.CREATE, {
                method: 'POST',
                body: JSON.stringify(request)
            })
        } catch (error) {
            console.error('Error creating article:', error)
            throw error
        }
    }

    async updateArticle(request: UpdateArticleRequest): Promise<ApiResponse<AdminArticle>> {
        try {
            const { id, ...updateData } = request
            return await this.makeRequest<AdminArticle>(this.ARTICLE_ENDPOINTS.UPDATE(id), {
                method: 'PUT',
                body: JSON.stringify(updateData)
            })
        } catch (error) {
            console.error('Error updating article:', error)
            throw error
        }
    }

    async deleteArticle(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
        try {
            return await this.makeRequest<{ deleted: boolean }>(this.ARTICLE_ENDPOINTS.DELETE(id), {
                method: 'DELETE'
            })
        } catch (error) {
            console.error('Error deleting article:', error)
            throw error
        }
    }


    async bulkDeleteArticles(ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
        try {
            return await this.makeRequest<{ deletedCount: number }>(this.ARTICLE_ENDPOINTS.BULK_DELETE, {
                method: 'POST',
                body: JSON.stringify({ ids })
            })
        } catch (error) {
            console.error('Error bulk deleting articles:', error)
            throw error
        }
    }


    async toggleFeatured(id: string): Promise<ApiResponse<AdminArticle>> {
        try {
            return await this.makeRequest<AdminArticle>(this.ARTICLE_ENDPOINTS.TOGGLE_FEATURED(id), {
                method: 'PATCH'
            })
        } catch (error) {
            console.error('Error toggling featured status:', error)
            throw error
        }
    }

    async duplicateArticle(id: string): Promise<ApiResponse<AdminArticle>> {
        try {
            return await this.makeRequest<AdminArticle>(this.ARTICLE_ENDPOINTS.DUPLICATE(id), {
                method: 'POST'
            })
        } catch (error) {
            console.error('Error duplicating article:', error)
            throw error
        }
    }
}

export const articleRepository = new ArticleRepository()
