import {
  ApiResponse,
  ArticleResponse,
  DonationResponse,
  NewsResponse,
  MenuResponse,
  HomeStatsResponse,
  HomePageData,
  PaginatedResponse
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
  FeedbackRequest
} from '../types/requestTypes'



export interface IArticleRepository {
  getArticles(params?: ArticleRequest): Promise<ApiResponse<PaginatedResponse<ArticleResponse>>>
  getArticleById(id: string): Promise<ApiResponse<ArticleResponse>>
  getArticleBySlug(slug: string): Promise<ApiResponse<ArticleResponse>>
  getFeaturedArticles(limit?: number): Promise<ApiResponse<ArticleResponse[]>>
  getRelatedArticles(articleId: string, limit?: number): Promise<ApiResponse<ArticleResponse[]>>
  incrementViews(id: string): Promise<ApiResponse<{ views: number }>>
  likeArticle(id: string): Promise<ApiResponse<{ likes: number }>>
}

export interface IDonationRepository {
  getDonations(params?: DonationRequest): Promise<ApiResponse<PaginatedResponse<DonationResponse>>>
  getDonationById(id: string): Promise<ApiResponse<DonationResponse>>
  getDonationBySlug(slug: string): Promise<ApiResponse<DonationResponse>>
  getActiveDonations(limit?: number): Promise<ApiResponse<DonationResponse[]>>
  submitDonation(data: DonationSubmissionRequest): Promise<ApiResponse<{ transactionId: string; paymentUrl?: string }>>
  getDonationStats(): Promise<ApiResponse<{
    totalAmount: number
    totalPrograms: number
    totalDonors: number
    thisMonthAmount: number
  }>>
}

export interface INewsRepository {
  getNews(params?: NewsRequest): Promise<ApiResponse<PaginatedResponse<NewsResponse>>>
  getNewsById(id: string): Promise<ApiResponse<NewsResponse>>
  getNewsBySlug(slug: string): Promise<ApiResponse<NewsResponse>>
  getLatestNews(limit?: number): Promise<ApiResponse<NewsResponse[]>>
  getTopNews(limit?: number): Promise<ApiResponse<NewsResponse[]>>
  incrementViews(id: string): Promise<ApiResponse<{ views: number }>>
}

export interface IMenuRepository {
  getMenus(params?: MenuRequest): Promise<ApiResponse<MenuResponse[]>>
  getMenuById(id: string): Promise<ApiResponse<MenuResponse>>
  getActiveMenus(): Promise<ApiResponse<MenuResponse[]>>
}

export interface IHomeRepository {
  getHomePageData(): Promise<ApiResponse<HomePageData>>
  getHomeStats(): Promise<ApiResponse<HomeStatsResponse>>
  subscribeNewsletter(data: NewsletterRequest): Promise<ApiResponse<{ message: string }>>
  submitContact(data: ContactRequest): Promise<ApiResponse<{ message: string }>>
  search(params: SearchRequest): Promise<ApiResponse<{
    articles: ArticleResponse[]
    donations: DonationResponse[]
    news: NewsResponse[]
    total: number
  }>>
}

export interface IAnalyticsRepository {
  trackEvent(data: AnalyticsRequest): Promise<ApiResponse<{ tracked: boolean }>>
  getPageViews(resourceId?: string): Promise<ApiResponse<{ views: number }>>
}

export interface IFeedbackRepository {
  submitFeedback(data: FeedbackRequest): Promise<ApiResponse<{ message: string }>>
  getFeedback(resourceType: string, resourceId?: string): Promise<ApiResponse<{
    averageRating: number
    totalComments: number
    feedback: Array<{
      type: string
      rating?: number
      comment?: string
      createdAt: string
    }>
  }>>
}

export interface IApiRepository {
  articles: IArticleRepository
  donations: IDonationRepository
  news: INewsRepository
  menus: IMenuRepository
  home: IHomeRepository
  analytics: IAnalyticsRepository
  feedback: IFeedbackRepository
}
