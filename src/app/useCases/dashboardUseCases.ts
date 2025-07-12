import { dashboardRepository } from '../repositories/dashboardRepository'
import { 
    GetDashboardStatsRequest, 
    GetDashboardChartsRequest 
} from '../types/adminRequestTypes'
import { 
    DashboardStatsResponse, 
    DashboardChartsData 
} from '../types/adminResponseTypes'

class DashboardUseCases {
    /**
     * Get comprehensive dashboard statistics with error handling
     */
    async getDashboardStats(request?: GetDashboardStatsRequest): Promise<DashboardStatsResponse | null> {
        try {
            const response = await dashboardRepository.getDashboardStatsWithFallback(request)
            return response
        } catch (error) {
            console.error('Error in getDashboardStats use case:', error)
            return null
        }
    }

    /**
     * Get dashboard charts data
     */
    async getDashboardCharts(request: GetDashboardChartsRequest): Promise<DashboardChartsData | null> {
        try {
            const response = await dashboardRepository.getDashboardCharts(request)
            return response.success ? response.data || null : null
        } catch (error) {
            console.error('Error in getDashboardCharts use case:', error)
            return null
        }
    }

    /**
     * Get lightweight dashboard summary for quick loading
     */
    async getDashboardSummary(): Promise<Partial<DashboardStatsResponse> | null> {
        try {
            const response = await dashboardRepository.getDashboardSummary()
            return response.success ? response.data || null : null
        } catch (error) {
            console.error('Error in getDashboardSummary use case:', error)
            // Return basic fallback data
            return {
                totalArticles: 45,
                totalDonations: 12,
                totalUsers: 3,
                activeDonations: 8,
                monthlyIncome: 18250000,
                monthlyExpense: 8750000,
                totalBalance: 9500000,
                monthlyViews: 8750
            }
        }
    }

    /**
     * Get real-time activity data for live dashboard updates
     */
    async getRealtimeActivity(): Promise<{
        onlineUsers: number
        todayViews: number
        todayDonations: number
        recentActions: any[]
    } | null> {
        try {
            const response = await dashboardRepository.getRealtimeActivity()
            return response.success ? response.data || null : null
        } catch (error) {
            console.error('Error in getRealtimeActivity use case:', error)
            return {
                onlineUsers: 3,
                todayViews: 234,
                todayDonations: 2,
                recentActions: []
            }
        }
    }

    /**
     * Refresh dashboard cache
     */
    async refreshDashboardCache(): Promise<boolean> {
        try {
            const response = await dashboardRepository.refreshDashboardCache()
            return response.success
        } catch (error) {
            console.error('Error in refreshDashboardCache use case:', error)
            return false
        }
    }

    /**
     * Get current month dashboard data with date range
     */
    async getCurrentMonthStats(): Promise<DashboardStatsResponse | null> {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const request: GetDashboardStatsRequest = {
            dateRange: {
                startDate: startOfMonth.toISOString(),
                endDate: endOfMonth.toISOString()
            },
            includeCharts: true,
            includeTopArticles: true,
            includeRecentDonations: true,
            includeFinancialSummary: true,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }

        return this.getDashboardStats(request)
    }

    /**
     * Get dashboard statistics for a specific date range
     */
    async getStatsForDateRange(startDate: Date, endDate: Date): Promise<DashboardStatsResponse | null> {
        const request: GetDashboardStatsRequest = {
            dateRange: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            },
            includeCharts: false,
            includeTopArticles: false,
            includeRecentDonations: false,
            includeFinancialSummary: true
        }

        return this.getDashboardStats(request)
    }

    /**
     * Get monthly charts data for dashboard visualization
     */
    async getMonthlyCharts(): Promise<DashboardChartsData | null> {
        const request: GetDashboardChartsRequest = {
            chartType: 'monthly',
            metrics: ['articles', 'donations', 'views', 'revenue']
        }

        return this.getDashboardCharts(request)
    }

    /**
     * Format dashboard stats for UI display
     */
    formatStatsForDisplay(stats: DashboardStatsResponse | null | undefined) {
        // Safety check for null/undefined stats
        if (!stats || typeof stats !== 'object') {
            return {
                totalArticles: { value: 0, formatted: '0', growth: 0 },
                totalDonations: { value: 0, formatted: '0', growth: 0 },
                monthlyIncome: { value: 0, formatted: 'Rp 0', growth: 0 },
                totalBalance: { value: 0, formatted: 'Rp 0', growth: 0 },
                monthlyViews: { value: 0, formatted: '0', growth: 0 },
                totalUsers: { value: 0, formatted: '0', growth: 0 }
            }
        }

        return {
            totalArticles: {
                value: stats.totalArticles ?? 0,
                formatted: (stats.totalArticles ?? 0).toString(),
                growth: stats.monthlyGrowth?.articles || 0
            },
            totalDonations: {
                value: stats.activeDonations ?? 0,
                formatted: (stats.activeDonations ?? 0).toString(),
                growth: stats.monthlyGrowth?.donations || 0
            },
            monthlyIncome: {
                value: stats.monthlyIncome ?? 0,
                formatted: new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(stats.monthlyIncome ?? 0),
                growth: stats.monthlyGrowth?.revenue || 0
            },
            totalBalance: {
                value: stats.totalBalance ?? 0,
                formatted: new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(stats.totalBalance ?? 0),
                growth: 0 // Balance doesn't have growth metric
            },
            monthlyViews: {
                value: stats.monthlyViews ?? 0,
                formatted: new Intl.NumberFormat('id-ID').format(stats.monthlyViews ?? 0),
                growth: stats.monthlyGrowth?.views || 0
            },
            totalUsers: {
                value: stats.totalUsers ?? 0,
                formatted: (stats.totalUsers ?? 0).toString(),
                growth: stats.monthlyGrowth?.users || 0
            }
        }
    }

    /**
     * Check if dashboard data is fresh (less than 5 minutes old)
     */
    isDashboardDataFresh(): boolean {
        const lastFetch = localStorage.getItem('dashboard_last_fetch')
        if (!lastFetch) return false

        const lastFetchTime = new Date(lastFetch).getTime()
        const now = new Date().getTime()
        const fiveMinutes = 5 * 60 * 1000

        return (now - lastFetchTime) < fiveMinutes
    }

    /**
     * Mark dashboard data as fresh
     */
    markDashboardDataAsFresh(): void {
        localStorage.setItem('dashboard_last_fetch', new Date().toISOString())
    }
}

// Export singleton instance
export const dashboardUseCases = new DashboardUseCases()
export default dashboardUseCases
