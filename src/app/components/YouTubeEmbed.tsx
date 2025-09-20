'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaPause, FaVolumeUp, FaExpand, FaYoutube } from 'react-icons/fa'

interface YouTubeEmbedProps {
    youtubeUrl: string
    title?: string
    thumbnail?: string
    autoplay?: boolean
    controls?: boolean
    responsive?: boolean
    width?: number
    height?: number
    className?: string
    onReady?: () => void
    onPlay?: () => void
    onPause?: () => void
    onEnd?: () => void
}

export default function YouTubeEmbed({
    youtubeUrl,
    title = 'YouTube Video',
    thumbnail,
    autoplay = false,
    controls = true,
    responsive = true,
    width = 560,
    height = 315,
    className = '',
    onReady,
    onPlay,
    onPause,
    onEnd
}: YouTubeEmbedProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [showPlayer, setShowPlayer] = useState(autoplay)
    const [isLoading, setIsLoading] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ]
        
        for (const pattern of patterns) {
            const match = url.match(pattern)
            if (match && match[1]) {
                return match[1]
            }
        }
        return null
    }

    // Get YouTube thumbnail URL
    const getYouTubeThumbnail = (url: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string => {
        const videoId = getYouTubeVideoId(url)
        if (!videoId) return '/images/video-placeholder.png'
        
        const qualityMap = {
            default: 'default',
            medium: 'mqdefault', 
            high: 'hqdefault',
            maxres: 'maxresdefault'
        }
        
        return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
    }

    // Generate embed URL with parameters
    const getEmbedUrl = (): string => {
        const videoId = getYouTubeVideoId(youtubeUrl)
        if (!videoId) return ''
        
        const params = new URLSearchParams({
            enablejsapi: '1',
            controls: controls ? '1' : '0',
            autoplay: autoplay ? '1' : '0',
            modestbranding: '1',
            rel: '0',
            fs: '1',
            cc_load_policy: '0',
            iv_load_policy: '3',
            autohide: '0'
        })
        
        return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
    }

    const handlePlayClick = () => {
        setIsLoading(true)
        setShowPlayer(true)
        setIsPlaying(true)
        onPlay?.()
    }

    const handleIframeLoad = () => {
        setIsLoading(false)
        onReady?.()
    }

    const videoId = getYouTubeVideoId(youtubeUrl)
    const thumbnailUrl = thumbnail || getYouTubeThumbnail(youtubeUrl)
    const embedUrl = getEmbedUrl()

    if (!videoId) {
        return (
            <div 
                className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
                style={{ width: responsive ? '100%' : width, height: responsive ? 'auto' : height, aspectRatio: responsive ? '16/9' : 'auto' }}
            >
                <div className="text-center text-gray-500">
                    <FaYoutube size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Invalid YouTube URL</p>
                </div>
            </div>
        )
    }

    if (!showPlayer) {
        return (
            <motion.div
                className={`relative group cursor-pointer overflow-hidden rounded-lg shadow-lg ${className}`}
                style={{ 
                    width: responsive ? '100%' : width, 
                    height: responsive ? 'auto' : height,
                    aspectRatio: responsive ? '16/9' : 'auto'
                }}
                onClick={handlePlayClick}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                {/* Thumbnail */}
                <img
                    src={thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/video-placeholder.png'
                    }}
                />
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-700 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlay className="text-white ml-1" size={24} />
                    </motion.div>
                </div>
                
                {/* YouTube logo */}
                <div className="absolute top-3 right-3 opacity-70 group-hover:opacity-100 transition-opacity">
                    <FaYoutube className="text-red-600" size={24} />
                </div>
                
                {/* Title overlay (optional) */}
                {title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                        <h3 className="text-white font-medium text-sm md:text-base line-clamp-2">
                            {title}
                        </h3>
                    </div>
                )}
            </motion.div>
        )
    }

    return (
        <div 
            className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
            style={{ 
                width: responsive ? '100%' : width, 
                height: responsive ? 'auto' : height,
                aspectRatio: responsive ? '16/9' : 'auto'
            }}
        >
            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            
            {/* YouTube iframe */}
            <iframe
                ref={iframeRef}
                src={embedUrl}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
                onLoad={handleIframeLoad}
            />
        </div>
    )
}

// Utility component for video lists/grids
interface VideoGridProps {
    videos: Array<{
        id: string
        title: string
        youtubeUrl: string
        thumbnail?: string
        description?: string
        duration?: string
        viewCount?: number
    }>
    onVideoSelect?: (video: any) => void
    columns?: 1 | 2 | 3 | 4
    showMetadata?: boolean
    className?: string
}

export function VideoGrid({ 
    videos, 
    onVideoSelect, 
    columns = 3, 
    showMetadata = true,
    className = '' 
}: VideoGridProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }

    return (
        <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
            {videos.map((video, index) => (
                <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group"
                >
                    <YouTubeEmbed
                        youtubeUrl={video.youtubeUrl}
                        title={video.title}
                        thumbnail={video.thumbnail}
                        responsive={true}
                        onPlay={() => onVideoSelect?.(video)}
                        className="mb-3"
                    />
                    
                    {showMetadata && (
                        <div className="space-y-2">
                            <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {video.title}
                            </h3>
                            
                            {video.description && (
                                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                                    {video.description}
                                </p>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                {video.duration && (
                                    <span>{video.duration}</span>
                                )}
                                {video.viewCount && (
                                    <span>{video.viewCount.toLocaleString()} views</span>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    )
}

// Playlist component for showing a main video with list of related videos
interface VideoPlaylistProps {
    mainVideo: {
        id: string
        title: string
        youtubeUrl: string
        description?: string
    }
    relatedVideos: Array<{
        id: string
        title: string
        youtubeUrl: string
        thumbnail?: string
        duration?: string
    }>
    onVideoChange?: (video: any) => void
    className?: string
}

export function VideoPlaylist({ 
    mainVideo, 
    relatedVideos, 
    onVideoChange,
    className = '' 
}: VideoPlaylistProps) {
    return (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
            {/* Main video player */}
            <div className="lg:col-span-2">
                <YouTubeEmbed
                    youtubeUrl={mainVideo.youtubeUrl}
                    title={mainVideo.title}
                    responsive={true}
                    autoplay={false}
                    className="mb-4"
                />
                
                <div>
                    <h2 className="text-xl font-bold mb-2">{mainVideo.title}</h2>
                    {mainVideo.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {mainVideo.description}
                        </p>
                    )}
                </div>
            </div>
            
            {/* Related videos list */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg mb-4">Video Lainnya</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {relatedVideos.map((video) => (
                        <div
                            key={video.id}
                            className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => onVideoChange?.(video)}
                        >
                            <div className="flex-shrink-0 w-20 h-14 relative overflow-hidden rounded">
                                <img
                                    src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeUrl.split('v=')[1]?.split('&')[0]}/mqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FaPlay className="text-white text-xs" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium line-clamp-2 mb-1">
                                    {video.title}
                                </h4>
                                {video.duration && (
                                    <span className="text-xs text-gray-500">
                                        {video.duration}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}