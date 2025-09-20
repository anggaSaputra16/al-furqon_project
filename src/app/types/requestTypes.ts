export interface BaseParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}




export interface ArticleRequest extends BaseParams {
  category?: 'kegiatan' | 'berita' | 'sumbangan' | 'fasilitas' | 'profil'
  status?: 'published' | 'draft' | 'archived'
  featured?: boolean
  search?: string
  tags?: string[]
  authorId?: string
  publishedAfter?: string
  publishedBefore?: string
}


export interface DonationRequest extends BaseParams {
  status?: 'active' | 'completed' | 'suspended'
  minTarget?: number
  maxTarget?: number
  search?: string
  category?: string
}


export interface NewsRequest extends BaseParams {
  category?: string
  priority?: 'high' | 'medium' | 'low'
  search?: string
  publishedAfter?: string
  publishedBefore?: string
}


export interface MenuRequest {
  includeInactive?: boolean
  parentId?: string
  flat?: boolean
}


export interface DonationSubmissionRequest {
  donationId: string
  donorName: string
  amount: number
  email?: string
  phone?: string
  message?: string
  isAnonymous?: boolean
  paymentMethod: 'bank_transfer' | 'qris' | 'ewallet' | 'cash'
}


export interface NewsletterRequest {
  email: string
  name?: string
  preferences?: {
    activities: boolean
    news: boolean
    donations: boolean
  }
}


export interface ContactRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type: 'general' | 'donation' | 'event' | 'complaint' | 'suggestion'
}


export interface SearchRequest {
  query: string
  type?: 'all' | 'articles' | 'donations' | 'news'
  limit?: number
  filters?: {
    category?: string[]
    tags?: string[]
    dateRange?: {
      start: string
      end: string
    }
  }
}


export interface AnalyticsRequest {
  type: 'page_view' | 'article_view' | 'donation_view' | 'download' | 'share'
  resourceId?: string
  metadata?: {
    referrer?: string
    userAgent?: string
    sessionId?: string
  }
}


export interface FeedbackRequest {
  type: 'rating' | 'comment' | 'suggestion' | 'bug_report'
  resourceType: 'article' | 'donation' | 'page' | 'feature'
  resourceId?: string
  rating?: number
  comment?: string
  email?: string
  isAnonymous?: boolean
}

export interface VideoRequest extends BaseParams {
  category?: 'kajian' | 'ceramah' | 'kegiatan' | 'tutorial' | 'lainnya'
  isActive?: boolean
  isFeatured?: boolean
  search?: string
  tags?: string[]
  publishedAfter?: string
  publishedBefore?: string
}

export interface CreateVideoRequest {
  title: string
  description?: string
  youtubeUrl: string
  duration?: string
  category?: string
  tags?: string
  orderIndex?: number
  isActive?: boolean
  isFeatured?: boolean
}

export interface UpdateVideoRequest extends Partial<CreateVideoRequest> {
  id: string
}
