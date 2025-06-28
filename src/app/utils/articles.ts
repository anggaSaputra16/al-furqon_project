import { ArticleMode, ImagePosition, ImageSize } from '../types/articleTypes'

export const articles = [
  {
    id: 'intro-fasilitas',
    title: 'Tentang Fasilitas Masjid Al-Furqon',
    description: 'Penjelasan umum tentang fasilitas dan layanan utama Masjid Al-Furqon.',
    content: `
Masjid Besar Al-Furqon, Bekasi Barat bukan hanya tempat ibadah yang luas dan nyaman, tetapi juga pusat kegiatan umat yang menghadirkan berbagai fasilitas penunjang di bawah naungan Yayasan Pondok Mulya Bekasi.

Dilengkapi dengan aula serbaguna Graha Subagdja, masjid ini siap menjadi pilihan untuk berbagai acara penting seperti pertemuan komunitas, kajian, hingga resepsi pernikahan yang berkesan.

Area parkir yang luas memberikan kenyamanan bagi para jamaah, sementara ruang belajar TPO menjadi wadah pembinaan generasi Qurani sejak dini. Tersedia pula ruang keserikatan yang mendukung kolaborasi dan kegiatan sosial masyarakat. Semua hadir dalam suasana yang teduh, bersih, dan penuh berkah.
    `,
    image: '/images/gambar8.jpg',
    imagePosition: ImagePosition.LEFT,
    imageSize: ImageSize.MEDIUM,
    category: 'Fasilitas',
    mode: ArticleMode.DETAIL,
  },
  {
    id: 'masjid-overview',
    title: 'Masjid Besar Al-Furqon',
    tag: 'Profil',
    category: 'Profil',
    content: `Masjid Besar Al-Furqon Bekasi Barat selain sebagai tempat beribadah seperti shalat dan I’tikaf, tetapi merupakan pusat kegiatan interaksi dan kebudayaan antar umat Islam serta menjadi pusat kegiatan keagamaan yang mencerahkan, menginspirasi dan menyatukan komunitas muslim Bekasi barat khususnya dalam kebersamaan, bertoleransi dan pelayanan sosial.

Keberadaan lokasi Masjid Besar Al-Furqon Bekasi yang strategis sehingga menjadi salah satu tujuan tempat beribadah dan kegiatan sosial dan budaya khususnya masyarakat Komplek Harapanbaru dan masyarakat Bekasi Barat sekitarnya.

DKM Masjid Al-Furqon Bekasi Barat di bawah naungan Yayasan Pondok Mulya Bekasi senantiasa dapat memberikan pelayanan yang terbaiknya dan terus berinovasi dan bersinergi untuk pengembangan baik infrastruktur dan sarana diantaranya tersedianya fasilitas Aula Serbaguna, Taman Pendidikan Qur’an serta unit Usaha Koperasi Jamaah dan lain sebagainya.`,
    image: '/images/al-furqon.png',
    imagePosition: ImagePosition.RIGHT,
    imageSize: ImageSize.MEDIUM,
    date: '27 Mei 2025',
    mode: ArticleMode.DETAIL,
  },
  {
    id: '1',
    title: 'Masjid Besar Al – Furqon',
    description: 'Lantai dua Masjid Besar Al-Furqon Bekasi Barat secara khusus diperuntukkan sebagai ruang ibadah.',
    detail: 'Ruang ini bukan hanya menjadi tempat sujud dan i’tikaf, tetapi juga memberikan nilai lebih sebagai tempat silaturahmi.',
    image: '/images/gambar1.jpg',
    imagePosition: ImagePosition.LEFT,
    category: 'Fasilitas',
    mode: ArticleMode.CARD,
    links: [
      { label: 'Galeri', href: '#' },
      { label: 'Artikel Terkait', href: '#' },
      { label: 'Tata Tertib', href: '#' },
      { label: 'Sarana & Prasarana', href: '#' },
    ],
  },
  {
    id: '2',
    title: 'Graha Subagdja',
    description: 'Fasilitas aula serbaguna yang digunakan masyarakat dan lembaga.',
    detail: 'Aula ini cocok untuk berbagai acara penting seperti pertemuan komunitas hingga resepsi pernikahan.',
    image: '/images/gambar2.jpg',
    imagePosition: ImagePosition.RIGHT,
    category: 'Fasilitas',
    mode: ArticleMode.CARD,
    links: [
      { label: 'Galeri', href: '#' },
      { label: 'Artikel Terkait', href: '#' },
      { label: 'Kapasitas', href: '#' },
    ],
  },
  {
    id: '3',
    title: 'Area Parkir Luas',
    description: 'Kenyamanan akses kendaraan bagi jamaah.',
    detail: 'Area parkir masjid mencakup sisi utara dan barat halaman dengan kapasitas ratusan kendaraan.',
    image: '/images/gambar5.jpg',
    imagePosition: ImagePosition.RIGHT,
    category: 'Fasilitas',
    mode: ArticleMode.CARD,
    links: [],
  },
  {
    id: '4',
    title: 'Ruang TPA & TQA',
    description: 'Tempat belajar anak-anak Qurani.',
    detail: 'Fasilitas ruang pendidikan TPA dan TQA untuk generasi Qurani sejak dini.',
    image: '/images/gambar9.jpg',
    imagePosition: ImagePosition.LEFT,
    category: 'Fasilitas',
    mode: ArticleMode.CARD,
    links: [{ label: 'Program Belajar', href: '#' }],
  },
]
