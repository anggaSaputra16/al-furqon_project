import React from 'react';
import { useTheme } from '@/context/themeContext';

interface UniversalModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const UniversalModal: React.FC<UniversalModalProps> = ({ open, onClose, title, description, children }) => {
  const { colors } = useTheme();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-200"
      style={{ backgroundColor: colors.background + 'CC' }} // semi-transparent
    >
      <div
        className="rounded-lg shadow-lg p-6 max-w-md w-full relative transition-colors duration-200"
        style={{ backgroundColor: colors.card, color: colors.cardText }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 transition-colors duration-200"
          style={{ color: colors.accent }}
          aria-label="Tutup Modal"
        >
          ×
        </button>
        {title && (
          <h2 className="text-lg font-bold mb-2" style={{ color: colors.cardText }}>{title}</h2>
        )}
        {description && (
          <p className="mb-4" style={{ color: colors.foreground }}>{description}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default UniversalModal;
