import { 
  ApiResponse, 
  ArticleResponse, 
  DonationResponse, 
  NewsResponse, 
  MenuResponse,
  HomePageData,
  HomeStatsResponse
} from '../types/responseTypes'

import {
  ArticleRequest,
  DonationRequest,
  NewsRequest,
  DonationSubmissionRequest,
  NewsletterRequest,
  ContactRequest,
  SearchRequest,
  AnalyticsRequest
} from '../types/requestTypes'

import { IApiRepository } from '../repositories/interfaces'



export class HomePageUseCases {
  constructor(private apiRepository: IApiRepository) {}


  async getHomePageData(): Promise<{
    success: boolean
    data?: HomePageData
    error?: string
  }> {
    try {
      const response = await this.apiRepository.home.getHomePageData()
      
      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to fetch home page data:', error)
      return {
        success: false,
        error: 'Failed to load home page data'
      }
    }
  }


  async getFeaturedArticles(limit = 6): Promise<{
    success: boolean
    data?: ArticleResponse[]
    error?: string
  }> {
    try {
      const response = await this.apiRepository.articles.getFeaturedArticles(limit)
      
      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to fetch featured articles:', error)
      

      if (error instanceof Error && error.message === 'Backend not available') {
        return {
          success: false,
          error: 'Backend not available'
        }
      }
      
      return {
        success: false,
        error: 'Failed to load featured articles'
      }
    }
  }

  // Get all published articles (not just featured)
  async getPublishedArticles(limit = 6): Promise<{
    success: boolean
    data?: ArticleResponse[]
    error?: string
  }> {
    try {
      const response = await this.apiRepository.articles.getArticles({
        page: 1,
        limit,
        status: 'published'
      })
      
      if (response.success) {
        return {
          success: true,
          data: response.data?.data || response.data
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to fetch published articles:', error)
      

      if (error instanceof Error && error.message === 'Backend not available') {
        return {
          success: false,
          error: 'Backend not available'
        }
      }
      
      return {
        success: false,
        error: 'Failed to load published articles'
      }
    }
  }


  async getActiveDonations(limit = 3): Promise<{
    success: boolean
    data?: DonationResponse[]
    error?: string
  }> {
    try {
      const response = await this.apiRepository.donations.getActiveDonations(limit)
      
      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to fetch active donations:', error)
      

      if (error instanceof Error && error.message === 'Backend not available') {
        return {
          success: false,
          error: 'Backend not available'
        }
      }
      
      return {
        success: false,
        error: 'Failed to load donation programs'
      }
    }
  }


  async getLatestNews(limit = 3): Promise<{
    success: boolean
    data?: NewsResponse[]
    error?: string
  }> {
    try {
      const response = await this.apiRepository.news.getLatestNews(limit)
      
      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to fetch latest news:', error)
      

      if (error instanceof Error && error.message === 'Backend not available') {
        return {
          success: false,
          error: 'Backend not available'
        }
      }
      
      return {
        success: false,
        error: 'Failed to load latest news'
      }
    }
  }


  async getNavigationMenus(): Promise<{
    success: boolean
    data?: MenuResponse[]
    error?: string
  }> {
    try {
      const response = await this.apiRepository.menus.getActiveMenus()
      
      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to fetch navigation menus:', error)
      return {
        success: false,
        error: 'Failed to load navigation menus'
      }
    }
  }


  async submitDonation(donationData: DonationSubmissionRequest): Promise<{
    success: boolean
    data?: { transactionId: string; paymentUrl?: string }
    error?: string
  }> {
    try {

      if (!donationData.donorName.trim()) {
        return {
          success: false,
          error: 'Nama donatur wajib diisi'
        }
      }

      if (!donationData.amount || donationData.amount <= 0) {
        return {
          success: false,
          error: 'Nominal donasi harus lebih dari 0'
        }
      }

      if (donationData.amount < 10000) {
        return {
          success: false,
          error: 'Minimal donasi adalah Rp 10.000'
        }
      }

      const response = await this.apiRepository.donations.submitDonation(donationData)
      
      if (response.success) {

        await this.trackDonationEvent(donationData.donationId, donationData.amount)
        
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to submit donation:', error)
      return {
        success: false,
        error: 'Gagal memproses donasi. Silakan coba lagi.'
      }
    }
  }


  async subscribeNewsletter(email: string, name?: string): Promise<{
    success: boolean
    message?: string
    error?: string
  }> {
    try {

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: 'Format email tidak valid'
        }
      }

      const subscriptionData: NewsletterRequest = {
        email,
        name,
        preferences: {
          activities: true,
          news: true,
          donations: true
        }
      }

      const response = await this.apiRepository.home.subscribeNewsletter(subscriptionData)
      
      if (response.success) {
        return {
          success: true,
          message: response.data.message
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to subscribe newsletter:', error)
      return {
        success: false,
        error: 'Gagal berlangganan newsletter. Silakan coba lagi.'
      }
    }
  }


  async submitContact(contactData: ContactRequest): Promise<{
    success: boolean
    message?: string
    error?: string
  }> {
    try {

      if (!contactData.name.trim()) {
        return {
          success: false,
          error: 'Nama wajib diisi'
        }
      }

      if (!contactData.email.trim()) {
        return {
          success: false,
          error: 'Email wajib diisi'
        }
      }

      if (!contactData.message.trim()) {
        return {
          success: false,
          error: 'Pesan wajib diisi'
        }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactData.email)) {
        return {
          success: false,
          error: 'Format email tidak valid'
        }
      }

      const response = await this.apiRepository.home.submitContact(contactData)
      
      if (response.success) {
        return {
          success: true,
          message: response.data.message
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to submit contact:', error)
      return {
        success: false,
        error: 'Gagal mengirim pesan. Silakan coba lagi.'
      }
    }
  }


  async searchContent(query: string, type?: 'all' | 'articles' | 'donations' | 'news'): Promise<{
    success: boolean
    data?: {
      articles: ArticleResponse[]
      donations: DonationResponse[]
      news: NewsResponse[]
      total: number
    }
    error?: string
  }> {
    try {
      if (!query.trim()) {
        return {
          success: false,
          error: 'Query pencarian tidak boleh kosong'
        }
      }

      const searchParams: SearchRequest = {
        query,
        type: type || 'all',
        limit: 20
      }

      const response = await this.apiRepository.home.search(searchParams)
      
      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to search content:', error)
      return {
        success: false,
        error: 'Gagal melakukan pencarian. Silakan coba lagi.'
      }
    }
  }


  async trackPageView(pageType: string = 'home'): Promise<void> {
    try {
      const analyticsData: AnalyticsRequest = {
        type: 'page_view',
        resourceId: pageType,
        metadata: {
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          sessionId: this.getSessionId()
        }
      }

      await this.apiRepository.analytics.trackEvent(analyticsData)
    } catch (error) {
      console.error('Failed to track page view:', error)

    }
  }

  async trackArticleView(articleId: string): Promise<void> {
    try {
      const analyticsData: AnalyticsRequest = {
        type: 'article_view',
        resourceId: articleId,
        metadata: {
          sessionId: this.getSessionId()
        }
      }

      await this.apiRepository.analytics.trackEvent(analyticsData)
      await this.apiRepository.articles.incrementViews(articleId)
    } catch (error) {
      console.error('Failed to track article view:', error)
    }
  }

  async trackDonationEvent(donationId: string, amount: number): Promise<void> {
    try {
      const analyticsData: AnalyticsRequest = {
        type: 'donation_view',
        resourceId: donationId,
        metadata: {
          sessionId: this.getSessionId()
        }
      }

      await this.apiRepository.analytics.trackEvent(analyticsData)
    } catch (error) {
      console.error('Failed to track donation event:', error)
    }
  }

  
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2)
      sessionStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }


  async getHomeStats(): Promise<{
    success: boolean
    data?: HomeStatsResponse
    error?: string
  }> {
    try {
      const response = await this.apiRepository.home.getHomeStats()
      
      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      } else {
        return {
          success: false,
          error: response.message
        }
      }
    } catch (error) {
      console.error('Failed to fetch home stats:', error)
      return {
        success: false,
        error: 'Failed to load statistics'
      }
    }
  }
}
