import { adminRepository } from './adminRepository'
import { 
    GetDashboardStatsRequest, 
    GetDashboardChartsRequest 
} from '../types/adminRequestTypes'
import { 
    DashboardStatsResponse, 
    DashboardChartsData, 
    ApiResponse 
} from '../types/adminResponseTypes'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const API_VERSION = '/api/v1'

class DashboardRepository {
    private baseUrl: string
    private defaultHeaders: HeadersInit

    constructor() {
        this.baseUrl = `${API_BASE_URL}${API_VERSION}`
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        }
    }

    // Helper method to get auth headers
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('admin_auth')
        const parsedToken = token ? JSON.parse(token) : null
        
        return {
            ...this.defaultHeaders,
            ...(parsedToken?.token && { 'Authorization': `Bearer ${parsedToken.token}` })
        }
    }

    // Generic API request method
    private async makeRequest<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        endpoint: string,
        body?: any
    ): Promise<T> {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method,
                headers: this.getAuthHeaders(),
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error: any) {
            clearTimeout(timeoutId)
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - Please check your connection')
            }
            console.error('Dashboard API request failed:', error.message)
            throw error
        }
    }
    private readonly DASHBOARD_ENDPOINTS = {
        STATS: '/admin/dashboard/stats',
        CHARTS: '/admin/dashboard/charts',
        ACTIVITY: '/admin/dashboard/activity',
        SUMMARY: '/admin/dashboard/summary'
    } as const

    /**
     * Get comprehensive dashboard statistics
     */
    async getDashboardStats(request?: GetDashboardStatsRequest): Promise<ApiResponse<DashboardStatsResponse>> {
        try {
            const params = new URLSearchParams()
            
            if (request?.dateRange) {
                params.append('startDate', request.dateRange.startDate)
                params.append('endDate', request.dateRange.endDate)
            }
            
            if (request?.includeCharts !== undefined) {
                params.append('includeCharts', request.includeCharts.toString())
            }
            
            if (request?.includeTopArticles !== undefined) {
                params.append('includeTopArticles', request.includeTopArticles.toString())
            }
            
            if (request?.includeRecentDonations !== undefined) {
                params.append('includeRecentDonations', request.includeRecentDonations.toString())
            }
            
            if (request?.includeFinancialSummary !== undefined) {
                params.append('includeFinancialSummary', request.includeFinancialSummary.toString())
            }
            
            if (request?.timezone) {
                params.append('timezone', request.timezone)
            }

            const queryString = params.toString()
            const url = queryString ? 
                `${this.DASHBOARD_ENDPOINTS.STATS}?${queryString}` : 
                this.DASHBOARD_ENDPOINTS.STATS

            const response = await this.makeRequest<DashboardStatsResponse>('GET', url)
            
            return {
                success: true,
                message: 'Dashboard stats retrieved successfully',
                data: response,
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
            throw error
        }
    }

    /**
     * Get dashboard charts data
     */
    async getDashboardCharts(request: GetDashboardChartsRequest): Promise<ApiResponse<DashboardChartsData>> {
        try {
            const params = new URLSearchParams()
            params.append('chartType', request.chartType)
            
            if (request.dateRange) {
                params.append('startDate', request.dateRange.startDate)
                params.append('endDate', request.dateRange.endDate)
            }
            
            if (request.metrics && request.metrics.length > 0) {
                params.append('metrics', request.metrics.join(','))
            }

            const url = `${this.DASHBOARD_ENDPOINTS.CHARTS}?${params.toString()}`
            const response = await this.makeRequest<DashboardChartsData>('GET', url)
            
            return {
                success: true,
                message: 'Dashboard charts data retrieved successfully',
                data: response,
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error fetching dashboard charts:', error)
            throw error
        }
    }

    /**
     * Get quick dashboard summary (lightweight version)
     */
    async getDashboardSummary(): Promise<ApiResponse<Partial<DashboardStatsResponse>>> {
        try {
            const response = await this.makeRequest<Partial<DashboardStatsResponse>>('GET', this.DASHBOARD_ENDPOINTS.SUMMARY)
            
            return {
                success: true,
                message: 'Dashboard summary retrieved successfully',
                data: response,
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error fetching dashboard summary:', error)
            throw error
        }
    }

    /**
     * Get real-time activity data
     */
    async getRealtimeActivity(): Promise<ApiResponse<{
        onlineUsers: number
        todayViews: number
        todayDonations: number
        recentActions: {
            type: 'article' | 'donation' | 'user' | 'system'
            title: string
            timestamp: string
            userId?: string
            userRole?: string
        }[]
    }>> {
        try {
            const response = await this.makeRequest<{
                onlineUsers: number
                todayViews: number
                todayDonations: number
                recentActions: {
                    type: 'article' | 'donation' | 'user' | 'system'
                    title: string
                    timestamp: string
                    userId?: string
                    userRole?: string
                }[]
            }>('GET', this.DASHBOARD_ENDPOINTS.ACTIVITY)
            
            return {
                success: true,
                message: 'Realtime activity data retrieved successfully',
                data: response,
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error fetching realtime activity:', error)
            throw error
        }
    }

    /**
     * Refresh dashboard cache (force update)
     */
    async refreshDashboardCache(): Promise<ApiResponse<{ message: string }>> {
        try {
            const response = await this.makeRequest<{ message: string }>('POST', `${this.DASHBOARD_ENDPOINTS.STATS}/refresh`)
            
            return {
                success: true,
                message: 'Dashboard cache refreshed successfully',
                data: response,
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error refreshing dashboard cache:', error)
            throw error
        }
    }

    /**
     * Get dashboard stats with fallback to mock data
     */
    async getDashboardStatsWithFallback(request?: GetDashboardStatsRequest): Promise<DashboardStatsResponse> {
        try {
            const response = await this.getDashboardStats(request)
            if (response.success && response.data) {
                return response.data
            }
            throw new Error('API response unsuccessful')
        } catch (error) {
            console.warn('Using fallback dashboard stats due to API error:', error)
            return this.getMockDashboardStats()
        }
    }

    /**
     * Mock dashboard stats for development/fallback
     */
    private getMockDashboardStats(): DashboardStatsResponse {
        return {
            totalArticles: 45,
            totalDonations: 12,
            totalGallery: 156,
            totalUsers: 3,
            monthlyViews: 8750,
            activeDonations: 8,
            monthlyIncome: 18250000,
            monthlyExpense: 8750000,
            totalBalance: 9500000,
            todayViews: 234,
            weeklyViews: 1680,
            yearlyViews: 52300,
            totalRevenue: 125000000,
            monthlyGrowth: {
                articles: 12.5,
                donations: 8.3,
                users: 15.7,
                revenue: 22.1,
                views: 18.9
            },
            topArticles: [
                {
                    id: '1',
                    title: 'Kajian Rutin Minggu Pagi',
                    views: 1250,
                    publishedAt: '2024-07-10T10:00:00Z'
                },
                {
                    id: '2',
                    title: 'Pengumuman Libur Hari Raya',
                    views: 980,
                    publishedAt: '2024-07-08T15:30:00Z'
                },
                {
                    id: '3',
                    title: 'Kegiatan Bakti Sosial',
                    views: 750,
                    publishedAt: '2024-07-05T09:15:00Z'
                }
            ],
            recentDonations: [
                {
                    id: '1',
                    amount: 5000000,
                    donorName: 'Anonim',
                    purpose: 'Renovasi Mihrab',
                    createdAt: '2024-07-13T08:30:00Z'
                },
                {
                    id: '2',
                    amount: 1500000,
                    donorName: 'Ahmad Fauzi',
                    purpose: 'Infaq Umum',
                    createdAt: '2024-07-12T14:20:00Z'
                },
                {
                    id: '3',
                    amount: 750000,
                    donorName: 'Siti Nurhaliza',
                    purpose: 'Program Anak Yatim',
                    createdAt: '2024-07-11T16:45:00Z'
                }
            ],
            monthlyFinancialSummary: {
                totalIncome: 18250000,
                totalExpense: 8750000,
                netBalance: 9500000,
                categories: [
                    { category: 'Donasi', income: 15000000, expense: 0 },
                    { category: 'Infaq', income: 3250000, expense: 0 },
                    { category: 'Operasional', income: 0, expense: 4500000 },
                    { category: 'Program', income: 0, expense: 2750000 },
                    { category: 'Pemeliharaan', income: 0, expense: 1500000 }
                ]
            }
        }
    }
}

// Export singleton instance
export const dashboardRepository = new DashboardRepository()
export default dashboardRepository
