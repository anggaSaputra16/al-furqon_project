import { useState, useEffect, useCallback } from 'react'
import { adminRepository } from '../repositories/adminRepository'
import { useAdminUI } from '../stores/adminStore'
import {
  AdminUser,
  AdminUserListResponse,
  AdminUserDetailResponse
} from '../types/adminResponseTypes'
import {
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  DeleteAdminUserRequest
} from '../types/adminRequestTypes'

interface UserFilters {
  page: number
  limit: number
  search?: string
  status?: string
  role?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  const ui = useAdminUI()

  
  const fetchUsers = useCallback(async (filters: Partial<UserFilters> = {}) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      
      if (filters.page) params.append('page', String(filters.page))
      if (filters.limit) params.append('limit', String(filters.limit))
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.role) params.append('role', filters.role)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

      const query = params.toString() ? `?${params.toString()}` : ''
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/admin/users${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('admin_auth') || '{}').token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setUsers(result.data.data || [])
        setPagination(result.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        })
      } else {
        setError(result.message || 'Failed to fetch users')
        ui.addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: result.message || 'Failed to fetch users',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred')
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Network Error',
        message: 'Failed to connect to server',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }, [ui]) 

  const createUser = useCallback(async (userData: {
    username: string
    email: string
    name: string
    password: string
    role: 'admin' | 'editor' | 'viewer'
  }) => {
    setLoading(true)
    
    try {
      const backendRole: 'admin' | 'editor' = userData.role === 'viewer' ? 'editor' : userData.role as 'admin' | 'editor'
      
      const createData: CreateAdminUserRequest = {
        ...userData,
        role: backendRole,
        permissions: []
      }

      const response = await adminRepository.createAdminUser(createData)

      if (response.success) {
        ui.addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'User Created',
          message: `User ${userData.username} has been created successfully`,
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 3000
        })

        await fetchUsers({ page: 1, limit: 10 })
        return { success: true }
      } else {
        ui.addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Create Failed',
          message: response.message || 'Failed to create user',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
        return { success: false, message: response.message }
      }
    } catch (err: any) {
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Create Failed',
        message: err.message || 'Failed to create user',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [ui, fetchUsers]) 

  const updateUser = useCallback(async (id: string, updateData: Partial<UpdateAdminUserRequest>) => {
    setLoading(true)
    
    try {
      const response = await adminRepository.updateAdminUser({
        id,
        ...updateData
      })

      if (response.success) {
        ui.addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'User Updated',
          message: 'User has been updated successfully',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 3000
        })

        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === id ? { ...user, ...response.data } : user
          )
        )
        return { success: true }
      } else {
        ui.addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Update Failed',
          message: response.message || 'Failed to update user',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
        return { success: false, message: response.message }
      }
    } catch (err: any) {
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to update user',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [ui])


  const deleteUser = useCallback(async (id: string) => {
    setLoading(true)
    
    try {
      const response = await adminRepository.deleteAdminUser({ id })

      if (response.success) {
        ui.addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'User Deleted',
          message: 'User has been deleted successfully',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 3000
        })

        setUsers(prevUsers => prevUsers.filter(user => user.id !== id))
        return { success: true }
      } else {
        ui.addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Delete Failed',
          message: response.message || 'Failed to delete user',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
        return { success: false, message: response.message }
      }
    } catch (err: any) {
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Failed to delete user',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [ui])

  const updateUserStatus = useCallback(async (id: string, status: 'active' | 'inactive' | 'suspended') => {
    const isActive = status === 'active'
    return updateUser(id, { isActive })
  }, [updateUser])

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    refetch: useCallback(() => {
      fetchUsers({ page: pagination.page, limit: pagination.limit })
    }, [fetchUsers, pagination.page, pagination.limit])
  }
}

export const useAdminUser = (id: string) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ui = useAdminUI()

  const fetchUser = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response = await adminRepository.getAdminUser(id)

      if (response.success) {
        setUser(response.data?.user || null)
      } else {
        setError(response.message || 'Failed to fetch user')
        ui.addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to fetch user',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred')
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Network Error',
        message: 'Failed to connect to server',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }, [id, ui])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user,
    loading,
    error,
    refetch: fetchUser
  }
}
