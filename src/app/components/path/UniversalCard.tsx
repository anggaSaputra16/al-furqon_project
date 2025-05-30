import Image from 'next/image';
import { useTheme } from '@/context/themeContext';
import React, { ReactNode } from 'react';

// Type UniversalCardAction didefinisikan ulang di sini agar tidak error import sirkular
export interface UniversalCardAction {
  label: string;
  onClick: () => void;
  color?: string;
}

export interface UniversalCardProps {
  image: string;
  title: string;
  description: string;
  detail?: string;
  badge?: string;
  icon?: ReactNode;
  actions?: UniversalCardAction[];
  children?: React.ReactNode;
  horizontal?: boolean;
  buttonLabel?: string; // legacy support
  onButtonClick?: () => void; // legacy support
  variant?: 'normal' | 'modern'; // NEW: pilih tampilan card
}

const UniversalCard: React.FC<UniversalCardProps> = ({
  image,
  title,
  description,
  detail,
  badge,
  icon,
  actions,
  children,
  horizontal = false,
  buttonLabel,
  onButtonClick,
  variant = 'normal', // default normal
}) => {
  const { colors } = useTheme();
  // Backward compatibility: if buttonLabel is provided, push to actions
  const mergedActions =
    actions && actions.length > 0
      ? actions
      : buttonLabel && onButtonClick
      ? [{ label: buttonLabel, onClick: onButtonClick }]
      : [];

  if (variant === 'modern') {
    // MODERN: gambar sebagai background, overlay gradient hanya di bagian bawah, teks tegas dan kontras
    return (
      <div
        className="relative rounded-xl shadow-md overflow-hidden flex flex-col transition-colors border"
        style={{ background: colors.card, color: colors.cardText, border: `1px solid ${colors.border}` }}
      >
        <div className="relative w-full h-72">
          <Image src={image} alt={title} fill className="object-cover" />
          {/* Overlay gradient hanya di bagian bawah, tidak blur penuh */}
          <div
            className="absolute left-0 bottom-0 w-full pt-12 pb-6 px-8 flex flex-col justify-end"
            style={{
              background: `linear-gradient(to top, ${colors.background}F2 70%, transparent 100%)`,
              minHeight: '50%',
            }}
          >
            <h3 className="font-extrabold text-2xl mb-1" style={{ color: colors.heading, textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>{title}</h3>
            <p className="text-base mb-2 font-medium" style={{ color: colors.cardText, textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>{description}</p>
            {detail && (
              <span className="block text-xs mb-2 font-semibold" style={{ color: colors.detail }}>{detail}</span>
            )}
            {children}
            {mergedActions.length > 0 && (
              <div className="flex gap-2 mt-4">
                {mergedActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className="w-full py-2 rounded-lg font-bold transition shadow-md"
                    style={{
                      background: action.color || colors.accent,
                      color: colors.card,
                      border: `1px solid ${action.color || colors.accent}`,
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // NORMAL: card seperti sebelumnya
  return (
    <div
      className={`rounded-xl shadow-md overflow-hidden flex ${horizontal ? 'flex-row' : 'flex-col'} transition-colors border`}
      style={{
        background: colors.card,
        color: colors.cardText,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className={`relative ${horizontal ? 'w-40 min-w-40 h-40' : 'w-full h-40'}`}>
        <Image src={image} alt={title} fill className="object-cover" />
        {badge && (
          <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-semibold" style={{ background: colors.accent, color: colors.card }}>{badge}</span>
        )}
        {icon && (
          <span className="absolute top-2 right-2 text-2xl">{icon}</span>
        )}
      </div>
      <div className={`p-4 flex-1 flex flex-col justify-between ${horizontal ? 'min-w-0' : ''}`}>
        <div>
          <h3 className="font-semibold text-lg mb-1" style={{ color: colors.heading }}>{title}</h3>
          <p className="text-sm mb-2" style={{ color: colors.cardText + 'cc' }}>{description}</p>
          {detail && (
            <span className="block text-xs mb-2" style={{ color: colors.detail }}>{detail}</span>
          )}
        </div>
        {children}
        {mergedActions.length > 0 && (
          <div className={`flex gap-2 mt-4 ${horizontal ? 'flex-col' : 'flex-row'}`}>
            {mergedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className="w-full py-2 rounded-lg font-semibold transition"
                style={{
                  background: action.color || colors.accent,
                  color: colors.card,
                  border: `1px solid ${action.color || colors.accent}`,
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalCard;
