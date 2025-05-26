import { create } from 'zustand'

export type Article = {
  id: string
  title: string
  description: string
  detail: string
  image: string
  imagePosition?: 'left' | 'right'
  links?: { label: string; href: string }[]
}

type ArticleStore = {
  articles: Article[]
  addArticle: (article: Article) => void
  removeArticle: (id: string) => void
  setArticles: (articles: Article[]) => void
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articles: [
    {
      id: '1',
      title: 'Masjid Besar Al – Furqon',
      description: 'Lantai dua Masjid Besar Al-Furqon Bekasi Barat secara khusus diperuntukkan sebagai ruang ibadah yang tenang dan penuh kekhusyukan bagi para jamaah serta tamu-tamu Allah yang datang dari berbagai penjuru.',
      detail: 'Ruang ini bukan hanya menjadi tempat sujud dan i’tikaf, tetapi juga memberikan nilai lebih sebagai tempat silaturahmi dan kebersamaan tumbuh berdampingan. Di sinilah umat Islam saling belajar, saling memperkuat ukhuwah dan suasana khidmat yang indah terasa.',
      image: '/images/gambar1.jpg',
      imagePosition: 'left',
      links: [
        { label: 'Galeri', href: '#' },
        { label: 'Artikel Terkait', href: '#' },
        { label: 'Tata Tertib & Ketentuan', href: '#' },
        { label: 'Sarana & Prasarana', href: '#' },
      ],
    },
    {
      id: '2',
      title: 'Graha Subagdja',
      description: 'Fasilitas aula serba guna yang dapat digunakan oleh masyarakat, baik perorangan maupun Lembaga Sosial, Keagamaan dan Lembaga lainnya.',
      detail: 'Aula ini menjadi tempat pilihan untuk berbagai acara penting seperti pertemuan komunitas, kajian, hingga resepsi pernikahan yang berkesan. Area parkir yang luas memberikan kenyamanan bagi para jamaah, sementara ruang belajar TPA menjadi wadah pembinaan generasi Qurani sejak dini.',
      image: '/images/gambar2.jpg',
      imagePosition: 'right',
      links: [
        { label: 'Galeri', href: '#' },
        { label: 'Artikel Terkait', href: '#' },
        { label: 'Kapasitas', href: '#' },
        { label: 'Fasilitas Umum', href: '#' },
      ],
    },
  ],
  addArticle: (article) => set((state) => ({ articles: [...state.articles, article] })),
  removeArticle: (id) => set((state) => ({ articles: state.articles.filter((a) => a.id !== id) })),
  setArticles: (articles) => set({ articles }),
}))
