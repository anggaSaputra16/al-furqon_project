import { useState, useEffect, useCallback } from 'react'
import { HomePageUseCases } from '../useCases/homePageUseCases'
import { apiRepository } from '../repositories/apiRepository'
import {
  ArticleResponse,
  DonationResponse,
  NewsResponse,
  MenuResponse,
  HomePageData,
  HomeStatsResponse
} from '../types/responseTypes'
import {
  DonationSubmissionRequest,
  ContactRequest
} from '../types/requestTypes'
import { activityCards, donationCards, newsCards } from '../utils/staticData'
import useBackendAvailability from './useBackendAvailability'

const homePageUseCases = new HomePageUseCases(apiRepository)

export const useHomePageData = () => {
  const [data, setData] = useState<HomePageData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [articlesUploaded, setArticlesUploaded] = useState(false)
  
  const { isAvailable: backendAvailable, isChecking } = useBackendAvailability()

  const fetchData = useCallback(async () => {
    if (backendAvailable === null || isChecking) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      if (!backendAvailable) {
        setLoading(false)
        return
      }

      const result = await homePageUseCases.getHomePageData()
      
      if (result.success) {
        setData(result.data || null)
      } else {
        setError(result.error || 'Failed to load data')
      }
    } catch (err) {
      console.error('❌ Error fetching home page data:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, [articlesUploaded, backendAvailable, isChecking])

  useEffect(() => {
    fetchData()
    if (backendAvailable) {
      homePageUseCases.trackPageView('home').catch(console.warn)
    }
  }, [fetchData, backendAvailable])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

export const useFeaturedArticles = (limit = 6) => {
  const [articles, setArticles] = useState<ArticleResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [articlesUploaded, setArticlesUploaded] = useState(false)
  
  const { isAvailable: backendAvailable, isChecking } = useBackendAvailability()

  const fetchArticles = useCallback(async () => {
    
    if (backendAvailable === null || isChecking) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      if (!backendAvailable) {        

        const staticArticles: ArticleResponse[] = activityCards.slice(0, limit).map((card, index) => ({
          id: card.id,
          title: card.title,
          slug: card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: card.description,
          content: card.detail,
          image: card.image,
          category: 'kegiatan' as const,
          status: 'published' as const,
          author: { 
            id: 'admin',
            name: 'Admin Al-Furqon',
            avatar: undefined
          },
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: Math.floor(Math.random() * 100) + 50,
          likes: Math.floor(Math.random() * 20) + 5,
          tags: ['kegiatan', 'masjid'],
          featured: true
        }))
        
        setArticles(staticArticles)
        setLoading(false)
        return
      }

      const result = await homePageUseCases.getFeaturedArticles(limit)      
      if (result.success) {
        let articleData = result.data

        if (articleData && typeof articleData === 'object' && 'data' in articleData) {
          articleData = (articleData as any).data
        }
        
        const transformedArticles = (articleData || [])
          .filter((article: any) => article.status === 'published')
          .map((article: any) => ({
            id: article.id,
            title: article.title,
            slug: article.slug || article.title.toLowerCase().replace(/ /g, '-'),
            description: article.description,
            content: article.content,
            image: article.image,
            category: article.category,
            status: article.status,
            author: article.author || { 
              id: article.authorId || 'admin',
              name: article.authorName || 'Admin',
              avatar: article.authorAvatar
            },
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt,
            views: article.views || 0,
            likes: article.likes || 0,
            tags: article.tags || [],
            featured: article.featured
          }))
        
        setArticles(transformedArticles)
      } else {
        if (result.error === 'Backend not available') {          

          const staticArticles: ArticleResponse[] = activityCards.slice(0, limit).map((card, index) => ({
            id: card.id,
            title: card.title,
            slug: card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: card.description,
            content: card.detail,
            image: card.image,
            category: 'kegiatan' as const,
            status: 'published' as const,
            author: { 
              id: 'admin',
              name: 'Admin Al-Furqon',
              avatar: undefined
            },
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: Math.floor(Math.random() * 100) + 50,
            likes: Math.floor(Math.random() * 20) + 5,
            tags: ['kegiatan', 'masjid'],
            featured: true
          }))
          
          setArticles(staticArticles)
        } else {
          setError(result.error || 'Failed to load articles')
        }
      }
    } catch (err) {
      console.error('Error fetching featured articles:', err)
      setError('Failed to load featured articles')
    } finally {
      setLoading(false)
    }
  }, [limit, backendAvailable, isChecking])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const trackArticleView = useCallback(async (articleId: string) => {
    await homePageUseCases.trackArticleView(articleId)
  }, [])

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
    trackView: trackArticleView
  }
}


export const useActiveDonations = (limit = 3) => {
  const [donations, setDonations] = useState<DonationResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { isAvailable: backendAvailable, isChecking } = useBackendAvailability()

  const fetchDonations = useCallback(async () => {

    if (backendAvailable === null || isChecking) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      if (!backendAvailable) {        

        const staticDonations: DonationResponse[] = donationCards.slice(0, limit).map((card) => {
          const percentage = Math.round((card.collected / card.target) * 100)
          return {
            id: card.id,
            title: card.title,
            slug: card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: card.description,
            detail: card.detail,
            target: card.target,
            collected: card.collected,
            percentage,
            image: card.image,
            status: 'active' as const,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            bankAccount: {
              bankName: 'BCA',
              accountNumber: '1234567890',
              accountName: 'Masjid Al-Furqon'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            donors: {
              total: Math.floor(Math.random() * 50) + 20,
              recent: []
            }
          }
        })
        
        setDonations(staticDonations)
        setLoading(false)
        return
      }

      const result = await homePageUseCases.getActiveDonations(limit)
      
      if (result.success) {

        const activeDonations = (result.data || []).filter((donation: any) => donation.status === 'active')
        setDonations(activeDonations)
      } else {
        setError(result.error || 'Failed to load donations')
      }
    } catch (err) {
      setError('Failed to load active donations')
    } finally {
      setLoading(false)
    }
  }, [limit, backendAvailable, isChecking])

  useEffect(() => {
    fetchDonations()
  }, [fetchDonations])

  return {
    donations,
    loading,
    error,
    refetch: fetchDonations
  }
}


export const useLatestNews = (limit = 3) => {
  const [news, setNews] = useState<NewsResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {


      if (backendAvailable === null) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000)
          
          const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/health`, {
            method: 'GET',
            signal: controller.signal
          })
          clearTimeout(timeoutId)
          setBackendAvailable(healthCheck.ok)
        } catch {
          setBackendAvailable(false)
          console.warn('⚠️ Backend not available for news, will use static data fallback')
          


          const staticNews: NewsResponse[] = newsCards.slice(0, limit).map((card, index) => ({
            id: `news-${index + 1}`,
            title: card.title,
            slug: card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: card.description,
            content: card.description,
            image: card.image,
            category: 'berita',
            priority: 'medium' as const,
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
              id: 'admin',
              name: 'Admin Al-Furqon'
            },
            views: Math.floor(Math.random() * 100) + 50
          }))
          
          setNews(staticNews)
          setLoading(false)
          return
        }
      }

      if (!backendAvailable) {        


        const staticNews: NewsResponse[] = newsCards.slice(0, limit).map((card, index) => ({
          id: `news-${index + 1}`,
          title: card.title,
          slug: card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: card.description,
          content: card.description,
          image: card.image,
          category: 'berita',
          priority: 'medium' as const,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: {
            id: 'admin',
            name: 'Admin Al-Furqon'
          },
          views: Math.floor(Math.random() * 100) + 50
        }))
        
        setNews(staticNews)
        setLoading(false)
        return
      }

      const result = await homePageUseCases.getLatestNews(limit)
      
      if (result.success) {


        const validatedNews = (result.data || [])
          .filter((news: any) => !news.status || news.status === 'published') 
          .map(news => ({
            ...news,
            author: news.author || { id: 'admin', name: 'Admin Al-Furqon' }
          }))
        
        setNews(validatedNews)
      } else {

        if (result.error === 'Backend not available') {          


          const staticNews: NewsResponse[] = newsCards.slice(0, limit).map((card, index) => ({
            id: `news-${index + 1}`,
            title: card.title,
            slug: card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: card.description,
            content: card.description,
            image: card.image,
            category: 'berita',
            priority: 'medium' as const,
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
              id: 'admin',
              name: 'Admin Al-Furqon'
            },
            views: Math.floor(Math.random() * 100) + 50
          }))
          
          setNews(staticNews)
        } else {
          setError(result.error || 'Failed to load news')
        }
      }
    } catch (err) {
      console.error('❌ Error fetching news:', err)
      setError('Failed to load latest news')
    } finally {
      setLoading(false)
    }
  }, [limit, backendAvailable])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  return {
    news,
    loading,
    error,
    refetch: fetchNews
  }
}



export const useNavigationMenus = () => {
  const [menus, setMenus] = useState<MenuResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null)

  const fetchMenus = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await homePageUseCases.getNavigationMenus()
      
      if (result.success) {
        setMenus(result.data || [])
      } else {
        setError(result.error || 'Failed to load menus')
      }
    } catch (err) {
      setError('Failed to load navigation menus')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMenus()
  }, [fetchMenus])

  return {
    menus,
    loading,
    error,
    refetch: fetchMenus
  }
}



export const useDonationSubmission = () => {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitDonation = useCallback(async (donationData: DonationSubmissionRequest) => {
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    
    try {
      const result = await homePageUseCases.submitDonation(donationData)
      
      if (result.success) {
        setSuccess(true)
        return {
          success: true,
          data: result.data
        }
      } else {
        setError(result.error || 'Failed to submit donation')
        return {
          success: false,
          error: result.error
        }
      }
    } catch (err) {
      const errorMessage = 'Gagal memproses donasi. Silakan coba lagi.'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setSubmitting(false)
    }
  }, [])

  const reset = useCallback(() => {
    setSuccess(false)
    setError(null)
  }, [])

  return {
    submitDonation,
    submitting,
    success,
    error,
    reset
  }
}



export const useNewsletterSubscription = () => {
  const [subscribing, setSubscribing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subscribe = useCallback(async (email: string, name?: string) => {
    setSubscribing(true)
    setError(null)
    setSuccess(false)
    
    try {
      const result = await homePageUseCases.subscribeNewsletter(email, name)
      
      if (result.success) {
        setSuccess(true)
        return {
          success: true,
          message: result.message
        }
      } else {
        setError(result.error || 'Failed to subscribe')
        return {
          success: false,
          error: result.error
        }
      }
    } catch (err) {
      const errorMessage = 'Gagal berlangganan newsletter. Silakan coba lagi.'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setSubscribing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setSuccess(false)
    setError(null)
  }, [])

  return {
    subscribe,
    subscribing,
    success,
    error,
    reset
  }
}



export const useContactSubmission = () => {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitContact = useCallback(async (contactData: ContactRequest) => {
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    
    try {
      const result = await homePageUseCases.submitContact(contactData)
      
      if (result.success) {
        setSuccess(true)
        return {
          success: true,
          message: result.message
        }
      } else {
        setError(result.error || 'Failed to submit contact')
        return {
          success: false,
          error: result.error
        }
      }
    } catch (err) {
      const errorMessage = 'Gagal mengirim pesan. Silakan coba lagi.'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setSubmitting(false)
    }
  }, [])

  const reset = useCallback(() => {
    setSuccess(false)
    setError(null)
  }, [])

  return {
    submitContact,
    submitting,
    success,
    error,
    reset
  }
}



export const useContentSearch = () => {
  const [results, setResults] = useState<{
    articles: ArticleResponse[]
    donations: DonationResponse[]
    news: NewsResponse[]
    total: number
  } | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, type?: 'all' | 'articles' | 'donations' | 'news') => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    setSearching(true)
    setError(null)
    
    try {
      const result = await homePageUseCases.searchContent(query, type)
      
      if (result.success) {
        setResults(result.data || null)
      } else {
        setError(result.error || 'Search failed')
      }
    } catch (err) {
      setError('Gagal melakukan pencarian')
    } finally {
      setSearching(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults(null)
    setError(null)
  }, [])

  return {
    search,
    results,
    searching,
    error,
    clearResults
  }
}



export const useHomeStats = () => {
  const [stats, setStats] = useState<HomeStatsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await homePageUseCases.getHomeStats()
      
      if (result.success) {
        setStats(result.data || null)
      } else {
        setError(result.error || 'Failed to load statistics')
      }
    } catch (err) {
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}
