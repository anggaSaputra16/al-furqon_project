import React from 'react';
import { useTheme } from '@/context/themeContext';

// UniversalModalProps sudah cukup universal, hanya tambahkan maxWidth opsional
interface UniversalModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  maxWidth?: string; // opsional
}

const UniversalModal: React.FC<UniversalModalProps> = ({ open, onClose, title, description, children, maxWidth = 'max-w-md' }) => {
  const { colors } = useTheme();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-200"
      style={{ backgroundColor: colors.background + 'CC', backdropFilter: 'blur(4px)' }}
    >
      <div
        className={`relative w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden transition-all border border-white/10`}
        style={{ background: colors.card, color: colors.cardText }}
      >
        {/* Tombol Close modern */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/40 text-xl font-bold flex items-center justify-center shadow-lg backdrop-blur-md transition"
          style={{ color: colors.accent, width: 40, height: 40, lineHeight: 1 }}
          aria-label="Tutup Modal"
        >
          <span className="flex items-center justify-center w-full h-full">×</span>
        </button>
        {/* Konten Modal modern */}
        <div className="p-8 flex flex-col justify-end min-h-[300px]">
          {title && (
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 drop-shadow-lg" style={{ color: colors.heading }}>{title}</h2>
          )}
          {description && (
            <p className="mb-4 text-base md:text-lg font-medium drop-shadow" style={{ color: colors.cardText + 'cc' }}>{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default UniversalModal;
