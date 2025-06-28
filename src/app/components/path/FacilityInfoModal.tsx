'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface FacilityInfoModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'tata-tertib' | 'prasarana' | 'kapasitas' | 'fasilitas-umum' | 'program-pembelajaran' | 'administrasi-umum' | 'keuangan' | 'humas-ti'
    facilityName: string
}

export default function FacilityInfoModal({ isOpen, onClose, type, facilityName }: FacilityInfoModalProps) {
    const { colors } = useTheme()

    const content = {
        'tata-tertib': {
            title: 'Tata Tertib & Ketentuan',
            subtitle: facilityName,
            items: facilityName === 'Graha Subagdja' ? [
                'Setiap pengguna dikenakan kompensasi dalam bentuk INFAQ sesuai ketentuan',
                'INFAQ yang diberikan merupakan sumbangan untuk pengelolaan dan pemeliharaan masjid',
                'Reservasi minimal 2 minggu sebelum tanggal acara',
                'Menjaga kebersihan dan kerapihan fasilitas selama penggunaan',
                'Menggunakan fasilitas sesuai dengan fungsi dan kapasitas yang ditentukan',
                'Berpakaian sopan dan menutup aurat selama berada di area masjid',
                'Tidak membawa minuman beralkohol atau hal-hal yang diharamkan',
                'Mengikuti jadwal penggunaan yang telah disepakati',
                'Bertanggung jawab atas kerusakan fasilitas selama penggunaan',
                'Melaporkan selesai penggunaan kepada petugas masjid'
            ] : [
                'Menjaga kebersihan dan kerapihan fasilitas',
                'Menggunakan fasilitas sesuai dengan fungsinya',
                'Tidak membawa makanan dan minuman ke dalam ruangan',
                'Mematikan atau mengatur mode silent pada perangkat elektronik',
                'Berpakaian sopan dan menutup aurat',
                'Tidak merokok di area fasilitas',
                'Mengikuti jadwal operasional yang telah ditentukan',
                'Bertanggung jawab atas barang bawaan masing-masing',
                'Meminta izin untuk menggunakan fasilitas secara berkelompok',
                'Melaporkan kerusakan atau masalah fasilitas kepada petugas'
            ]
        },
        'prasarana': {
            title: 'Prasarana & Sarana',
            subtitle: facilityName,
            items: [
                'Area parkir yang luas dan aman',
                'Akses jalan yang mudah dijangkau',
                'Sistem keamanan 24 jam',
                'Jaringan WiFi gratis untuk jamaah',
                'Sistem pengeras suara yang jernih',
                'Pencahayaan yang memadai',
                'Ventilasi udara yang baik',
                'Fasilitas toilet yang bersih',
                'Tempat wudhu yang terpisah',
                'Area istirahat yang nyaman'
            ]
        },
        'kapasitas': {
            title: 'Informasi Kapasitas',
            subtitle: facilityName,
            items: facilityName === 'Graha Subagdja' ? [
                'Kapasitas maksimal 300 orang untuk acara resepsi pernikahan',
                'Kapasitas maksimal 200 orang untuk seminar dan rapat kerja',
                'Kapasitas maksimal 150 orang untuk akad nikah',
                'Tersedia meja bundar untuk 8-10 orang per meja',
                'Area stage/panggung untuk acara resepsi',
                'Ruang persiapan pengantin (khusus resepsi)',
                'Area foto dan dokumentasi yang luas',
                'Kapasitas parkir untuk 100 kendaraan',
                'Dapat menampung acara hingga 8 jam',
                'Reservasi minimal 2 minggu sebelum acara'
            ] : [
                'Kapasitas maksimal 300 orang untuk acara resepsi',
                'Kapasitas maksimal 200 orang untuk acara seminar',
                'Kapasitas maksimal 150 orang untuk akad nikah',
                'Tersedia meja bundar untuk 8-10 orang per meja',
                'Area stage/panggung untuk presentasi',
                'Ruang persiapan untuk pengantin (khusus resepsi)',
                'Area foto dan dokumentasi yang luas',
                'Kapasitas parkir untuk 100 kendaraan',
                'Dapat menampung acara hingga 8 jam',
                'Reservasi minimal 2 minggu sebelum acara'
            ]
        },
        'fasilitas-umum': {
            title: 'Fasilitas Umum Tersedia',
            subtitle: facilityName,
            items: facilityName === 'Graha Subagdja' ? [
                'Sistem sound system profesional dengan wireless microphone',
                'Penerangan lampu LED yang dapat dimmer',
                'Meja dan kursi dengan arrangement fleksibel',
                'Area catering dan pantry untuk acara resepsi',
                'Toilet pria dan wanita yang terpisah dan bersih',
                'Tempat wudhu dengan fasilitas air bersih',
                'Ruang persiapan pengantin dengan cermin dan AC',
                'Sistem keamanan CCTV dan petugas keamanan',
                'Area parkir yang luas dan aman',
                'Dekorasi dasar untuk acara pernikahan'
            ] : [
                'Sistem sound system profesional dengan wireless microphone',
                'Proyektor LCD dan layar besar untuk presentasi',
                'Air conditioning (AC) dengan pengaturan suhu otomatis',
                'Penerangan lampu LED yang dapat dimmer',
                'Meja dan kursi dengan arrangement fleksibel',
                'Area catering dan pantry dengan peralatan lengkap',
                'Toilet pria dan wanita yang terpisah',
                'Tempat wudhu dengan fasilitas air bersih',
                'Akses internet WiFi berkecepatan tinggi',
                'Sistem keamanan CCTV dan petugas keamanan'
            ]
        },
        'program-pembelajaran': {
            title: 'Program Pembelajaran TPQ',
            subtitle: facilityName,
            items: [
                'Program Iqro: Pembelajaran membaca Al-Qur\'an dari tingkat dasar',
                'Program Tahfidz: Menghafal Al-Qur\'an dengan metode yang menyenangkan',
                'Pembelajaran Tajwid: Memahami aturan bacaan Al-Qur\'an yang benar',
                'Pendidikan Akhlak: Pembentukan karakter islami pada anak',
                'Pembelajaran Bahasa Arab: Dasar-dasar bahasa Arab untuk memahami Al-Qur\'an',
                'Cerita Nabi dan Sahabat: Kisah inspiratif untuk teladan hidup',
                'Praktik Ibadah: Tata cara shalat, wudhu, dan ibadah harian',
                'Hafalan Doa Sehari-hari: Doa-doa praktis dalam kehidupan',
                'Kegiatan Ramadhan: Program khusus selama bulan suci',
                'Evaluasi Berkala: Penilaian kemajuan setiap santri secara rutin'
            ]
        },
        'administrasi-umum': {
            title: 'Administrasi Umum DKM',
            subtitle: facilityName,
            items: [
                'Pengelolaan surat-menyurat dan korespondensi masjid',
                'Administrasi keanggotaan jamaah dan pengurus masjid',
                'Pengurusan perizinan dan dokumen resmi masjid',
                'Koordinasi dengan instansi pemerintah dan organisasi masyarakat',
                'Pencatatan dan pengarsipan dokumen penting masjid',
                'Administrasi kegiatan rutin dan event masjid',
                'Pengelolaan database jamaah dan pengurus',
                'Koordinasi rapat pengurus dan evaluasi program',
                'Administrasi fasilitas dan inventaris masjid',
                'Pelayanan administrasi kepada jamaah dan masyarakat'
            ]
        },
        'keuangan': {
            title: 'Keuangan DKM',
            subtitle: facilityName,
            items: [
                'Pengelolaan keuangan masjid secara transparan dan akuntabel',
                'Administrasi penerimaan Zakat, Infaq, dan Wakaf (ZIW)',
                'Pencatatan dan pelaporan keuangan bulanan dan tahunan',
                'Pengelolaan dana pembangunan dan pemeliharaan masjid',
                'Koordinasi usaha-usaha ekonomi masjid',
                'Pemberdayaan ekonomi jamaah melalui program ZIW',
                'Audit internal dan eksternal keuangan masjid',
                'Penyusunan anggaran dan rencana keuangan tahunan',
                'Pengelolaan investasi dan asset masjid',
                'Pelaporan keuangan kepada jamaah dan stakeholder'
            ]
        },
        'humas-ti': {
            title: 'Hubungan Masyarakat & TI',
            subtitle: facilityName,
            items: [
                'Pengelolaan komunikasi eksternal dengan masyarakat dan media',
                'Koordinasi protokol dalam acara-acara resmi masjid',
                'Dokumentasi kegiatan dan program masjid',
                'Pengelolaan website dan media sosial masjid',
                'Pengembangan sistem informasi dan teknologi masjid',
                'Publikasi dan promosi program-program masjid',
                'Koordinasi dengan media massa untuk liputan kegiatan',
                'Pengelolaan jaringan internet dan sistem audio visual',
                'Pelatihan teknologi untuk pengurus dan jamaah',
                'Pengembangan aplikasi dan layanan digital masjid'
            ]
        }
    }

    const currentContent = content[type]

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden"
                    style={{ backgroundColor: colors.card }}
                >
                    {/* Header */}
                    <div
                        className="p-6 border-b"
                        style={{ borderColor: colors.border }}
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3
                                    className="text-xl font-bold"
                                    style={{
                                        color: colors.cardText,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    {currentContent.title}
                                </h3>
                                <p
                                    className="text-sm"
                                    style={{
                                        color: colors.accent,
                                        fontFamily: 'var(--font-sharp-bold)'
                                    }}
                                >
                                    {currentContent.subtitle}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                style={{ color: colors.cardText }}
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-96 overflow-y-auto">
                        <div className="space-y-3">
                            {currentContent.items.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    className="flex items-start gap-3"
                                >
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0"
                                        style={{
                                            backgroundColor: colors.accent + '20',
                                            color: colors.accent
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    <p
                                        className="text-sm leading-relaxed"
                                        style={{
                                            color: colors.cardText,
                                            fontFamily: 'var(--font-body)'
                                        }}
                                    >
                                        {item}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="p-6 border-t"
                        style={{ borderColor: colors.border }}
                    >
                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                            style={{
                                backgroundColor: colors.accent,
                                color: 'white',
                                fontFamily: 'var(--font-sharp-bold)'
                            }}
                        >
                            Mengerti
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
