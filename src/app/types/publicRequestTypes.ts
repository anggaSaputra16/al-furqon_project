// Public Website Request Types (Non-Admin)

// Article Request Types
export interface GetArticlesRequest {
  page?: number
  limit?: number
  category?: string
  search?: string
  featured?: boolean
  sortBy?: 'date' | 'views' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface GetArticleByIdRequest {
  id: string
}

export interface GetArticleBySlugRequest {
  slug: string
}

// Donation Request Types
export interface GetDonationsRequest {
  page?: number
  limit?: number
  status?: 'active' | 'completed' | 'upcoming'
  category?: string
  search?: string
  sortBy?: 'date' | 'target' | 'collected'
  sortOrder?: 'asc' | 'desc'
}

export interface GetDonationByIdRequest {
  id: string
}

export interface CreateDonationTransactionRequest {
  donationId: string
  donorName: string
  donorEmail?: string
  donorPhone?: string
  amount: number
  message?: string
  isAnonymous: boolean
  paymentMethod: 'bank_transfer' | 'e_wallet' | 'cash'
  paymentProof?: File
}

// Gallery Request Types
export interface GetGalleryRequest {
  page?: number
  limit?: number
  category?: string
  year?: number
  month?: number
  search?: string
  sortBy?: 'date' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface GetGalleryByIdRequest {
  id: string
}

// Contact Request Types
export interface SendContactMessageRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  category: 'general' | 'donation' | 'event' | 'complaint' | 'suggestion'
}

// Prayer Times Request Types
export interface GetPrayerTimesRequest {
  date?: string // YYYY-MM-DD format
  month?: string // YYYY-MM format
  city?: string
  latitude?: number
  longitude?: number
}

// Islamic Calendar Request Types
export interface GetIslamicCalendarRequest {
  year?: number
  month?: number
  hijriYear?: number
  hijriMonth?: number
}

// Events Request Types
export interface GetEventsRequest {
  page?: number
  limit?: number
  category?: string
  status?: 'upcoming' | 'ongoing' | 'completed'
  search?: string
  startDate?: string
  endDate?: string
  sortBy?: 'date' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface GetEventByIdRequest {
  id: string
}

export interface RegisterEventRequest {
  eventId: string
  participantName: string
  participantEmail: string
  participantPhone: string
  additionalInfo?: string
}

// Newsletter Subscription Request Types
export interface SubscribeNewsletterRequest {
  email: string
  name?: string
  preferences?: string[]
}

export interface UnsubscribeNewsletterRequest {
  email: string
  token?: string
}

// Search Request Types
export interface GlobalSearchRequest {
  query: string
  type?: 'all' | 'articles' | 'donations' | 'events' | 'gallery'
  page?: number
  limit?: number
}

// Facility Request Types
export interface GetFacilitiesRequest {
  category?: string
  available?: boolean
  search?: string
}

export interface BookFacilityRequest {
  facilityId: string
  bookerName: string
  bookerEmail: string
  bookerPhone: string
  bookingDate: string
  startTime: string
  endTime: string
  purpose: string
  expectedAttendees?: number
  additionalRequests?: string
}

// Feedback Request Types
export interface SubmitFeedbackRequest {
  type: 'service' | 'facility' | 'website' | 'event' | 'general'
  rating: number // 1-5
  title: string
  comment: string
  email?: string
  name?: string
  isAnonymous: boolean
}

// Announcement Request Types
export interface GetAnnouncementsRequest {
  page?: number
  limit?: number
  category?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  active?: boolean
}

// Zakat Calculator Request Types
export interface CalculateZakatRequest {
  type: 'mal' | 'fitrah' | 'profession'
  amount: number
  goldPrice?: number
  dependents?: number
}

// Qibla Direction Request Types
export interface GetQiblaDirectionRequest {
  latitude: number
  longitude: number
}

// Website Stats Request Types (Public)
export interface GetPublicStatsRequest {
  period?: 'day' | 'week' | 'month' | 'year'
}

// Donation Report Request Types (Public)
export interface GetDonationReportRequest {
  donationId?: string
  period?: 'month' | 'quarter' | 'year'
  year?: number
  month?: number
  format?: 'summary' | 'detailed'
}
