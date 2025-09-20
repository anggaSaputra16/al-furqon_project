import { grahaSubagdjaRepository, UMKMPartner, GalleryImage, FAQ, FacilityInfo } from '../repositories/grahaSubagdjaRepository'

export const grahaSubagdjaUseCases = {
    // Partners
    getPartners: async (): Promise<UMKMPartner[]> => {
        return await grahaSubagdjaRepository.getPartners()
    },
    addPartner: async (data: Partial<UMKMPartner>) => {
        return await grahaSubagdjaRepository.createPartner(data)
    },
    editPartner: async (id: number, data: Partial<UMKMPartner>) => {
        return await grahaSubagdjaRepository.updatePartner(id, data)
    },
    removePartner: async (id: number) => {
        return await grahaSubagdjaRepository.deletePartner(id)
    },

    // Gallery
    getGallery: async (): Promise<GalleryImage[]> => {
        return await grahaSubagdjaRepository.getGallery()
    },
    addGalleryImage: async (data: Partial<GalleryImage>) => {
        return await grahaSubagdjaRepository.createGalleryImage(data)
    },
    editGalleryImage: async (id: number, data: Partial<GalleryImage>) => {
        return await grahaSubagdjaRepository.updateGalleryImage(id, data)
    },
    removeGalleryImage: async (id: number) => {
        return await grahaSubagdjaRepository.deleteGalleryImage(id)
    },

    // FAQ
    getFAQs: async (): Promise<FAQ[]> => {
        return await grahaSubagdjaRepository.getFAQs()
    },
    addFAQ: async (data: Partial<FAQ>) => {
        return await grahaSubagdjaRepository.createFAQ(data)
    },
    editFAQ: async (id: number, data: Partial<FAQ>) => {
        return await grahaSubagdjaRepository.updateFAQ(id, data)
    },
    removeFAQ: async (id: number) => {
        return await grahaSubagdjaRepository.deleteFAQ(id)
    },

    // Facility Info
    getFacilityInfo: async (): Promise<FacilityInfo> => {
        return await grahaSubagdjaRepository.getFacilityInfo()
    },
    updateFacilityInfo: async (data: Partial<FacilityInfo>) => {
        return await grahaSubagdjaRepository.updateFacilityInfo(data)
    }
}
