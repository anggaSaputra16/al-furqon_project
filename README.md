<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


my-next-zustand-app/
├── public/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Next.js routes
│   ├── stores/             # Zustand state stores
│   ├── hooks/              # Custom hooks if needed
│   ├── styles/             # CSS/SCSS/Tailwind
│   └── utils/              # Helper functions
├── .gitignore
├── package.json
├── next.config.js
└── README.md
=======
# al-furqon_project
>>>>>>> 9bc2be9a64c2abf0ff9ad089f6fbb4f4f9f045c2



response api untuk article :[
  {
    "id": "1",
    "title": "Masjid Besar Al – Furqon",
    "description": "Lantai dua Masjid...",
    "detail": "Ruang ini bukan hanya...",
    "image": "/images/gambar1.jpg",
    "imagePosition": "left",
    "imageSize": "medium",
    "category": "fasilitas",
    "mode": "card",  
    "links": [
      { "label": "Galeri", "href": "#" }
    ]
  },
  {
    "id": "intro-fasilitas",
    "title": "Tentang Fasilitas Masjid Al-Furqon",
    "content": "...",
    "image": "/images/masjid.jpg",
    "imagePosition": "right",
    "imageSize": "large",
    "category": "fasilitas",
    "mode": "detail"
  }
]

"mode": "card/detail" = menentukan component apa yang akan di isi dengan data jika mode card component simple dengan modal avtivity dan jika detail akan mode detail akanmenampilkan article yang bisa memuat banyak text selayaknya article pada umumnya.

imageSize": "medium", terdapat 3 pilihan small/medium/dan large

 "imagePosition": "left", terdapat 2 pilihan left dan right 

jika menggunakan mode card data ini  "links": [
      { "label": "Galeri", "href": "#" }
    ] harus ada, 
