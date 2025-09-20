import { useState, useEffect, useCallback } from 'react';
import { 
  grahaRepository, 
  UMKMPartner, 
  GalleryItem, 
  FAQ, 
  FacilityInfo,
  CreateUMKMPartnerRequest,
  CreateGalleryItemRequest,
  CreateFAQRequest,
  UpdateFacilityInfoRequest
} from '../repositories/grahaRepository';

export interface UseGrahaState {
  umkmPartners: UMKMPartner[];
  gallery: GalleryItem[];
  faqs: FAQ[];
  facilityInfo: FacilityInfo | null;
  loading: {
    umkmPartners: boolean;
    gallery: boolean;
    faqs: boolean;
    facilityInfo: boolean;
  };
  error: {
    umkmPartners: string | null;
    gallery: string | null;
    faqs: string | null;
    facilityInfo: string | null;
  };
}

export interface UseGrahaActions {
  // Fetch functions
  fetchUMKMPartners: () => Promise<void>;
  fetchGallery: (category?: string) => Promise<void>;
  fetchFAQs: () => Promise<void>;
  fetchFacilityInfo: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  
  // Create functions
  createUMKMPartner: (data: CreateUMKMPartnerRequest) => Promise<UMKMPartner | null>;
  createGalleryItem: (data: CreateGalleryItemRequest) => Promise<GalleryItem | null>;
  createFAQ: (data: CreateFAQRequest) => Promise<FAQ | null>;
  updateFacilityInfo: (data: UpdateFacilityInfoRequest) => Promise<FacilityInfo | null>;
  
  // Update functions
  updateUMKMPartner: (id: string, data: CreateUMKMPartnerRequest) => Promise<UMKMPartner | null>;
  updateGalleryItem: (id: string, data: CreateGalleryItemRequest) => Promise<GalleryItem | null>;
  updateFAQ: (id: string, data: CreateFAQRequest) => Promise<FAQ | null>;
  
  // Delete functions
  deleteUMKMPartner: (id: string) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  
  // Filter functions
  getGalleryByCategory: (category: string) => GalleryItem[];
  getUMKMPartnersByCategory: (category: string) => UMKMPartner[];
  
  // Reset functions
  clearErrors: () => void;
}

export function useGraha(): UseGrahaState & UseGrahaActions {
  const [state, setState] = useState<UseGrahaState>({
    umkmPartners: [],
    gallery: [],
    faqs: [],
    facilityInfo: null,
    loading: {
      umkmPartners: false,
      gallery: false,
      faqs: false,
      facilityInfo: false,
    },
    error: {
      umkmPartners: null,
      gallery: null,
      faqs: null,
      facilityInfo: null,
    },
  });

  const setLoading = useCallback((key: keyof UseGrahaState['loading'], value: boolean) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [key]: value }
    }));
  }, []);

  const setError = useCallback((key: keyof UseGrahaState['error'], value: string | null) => {
    setState(prev => ({
      ...prev,
      error: { ...prev.error, [key]: value }
    }));
  }, []);

  const fetchUMKMPartners = useCallback(async () => {
    setLoading('umkmPartners', true);
    setError('umkmPartners', null);
    
    try {
      const partners = await grahaRepository.getUMKMPartners();
      setState(prev => ({ ...prev, umkmPartners: partners }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat mitra UMKM';
      setError('umkmPartners', errorMessage);
      console.error('Error fetching UMKM partners:', error);
    } finally {
      setLoading('umkmPartners', false);
    }
  }, [setLoading, setError]);

  const fetchGallery = useCallback(async (category?: string) => {
    setLoading('gallery', true);
    setError('gallery', null);
    
    try {
      const gallery = await grahaRepository.getGallery(category);
      setState(prev => ({ ...prev, gallery }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat galeri';
      setError('gallery', errorMessage);
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading('gallery', false);
    }
  }, [setLoading, setError]);

  const fetchFAQs = useCallback(async () => {
    setLoading('faqs', true);
    setError('faqs', null);
    
    try {
      const faqs = await grahaRepository.getFAQs();
      setState(prev => ({ ...prev, faqs }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat FAQ';
      setError('faqs', errorMessage);
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading('faqs', false);
    }
  }, [setLoading, setError]);

  const fetchFacilityInfo = useCallback(async () => {
    setLoading('facilityInfo', true);
    setError('facilityInfo', null);
    
    try {
      const facilityInfo = await grahaRepository.getFacilityInfo();
      setState(prev => ({ ...prev, facilityInfo }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat informasi fasilitas';
      setError('facilityInfo', errorMessage);
      console.error('Error fetching facility info:', error);
    } finally {
      setLoading('facilityInfo', false);
    }
  }, [setLoading, setError]);

  const fetchAllData = useCallback(async () => {
    await Promise.allSettled([
      fetchUMKMPartners(),
      fetchGallery(),
      fetchFAQs(),
      fetchFacilityInfo()
    ]);
  }, [fetchUMKMPartners, fetchGallery, fetchFAQs, fetchFacilityInfo]);

  const createUMKMPartner = useCallback(async (data: CreateUMKMPartnerRequest): Promise<UMKMPartner | null> => {
    try {
      const newPartner = await grahaRepository.createUMKMPartner(data);
      setState(prev => ({
        ...prev,
        umkmPartners: [...prev.umkmPartners, newPartner].sort((a, b) => a.orderIndex - b.orderIndex)
      }));
      return newPartner;
    } catch (error) {
      console.error('Error creating UMKM partner:', error);
      throw error;
    }
  }, []);

  const createGalleryItem = useCallback(async (data: CreateGalleryItemRequest): Promise<GalleryItem | null> => {
    try {
      const newItem = await grahaRepository.createGalleryItem(data);
      setState(prev => ({
        ...prev,
        gallery: [...prev.gallery, newItem].sort((a, b) => a.orderIndex - b.orderIndex)
      }));
      return newItem;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  }, []);

  const createFAQ = useCallback(async (data: CreateFAQRequest): Promise<FAQ | null> => {
    try {
      const newFAQ = await grahaRepository.createFAQ(data);
      setState(prev => ({
        ...prev,
        faqs: [...prev.faqs, newFAQ].sort((a, b) => a.orderIndex - b.orderIndex)
      }));
      return newFAQ;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }, []);

  const updateFacilityInfo = useCallback(async (data: UpdateFacilityInfoRequest): Promise<FacilityInfo | null> => {
    try {
      const updatedInfo = await grahaRepository.updateFacilityInfo(data);
      setState(prev => ({ ...prev, facilityInfo: updatedInfo }));
      return updatedInfo;
    } catch (error) {
      console.error('Error updating facility info:', error);
      throw error;
    }
  }, []);

  // Update functions
  const updateUMKMPartner = useCallback(async (id: string, data: CreateUMKMPartnerRequest): Promise<UMKMPartner | null> => {
    try {
      const updatedPartner = await grahaRepository.updateUMKMPartner(id, data);
      setState(prev => ({
        ...prev,
        umkmPartners: prev.umkmPartners.map(partner => 
          partner.id === id ? updatedPartner : partner
        ).sort((a, b) => a.orderIndex - b.orderIndex)
      }));
      return updatedPartner;
    } catch (error) {
      console.error('Error updating UMKM partner:', error);
      throw error;
    }
  }, []);

  const updateGalleryItem = useCallback(async (id: string, data: CreateGalleryItemRequest): Promise<GalleryItem | null> => {
    try {
      const updatedItem = await grahaRepository.updateGalleryItem(id, data);
      setState(prev => ({
        ...prev,
        gallery: prev.gallery.map(item => 
          item.id === id ? updatedItem : item
        ).sort((a, b) => a.orderIndex - b.orderIndex)
      }));
      return updatedItem;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw error;
    }
  }, []);

  const updateFAQ = useCallback(async (id: string, data: CreateFAQRequest): Promise<FAQ | null> => {
    try {
      const updatedFAQ = await grahaRepository.updateFAQ(id, data);
      setState(prev => ({
        ...prev,
        faqs: prev.faqs.map(faq => 
          faq.id === id ? updatedFAQ : faq
        ).sort((a, b) => a.orderIndex - b.orderIndex)
      }));
      return updatedFAQ;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }, []);

  // Delete functions
  const deleteUMKMPartner = useCallback(async (id: string): Promise<void> => {
    try {
      await grahaRepository.deleteUMKMPartner(id);
      setState(prev => ({
        ...prev,
        umkmPartners: prev.umkmPartners.filter(partner => partner.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting UMKM partner:', error);
      throw error;
    }
  }, []);

  const deleteGalleryItem = useCallback(async (id: string): Promise<void> => {
    try {
      await grahaRepository.deleteGalleryItem(id);
      setState(prev => ({
        ...prev,
        gallery: prev.gallery.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      throw error;
    }
  }, []);

  const deleteFAQ = useCallback(async (id: string): Promise<void> => {
    try {
      await grahaRepository.deleteFAQ(id);
      setState(prev => ({
        ...prev,
        faqs: prev.faqs.filter(faq => faq.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }, []);

  const getGalleryByCategory = useCallback((category: string): GalleryItem[] => {
    return state.gallery.filter(item => item.category === category);
  }, [state.gallery]);

  const getUMKMPartnersByCategory = useCallback((category: string): UMKMPartner[] => {
    return state.umkmPartners.filter(partner => partner.category === category);
  }, [state.umkmPartners]);

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: {
        umkmPartners: null,
        gallery: null,
        faqs: null,
        facilityInfo: null,
      }
    }));
  }, []);

  return {
    ...state,
    fetchUMKMPartners,
    fetchGallery,
    fetchFAQs,
    fetchFacilityInfo,
    fetchAllData,
    createUMKMPartner,
    createGalleryItem,
    createFAQ,
    updateFacilityInfo,
    updateUMKMPartner,
    updateGalleryItem,
    updateFAQ,
    deleteUMKMPartner,
    deleteGalleryItem,
    deleteFAQ,
    getGalleryByCategory,
    getUMKMPartnersByCategory,
    clearErrors,
  };
}