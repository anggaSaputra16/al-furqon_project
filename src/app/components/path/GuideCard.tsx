import Image from 'next/image'
import { useTheme } from '@/context/themeContext'

type Props = {
  title: string
  description: string
  image: string
}

export default function GuideCard({ title, description, image }: Props) {
  const { colors } = useTheme()
  return (
    <div
      className="p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
      style={{ background: colors.card, color: colors.cardText }}
    >
      <Image src={image} alt={title} width={200} height={120} className="rounded-md w-full h-32 object-cover" />
      <h3 className="text-lg font-semibold mt-3">{title}</h3>
      <p className="text-sm" style={{ color: colors.cardText + 'cc' }}>{description}</p>
      <button className="mt-2 text-sm font-medium hover:underline" style={{ color: colors.accent }}>See more</button>
    </div>
  )
}
