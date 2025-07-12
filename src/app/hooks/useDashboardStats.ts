import { useEffect, useCallback, useState } from 'react'
import { useDashboardStatsComplete, useDashboardStatsData, useIsStatsLoading } from '../stores/adminStore'
import { dashboardUseCases } from '../useCases/dashboardUseCases'
import { DashboardStatsResponse } from '../types/adminResponseTypes'
import { GetDashboardStatsRequest } from '../types/adminRequestTypes'

/**
 * Custom hook for dashboard statistics with automatic loading and caching
 */
export const useDashboardStats = () => {
  const {
    stats,
    setStats,
    setStatsLoading,
    isStatsLoading,
    lastStatsUpdate
  } = useDashboardStatsComplete()
  
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load dashboard stats
  const loadStats = useCallback(async (request?: GetDashboardStatsRequest, forceRefresh = false) => {
    try {
      setError(null)
      setStatsLoading(true)

      // Check if we need to refresh data
      const shouldRefresh = forceRefresh || 
                           !stats || 
                           !dashboardUseCases.isDashboardDataFresh()

      if (!shouldRefresh && stats) {
        setStatsLoading(false)
        return stats
      }

      const newStats = await dashboardUseCases.getDashboardStats(request)
      
      if (newStats) {
        setStats(newStats)
        dashboardUseCases.markDashboardDataAsFresh()
        setIsInitialized(true)
        return newStats
      } else {
        throw new Error('Failed to load dashboard statistics')
      }
    } catch (err: any) {
      console.error('Error loading dashboard stats:', err)
      setError(err.message || 'Failed to load dashboard statistics')
      
      // If no existing stats, load fallback data
      if (!stats) {
        const fallbackStats = await dashboardUseCases.getDashboardSummary()
        if (fallbackStats) {
          setStats(fallbackStats as DashboardStatsResponse)
        }
      }
    } finally {
      setStatsLoading(false)
    }
  }, [stats, setStats, setStatsLoading])

  // Load current month stats
  const loadCurrentMonthStats = useCallback(async (forceRefresh = false) => {
    const currentMonthStats = await dashboardUseCases.getCurrentMonthStats()
    if (currentMonthStats) {
      setStats(currentMonthStats)
      dashboardUseCases.markDashboardDataAsFresh()
    }
  }, [setStats])

  // Refresh stats
  const refreshStats = useCallback(async () => {
    return loadStats(undefined, true)
  }, [loadStats])

  // Auto-load stats on mount
  useEffect(() => {
    if (!isInitialized && !isStatsLoading) {
      loadStats()
    }
  }, [isInitialized, isStatsLoading, loadStats])

  // Format stats for display with safety checks
  const formattedStats = (stats && typeof stats === 'object') ? 
    dashboardUseCases.formatStatsForDisplay(stats) : null

  return {
    // Data
    stats,
    formattedStats,
    
    // Status
    isLoading: isStatsLoading,
    error,
    isInitialized,
    lastUpdate: lastStatsUpdate,
    
    // Actions
    loadStats,
    loadCurrentMonthStats,
    refreshStats,
    
    // Helpers
    isDataFresh: dashboardUseCases.isDashboardDataFresh()
  }
}

/**
 * Hook for real-time dashboard activity
 */
export const useRealtimeDashboard = () => {
  const {
    realtimeActivity,
    setRealtimeActivity,
    isActivityLoading,
    setActivityLoading
  } = useDashboardStatsComplete()

  const [error, setError] = useState<string | null>(null)

  const loadRealtimeActivity = useCallback(async () => {
    try {
      setError(null)
      setActivityLoading(true)
      
      const activity = await dashboardUseCases.getRealtimeActivity()
      if (activity) {
        setRealtimeActivity(activity)
      }
    } catch (err: any) {
      console.error('Error loading realtime activity:', err)
      setError(err.message || 'Failed to load realtime activity')
    } finally {
      setActivityLoading(false)
    }
  }, [setRealtimeActivity, setActivityLoading])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    loadRealtimeActivity()
    
    const interval = setInterval(loadRealtimeActivity, 30000)
    return () => clearInterval(interval)
  }, [loadRealtimeActivity])

  return {
    realtimeActivity,
    isLoading: isActivityLoading,
    error,
    refresh: loadRealtimeActivity
  }
}

/**
 * Hook for dashboard charts
 */
export const useDashboardCharts = () => {
  const {
    charts,
    setCharts,
    isChartsLoading,
    setChartsLoading,
    lastChartsUpdate
  } = useDashboardStatsComplete()

  const [error, setError] = useState<string | null>(null)

  const loadCharts = useCallback(async () => {
    try {
      setError(null)
      setChartsLoading(true)
      
      const chartsData = await dashboardUseCases.getMonthlyCharts()
      if (chartsData) {
        setCharts(chartsData)
      }
    } catch (err: any) {
      console.error('Error loading dashboard charts:', err)
      setError(err.message || 'Failed to load dashboard charts')
    } finally {
      setChartsLoading(false)
    }
  }, [setCharts, setChartsLoading])

  return {
    charts,
    isLoading: isChartsLoading,
    error,
    lastUpdate: lastChartsUpdate,
    loadCharts,
    refresh: loadCharts
  }
}

/**
 * Simple hook that just returns the current stats data
 */
export const useCurrentDashboardStats = () => {
  return useDashboardStatsData()
}
