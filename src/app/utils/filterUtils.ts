// utils/filterUtils.ts

export interface FilterState {
  facility?: string
  category?: string
  dateRange?: {
    start: Date
    end: Date
  }
  searchQuery?: string
}

export const parseFilterFromURL = (searchParams: URLSearchParams): FilterState => {
  const filter: FilterState = {}
  
  const facilityFilter = searchParams.get('filter')
  if (facilityFilter) {
    filter.facility = decodeURIComponent(facilityFilter)
  }
  
  const categoryFilter = searchParams.get('category')
  if (categoryFilter) {
    filter.category = decodeURIComponent(categoryFilter)
  }
  
  const searchQuery = searchParams.get('search')
  if (searchQuery) {
    filter.searchQuery = decodeURIComponent(searchQuery)
  }
  
  return filter
}

export const createFilterURL = (baseURL: string, filter: FilterState): string => {
  const url = new URL(baseURL, window.location.origin)
  
  if (filter.facility) {
    url.searchParams.set('filter', encodeURIComponent(filter.facility))
  }
  
  if (filter.category) {
    url.searchParams.set('category', encodeURIComponent(filter.category))
  }
  
  if (filter.searchQuery) {
    url.searchParams.set('search', encodeURIComponent(filter.searchQuery))
  }
  
  return url.pathname + url.search
}

export const getFacilityRelatedContent = (facilityName: string, contentType: 'kegiatan' | 'galeri') => {
  // This function will be used to filter content based on facility
  // For now, return some sample data, but this should integrate with your actual data source
  
  const facilityKeywords = facilityName.toLowerCase().split(' ')
  
  // Return relevant keywords for filtering
  return {
    keywords: facilityKeywords,
    suggestedCategories: getSuggestedCategories(facilityName, contentType)
  }
}

const getSuggestedCategories = (facilityName: string, contentType: 'kegiatan' | 'galeri'): string[] => {
  const facility = facilityName.toLowerCase()
  
  if (contentType === 'kegiatan') {
    if (facility.includes('shalat') || facility.includes('ruang shalat')) {
      return ['ibadah', 'shalat berjamaah', 'kajian']
    }
    if (facility.includes('perpustakaan')) {
      return ['kajian', 'belajar', 'literasi']
    }
    if (facility.includes('aula')) {
      return ['seminar', 'acara', 'pertemuan']
    }
    if (facility.includes('tpq')) {
      return ['pendidikan', 'anak-anak', 'mengaji']
    }
    return ['umum']
  }
  
  if (contentType === 'galeri') {
    if (facility.includes('shalat') || facility.includes('ruang shalat')) {
      return ['ibadah', 'interior masjid']
    }
    if (facility.includes('perpustakaan')) {
      return ['fasilitas', 'interior']
    }
    if (facility.includes('aula')) {
      return ['acara', 'fasilitas']
    }
    if (facility.includes('tpq')) {
      return ['pendidikan', 'anak-anak']
    }
    return ['fasilitas']
  }
  
  return []
}
