import React, { useState } from 'react';
import { useMenuStore } from '../../stores/useMenuStore';
import UniversalModal from './UniversalModal';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/themeContext';

export type ArticleCardProps = {
  title: string;
  description: string;
  detail: string;
  image: string;
  imagePosition?: 'left' | 'right';
  links?: { label: string; href: string }[];
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  description,
  detail,
  image,
  imagePosition = 'left',
  links = [],
}) => {
  const { menus } = useMenuStore();
  const [modal, setModal] = useState<{ open: boolean; label?: string } | null>(null);
  const router = useRouter();
  const { colors } = useTheme();

  const handleLinkClick = (label: string, href: string, e: React.MouseEvent) => {
    const menu = menus.find((m) => m.title.toLowerCase() === label.toLowerCase());
    if (menu) {
      // Kirim props via query string (misal: ?filter=judul)
      if (menu.slug === 'galeri') {
        router.push(`/${menu.slug}?filter=${encodeURIComponent(title)}`);
      } else {
        router.push(`/${menu.slug}?filter=${encodeURIComponent(title)}`);
      }
    } else {
      e.preventDefault();
      setModal({ open: true, label });
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row rounded-3xl shadow-xl overflow-hidden my-8 transition-colors duration-200 ${
        imagePosition === 'right' ? 'md:flex-row-reverse' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg, #f9f6f2 80%, #e7e1d7 100%)',
        border: '1.5px solid #e7e1d7',
        boxShadow: '0 8px 32px 0 rgba(60, 40, 20, 0.08)',
        color: colors.cardText
      }}
    >
      <div
        className="md:w-1/3 flex items-center justify-center p-6 transition-colors duration-200"
        style={{ background: '#f3ede7' }}
      >
        <img
          src={image}
          alt={title}
          className="object-cover rounded-2xl max-h-56 w-full shadow-md border border-[#e7e1d7]"
          style={{ background: '#f9f6f2' }}
        />
      </div>
      <div className="md:w-2/3 p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-3" style={{ color: '#7c5c3b', letterSpacing: '0.01em' }}>{title}</h3>
          <p className="text-base mb-2 font-semibold" style={{ color: '#b89c7d' }}>{description}</p>
          <p className="mb-6 text-[#6d5c4a] text-[15px] leading-relaxed" style={{ fontWeight: 500 }}>{detail}</p>
        </div>
        {links.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => handleLinkClick(link.label, link.href, e)}
                className="text-base font-semibold hover:underline cursor-pointer transition-colors duration-200"
                style={{ color: '#e29547' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <UniversalModal
        open={!!modal?.open}
        onClose={() => setModal(null)}
        title={modal?.label || 'Info'}
        description={`Halaman untuk "${modal?.label}" belum tersedia atau tidak ditemukan.`}
      />
    </div>
  );
};

export default ArticleCard;
