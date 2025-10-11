'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaVideo, FaPlay, FaSearch, FaFilter, FaTimes, FaArrowLeft, FaHome } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'
import YouTubeEmbed, { VideoGrid, VideoPlaylist } from '@/app/components/YouTubeEmbed'
import { apiRepository } from '@/app/repositories/apiRepository'
import { VideoResponse } from '@/app/types/responseTypes'

interface VideoGalleryPageProps {
    showHeader?: boolean
    maxVideos?: number
}

export default function VideoGalleryPage({ showHeader = true, maxVideos }: VideoGalleryPageProps) {
    const { colors } = useTheme()
    const router = useRouter()
    const [videos, setVideos] = useState<VideoResponse[]>([])
    const [featuredVideos, setFeaturedVideos] = useState<VideoResponse[]>([])
    const [selectedVideo, setSelectedVideo] = useState<VideoResponse | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'playlist'>('grid')
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [playingVideo, setPlayingVideo] = useState<VideoResponse | null>(null)
    const [showFullDescription, setShowFullDescription] = useState(false)

    useEffect(() => {
        loadVideos()
    }, [])

    const loadVideos = async () => {
        setIsLoading(true)
        try {
            console.log('🔄 Starting to load videos...')
            const response = await apiRepository.videos.getVideos()
            console.log('🎥 Video API Response:', response)
            
            if (response.success && response.data) {
                let videoList: VideoResponse[] = []
                
                if (response.data.data && Array.isArray(response.data.data)) {
                    // Standard backend pagination structure (sama seperti admin)
                    videoList = response.data.data
                    console.log('📹 Using response.data.data:', videoList.length, 'videos')
                    console.log('📹 First video sample:', videoList[0])
                } else if (Array.isArray(response.data)) {
                    // Direct array response (fallback)
                    videoList = response.data
                    console.log('📹 Using response.data (direct array):', videoList.length, 'videos')
                } else {
                    console.warn('❌ Unexpected video data structure:', response.data)
                    videoList = []
                }
                
                console.log('📹 Raw video list length:', videoList.length)
                console.log('📹 Raw video list:', videoList)
                
                // PERBAIKAN: Tampilkan semua video seperti di admin, tidak hanya yang aktif
                // Filter hanya untuk memastikan data valid
                const validVideos = videoList.filter((video: VideoResponse) => {
                    const isValid = video && video.id && video.title && video.youtubeUrl
                    console.log(`📹 Checking video "${video?.title}": valid = ${isValid}, isActive = ${video?.isActive}`)
                    return isValid
                })
                console.log('✅ Valid videos count:', validVideos.length)
                console.log('✅ Valid videos:', validVideos)
                
                setVideos(validVideos)
                
                // Set first video as selected for playlist mode
                if (validVideos.length > 0 && !selectedVideo) {
                    setSelectedVideo(validVideos[0])
                    console.log('🎯 Selected first video:', validVideos[0].title)
                }
                
                // Get featured videos (first 6 for grid display)
                setFeaturedVideos(validVideos.slice(0, 6))
                console.log('⭐ Featured videos count:', Math.min(validVideos.length, 6))
            } else {
                console.warn('❌ Failed to load videos:', response)
                setVideos([])
                setFeaturedVideos([])
                setSelectedVideo(null)
            }
        } catch (error) {
            console.error('❌ Error loading videos:', error)
            setVideos([])
            setFeaturedVideos([])
            setSelectedVideo(null)
        } finally {
            setIsLoading(false)
            console.log('🏁 Video loading finished')
        }
    }

    const categories = [
        { value: 'all', label: 'Semua Video' },
        { value: 'kajian', label: 'Kajian' },
        { value: 'ceramah', label: 'Ceramah' },
        { value: 'kegiatan', label: 'Kegiatan' },
        { value: 'tutorial', label: 'Tutorial' }
    ]

    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    // Apply maxVideos limit if specified
    const displayVideos = maxVideos ? filteredVideos.slice(0, maxVideos) : filteredVideos

    const handleVideoPlay = (video: VideoResponse) => {
        setPlayingVideo(video)
        setShowVideoModal(true)
    }

    const closeVideoModal = () => {
        setShowVideoModal(false)
        setPlayingVideo(null)
        setShowFullDescription(false)
    }

    const handleVideoSelect = (video: any) => {
        console.log('🎯 handleVideoSelect called with:', video)
        // Find full video object from our state
        const fullVideo = videos.find(v => v.id === video.id)
        if (fullVideo) {
            console.log('🎯 Setting selected video:', fullVideo.title)
            setSelectedVideo(fullVideo)
            if (viewMode === 'grid') {
                setViewMode('playlist')
            }
            // Scroll to top when video changes
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            console.warn('❌ Could not find full video for:', video)
        }
    }

    const getRelatedVideos = (currentVideo: VideoResponse) => {
        return filteredVideos
            .filter(video => video.id !== currentVideo.id)
            .slice(0, 8)
            .map(video => ({
                id: video.id,
                title: video.title,
                youtubeUrl: video.youtubeUrl,
                thumbnail: video.thumbnailUrl || `https://img.youtube.com/vi/${extractYouTubeVideoId(video.youtubeUrl)}/maxresdefault.jpg`,
                duration: video.duration || '5:30'
            }))
    }

    // Helper function to extract YouTube video ID
    const extractYouTubeVideoId = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : ''
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p style={{ color: colors.cardText }}>Memuat video...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            {/* Header */}
            {showHeader && (
                <div
                    className="border-b"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Back Button */}
                            <div className="mb-6">
                                <button
                                    onClick={() => router.push('/')}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md group"
                                    style={{ 
                                        backgroundColor: colors.accent + '10',
                                        color: colors.accent,
                                        border: `1px solid ${colors.accent}20`
                                    }}
                                >
                                    <FaArrowLeft className="transition-transform group-hover:-translate-x-1" size={16} />
                                    <FaHome size={16} />
                                    <span className="font-medium">Kembali ke Beranda</span>
                                </button>
                            </div>

                            <div className="flex items-center space-x-4 mb-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: '#f59e0b' + '20' }}
                                >
                                    <FaVideo size={24} style={{ color: '#f59e0b' }} />
                                </div>
                                <div>
                                    <h1
                                        className="text-3xl font-bold"
                                        style={{
                                            color: colors.cardText,
                                            fontFamily: 'var(--font-header-modern)'
                                        }}
                                    >
                                        Gallery Video
                                    </h1>
                                    <p
                                        className="text-lg"
                                        style={{
                                            color: colors.detail,
                                            fontFamily: 'var(--font-body)'
                                        }}
                                    >
                                        Koleksi video kajian, ceramah, dan kegiatan Masjid Al-Furqon
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <span style={{ color: colors.detail }}>Total Video:</span>
                                    <span
                                        className="font-semibold"
                                        style={{ color: colors.cardText }}
                                    >
                                        {videos.length}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span style={{ color: colors.detail }}>Total Views:</span>
                                    <span
                                        className="font-semibold"
                                        style={{ color: colors.cardText }}
                                    >
                                        {videos.reduce((total, video) => total + video.viewCount, 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <FaSearch 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                                style={{ color: colors.detail }} 
                                size={16}
                            />
                            <input
                                type="text"
                                placeholder="Cari video..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    color: colors.cardText
                                }}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <FaFilter 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                                style={{ color: colors.detail }} 
                                size={16}
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="pl-10 pr-8 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all appearance-none"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    color: colors.cardText
                                }}
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex rounded-lg border" style={{ borderColor: colors.border }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                                viewMode === 'grid' ? '' : 'hover:bg-opacity-50'
                            }`}
                            style={{
                                backgroundColor: viewMode === 'grid' ? colors.accent : 'transparent',
                                color: viewMode === 'grid' ? 'white' : colors.cardText
                            }}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('playlist')}
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                                viewMode === 'playlist' ? '' : 'hover:bg-opacity-50'
                            }`}
                            style={{
                                backgroundColor: viewMode === 'playlist' ? colors.accent : 'transparent',
                                color: viewMode === 'playlist' ? 'white' : colors.cardText,
                                borderLeft: `1px solid ${colors.border}`
                            }}
                        >
                            Playlist
                        </button>
                    </div>
                </motion.div>

                {(() => {
                    console.log('🎬 Rendering video content. filteredVideos.length:', filteredVideos.length)
                    return null
                })()}
                {filteredVideos.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {(() => {
                            console.log('🎯 View mode:', viewMode, 'Selected video:', selectedVideo?.title)
                            return null
                        })()}
                        
                        {viewMode === 'grid' ? (
                            /* Clean Modern Video Grid Layout */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                {filteredVideos.map((video, index) => (
                                    <motion.div
                                        key={video.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group cursor-pointer"
                                        onClick={() => {
                                            handleVideoPlay(video)
                                        }}
                                    >
                                        <div 
                                            className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                            style={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }}
                                        >
                                            {/* Video Thumbnail */}
                                            <div className="relative aspect-video">
                                                {video.youtubeUrl && (
                                                    <img
                                                        src={video.thumbnailUrl || `https://img.youtube.com/vi/${extractYouTubeVideoId(video.youtubeUrl)}/maxresdefault.jpg`}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                            e.currentTarget.src = `https://img.youtube.com/vi/${extractYouTubeVideoId(video.youtubeUrl)}/hqdefault.jpg`
                                                        }}
                                                    />
                                                )}
                                                
                                                {/* Dark Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                
                                                {/* Video Duration */}
                                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                                                    {video.duration || '05:30'}
                                                </div>
                                                
                                                {/* Featured Badge */}
                                                {video.isFeatured && (
                                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded font-bold flex items-center space-x-1">
                                                        <span>🔥</span>
                                                        <span>UTAMA</span>
                                                    </div>
                                                )}
                                                
                                                {/* Play Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <div className="w-16 h-16 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-200">
                                                        <FaPlay className="text-white ml-1" size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Video Info */}
                                            <div className="p-4">
                                                <h3 
                                                    className="font-bold text-sm mb-2 line-clamp-2 leading-tight"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    {video.title}
                                                </h3>
                                                
                                                {video.description && (
                                                    <p 
                                                        className="text-xs mb-3 line-clamp-2 leading-relaxed"
                                                        style={{ color: colors.detail }}
                                                    >
                                                        {video.description}
                                                    </p>
                                                )}
                                                
                                                <div className="flex items-center justify-between mb-2">
                                                    {/* Category Badge */}
                                                    <span 
                                                        className="px-2 py-1 rounded text-xs font-medium"
                                                        style={{
                                                            backgroundColor: video.category === 'kajian' ? '#3B82F620' : 
                                                                           video.category === 'ceramah' ? '#10B98120' : 
                                                                           video.category === 'tutorial' ? '#F59E0B20' : '#8B5CF620',
                                                            color: video.category === 'kajian' ? '#3B82F6' : 
                                                                  video.category === 'ceramah' ? '#10B981' : 
                                                                  video.category === 'tutorial' ? '#F59E0B' : '#8B5CF6'
                                                        }}
                                                    >
                                                        {video.category || 'kajian'}
                                                    </span>
                                                    
                                                    {/* Views */}
                                                    <span className="text-xs" style={{ color: colors.detail }}>
                                                        {video.viewCount || 0} views
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center justify-between text-xs">
                                                    {/* Status */}
                                                    <div className="flex items-center space-x-1">
                                                        <div className={`w-2 h-2 rounded-full ${video.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
                                                        <span style={{ color: colors.detail }}>
                                                            {video.isActive ? 'Aktif' : 'Draft'}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Date */}
                                                    <span style={{ color: colors.detail }}>
                                                        {new Date(video.createdAt).toLocaleDateString('id-ID', { 
                                                            day: 'numeric', 
                                                            month: 'short' 
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            /* Playlist Mode - using the commented out VideoPlaylist */
                            selectedVideo && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Main video player */}
                                    <div className="lg:col-span-2">
                                        <div className="aspect-video mb-4">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(selectedVideo.youtubeUrl)}?rel=0&modestbranding=1`}
                                                title={selectedVideo.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                                className="w-full h-full rounded-lg"
                                            />
                                        </div>
                                        
                                        <div>
                                            <h2 className="text-xl font-bold mb-2" style={{ color: colors.cardText }}>
                                                {selectedVideo.title}
                                            </h2>
                                            {selectedVideo.description && (
                                                <p className="text-sm leading-relaxed" style={{ color: colors.detail }}>
                                                    {selectedVideo.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Related videos list */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-lg mb-4" style={{ color: colors.cardText }}>Video Lainnya</h3>
                                        <div className="space-y-3 max-h-96 overflow-y-auto">
                                            {filteredVideos.filter(v => v.id !== selectedVideo.id).slice(0, 8).map((video) => (
                                                <div
                                                    key={video.id}
                                                    className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                    onClick={() => setSelectedVideo(video)}
                                                >
                                                    <div className="flex-shrink-0 w-20 h-14 relative overflow-hidden rounded">
                                                        <img
                                                            src={video.thumbnailUrl || `https://img.youtube.com/vi/${extractYouTubeVideoId(video.youtubeUrl)}/mqdefault.jpg`}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <FaPlay className="text-white text-xs" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium line-clamp-2 mb-1" style={{ color: colors.cardText }}>
                                                            {video.title}
                                                        </h4>
                                                        <span className="text-xs" style={{ color: colors.detail }}>
                                                            {video.duration || '00:00'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                        {/* Original VideoGrid/VideoPlaylist - commented out for debugging 
                        {viewMode === 'playlist' && selectedVideo ? (
                            <VideoPlaylist
                                mainVideo={{
                                    id: selectedVideo.id,
                                    title: selectedVideo.title,
                                    youtubeUrl: selectedVideo.youtubeUrl,
                                    description: selectedVideo.description || ''
                                }}
                                relatedVideos={getRelatedVideos(selectedVideo)}
                                onVideoChange={(video) => {
                                    const fullVideo = videos.find(v => v.id === video.id)
                                    if (fullVideo) {
                                        setSelectedVideo(fullVideo)
                                        // Scroll to top when video changes
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                    }
                                }}
                            />
                        ) : (
                            <VideoGrid
                                videos={filteredVideos.map(video => ({
                                    id: video.id,
                                    title: video.title,
                                    youtubeUrl: video.youtubeUrl,
                                    thumbnail: video.thumbnailUrl || `https://img.youtube.com/vi/${extractYouTubeVideoId(video.youtubeUrl)}/maxresdefault.jpg`,
                                    description: video.description || '',
                                    duration: video.duration || '5:30',
                                    viewCount: video.viewCount || 0
                                }))}
                                onVideoSelect={handleVideoSelect}
                                columns={3}
                                showMetadata={true}
                            />
                        )}
                        */}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-16"
                    >
                        <FaVideo 
                            size={64} 
                            className="mx-auto mb-4" 
                            style={{ color: colors.detail + '50' }}
                        />
                        <h3
                            className="text-xl font-bold mb-2"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-header-modern)'
                            }}
                        >
                            Video Tidak Ditemukan
                        </h3>
                        <p
                            className="mb-6"
                            style={{
                                color: colors.detail,
                                fontFamily: 'var(--font-body)'
                            }}
                        >
                            {searchTerm || selectedCategory !== 'all'
                                ? 'Coba ubah kata kunci pencarian atau filter kategori'
                                : 'Belum ada video yang tersedia'
                            }
                        </p>
                        {(searchTerm || selectedCategory !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setSelectedCategory('all')
                                }}
                                className="px-6 py-3 rounded-lg font-medium transition-colors"
                                style={{
                                    backgroundColor: colors.accent,
                                    color: 'white'
                                }}
                            >
                                Reset Filter
                            </button>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Video Modal */}
            {showVideoModal && playingVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        style={{ backgroundColor: colors.card }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.border }}>
                            <h3 className="text-lg font-semibold" style={{ color: colors.cardText }}>
                                {playingVideo.title}
                            </h3>
                            <button
                                onClick={closeVideoModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                style={{ color: colors.cardText }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Video Player */}
                        <div className="aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(playingVideo.youtubeUrl)}?autoplay=1&rel=0&modestbranding=1`}
                                title={playingVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>

                        {/* Video Info */}
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                        {playingVideo.category || 'Video'}
                                    </span>
                                    {playingVideo.isFeatured && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium">
                                            ⭐ Featured
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm" style={{ color: colors.detail }}>
                                    {playingVideo.viewCount || 0} views
                                </span>
                            </div>

                            {playingVideo.description && (
                                <div>
                                    <h4 className="font-medium mb-2" style={{ color: colors.cardText }}>Deskripsi:</h4>
                                    <div className="text-sm leading-relaxed" style={{ color: colors.detail }}>
                                        {showFullDescription ? (
                                            <div>
                                                <p>{playingVideo.description}</p>
                                                <button
                                                    onClick={() => setShowFullDescription(false)}
                                                    className="text-blue-600 hover:text-blue-700 mt-2 text-sm font-medium transition-colors"
                                                >
                                                    Tampilkan lebih sedikit
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <p>
                                                    {playingVideo.description.length > 200 
                                                        ? `${playingVideo.description.substring(0, 200)}...` 
                                                        : playingVideo.description
                                                    }
                                                </p>
                                                {playingVideo.description.length > 200 && (
                                                    <button
                                                        onClick={() => setShowFullDescription(true)}
                                                        className="text-blue-600 hover:text-blue-700 mt-2 text-sm font-medium transition-colors"
                                                    >
                                                        Baca selengkapnya
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm" style={{ borderColor: colors.border, color: colors.detail }}>
                                <span>📅 {new Date(playingVideo.createdAt).toLocaleDateString('id-ID')}</span>
                                <a
                                    href={playingVideo.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                                >
                                    <span>Buka di YouTube</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}