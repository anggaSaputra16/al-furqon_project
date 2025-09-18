'use client'

import { useEffect, useState } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CustomCard from '../components/path/CustomCard'
import { FaInfoCircle } from 'react-icons/fa'
import clsx from 'clsx'

export type CardData = {
  id: string
  title: string
  description: string
  detail?: string
  image: string
  size?: 'small' | 'large'
  target?: number
  collected?: number
}

type Props = {
  cards: CardData[]
  onReorder: (from: number, to: number) => void
  onShowDetail?: (card: CardData) => void
}

function SortableCardWrapper({
  card,
  onShowDetail,
}: {
  card: CardData
  onShowDetail?: (card: CardData) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative group">
      <div {...listeners}>
        <CustomCard {...card} />
      </div>

      <button
        title="Lihat detail kegiatan"
        onClick={(e) => {
          e.stopPropagation()
          onShowDetail?.(card)
        }}
        className="absolute bottom-3 right-3 p-2 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition z-10 opacity-0 group-hover:opacity-100"
        aria-label="Lihat Detail"
      >
        <FaInfoCircle className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function CardLayout({ cards, onReorder, onShowDetail }: Props) {
  const [items, setItems] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cardOrder')
    const defaultOrder = cards.map((c) => c.id)
    if (saved) {
      const parsed = JSON.parse(saved)
      const merged = [...parsed, ...defaultOrder.filter((id) => !parsed.includes(id))]
      setItems(merged)
    } else {
      setItems(defaultOrder)
    }
  }, [cards])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIdx = items.indexOf(active.id)
    const newIdx = items.indexOf(over.id)

    if (oldIdx !== -1 && newIdx !== -1) {
      const newOrder = arrayMove(items, oldIdx, newIdx)
      setItems(newOrder)
      localStorage.setItem('cardOrder', JSON.stringify(newOrder))

      const cardIds = cards.map((c) => c.id)
      const reordered = newOrder.map((id) => cardIds.indexOf(id))
      onReorder(reordered[0], reordered[1])
    }
  }

  const orderedCards = items
    .map((id) => cards.find((c) => c.id === id))
    .filter(Boolean) as CardData[]

  const visibleCards = showAll ? orderedCards : orderedCards.slice(0, 6)

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min grid-flow-dense">
            {visibleCards.map((card) => (
              <div
                key={card.id}
                className={clsx(
                  'break-inside-avoid',
                  card.size === 'large' ? 'row-span-2' : 'row-span-1'
                )}
              >
                <SortableCardWrapper card={card} onShowDetail={onShowDetail} />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {orderedCards.length > 6 && (
        <div className="text-center mt-6">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? 'Sembunyikan' : 'Tampilkan Semua'}
          </button>
        </div>
      )}
    </>
  )
}
