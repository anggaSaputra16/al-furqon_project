import { useState, useEffect, useCallback } from 'react'


class BackendAvailabilityManager {
  private static instance: BackendAvailabilityManager
  private isAvailable: boolean | null = null
  private lastCheck: number = 0
  private checkInProgress: boolean = false
  private readonly CHECK_INTERVAL = 30000
  private readonly TIMEOUT = 3000
  private listeners: Set<(available: boolean) => void> = new Set()

  static getInstance(): BackendAvailabilityManager {
    if (!BackendAvailabilityManager.instance) {
      BackendAvailabilityManager.instance = new BackendAvailabilityManager()
    }
    return BackendAvailabilityManager.instance
  }

  subscribe(listener: (available: boolean) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(available: boolean) {
    this.listeners.forEach(listener => {
      try {
        listener(available)
      } catch (error) {
        console.error('Error notifying backend availability listener:', error)
      }
    })
  }

  async checkAvailability(forceCheck = false): Promise<boolean> {
    const now = Date.now()
    

    if (!forceCheck && this.isAvailable !== null && (now - this.lastCheck) < this.CHECK_INTERVAL) {
      return this.isAvailable
    }


    if (this.checkInProgress) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.checkInProgress) {
            clearInterval(checkInterval)
            resolve(this.isAvailable as boolean)
          }
        }, 100)
        

        setTimeout(() => {
          clearInterval(checkInterval)
          resolve(false)
        }, 10000)
      })
    }

    this.checkInProgress = true

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT)
      
      const healthUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/health`      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      const newAvailability = response.ok
      const statusChanged = this.isAvailable !== newAvailability
      
      this.isAvailable = newAvailability
      this.lastCheck = now
      

      if (statusChanged || this.lastCheck === now) {
        this.notifyListeners(newAvailability)
      }
      
      if (!newAvailability) {
        console.warn('⚠️ Backend not available, will use static data fallback')
      }
      
      return newAvailability
    } catch (error) {
      console.error('❌ Backend health check failed:', error)
      
      const newAvailability = false
      const statusChanged = this.isAvailable !== newAvailability
      
      this.isAvailable = newAvailability
      this.lastCheck = now
      
      if (statusChanged) {
        console.warn('⚠️ Backend not available, will use static data fallback')
        this.notifyListeners(newAvailability)
      }
      
      return newAvailability
    } finally {
      this.checkInProgress = false
    }
  }

  getCachedAvailability(): boolean | null {
    return this.isAvailable
  }

  reset() {
    this.isAvailable = null
    this.lastCheck = 0
    this.checkInProgress = false
  }
}


export const useBackendAvailability = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<number>(0)

  const manager = BackendAvailabilityManager.getInstance()

  const checkAvailability = useCallback(async (force = false) => {
    setIsChecking(true)
    try {
      const available = await manager.checkAvailability(force)
      setIsAvailable(available)
      setLastChecked(Date.now())
      return available
    } finally {
      setIsChecking(false)
    }
  }, [manager])

  const forceCheck = useCallback(() => {
    return checkAvailability(true)
  }, [checkAvailability])

  useEffect(() => {

    const cached = manager.getCachedAvailability()
    if (cached !== null) {
      setIsAvailable(cached)
    }


    const unsubscribe = manager.subscribe((available) => {
      setIsAvailable(available)
      setLastChecked(Date.now())
    })


    if (cached === null) {
      checkAvailability()
    }

    return unsubscribe
  }, [manager, checkAvailability])

  return {
    isAvailable,
    isChecking,
    lastChecked,
    checkAvailability: forceCheck,
    getCached: () => manager.getCachedAvailability()
  }
}

export default useBackendAvailability
