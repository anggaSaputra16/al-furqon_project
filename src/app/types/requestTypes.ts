// ===== API Request Types =====

// Base Request Parameters
export interface BaseParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

// ===== Home Page Request Types =====

// Article/Activity Request Parameters
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

// Donation Request Parameters
export interface DonationRequest extends BaseParams {
  status?: 'active' | 'completed' | 'suspended'
  minTarget?: number
  maxTarget?: number
  search?: string
  category?: string
}

// News Request Parameters
export interface NewsRequest extends BaseParams {
  category?: string
  priority?: 'high' | 'medium' | 'low'
  search?: string
  publishedAfter?: string
  publishedBefore?: string
}

// Menu Request Parameters
export interface MenuRequest {
  includeInactive?: boolean
  parentId?: string
  flat?: boolean // return flat array instead of nested
}

// ===== Donation Submission Request =====
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

// ===== Newsletter Subscription Request =====
export interface NewsletterRequest {
  email: string
  name?: string
  preferences?: {
    activities: boolean
    news: boolean
    donations: boolean
  }
}

// ===== Contact Form Request =====
export interface ContactRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type: 'general' | 'donation' | 'event' | 'complaint' | 'suggestion'
}

// ===== Search Request =====
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

// ===== Analytics Request =====
export interface AnalyticsRequest {
  type: 'page_view' | 'article_view' | 'donation_view' | 'download' | 'share'
  resourceId?: string
  metadata?: {
    referrer?: string
    userAgent?: string
    sessionId?: string
  }
}

// ===== Feedback Request =====
export interface FeedbackRequest {
  type: 'rating' | 'comment' | 'suggestion' | 'bug_report'
  resourceType: 'article' | 'donation' | 'page' | 'feature'
  resourceId?: string
  rating?: number // 1-5
  comment?: string
  email?: string
  isAnonymous?: boolean
}
