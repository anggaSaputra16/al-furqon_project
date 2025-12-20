'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  type = 'danger',
  isLoading = false
}: ConfirmationModalProps) {
  const { colors } = useTheme()
  const typeConfig = {
    danger: {
      icon: 'text-red-500',
      button: 'bg-red-500 hover:bg-red-600'
    },
    warning: {
      icon: 'text-yellow-500',
      button: 'bg-yellow-500 hover:bg-yellow-600'
    },
    info: {
      icon: 'text-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600'
    }
  }

  const currentConfig = typeConfig[type]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: colors.card }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-gray-100"
                style={{ color: colors.detail }}
              >
                <FaTimes size={18} />
              </button>

              {/* Icon Section */}
              <div 
                className="border-b p-6 flex justify-center"
                style={{ 
                  backgroundColor: colors.muted,
                  borderColor: colors.border
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.background }}
                >
                  <FaExclamationTriangle className={`${currentConfig.icon} text-3xl`} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-3 text-center"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-header-modern)'
                  }}
                >
                  {title}
                </h3>
                <p
                  className="text-center mb-6"
                  style={{
                    color: colors.detail,
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.cardText,
                      border: `2px solid ${colors.border}`,
                      fontFamily: 'var(--font-sharp-bold)'
                    }}
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                      onConfirm()
                    }}
                    disabled={isLoading}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${currentConfig.button}`}
                    style={{
                      fontFamily: 'var(--font-sharp-bold)'
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Memproses...</span>
                      </div>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>

              {/* Warning Footer */}
              {type === 'danger' && (
                <div 
                  className="border-t px-6 py-3"
                  style={{ 
                    backgroundColor: colors.muted,
                    borderColor: colors.border
                  }}
                >
                  <p className="text-xs text-center text-red-500">
                    ⚠️ Tindakan ini tidak dapat dibatalkan
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
