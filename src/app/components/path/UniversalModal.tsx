import React, { useEffect } from 'react';
import { useTheme } from '@/context/themeContext';

interface UniversalModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  maxWidth?: string;
}

const UniversalModal: React.FC<UniversalModalProps> = ({ open, onClose, title, description, children, maxWidth = 'max-w-md' }) => {
  const { colors } = useTheme();

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center transition-colors duration-200 p-4"
      style={{ backgroundColor: colors.background + 'CC', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden transition-all border border-white/10 max-h-[90vh] overflow-y-auto`}
        style={{ background: colors.card, color: colors.cardText }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="modal-close-button absolute top-3 right-3 z-10 p-3 rounded-full hover:bg-red-500/20 hover:rotate-90 text-2xl font-bold flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
          style={{
            color: colors.accent,
            backgroundColor: `${colors.card}90`,
            border: `2px solid ${colors.accent}30`,
            minWidth: '48px',
            minHeight: '48px',
            lineHeight: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          aria-label="Tutup Modal"
        >
          <span className="flex items-center justify-center w-full h-full">×</span>
        </button>
        {/* Konten Modal modern */}
        <div className="p-6 sm:p-8 pt-16 sm:pt-20">
          {title && (
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 sm:mb-4 drop-shadow-lg pr-8"
              style={{ color: colors.heading }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className="mb-4 text-sm sm:text-base md:text-lg font-medium drop-shadow pr-8"
              style={{ color: colors.cardText + 'cc' }}
            >
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default UniversalModal;
