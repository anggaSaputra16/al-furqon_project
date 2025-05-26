'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'
import { CardData } from '@/app/layouts/CardLayout'
import { FaTimes } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface Props {
  data: CardData | null
  onClose: () => void
}

export default function ActivityModal({ data, onClose }: Props) {
  const { colors } = useTheme();
  if (!data) return null;
  return (
    <Transition appear show={!!data} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay background */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0" style={{ backgroundColor: colors.background + 'B3' }} />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-4xl transform overflow-hidden rounded-2xl p-0 shadow-xl transition-all relative"
                style={{ backgroundColor: colors.card, color: colors.cardText }}
              >
                {/* Gambar Background */}
                <div className="relative w-full h-72 sm:h-96 md:h-[420px]">
                  <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Tombol Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full transition z-50 transition-colors duration-200"
                  style={{ backgroundColor: colors.background + 'CC', color: colors.accent }}
                  aria-label="Tutup"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
                {/* Overlay konten */}
                <div
                  className="absolute inset-0 p-6 flex flex-col justify-end transition-colors duration-200"
                  style={{ background: `linear-gradient(to top, ${colors.background}E6, ${colors.background}B3 60%, transparent)` }}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 mb-3"
                    style={{ color: colors.cardText }}
                  >
                    {data.title}
                  </Dialog.Title>
                  <div className="text-sm max-h-60 overflow-y-auto whitespace-pre-line" style={{ color: colors.cardText }}>
                    {data.detail || 'Tidak ada detail tambahan.'}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
