import { articleRepository, AdminArticle, CreateArticleRequest, UpdateArticleRequest, GetArticlesRequest } from '../repositories/articleRepository'
import { PaginatedResponse } from '../types/adminResponseTypes'

class ArticleUseCases {
    /**
     * Get articles with comprehensive filtering and error handling
     */
    async getArticles(request?: GetArticlesRequest): Promise<PaginatedResponse<AdminArticle> | null> {
        try {
            return await articleRepository.getArticlesWithFallback(request)
        } catch (error) {
            console.error('Error in getArticles use case:', error)
            return null
        }
    }

    /**
     * Get article by ID with error handling
     */
    async getArticleById(id: string): Promise<AdminArticle | null> {
        try {
            const response = await articleRepository.getArticleById(id)
            return response.success ? response.data || null : null
        } catch (error) {
            console.error('Error in getArticleById use case:', error)
            return null
        }
    }

    /**
     * Create new article with validation
     */
    async createArticle(request: CreateArticleRequest): Promise<AdminArticle | null> {
        try {
            // Validate required fields
            if (!request.title || !request.description || !request.content) {
                throw new Error('Title, description, and content are required')
            }

            // Generate slug from title if not provided
            const slug = this.generateSlug(request.title)
            
            const response = await articleRepository.createArticle({
                ...request,
                tags: request.tags || []
            })

            if (response.success && response.data) {
                return response.data
            }

            throw new Error(response.message || 'Failed to create article')
        } catch (error) {
            console.error('Error in createArticle use case:', error)
            throw error
        }
    }

    /**
     * Update existing article with validation
     */
    async updateArticle(request: UpdateArticleRequest): Promise<AdminArticle | null> {
        try {
            if (!request.id) {
                throw new Error('Article ID is required for update')
            }

            const response = await articleRepository.updateArticle(request)

            if (response.success && response.data) {
                return response.data
            }

            throw new Error(response.message || 'Failed to update article')
        } catch (error) {
            console.error('Error in updateArticle use case:', error)
            throw error
        }
    }

    /**
     * Delete article with confirmation
     */
    async deleteArticle(id: string): Promise<boolean> {
        try {
            if (!id) {
                throw new Error('Article ID is required for deletion')
            }

            const response = await articleRepository.deleteArticle(id)
            return response.success && response.data?.deleted === true
        } catch (error) {
            console.error('Error in deleteArticle use case:', error)
            return false
        }
    }

    /**
     * Bulk delete articles
     */
    async bulkDeleteArticles(ids: string[]): Promise<number> {
        try {
            if (!ids || ids.length === 0) {
                throw new Error('Article IDs are required for bulk deletion')
            }

            const response = await articleRepository.bulkDeleteArticles(ids)
            return response.success ? response.data?.deletedCount || 0 : 0
        } catch (error) {
            console.error('Error in bulkDeleteArticles use case:', error)
            return 0
        }
    }

    /**
     * Toggle featured status
     */
    async toggleFeatured(id: string): Promise<AdminArticle | null> {
        try {
            if (!id) {
                throw new Error('Article ID is required')
            }

            const response = await articleRepository.toggleFeatured(id)
            return response.success ? response.data || null : null
        } catch (error) {
            console.error('Error in toggleFeatured use case:', error)
            return null
        }
    }

    /**
     * Duplicate article
     */
    async duplicateArticle(id: string): Promise<AdminArticle | null> {
        try {
            if (!id) {
                throw new Error('Article ID is required for duplication')
            }

            const response = await articleRepository.duplicateArticle(id)
            return response.success ? response.data || null : null
        } catch (error) {
            console.error('Error in duplicateArticle use case:', error)
            return null
        }
    }

    /**
     * Get article statistics
     */
    async getArticleStats(): Promise<{
        total: number
        published: number
        draft: number
        pending: number
        totalViews: number
        featuredCount: number
    } | null> {
        try {
            const allArticles = await this.getArticles({ limit: 1000 }) // Get all articles
            
            if (!allArticles || !allArticles.data) {
                return null
            }

            const articles = allArticles.data
            
            return {
                total: articles.length,
                published: articles.filter(a => a.status === 'published').length,
                draft: articles.filter(a => a.status === 'draft').length,
                pending: articles.filter(a => a.status === 'pending').length,
                totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0),
                featuredCount: articles.filter(a => a.featured).length
            }
        } catch (error) {
            console.error('Error in getArticleStats use case:', error)
            return null
        }
    }

    /**
     * Get available categories from existing articles
     */
    async getCategories(): Promise<string[]> {
        try {
            const articles = await this.getArticles({ limit: 1000 })
            
            if (!articles || !articles.data) {
                return ['Kajian', 'Pengumuman', 'Kegiatan', 'Berita', 'Program'] // Default categories
            }

            const categories = [...new Set(articles.data.map(a => a.category).filter(Boolean))]
            return categories.length > 0 ? categories : ['Kajian', 'Pengumuman', 'Kegiatan', 'Berita', 'Program']
        } catch (error) {
            console.error('Error in getCategories use case:', error)
            return ['Kajian', 'Pengumuman', 'Kegiatan', 'Berita', 'Program']
        }
    }

    /**
     * Get popular tags from existing articles
     */
    async getPopularTags(limit: number = 20): Promise<string[]> {
        try {
            const articles = await this.getArticles({ limit: 1000 })
            
            if (!articles || !articles.data) {
                return []
            }

            const tagCounts: { [key: string]: number } = {}
            
            articles.data.forEach(article => {
                article.tags?.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1
                })
            })

            return Object.entries(tagCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, limit)
                .map(([tag]) => tag)
        } catch (error) {
            console.error('Error in getPopularTags use case:', error)
            return []
        }
    }

    /**
     * Generate URL-friendly slug from title
     */
    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim()
    }

    /**
     * Validate article data
     */
    validateArticleData(data: Partial<CreateArticleRequest>): {
        isValid: boolean
        errors: string[]
    } {
        const errors: string[] = []

        if (!data.title || data.title.trim().length === 0) {
            errors.push('Judul artikel wajib diisi')
        }

        if (!data.description || data.description.trim().length === 0) {
            errors.push('Deskripsi artikel wajib diisi')
        }

        if (!data.content || data.content.trim().length === 0) {
            errors.push('Konten artikel wajib diisi')
        }

        if (data.title && data.title.length > 200) {
            errors.push('Judul artikel maksimal 200 karakter')
        }

        if (data.description && data.description.length > 500) {
            errors.push('Deskripsi artikel maksimal 500 karakter')
        }

        if (data.image && !this.isValidUrl(data.image)) {
            errors.push('URL gambar tidak valid')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    /**
     * Check if URL is valid
     */
    private isValidUrl(url: string): boolean {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    /**
     * Format article for display
     */
    formatArticleForDisplay(article: AdminArticle) {
        return {
            ...article,
            formattedDate: new Date(article.publishedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            shortDescription: article.description.length > 100 
                ? article.description.substring(0, 100) + '...'
                : article.description,
            readTime: Math.ceil(article.content.split(' ').length / 200), // Assume 200 WPM reading speed
            statusColor: this.getStatusColor(article.status),
            statusText: this.getStatusText(article.status)
        }
    }

    /**
     * Get status color
     */
    private getStatusColor(status: string): string {
        switch (status) {
            case 'published': return '#10b981'
            case 'draft': return '#f59e0b'
            case 'pending': return '#ef4444'
            default: return '#6b7280'
        }
    }

    /**
     * Get status text
     */
    private getStatusText(status: string): string {
        switch (status) {
            case 'published': return 'Dipublikasi'
            case 'draft': return 'Draft'
            case 'pending': return 'Menunggu Review'
            default: return status
        }
    }
}

export const articleUseCases = new ArticleUseCases()
