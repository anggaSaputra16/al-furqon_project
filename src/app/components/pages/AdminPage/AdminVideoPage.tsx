'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaVideo, FaPlus, FaEdit, FaTrash, FaYoutube, FaEye, FaEyeSlash, FaSave, FaTimes, FaTag, FaStar, FaArrowLeft } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'
import { apiRepository } from '@/app/repositories/apiRepository'
import { useAdminUI } from '@/app/stores/adminStore'
import { VideoResponse } from '@/app/types/responseTypes'
import { CreateVideoRequest, UpdateVideoRequest } from '@/app/types/requestTypes'

interface AdminVideoPageProps {
  onBack?: () => void
}

export default function AdminVideoPage({ onBack }: AdminVideoPageProps) {
  const { colors } = useTheme()
  const ui = useAdminUI()
  const [videos, setVideos] = useState<VideoResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateVideoRequest>({
    title: '',
    description: '',
    youtubeUrl: '',
    isActive: true,
    isFeatured: false,
    tags: '',
    category: 'general'
  })

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    setIsLoading(true)
    try {
      const response = await apiRepository.videos.getVideos()
      console.log('🎥 Admin Video API Response:', response)
      
      if (response.success && response.data) {
        // API returns: {success: true, data: {data: videos[], pagination: {}}}
        let videoList: VideoResponse[] = []
        
        if (response.data.data && Array.isArray(response.data.data)) {
          // Standard backend pagination structure
          videoList = response.data.data
          console.log('📹 Admin using response.data.data:', videoList)
        } else if (Array.isArray(response.data)) {
          // Direct array response (fallback)
          videoList = response.data as VideoResponse[]
          console.log('📹 Admin using response.data (direct array):', videoList)
        } else {
          console.warn('❌ Admin - Unexpected video data structure:', response.data)
          videoList = []
        }
        
        console.log('📹 Admin video list:', videoList)
        setVideos(videoList)
      } else {
        console.warn('❌ Failed to load videos:', response)
        ui.addNotification({
          id: Date.now().toString(),
          type: 'warning',
          title: 'Gagal Memuat Video',
          message: response.message || 'Terjadi kesalahan saat memuat daftar video',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
      }
    } catch (error) {
      console.error('❌ Failed to load videos:', error)
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Terjadi kesalahan saat memuat daftar video',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingVideo) {
        const response = await apiRepository.videos.updateVideo({
          id: editingVideo.id,
          ...formData
        })
        if (response.success) {
          ui.addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Video Diperbarui',
            message: `Video "${formData.title}" berhasil diperbarui`,
            timestamp: new Date().toISOString(),
            autoClose: true,
            duration: 3000
          })
          await loadVideos()
          handleCloseForm()
        } else {
          ui.addNotification({
            id: Date.now().toString(),
            type: 'error',
            title: 'Gagal Memperbarui Video',
            message: response.message || 'Terjadi kesalahan saat memperbarui video',
            timestamp: new Date().toISOString(),
            autoClose: true,
            duration: 5000
          })
        }
      } else {
        const response = await apiRepository.videos.createVideo(formData)
        if (response.success) {
          ui.addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Video Ditambahkan',
            message: `Video "${formData.title}" berhasil ditambahkan`,
            timestamp: new Date().toISOString(),
            autoClose: true,
            duration: 3000
          })
          await loadVideos()
          handleCloseForm()
        } else {
          ui.addNotification({
            id: Date.now().toString(),
            type: 'error',
            title: 'Gagal Menambahkan Video',
            message: response.message || 'Terjadi kesalahan saat menambahkan video',
            timestamp: new Date().toISOString(),
            autoClose: true,
            duration: 5000
          })
        }
      }
    } catch (error) {
      console.error('Failed to save video:', error)
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Terjadi kesalahan sistem saat menyimpan video',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (video: VideoResponse) => {
    setEditingVideo(video)
    setFormData({
      title: video.title || '',
      description: video.description || '',
      youtubeUrl: video.youtubeUrl || '',
      isActive: video.isActive ?? true,
      isFeatured: video.isFeatured ?? false,
      tags: Array.isArray(video.tags) ? video.tags.join(', ') : (video.tags || ''),
      category: video.category || 'general'
    })
    setShowForm(true)
  }

  const handleDelete = async (videoId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus video ini?')) {
      try {
        const response = await apiRepository.videos.deleteVideo(videoId)
        if (response.success) {
          ui.addNotification({
            id: Date.now().toString(),
            type: 'success',
            title: 'Video Dihapus',
            message: 'Video berhasil dihapus',
            timestamp: new Date().toISOString(),
            autoClose: true,
            duration: 3000
          })
          await loadVideos()
        } else {
          ui.addNotification({
            id: Date.now().toString(),
            type: 'error',
            title: 'Gagal Menghapus Video',
            message: response.message || 'Terjadi kesalahan saat menghapus video',
            timestamp: new Date().toISOString(),
            autoClose: true,
            duration: 5000
          })
        }
      } catch (error) {
        console.error('Failed to delete video:', error)
        ui.addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Terjadi kesalahan saat menghapus video',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
      }
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingVideo(null)
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      isActive: true,
      isFeatured: false,
      tags: '',
      category: 'general'
    })
  }

  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.accent }}></div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border + '30'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.cardText
                  }}
                >
                  <FaArrowLeft size={16} />
                  <span>Kembali</span>
                </button>
              )}
              <div>
                <h1
                  className="text-2xl font-bold flex items-center gap-3"
                  style={{
                    color: colors.cardText,
                    fontFamily: 'var(--font-header-modern)'
                  }}
                >
                  <FaVideo className="text-2xl" style={{ color: colors.accent }} />
                  Manajemen Video
                </h1>
                <p
                  className="text-sm"
                  style={{ color: colors.detail }}
                >
                  Kelola video YouTube untuk ditampilkan di website
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: colors.accent,
                color: 'white'
              }}
            >
              <FaPlus size={16} />
              <span>Tambah Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border shadow-lg overflow-hidden"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <FaVideo className="text-white" />
              <span>{editingVideo ? 'Edit Video' : 'Tambah Video Baru'}</span>
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {editingVideo ? 'Perbarui informasi video yang dipilih' : 'Isi form di bawah untuk menambahkan video YouTube baru'}
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Video URL Field dengan Preview */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                  <FaYoutube className="text-red-500" />
                  <span>URL YouTube</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-0 focus:border-blue-500"
                    style={{ 
                      backgroundColor: colors.card, 
                      borderColor: formData.youtubeUrl ? colors.border : '#e5e7eb',
                      color: colors.cardText 
                    }}
                    required
                  />
                  {formData.youtubeUrl && extractVideoId(formData.youtubeUrl) && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Preview Thumbnail:</p>
                      <img
                        src={`https://img.youtube.com/vi/${extractVideoId(formData.youtubeUrl)}/mqdefault.jpg`}
                        alt="Video Thumbnail"
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Title Field */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                  <span>📝</span>
                  <span>Judul Video</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul video yang menarik"
                  className="w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-0 focus:border-blue-500"
                  style={{ 
                    backgroundColor: colors.card, 
                    borderColor: formData.title ? colors.border : '#e5e7eb',
                    color: colors.cardText 
                  }}
                  required
                />
                <p className="text-xs text-gray-500">
                  {formData.title.length}/100 karakter
                </p>
              </div>

              {/* Description Field */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                  <span>📄</span>
                  <span>Deskripsi</span>
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Jelaskan konten video secara singkat dan menarik"
                  className="w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-0 focus:border-blue-500 resize-none"
                  style={{ 
                    backgroundColor: colors.card, 
                    borderColor: formData.description ? colors.border : '#e5e7eb',
                    color: colors.cardText 
                  }}
                  required
                />
                <p className="text-xs text-gray-500">
                  {(formData.description || '').length}/500 karakter
                </p>
              </div>

              {/* Two Column Layout for Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Field */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                    <FaTag className="text-blue-500" />
                    <span>Kategori</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-0 focus:border-blue-500"
                    style={{ 
                      backgroundColor: colors.card, 
                      borderColor: colors.border,
                      color: colors.cardText 
                    }}
                  >
                    <option value="general">🔵 Umum</option>
                    <option value="kajian">📖 Kajian</option>
                    <option value="ceramah">🎤 Ceramah</option>
                    <option value="tilawah">🕌 Tilawah</option>
                    <option value="tutorial">🎓 Tutorial</option>
                    <option value="event">🎉 Event</option>
                  </select>
                </div>

                {/* Tags Field */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                    <span>🏷️</span>
                    <span>Tags</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="islam, kajian, ramadan"
                    className="w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-0 focus:border-blue-500"
                    style={{ 
                      backgroundColor: colors.card, 
                      borderColor: colors.border,
                      color: colors.cardText 
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    Pisahkan dengan koma (,)
                  </p>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-800 mb-3">Pengaturan Video</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Active Toggle */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h5 className="font-medium text-gray-800">Status Publikasi</h5>
                        <p className="text-sm text-gray-500">
                          {formData.isActive ? 'Video akan tampil di publik' : 'Video tersembunyi dari publik'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${formData.isFeatured ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h5 className="font-medium text-gray-800">Video Unggulan</h5>
                        <p className="text-sm text-gray-500">
                          {formData.isFeatured ? 'Akan ditampilkan dengan prioritas' : 'Tampil dengan urutan normal'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-6 py-3 rounded-lg border-2 transition-all hover:bg-gray-50 font-medium"
                  style={{ borderColor: colors.border, color: colors.cardText }}
                >
                  ❌ Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-lg transition-all font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>{editingVideo ? '✏️ Update Video' : '➕ Simpan Video'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg overflow-hidden"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <div className="aspect-video bg-gray-200 relative">
              {extractVideoId(video.youtubeUrl) && (
                <img
                  src={`https://img.youtube.com/vi/${extractVideoId(video.youtubeUrl)}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2">
                <FaYoutube className="text-red-500 text-xl" />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold line-clamp-2 flex-1" style={{ color: colors.cardText }}>
                  {video.title}
                </h3>
                {video.isFeatured && (
                  <FaStar className="text-yellow-500 ml-2 flex-shrink-0" title="Video Unggulan" />
                )}
              </div>
              
              <p className="text-sm mb-3 line-clamp-2" style={{ color: colors.detail }}>
                {video.description}
              </p>

              {/* Category & Tags */}
              <div className="mb-3 space-y-1">
                <div className="flex items-center gap-1">
                  <FaTag className="text-xs" style={{ color: colors.detail }} />
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {video.category || 'Umum'}
                  </span>
                </div>
                {video.tags && (
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(video.tags) ? video.tags : (video.tags as string).split(',')).map((tag: string, index: number) => (
                      <span key={index} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                        {typeof tag === 'string' ? tag.trim() : tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <span className={`px-2 py-1 text-xs rounded ${video.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {video.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                  {video.isFeatured && (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                      Unggulan
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 rounded-lg transition-colors text-red-500 bg-red-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {videos.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FaVideo className="text-4xl mx-auto mb-4" style={{ color: colors.detail }} />
          <p style={{ color: colors.detail }}>Belum ada video yang tersedia</p>
          <p className="text-sm mt-2" style={{ color: colors.detail }}>
            Klik "Tambah Video" untuk menambahkan video YouTube
          </p>
        </div>
      )}
      </div>
    </div>
  )
}
