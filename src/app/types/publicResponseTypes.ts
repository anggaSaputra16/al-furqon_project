// Public Website Response Types (Non-Admin)

// Base Response Types
export interface PublicApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
  timestamp: string
}

export interface PublicPaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Article Response Types
export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  author: {
    id: string
    name: string
    avatar?: string
  }
  publishedAt: string
  updatedAt: string
  viewCount: number
  readTime: number
  isFeatured: boolean
  isPublished: boolean
  seoTitle?: string
  seoDescription?: string
  relatedArticles?: Article[]
}

export interface ArticleListResponse extends PublicPaginatedResponse<Article> {}

export interface ArticleDetailResponse {
  article: Article
  relatedArticles: Article[]
  previousArticle?: Pick<Article, 'id' | 'title' | 'slug'>
  nextArticle?: Pick<Article, 'id' | 'title' | 'slug'>
}

export interface ArticleCategory {
  id: string
  name: string
  slug: string
  description?: string
  articleCount: number
  color?: string
}

export interface ArticleCategoriesResponse {
  categories: ArticleCategory[]
}

// Donation Response Types
export interface Donation {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  featuredImage: string
  gallery: string[]
  category: string
  targetAmount: number
  collectedAmount: number
  donorCount: number
  progress: number
  startDate: string
  endDate?: string
  status: 'active' | 'completed' | 'upcoming' | 'paused'
  isUrgent: boolean
  isRecurring: boolean
  minimumDonation?: number
  bankAccount: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  qrisCode?: string
  recentDonors: DonationTransaction[]
  updates: DonationUpdate[]
}

export interface DonationTransaction {
  id: string
  donorName: string
  amount: number
  message?: string
  isAnonymous: boolean
  createdAt: string
  status: 'pending' | 'verified' | 'rejected'
}

export interface DonationUpdate {
  id: string
  title: string
  content: string
  images?: string[]
  createdAt: string
}

export interface DonationListResponse extends PublicPaginatedResponse<Donation> {}

export interface DonationDetailResponse {
  donation: Donation
  relatedDonations: Donation[]
  recentTransactions: DonationTransaction[]
}

export interface CreateDonationTransactionResponse {
  transaction: DonationTransaction
  paymentInstructions: string
  qrCode?: string
  virtualAccount?: string
}

// Gallery Response Types
export interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl: string
  category: string
  eventDate?: string
  uploadedAt: string
  tags: string[]
  photographer?: string
  location?: string
}

export interface GalleryListResponse extends PublicPaginatedResponse<GalleryItem> {}

export interface GalleryDetailResponse {
  item: GalleryItem
  relatedItems: GalleryItem[]
}

export interface GalleryCategory {
  id: string
  name: string
  slug: string
  description?: string
  itemCount: number
  coverImage?: string
}

export interface GalleryCategoriesResponse {
  categories: GalleryCategory[]
}

// Contact Response Types
export interface ContactInfo {
  address: string
  phone: string
  email: string
  websiteUrl: string
  socialMedia: {
    facebook?: string
    instagram?: string
    youtube?: string
    twitter?: string
    whatsapp?: string
  }
  location: {
    latitude: number
    longitude: number
  }
  openingHours: {
    [day: string]: {
      open: string
      close: string
      isClosed: boolean
    }
  }
}

export interface SendContactMessageResponse {
  messageId: string
  status: 'sent' | 'pending'
  autoReply?: string
}

// Prayer Times Response Types
export interface PrayerTime {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  date: string
  hijriDate: string
}

export interface PrayerTimesResponse {
  prayerTimes: PrayerTime[]
  location: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  method: string
}

export interface NextPrayerResponse {
  nextPrayer: {
    name: string
    time: string
    timeRemaining: string
  }
  currentPrayer?: {
    name: string
    time: string
  }
  allPrayers: {
    [key: string]: string
  }
}

// Islamic Calendar Response Types
export interface IslamicDate {
  hijriDay: number
  hijriMonth: string
  hijriYear: number
  gregorianDate: string
  events: string[]
  isHoliday: boolean
}

export interface IslamicCalendarResponse {
  dates: IslamicDate[]
  currentHijriDate: {
    day: number
    month: string
    year: number
  }
  upcomingEvents: {
    name: string
    date: string
    hijriDate: string
    daysUntil: number
  }[]
}

// Events Response Types
export interface Event {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  featuredImage: string
  gallery: string[]
  category: string
  startDate: string
  endDate?: string
  startTime: string
  endTime?: string
  location: string
  address?: string
  maxParticipants?: number
  currentParticipants: number
  registrationFee?: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  requiresRegistration: boolean
  isRecurring: boolean
  recurringPattern?: string
  organizer: {
    name: string
    contact: string
  }
  tags: string[]
}

export interface EventListResponse extends PublicPaginatedResponse<Event> {}

export interface EventDetailResponse {
  event: Event
  relatedEvents: Event[]
  registrationStatus?: 'open' | 'closed' | 'full'
}

export interface RegisterEventResponse {
  registrationId: string
  status: 'confirmed' | 'pending' | 'waitlist'
  instructions?: string
}

// Newsletter Response Types
export interface SubscribeNewsletterResponse {
  subscriptionId: string
  status: 'confirmed' | 'pending'
  confirmationRequired: boolean
}

export interface NewsletterPreference {
  id: string
  name: string
  description: string
}

export interface NewsletterPreferencesResponse {
  preferences: NewsletterPreference[]
}

// Search Response Types
export interface SearchResult {
  id: string
  title: string
  excerpt: string
  type: 'article' | 'donation' | 'event' | 'gallery'
  url: string
  publishedAt: string
  relevanceScore: number
  highlightedContent?: string
}

export interface GlobalSearchResponse extends PublicPaginatedResponse<SearchResult> {
  query: string
  suggestions?: string[]
  filters: {
    types: { type: string; count: number }[]
    categories: { category: string; count: number }[]
  }
}

// Facility Response Types
export interface Facility {
  id: string
  name: string
  description: string
  category: string
  capacity: number
  features: string[]
  images: string[]
  availability: {
    [day: string]: {
      isAvailable: boolean
      timeSlots: {
        start: string
        end: string
        isBooked: boolean
      }[]
    }
  }
  bookingRules: string[]
  contactPerson: {
    name: string
    phone: string
    email: string
  }
}

export interface FacilityListResponse {
  facilities: Facility[]
}

export interface BookFacilityResponse {
  bookingId: string
  status: 'confirmed' | 'pending' | 'rejected'
  instructions?: string
  contactInfo: {
    name: string
    phone: string
    email: string
  }
}

// Feedback Response Types
export interface SubmitFeedbackResponse {
  feedbackId: string
  status: 'submitted' | 'pending_review'
  thankYouMessage: string
}

export interface FeedbackStats {
  averageRating: number
  totalFeedbacks: number
  ratingDistribution: {
    [rating: number]: number
  }
  recentFeedbacks: {
    rating: number
    comment: string
    createdAt: string
  }[]
}

// Announcement Response Types
export interface Announcement {
  id: string
  title: string
  content: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  validFrom: string
  validUntil?: string
  isActive: boolean
  isPinned: boolean
  createdAt: string
}

export interface AnnouncementListResponse extends PublicPaginatedResponse<Announcement> {}

// Zakat Calculator Response Types
export interface ZakatCalculationResult {
  type: string
  amount: number
  zakatAmount: number
  nisab: number
  isEligible: boolean
  calculation: {
    method: string
    rate: number
    deductions?: number
    notes?: string[]
  }
  paymentOptions: {
    bankAccount: {
      bankName: string
      accountNumber: string
      accountName: string
    }
    qrisCode?: string
    onlinePayment?: string
  }
}

// Qibla Direction Response Types
export interface QiblaDirectionResponse {
  direction: number // degrees from north
  distance: number // kilometers to Kaaba
  location: {
    latitude: number
    longitude: number
    city?: string
    country?: string
  }
  kaaba: {
    latitude: number
    longitude: number
  }
}

// Website Stats Response Types (Public)
export interface PublicWebsiteStats {
  totalArticles: number
  totalDonations: number
  totalAmountDonated: number
  totalEvents: number
  totalGalleryItems: number
  recentActivities: {
    type: string
    title: string
    timestamp: string
  }[]
  popularContent: {
    id: string
    title: string
    type: string
    views: number
  }[]
}

// Donation Report Response Types (Public)
export interface PublicDonationReport {
  totalCollected: number
  totalDistributed: number
  totalDonors: number
  distributionByCategory: {
    category: string
    amount: number
    percentage: number
  }[]
  distributionByMonth: {
    month: string
    collected: number
    distributed: number
  }[]
  impactMetrics: {
    beneficiaries: number
    programsSupported: number
    facilitiesImproved: number
  }
  testimonials: {
    name: string
    message: string
    program: string
  }[]
  transparencyDocuments: {
    title: string
    url: string
    date: string
  }[]
}
