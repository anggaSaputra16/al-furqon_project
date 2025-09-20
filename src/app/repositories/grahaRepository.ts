import { ApiRepository } from './apiRepository';

interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  error?: string;
}

// Create HttpClient class from apiRepository structure
class HttpClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private timeout: number

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') {
    this.baseUrl = baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl}/api/v1`
    this.timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '15000')
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Client-Version': '1.0.0'
    }
  }

  private getAuthHeaders(endpoint?: string): Record<string, string> {
    // For admin endpoints, use admin_auth token
    if (endpoint && endpoint.includes('/admin/')) {
      const adminAuth = localStorage.getItem('admin_auth')
      if (adminAuth) {
        const parsedAuth = JSON.parse(adminAuth)
        return parsedAuth?.token ? { Authorization: `Bearer ${parsedAuth.token}` } : {}
      }
    }
    
    // For regular endpoints, use alfurqon_token
    const token = localStorage.getItem('alfurqon_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(endpoint),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout)
    }

    try {      
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`[API] Error ${endpoint}`, error)
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : ''
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint
    
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export interface UMKMPartner {
  id: string;
  name: string;
  category: string;
  description: string;
  services: string[];
  contact: {
    phone: string;
    whatsapp: string;
    instagram: string;
  };
  image?: string;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: 'facility' | 'event' | 'ceremony' | 'interior' | 'exterior';
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityInfo {
  id: string;
  title: string;
  description: string;
  capacity: string;
  facilities: string[];
  price: string;
  contact: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUMKMPartnerRequest {
  name: string;
  category: string;
  description: string;
  services: string[];
  contact: {
    phone: string;
    whatsapp: string;
    instagram: string;
  };
  image?: string;
  orderIndex?: number;
}

export interface CreateGalleryItemRequest {
  title: string;
  image: string;
  category: 'facility' | 'event' | 'ceremony' | 'interior' | 'exterior';
  orderIndex?: number;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  orderIndex?: number;
}

export interface UpdateFacilityInfoRequest {
  title: string;
  description: string;
  capacity: string;
  facilities: string[];
  price: string;
  contact: string;
}

export class GrahaRepository {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  // UMKM Partners
  async getUMKMPartners(): Promise<UMKMPartner[]> {
    try {
      const response = await this.httpClient.get<ApiResponse<UMKMPartner[]>>('/graha/umkm-partners');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching UMKM partners:', error);
      throw error;
    }
  }

  async createUMKMPartner(data: CreateUMKMPartnerRequest): Promise<UMKMPartner> {
    try {
      const response = await this.httpClient.post<ApiResponse<UMKMPartner>>('/admin/graha/umkm-partners', data);
      return response.data;
    } catch (error) {
      console.error('Error creating UMKM partner:', error);
      throw error;
    }
  }

  async updateUMKMPartner(id: string, data: CreateUMKMPartnerRequest): Promise<UMKMPartner> {
    try {
      const response = await this.httpClient.put<ApiResponse<UMKMPartner>>(`/admin/graha/umkm-partners/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating UMKM partner:', error);
      throw error;
    }
  }

  async deleteUMKMPartner(id: string): Promise<void> {
    try {
      await this.httpClient.delete<ApiResponse<void>>(`/admin/graha/umkm-partners/${id}`);
    } catch (error) {
      console.error('Error deleting UMKM partner:', error);
      throw error;
    }
  }

  // Gallery
  async getGallery(category?: string): Promise<GalleryItem[]> {
    try {
      const params = category ? { category } : undefined;
      const response = await this.httpClient.get<ApiResponse<GalleryItem[]>>('/graha/gallery', params);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching gallery:', error);
      throw error;
    }
  }

  async createGalleryItem(data: CreateGalleryItemRequest): Promise<GalleryItem> {
    try {
      const response = await this.httpClient.post<ApiResponse<GalleryItem>>('/admin/graha/gallery', data);
      return response.data;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  }

  async updateGalleryItem(id: string, data: CreateGalleryItemRequest): Promise<GalleryItem> {
    try {
      const response = await this.httpClient.put<ApiResponse<GalleryItem>>(`/admin/graha/gallery/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw error;
    }
  }

  async deleteGalleryItem(id: string): Promise<void> {
    try {
      await this.httpClient.delete<ApiResponse<void>>(`/admin/graha/gallery/${id}`);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      throw error;
    }
  }

  // FAQ
  async getFAQs(): Promise<FAQ[]> {
    try {
      const response = await this.httpClient.get<ApiResponse<FAQ[]>>('/graha/faqs');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }

  async createFAQ(data: CreateFAQRequest): Promise<FAQ> {
    try {
      const response = await this.httpClient.post<ApiResponse<FAQ>>('/admin/graha/faqs', data);
      return response.data;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }

  async updateFAQ(id: string, data: CreateFAQRequest): Promise<FAQ> {
    try {
      const response = await this.httpClient.put<ApiResponse<FAQ>>(`/admin/graha/faqs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }

  async deleteFAQ(id: string): Promise<void> {
    try {
      await this.httpClient.delete<ApiResponse<void>>(`/admin/graha/faqs/${id}`);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }

  // Facility Info
  async getFacilityInfo(): Promise<FacilityInfo | null> {
    try {
      const response = await this.httpClient.get<ApiResponse<FacilityInfo | null>>('/graha/facility-info');
      return response.data;
    } catch (error) {
      console.error('Error fetching facility info:', error);
      throw error;
    }
  }

  async updateFacilityInfo(data: UpdateFacilityInfoRequest): Promise<FacilityInfo> {
    try {
      const response = await this.httpClient.put<ApiResponse<FacilityInfo>>('/admin/graha/facility-info', data);
      return response.data;
    } catch (error) {
      console.error('Error updating facility info:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const grahaRepository = new GrahaRepository();