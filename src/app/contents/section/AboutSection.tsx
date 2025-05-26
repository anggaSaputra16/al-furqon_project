'use client'

import React, { useEffect } from 'react'
import { useGuideStore } from '../../stores/guideStore'
import GuideCard from '@/app/components/path/GuideCard'

const AboutSection: React.FC = () => {
  const cards = useGuideStore((state) => state.cards)
  const fetchCards = useGuideStore((state) => state.fetchCards)

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <GuideCard key={card.id} {...card} />
        ))}
      </div>
    </section>
  )
}

export default AboutSection
