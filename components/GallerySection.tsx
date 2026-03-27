
import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewType } from '../App';
import { WaveText } from './ui/wave-text';

interface SectionData {
  image: string;
  title: string;
  view: ViewType;
}

const sections: SectionData[] = [
  {
    image: '/Pelmo_fotos/room_pelmo_section.jpg',
    title: 'Rooms',
    view: 'rooms',
  },
  {
    image: '/Pelmo_fotos/restaurant_pelmo_section.jpg',
    title: 'Restaurant',
    view: 'dining',
  },
  {
    image: 'https://images.unsplash.com/photo-1733652106206-a944d460920b?w=1920&q=80',
    title: 'Experiences',
    view: 'activities',
  },
  {
    image: '/Pelmo_fotos/spa_section.jpg',
    title: 'Wellness',
    view: 'wellness',
  },
];

interface GallerySectionProps {
  onNavigate?: (view: ViewType) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div>
      {sections.map((section, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <div className="h-[1px] bg-[#99ccff]/20" />}
          <ScrollSection
            section={section}
            index={idx}
            onNavigate={onNavigate}
            t={t}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

interface ScrollSectionProps {
  section: SectionData;
  index: number;
  onNavigate?: (view: ViewType) => void;
  t: (key: string) => string;
}

const hasScrollTimeline = typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()');

const ScrollSection: React.FC<ScrollSectionProps> = ({ section, index, onNavigate, t }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (hasScrollTimeline) { setRevealed(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden snap-section bg-[#f0f1e3]" data-header-transparent>
      {/* Image with clip-path reveal — scroll-driven for modern browsers */}
      <div
        className={`absolute inset-0 ${hasScrollTimeline ? 'sda-clip-up' : 'transition-[clip-path] duration-[1.6s]'}`}
        style={!hasScrollTimeline ? {
          clipPath: revealed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
          transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
        } : undefined}
      >
        <img
          src={section.image}
          alt={t(section.title)}
          className={`w-full h-full object-cover ${hasScrollTimeline ? 'sda-img-ken-burns' : ''}`}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Title — centered, with wave hover effect */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <WaveText
          text={t(section.title)}
          onClick={() => onNavigate?.(section.view)}
          className="text-white font-bold tracking-tight leading-none uppercase"
          style={{
            fontFamily: "'PT Sans', sans-serif",
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            letterSpacing: '-0.02em',
          }}
        />
      </div>

      {/* Discover CTA — bottom center */}
      <div className="absolute bottom-14 left-0 right-0 text-center z-10">
        <button
          onClick={() => onNavigate?.(section.view)}
          className="group inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold uppercase tracking-[0.4em] transition-all duration-500"
        >
          <span>{t('Discover')}</span>
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GallerySection;
