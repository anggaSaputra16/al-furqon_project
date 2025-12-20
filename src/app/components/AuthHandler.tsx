'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuthentication } from '../hooks/useAdmin'

export default function AuthHandler() {
  const router = useRouter()
  const { logout } = useAdminAuthentication()

  useEffect(() => {
    const handleAutoLogout = (event: any) => {
      // Clear all auth tokens immediately
      localStorage.removeItem('admin_auth')
      localStorage.removeItem('alfurqon_token')
      
      // Call logout function to update state
      logout()
      
      // Show notification
      showAutoLogoutNotification(event.detail?.message || 'Session expired. Please login again.')
      
      // Redirect immediately
      const currentPath = window.location.pathname
      if (currentPath.includes('/admin')) {
        router.push('/admin')
      } else {
        router.refresh()
      }
    }

    // Add event listener for auto logout
    window.addEventListener('autoLogout', handleAutoLogout)

    return () => {
      window.removeEventListener('autoLogout', handleAutoLogout)
    }
  }, [router, logout])

  return null // This component doesn't render anything
}

function showAutoLogoutNotification(message: any) {
  // Create a simple toast notification
  const notification = document.createElement('div')
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f59e0b;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">⚠️</span>
        <span>${message}</span>
      </div>
    </div>
  `

  // Add animation styles
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    const notificationElement = notification.querySelector('div')
    if (notificationElement) {
      notificationElement.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }
  }, 5000)
}