import { useEffect, useCallback, useState } from 'react'
import { useDashboardStatsComplete, useDashboardStatsData, useIsStatsLoading } from '../stores/adminStore'
import { dashboardUseCases } from '../useCases/dashboardUseCases'
import { DashboardStatsResponse } from '../types/adminResponseTypes'
import { GetDashboardStatsRequest } from '../types/adminRequestTypes'

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


  const loadStats = useCallback(async (request?: GetDashboardStatsRequest, forceRefresh = false) => {
    try {
      setError(null)
      setStatsLoading(true)


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


  const loadCurrentMonthStats = useCallback(async (forceRefresh = false) => {
    const currentMonthStats = await dashboardUseCases.getCurrentMonthStats()
    if (currentMonthStats) {
      setStats(currentMonthStats)
      dashboardUseCases.markDashboardDataAsFresh()
    }
  }, [setStats])


  const refreshStats = useCallback(async () => {
    return loadStats(undefined, true)
  }, [loadStats])


  useEffect(() => {
    if (!isInitialized && !isStatsLoading) {
      loadStats()
    }
  }, [isInitialized, isStatsLoading, loadStats])


  const formattedStats = (stats && typeof stats === 'object') ? 
    dashboardUseCases.formatStatsForDisplay(stats) : null

  return {
    stats,
    formattedStats,
    isLoading: isStatsLoading,
    error,
    isInitialized,
    lastUpdate: lastStatsUpdate,
    loadStats,
    loadCurrentMonthStats,
    refreshStats,
    
    isDataFresh: dashboardUseCases.isDashboardDataFresh()
  }
}

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


export const useCurrentDashboardStats = () => {
  return useDashboardStatsData()
}
