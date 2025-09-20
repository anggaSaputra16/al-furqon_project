


export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
    timestamp: string
  }
}


export interface ApiError {
  success: false
  message: string
  error?: {
    code: string
    details?: any
  }
  timestamp: string
}


export interface ArticleResponse {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  image: string
  category: 'kegiatan' | 'berita' | 'sumbangan' | 'fasilitas' | 'profil'
  status: 'published' | 'draft' | 'archived'
  author: {
    id: string
    name: string
    avatar?: string
  }
  publishedAt: string
  updatedAt: string
  views: number
  likes: number
  tags: string[]
  featured: boolean
}

export interface DonationResponse {
  id: string
  title: string
  slug: string
  description: string
  detail: string
  image: string
  target: number
  collected: number
  percentage: number
  status: 'active' | 'completed' | 'suspended'
  startDate: string
  endDate?: string
  bankAccount: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  createdAt: string
  updatedAt: string
  donors: {
    total: number
    recent: Array<{
      name: string
      amount: number
      donatedAt: string
      isAnonymous: boolean
    }>
  }
}

export interface NewsResponse {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image: string
  category: string
  priority: 'high' | 'medium' | 'low'
  publishedAt: string
  updatedAt: string
  author: {
    id: string
    name: string
  }
  views: number
  summary?: string
}


export interface MenuResponse {
  id: string
  title: string
  slug: string
  icon: string
  order: number
  isActive: boolean
  parentId?: string
  children?: MenuResponse[]
  description?: string
}


export interface HomeStatsResponse {
  totalDonations: {
    amount: number
    programs: number
    donors: number
  }
  activities: {
    total: number
    thisMonth: number
  }
  news: {
    total: number
    thisWeek: number
  }
  visitors: {
    today: number
    thisMonth: number
    total: number
  }
}


export interface HomePageData {
  articles: ArticleResponse[]
  donations: DonationResponse[]
  news: NewsResponse[]
  menus: MenuResponse[]
  stats: HomeStatsResponse
}


export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export type PaginatedArticles = ApiResponse<PaginatedResponse<ArticleResponse>>
export type PaginatedDonations = ApiResponse<PaginatedResponse<DonationResponse>>
export type PaginatedNews = ApiResponse<PaginatedResponse<NewsResponse>>
