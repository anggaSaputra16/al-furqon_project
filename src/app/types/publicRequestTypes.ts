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
export interface SendContactMessageRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  category: 'general' | 'donation' | 'event' | 'complaint' | 'suggestion'
}

export interface GetPrayerTimesRequest {
  date?: string
  month?: string
  city?: string
  latitude?: number
  longitude?: number
}
export interface GetIslamicCalendarRequest {
  year?: number
  month?: number
  hijriYear?: number
  hijriMonth?: number
}
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
export interface SubscribeNewsletterRequest {
  email: string
  name?: string
  preferences?: string[]
}
export interface UnsubscribeNewsletterRequest {
  email: string
  token?: string
}
export interface GlobalSearchRequest {
  query: string
  type?: 'all' | 'articles' | 'donations' | 'events' | 'gallery'
  page?: number
  limit?: number
}
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


export interface SubmitFeedbackRequest {
  type: 'service' | 'facility' | 'website' | 'event' | 'general'
  rating: number
  title: string
  comment: string
  email?: string
  name?: string
  isAnonymous: boolean
}
export interface GetAnnouncementsRequest {
  page?: number
  limit?: number
  category?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  active?: boolean
}
export interface CalculateZakatRequest {
  type: 'mal' | 'fitrah' | 'profession'
  amount: number
  goldPrice?: number
  dependents?: number
}


export interface GetQiblaDirectionRequest {
  latitude: number
  longitude: number
}


export interface GetPublicStatsRequest {
  period?: 'day' | 'week' | 'month' | 'year'
}
export interface GetDonationReportRequest {
  donationId?: string
  period?: 'month' | 'quarter' | 'year'
  year?: number
  month?: number
  format?: 'summary' | 'detailed'
}
