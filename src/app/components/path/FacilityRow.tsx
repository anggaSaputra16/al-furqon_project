'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/themeContext'
import { useRouter } from 'next/navigation'
import FacilityInfoModal from './FacilityInfoModal'

interface FacilityRowProps {
    id: string
    title: string
    description: string
    detail: string
    image: string
    features: string[]
    index: number
    isReversed?: boolean
}

interface ModalState {
    tataTertib: boolean
    prasarana: boolean
    kapasitas: boolean
    fasilitasUmum: boolean
    programPembelajaran: boolean
    administrasiUmum: boolean
    keuangan: boolean
    humasTi: boolean
}

export default function FacilityRow({
    title,
    description,
    detail,
    image,
    index,
    isReversed = false
}: FacilityRowProps) {
    const { colors } = useTheme()
    const router = useRouter()


    const [modals, setModals] = useState<ModalState>({
        tataTertib: false,
        prasarana: false,
        kapasitas: false,
        fasilitasUmum: false,
        programPembelajaran: false,
        administrasiUmum: false,
        keuangan: false,
        humasTi: false
    })


    const toggleModal = useCallback((modalType: keyof ModalState) => {
        setModals(prev => ({ ...prev, [modalType]: !prev[modalType] }))
    }, [])


    const handleNavigateToKegiatan = useCallback(() => {
        router.push(`/kegiatan?filter=${encodeURIComponent(title)}`)
    }, [router, title])

    const handleNavigateToGaleri = useCallback(() => {
        router.push(`/galeri?filter=${encodeURIComponent(title)}`)
    }, [router, title])


    const facilityType = useMemo(() => {
        if (title === 'Taman Pendidikan Qur\'an') return 'tpq'
        if (title === 'Kesekretariatan DKM') return 'dkm'
        if (title === 'Parkir & Taman Masjid') return 'parking'
        if (isReversed) return 'reversed'
        return 'normal'
    }, [title, isReversed])


    const linkStyle = useMemo(() => ({
        color: colors.accent,
        fontFamily: '"Inter", "Segoe UI", "Arial", sans-serif',
        fontWeight: '700',
        fontSize: '1rem',
        letterSpacing: '0.01em'
    }), [colors.accent])


    const separatorStyle = useMemo(() => ({
        color: colors.border,
        fontWeight: 'bold',
        fontSize: '1.2rem'
    }), [colors.border])


    const ActionLink = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
        <button
            onClick={onClick}
            className="text-blue-600 hover:text-blue-800 font-bold transition-all duration-200 underline underline-offset-2 hover:underline-offset-4 hover:scale-105 active:scale-95"
            style={linkStyle}
        >
            {children}
        </button>
    )


    const Separator = () => <span style={separatorStyle}>•</span>
    const renderActionLinks = (justifyClass: string = 'justify-start') => {
        const commonClass = `flex flex-wrap gap-4 pt-4 ${justifyClass}`

        switch (facilityType) {
            case 'tpq':
                return (
                    <div className={commonClass}>
                        <ActionLink onClick={() => toggleModal('programPembelajaran')}>
                            Program Pembelajaran
                        </ActionLink>
                    </div>
                )

            case 'dkm':
                return (
                    <div className={commonClass}>
                        <ActionLink onClick={() => toggleModal('administrasiUmum')}>
                            Administrasi Umum
                        </ActionLink>
                        <Separator />
                        <ActionLink onClick={() => toggleModal('keuangan')}>
                            Keuangan
                        </ActionLink>
                        <Separator />
                        <ActionLink onClick={() => toggleModal('humasTi')}>
                            Humas & TI
                        </ActionLink>
                    </div>
                )

            case 'parking':

                return null

            case 'reversed':
                return (
                    <div className={commonClass}>
                        <ActionLink onClick={() => toggleModal('tataTertib')}>
                            Tata Tertib & Ketentuan
                        </ActionLink>
                        <Separator />
                        <ActionLink onClick={() => toggleModal('kapasitas')}>
                            Kapasitas
                        </ActionLink>
                        <Separator />
                        <ActionLink onClick={() => toggleModal('fasilitasUmum')}>
                            Fasilitas Umum
                        </ActionLink>
                    </div>
                )

            default:
                return (
                    <div className={commonClass}>
                        <ActionLink onClick={() => toggleModal('tataTertib')}>
                            Tata Tertib & Ketentuan
                        </ActionLink>
                        <Separator />
                        <ActionLink onClick={() => toggleModal('prasarana')}>
                            Sarana & Prasarana
                        </ActionLink>
                    </div>
                )
        }
    }


    const renderNavigationLinks = (justifyClass: string = 'justify-start') => (
        <div className={`flex gap-4 pt-2 sm:pt-3 ${justifyClass}`}>
            <ActionLink onClick={handleNavigateToKegiatan}>
                Artikel Terkait
            </ActionLink>
            <Separator />
            <ActionLink onClick={handleNavigateToGaleri}>
                Galeri
            </ActionLink>
        </div>
    )

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="w-full"
            >
                <div
                    className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 p-6 sm:p-8"
                    style={{
                        backgroundColor: colors.card,
                        border: `1px solid ${colors.border}`
                    }}
                >
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>

                        {/* Content Section */}
                        <div className={`space-y-6 ${isReversed ? 'lg:col-start-2' : ''} order-1 lg:order-none`}>
                            {/* Title */}
                            <h2
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-header-modern)',
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                {title}
                            </h2>

                            {/* Mobile Image - Only visible on mobile */}
                            <div className="lg:hidden flex justify-center items-center">
                                <div className="relative overflow-hidden rounded-2xl group w-full">
                                    <div
                                        className="w-full h-64 sm:h-80 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>

                            {/* Body Text */}
                            <div className="space-y-4">
                                {description.split('\n\n').map((paragraph, idx) => (
                                    <p
                                        key={idx}
                                        className="text-base sm:text-lg leading-relaxed"
                                        style={{
                                            color: colors.detail,
                                            fontFamily: 'var(--font-body)',
                                            lineHeight: '1.7'
                                        }}
                                    >
                                        {paragraph.trim()}
                                    </p>
                                ))}
                            </div>

                            {/* Action Links - Conditional based on title and isReversed */}
                            {renderActionLinks()}

                            {/* Mobile Navigation Links - Only visible on mobile, always at bottom */}
                            <div className="lg:hidden flex justify-start gap-4 pt-2">
                                <ActionLink onClick={handleNavigateToKegiatan}>
                                    Artikel Terkait
                                </ActionLink>
                                <Separator />
                                <ActionLink onClick={handleNavigateToGaleri}>
                                    Galeri
                                </ActionLink>
                            </div>
                        </div>

                        {/* Desktop Image Section - Only visible on lg and up */}
                        <div className={`${isReversed ? 'lg:col-start-1' : ''} space-y-4 hidden lg:flex lg:flex-col lg:justify-center lg:items-center order-2 lg:order-none`}>
                            {/* Main Image */}
                            <div className="relative overflow-hidden rounded-2xl group w-full max-w-lg">
                                <div
                                    className="w-full h-64 sm:h-80 lg:h-96 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Desktop Navigation Links positioned below image - Conditional based on isReversed */}
                            <div className="w-full max-w-lg">
                                {!isReversed ? (

                                    renderNavigationLinks('justify-end')
                                ) : (

                                    renderNavigationLinks('justify-start')
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Modals */}
            <FacilityInfoModal
                isOpen={modals.tataTertib}
                onClose={() => toggleModal('tataTertib')}
                type="tata-tertib"
                facilityName={title}
            />

            <FacilityInfoModal
                isOpen={modals.prasarana}
                onClose={() => toggleModal('prasarana')}
                type="prasarana"
                facilityName={title}
            />

            <FacilityInfoModal
                isOpen={modals.kapasitas}
                onClose={() => toggleModal('kapasitas')}
                type="kapasitas"
                facilityName={title}
            />

            <FacilityInfoModal
                isOpen={modals.fasilitasUmum}
                onClose={() => toggleModal('fasilitasUmum')}
                type="fasilitas-umum"
                facilityName={title}
            />

            <FacilityInfoModal
                isOpen={modals.programPembelajaran}
                onClose={() => toggleModal('programPembelajaran')}
                type="program-pembelajaran"
                facilityName={title}
            />

            <FacilityInfoModal
                isOpen={modals.administrasiUmum}
                onClose={() => toggleModal('administrasiUmum')}
                type="administrasi-umum"
                facilityName={title}
            />

            <FacilityInfoModal
                isOpen={modals.keuangan}
                onClose={() => toggleModal('keuangan')}
                type="keuangan"
                facilityName={title}
            />

            <FacilityInfoModal
                isOpen={modals.humasTi}
                onClose={() => toggleModal('humasTi')}
                type="humas-ti"
                facilityName={title}
            />
        </>
    )
}
