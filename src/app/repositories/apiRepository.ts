import {
  ApiResponse,
  ArticleResponse,
  DonationResponse,
  NewsResponse,
  MenuResponse,
  HomeStatsResponse,
  HomePageData,
  PaginatedResponse,
  VideoResponse
} from '../types/responseTypes'

import {
  ArticleRequest,
  DonationRequest,
  NewsRequest,
  MenuRequest,
  DonationSubmissionRequest,
  NewsletterRequest,
  ContactRequest,
  SearchRequest,
  AnalyticsRequest,
  FeedbackRequest,
  VideoRequest,
  CreateVideoRequest,
  UpdateVideoRequest
} from '../types/requestTypes'

import {
  IArticleRepository,
  IDonationRepository,
  INewsRepository,
  IMenuRepository,
  IHomeRepository,
  IAnalyticsRepository,
  IFeedbackRepository,
  IVideoRepository,
  IApiRepository
} from './interfaces'


class BackendChecker {
  private static isAvailable: boolean | null = null
  private static lastCheck: number = 0
  private static readonly CHECK_INTERVAL = 30000

  static async checkAvailability(): Promise<boolean> {
    const now = Date.now()
    
    // If no external API URL is configured, assume we're in development mode
    if (!process.env.NEXT_PUBLIC_API_URL) {
      this.isAvailable = true
      this.lastCheck = now
      return true
    }

    if (this.isAvailable !== null && (now - this.lastCheck) < this.CHECK_INTERVAL) {
      return this.isAvailable
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
      // Use the configured external API URL for health check
      const healthUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/health`

      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      this.isAvailable = response.ok
      this.lastCheck = now
      
      return this.isAvailable
    } catch (error) {
      this.isAvailable = false
      this.lastCheck = now
      console.warn('⚠️ External backend API check failed:', error)
      return false
    }
  }

  static reset() {
    this.isAvailable = null
    this.lastCheck = 0
  }
}


class HttpClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') {

    this.baseUrl = baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl}/api/v1`
    this.timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '15000')
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Client-Version': '1.0.0'
    }
  }

  private getAuthHeaders(endpoint?: string): Record<string, string> {
    // For admin endpoints, use admin_auth token
    if (endpoint && endpoint.includes('/admin/')) {
      const adminAuth = localStorage.getItem('admin_auth')
      if (adminAuth) {
        const parsedAuth = JSON.parse(adminAuth)
        return parsedAuth?.token ? { Authorization: `Bearer ${parsedAuth.token}` } : {}
      }
    }
    
    // For regular endpoints, use alfurqon_token
    const token = localStorage.getItem('alfurqon_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {

    // Skip backend check for development when no external API is configured
    if (!endpoint.includes('/health') && !process.env.NEXT_PUBLIC_API_URL) {
      // In development mode without external API, proceed without checking
      console.log('📍 Development mode: skipping backend availability check')
    } else if (!endpoint.includes('/health')) {
      const isBackendAvailable = await BackendChecker.checkAvailability()
      if (!isBackendAvailable) {
        throw new Error('Backend not available')
      }
    }

    const url = `${this.baseUrl}${endpoint}`
    const startTime = Date.now()
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(endpoint),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout)
    }

    try {      
      const response = await fetch(url, config)
      const duration = Date.now() - startTime
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Check for invalid token errors and trigger auto logout
        if (this.isInvalidTokenError(response.status, errorData)) {
          this.handleInvalidToken(endpoint)
        }
        
        this.logError(endpoint, errorData)
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return data
    } catch (error) {
      this.logError(endpoint, error)
      throw error
    }
  }

  private isInvalidTokenError(statusCode: number, errorData: any): boolean {
    // Check for invalid token based on status code and error message
    const isUnauthorized = statusCode === 401 || errorData?.error === 401
    const hasInvalidTokenMessage = errorData?.message?.toLowerCase().includes('invalid token') ||
                                   errorData?.message?.toLowerCase().includes('token expired') ||
                                   errorData?.message?.toLowerCase().includes('unauthorized') ||
                                   errorData?.message?.toLowerCase().includes('access token required')
    
    return (isUnauthorized || statusCode === 500) && hasInvalidTokenMessage
  }

  private handleInvalidToken(endpoint: string): void {
    console.warn('🔒 Invalid token detected, logging out user...')
    
    // Clear tokens from localStorage
    if (typeof window !== 'undefined') {
      // Clear admin token if it's an admin endpoint
      if (endpoint.includes('/admin/')) {
        localStorage.removeItem('admin_auth')
      } else {
        // Clear regular user token
        localStorage.removeItem('alfurqon_token')
      }
      
      // Dispatch auto logout event for AuthHandler to pick up
      const event = new CustomEvent('autoLogout', {
        detail: {
          message: 'Sesi Anda telah berakhir. Silakan login kembali.',
          type: 'warning',
          endpoint: endpoint
        }
      })
      window.dispatchEvent(event)
    }
  }

  private showLogoutNotification(): void {
    // Create a simple notification for auto logout
    if (typeof window !== 'undefined') {
      // Try to show a toast notification if available
      const event = new CustomEvent('autoLogout', {
        detail: {
          message: 'Sesi Anda telah berakhir. Silakan login kembali.',
          type: 'warning'
        }
      })
      window.dispatchEvent(event)
      
      // Fallback to simple alert if no notification system
      setTimeout(() => {
        if (!document.querySelector('[data-notification-shown]')) {
          alert('Sesi Anda telah berakhir. Silakan login kembali.')
        }
      }, 100)
    }
  }


  private logError(endpoint: string, error: any) {
    console.error(`[API] Error ${endpoint}`, error)
    

    if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {

    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : ''
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint
    
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}



export class ArticleRepository implements IArticleRepository {
  constructor(private httpClient: HttpClient) {}

  async getArticles(params?: ArticleRequest): Promise<ApiResponse<PaginatedResponse<ArticleResponse>>> {
    return this.httpClient.get('/articles', params)
  }

  async getArticleById(id: string): Promise<ApiResponse<ArticleResponse>> {
    return this.httpClient.get(`/articles/${id}`)
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<ArticleResponse>> {
    return this.httpClient.get(`/articles/slug/${slug}`)
  }

  async getFeaturedArticles(limit = 6): Promise<ApiResponse<ArticleResponse[]>> {

    return this.httpClient.get('/articles', { limit, featured: true })
  }

  async getRelatedArticles(articleId: string, limit = 3): Promise<ApiResponse<ArticleResponse[]>> {
    return this.httpClient.get(`/articles/${articleId}/related`, { limit })
  }

  async incrementViews(id: string): Promise<ApiResponse<{ views: number }>> {
    return this.httpClient.post(`/articles/${id}/view`)
  }

  async likeArticle(id: string): Promise<ApiResponse<{ likes: number }>> {
    return this.httpClient.post(`/articles/${id}/like`)
  }
}

export class DonationRepository implements IDonationRepository {
  constructor(private httpClient: HttpClient) {}

  async getDonations(params?: DonationRequest): Promise<ApiResponse<PaginatedResponse<DonationResponse>>> {
    return this.httpClient.get('/donations', params)
  }

  async getDonationById(id: string): Promise<ApiResponse<DonationResponse>> {
    return this.httpClient.get(`/donations/${id}`)
  }

  async getDonationBySlug(slug: string): Promise<ApiResponse<DonationResponse>> {
    return this.httpClient.get(`/donations/slug/${slug}`)
  }

  async getActiveDonations(limit = 3): Promise<ApiResponse<DonationResponse[]>> {
    return this.httpClient.get('/donations/active', { limit })
  }

  async submitDonation(data: DonationSubmissionRequest): Promise<ApiResponse<{ transactionId: string; paymentUrl?: string }>> {
    return this.httpClient.post('/donations/submit', data)
  }

  async getDonationStatus(transactionId: string): Promise<ApiResponse<{ status: string; amount: number }>> {
    return this.httpClient.get(`/donations/${transactionId}/status`)
  }

  async getDonationStats(): Promise<ApiResponse<{ totalAmount: number; totalPrograms: number; totalDonors: number; thisMonthAmount: number }>> {
    return this.httpClient.get('/donations/stats')
  }
}

export class NewsRepository implements INewsRepository {
  constructor(private httpClient: HttpClient) {}

  async getNews(params?: NewsRequest): Promise<ApiResponse<PaginatedResponse<NewsResponse>>> {
    return this.httpClient.get('/news', params)
  }

  async getNewsById(id: string): Promise<ApiResponse<NewsResponse>> {
    return this.httpClient.get(`/news/${id}`)
  }

  async getNewsBySlug(slug: string): Promise<ApiResponse<NewsResponse>> {
    return this.httpClient.get(`/news/slug/${slug}`)
  }

  async getLatestNews(limit = 3): Promise<ApiResponse<NewsResponse[]>> {
    return this.httpClient.get('/news/latest', { limit })
  }

  async getTopNews(limit = 3): Promise<ApiResponse<NewsResponse[]>> {
    return this.httpClient.get('/news/top', { limit })
  }

  async incrementViews(id: string): Promise<ApiResponse<{ views: number }>> {
    return this.httpClient.patch(`/news/${id}/views`)
  }
}

export class MenuRepository implements IMenuRepository {
  constructor(private httpClient: HttpClient) {}

  async getMenus(params?: MenuRequest): Promise<ApiResponse<MenuResponse[]>> {
    return this.httpClient.get('/menus/navigation', params)
  }

  async getMenuById(id: string): Promise<ApiResponse<MenuResponse>> {
    return this.httpClient.get(`/menus/${id}`)
  }

  async getActiveMenus(): Promise<ApiResponse<MenuResponse[]>> {
    return this.httpClient.get('/menus/navigation', { active: true })
  }
}

export class HomeRepository implements IHomeRepository {
  constructor(private httpClient: HttpClient) {}

  async getHomePageData(): Promise<ApiResponse<HomePageData>> {
    return this.httpClient.get('/home/dashboard')
  }

  async getHomeStats(): Promise<ApiResponse<HomeStatsResponse>> {
    return this.httpClient.get('/statistics/public')
  }

  async subscribeNewsletter(data: NewsletterRequest): Promise<ApiResponse<{ message: string }>> {
    return this.httpClient.post('/newsletter/subscribe', data)
  }

  async submitContact(data: ContactRequest): Promise<ApiResponse<{ message: string }>> {
    return this.httpClient.post('/contact/submit', data)
  }

  async search(params: SearchRequest): Promise<ApiResponse<{ articles: ArticleResponse[]; donations: DonationResponse[]; news: NewsResponse[]; total: number }>> {
    return this.httpClient.get('/search', params)
  }
}

export class AnalyticsRepository implements IAnalyticsRepository {
  constructor(private httpClient: HttpClient) {}

  async trackEvent(data: AnalyticsRequest): Promise<ApiResponse<{ tracked: boolean }>> {
    return this.httpClient.post('/analytics/track', data)
  }

  async getPageViews(resourceId?: string): Promise<ApiResponse<{ views: number }>> {
    return this.httpClient.get('/analytics/views', resourceId ? { resourceId } : undefined)
  }
}

export class FeedbackRepository implements IFeedbackRepository {
  constructor(private httpClient: HttpClient) {}

  async submitFeedback(data: FeedbackRequest): Promise<ApiResponse<{ message: string }>> {
    return this.httpClient.post('/feedback', data)
  }

  async getFeedback(resourceType: string, resourceId?: string): Promise<ApiResponse<{ averageRating: number; totalComments: number; feedback: Array<{ type: string; rating?: number; comment?: string; createdAt: string }> }>> {
    return this.httpClient.get('/feedback', { resourceType, resourceId })
  }
}

export class VideoRepository implements IVideoRepository {
  constructor(private httpClient: HttpClient) {}

  async getVideos(params?: VideoRequest): Promise<ApiResponse<PaginatedResponse<VideoResponse>>> {
    return this.httpClient.get('/videos', params)
  }

  async getVideoById(id: string): Promise<ApiResponse<VideoResponse>> {
    return this.httpClient.get(`/videos/${id}`)
  }

  async getFeaturedVideos(limit = 6): Promise<ApiResponse<VideoResponse[]>> {
    return this.httpClient.get('/videos', { limit, isFeatured: true })
  }

  async getVideosByCategory(category: string, limit = 10): Promise<ApiResponse<VideoResponse[]>> {
    return this.httpClient.get('/videos', { category, limit })
  }

  async incrementViews(id: string): Promise<ApiResponse<{ views: number }>> {
    return this.httpClient.post(`/videos/${id}/view`)
  }

  async createVideo(data: CreateVideoRequest): Promise<ApiResponse<VideoResponse>> {
    return this.httpClient.post('/admin/videos', data)
  }

  async updateVideo(data: UpdateVideoRequest): Promise<ApiResponse<VideoResponse>> {
    const { id, ...updateData } = data
    return this.httpClient.put(`/admin/videos/${id}`, updateData)
  }

  async deleteVideo(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.httpClient.delete(`/admin/videos/${id}`)
  }
}

export class ApiRepository implements IApiRepository {
  private httpClient: HttpClient

  public articles: IArticleRepository
  public donations: IDonationRepository
  public news: INewsRepository
  public menus: IMenuRepository
  public home: IHomeRepository
  public analytics: IAnalyticsRepository
  public feedback: IFeedbackRepository
  public videos: IVideoRepository

  constructor(baseUrl?: string) {
    this.httpClient = new HttpClient(baseUrl)
    
    this.articles = new ArticleRepository(this.httpClient)
    this.donations = new DonationRepository(this.httpClient)
    this.news = new NewsRepository(this.httpClient)
    this.menus = new MenuRepository(this.httpClient)
    this.home = new HomeRepository(this.httpClient)
    this.analytics = new AnalyticsRepository(this.httpClient)
    this.feedback = new FeedbackRepository(this.httpClient)
    this.videos = new VideoRepository(this.httpClient)
  }
}


export const apiRepository = new ApiRepository()
