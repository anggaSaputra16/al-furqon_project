
import { HttpClient, apiRepository } from './apiRepository'

export interface UMKMPartner {
    id: number
    name: string
    category: string
    description: string
    services: string[]
    contact: {
        phone: string
        whatsapp: string
        instagram: string
    }
    image: string
}

export interface GalleryImage {
    id: number
    title: string
    image: string
    category: 'facility' | 'event' | 'ceremony'
}

export interface FAQ {
    id: number
    question: string
    answer: string
}

export interface FacilityInfo {
    id: number
    title: string
    description: string
    capacity: string
    facilities: string[]
    price: string
    contact: string
}

export class GrahaSubagdjaRepository {
    private http: HttpClient
    private base = '/graha-subagdja'

    constructor(httpClient: HttpClient) {
        this.http = httpClient
    }

    // Partners
    async getPartners(): Promise<UMKMPartner[]> {
        return this.http.get(`${this.base}/partners`)
    }
    async createPartner(data: Partial<UMKMPartner>) {
        return this.http.post(`${this.base}/partners`, data)
    }
    async updatePartner(id: number, data: Partial<UMKMPartner>) {
        return this.http.put(`${this.base}/partners/${id}`, data)
    }
    async deletePartner(id: number) {
        return this.http.delete(`${this.base}/partners/${id}`)
    }

    // Gallery
    async getGallery(): Promise<GalleryImage[]> {
        return this.http.get(`${this.base}/gallery`)
    }
    async createGalleryImage(data: Partial<GalleryImage>) {
        return this.http.post(`${this.base}/gallery`, data)
    }
    async updateGalleryImage(id: number, data: Partial<GalleryImage>) {
        return this.http.put(`${this.base}/gallery/${id}`, data)
    }
    async deleteGalleryImage(id: number) {
        return this.http.delete(`${this.base}/gallery/${id}`)
    }

    // FAQ
    async getFAQs(): Promise<FAQ[]> {
        return this.http.get(`${this.base}/faq`)
    }
    async createFAQ(data: Partial<FAQ>) {
        return this.http.post(`${this.base}/faq`, data)
    }
    async updateFAQ(id: number, data: Partial<FAQ>) {
        return this.http.put(`${this.base}/faq/${id}`, data)
    }
    async deleteFAQ(id: number) {
        return this.http.delete(`${this.base}/faq/${id}`)
    }

    // Facility Info
    async getFacilityInfo(): Promise<FacilityInfo> {
        return this.http.get(`${this.base}/facility`)
    }
    async updateFacilityInfo(data: Partial<FacilityInfo>) {
        return this.http.put(`${this.base}/facility`, data)
    }
}

export const grahaSubagdjaRepository = new GrahaSubagdjaRepository(apiRepository.httpClient)
