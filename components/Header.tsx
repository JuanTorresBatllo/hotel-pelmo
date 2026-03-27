import React, { useState, useEffect } from 'react';
import { ViewType } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { MenuVertical } from './ui/menu-vertical';

interface HeaderProps {
  onNavigate: (view: ViewType) => void;
  activeView: ViewType;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, activeView }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { key: 'rooms', label: t('Rooms') },
    { key: 'dining', label: t('Restaurant') },
    { key: 'activities', label: t('Experiences') },
    { key: 'wellness', label: t('Wellness') },
    { key: 'contact', label: t('Contact') },
  ];

  const [onDarkSection, setOnDarkSection] = useState(false);

  const [onLightSection, setOnLightSection] = useState(true);
  const [hideLogo, setHideLogo] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      // Check if a dark section is at or approaching the viewport top
      const darkSections = document.querySelectorAll('[data-header-transparent]');
      let dark = false;
      for (const section of darkSections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 100) {
          dark = true;
          break;
        }
      }
      setOnDarkSection(dark);

      // Hide logo when on a section with data-hide-logo
      const hideLogoSections = document.querySelectorAll('[data-hide-logo]');
      let shouldHide = false;
      for (const section of hideLogoSections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 100) {
          shouldHide = true;
          break;
        }
      }
      setHideLogo(shouldHide);

      // Detect light background at header position
      const el = document.elementFromPoint(window.innerWidth / 2, 40);
      if (el) {
        let target: Element | null = el;
        let light = false;
        while (target && target !== document.body) {
          const bg = getComputedStyle(target).backgroundColor;
          const match = bg.match(/\d+/g);
          if (match && match.length >= 3) {
            const [r, g, b] = match.map(Number);
            const a = match.length >= 4 ? parseFloat(match[3]) : 1;
            if (a > 0.1 && (r * 0.299 + g * 0.587 + b * 0.114) > 180) {
              light = true;
              break;
            }
          }
          target = target.parentElement;
        }
        setOnLightSection(light);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showBlueBg = scrolled && !onDarkSection;
  const useWhiteText = onDarkSection || !onLightSection;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        showBlueBg ? 'bg-transparent py-3' : 'bg-transparent py-6'
      }`}>
        <div className="w-full px-6 md:px-10 flex items-center justify-between">
          {/* Logo / Hotel Name — extreme left */}
          <button
            onClick={() => { onNavigate('home'); setMenuOpen(false); }}
            className={`text-left group focus:outline-none z-50 flex items-center gap-3 transition-opacity duration-500 ${hideLogo && !menuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            {/* Edelweiss SVG */}
            <svg
              viewBox="0 0 64 64"
              className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-colors duration-300 ${useWhiteText || menuOpen ? 'text-white' : 'text-[#1a1a1a]'}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Center */}
              <circle cx="32" cy="32" r="5" fill="#c5a059" />
              <circle cx="32" cy="32" r="3" fill="#e8d5a3" />
              {/* Petals — 5 around center */}
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <g key={i} transform={`rotate(${angle} 32 32)`}>
                  <ellipse cx="32" cy="16" rx="5.5" ry="12" fill="#f5f0e0" stroke="currentColor" strokeWidth="0.8" opacity="0.95" />
                  <ellipse cx="32" cy="16" rx="2.5" ry="8" fill="none" stroke="#c5a059" strokeWidth="0.5" opacity="0.6" />
                </g>
              ))}
              {/* Inner ring of smaller petals */}
              {[36, 108, 180, 252, 324].map((angle, i) => (
                <g key={`inner-${i}`} transform={`rotate(${angle} 32 32)`}>
                  <ellipse cx="32" cy="20" rx="4" ry="8" fill="#faf7ee" stroke="currentColor" strokeWidth="0.6" opacity="0.8" />
                </g>
              ))}
              {/* Tiny leaves at bottom */}
              <path d="M28 50 Q32 42 36 50 Q32 46 28 50Z" fill="#7a9e5a" opacity="0.7" />
              <path d="M24 48 Q28 44 30 50" stroke="#7a9e5a" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M40 48 Q36 44 34 50" stroke="#7a9e5a" strokeWidth="1" fill="none" opacity="0.5" />
            </svg>
            <div>
              <h1
                className={`text-4xl md:text-5xl tracking-tight font-bold transition-colors duration-300 ${useWhiteText || menuOpen ? 'text-white group-hover:text-white/80' : 'text-[#1a1a1a] group-hover:text-[#1a1a1a]/70'}`}
                style={{ fontFamily: "'Obra Letra', cursive" }}
              >
                Al Pelmo
              </h1>
              <span
                className={`text-sm md:text-base uppercase tracking-[0.3em] font-bold block mt-0.5 ${useWhiteText || menuOpen ? 'text-white/60' : 'text-[#1a1a1a]/50'}`}
                style={{ fontFamily: "'Obra Letra', cursive" }}
              >
                dal 1919
              </span>
            </div>
          </button>

          {/* Hamburger menu toggle — right side */}
          <button
            className="flex flex-col gap-1.5 p-2 z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-[1px] transition-all duration-300 ${menuOpen ? 'bg-white rotate-45 translate-y-[7px]' : useWhiteText ? 'bg-white' : 'bg-[#1a1a1a]'}`} />
            <span className={`w-6 h-[1px] transition-all duration-300 ${menuOpen ? 'bg-white opacity-0' : useWhiteText ? 'bg-white' : 'bg-[#1a1a1a]'}`} />
            <span className={`w-6 h-[1px] transition-all duration-300 ${menuOpen ? 'bg-white -rotate-45 -translate-y-[7px]' : useWhiteText ? 'bg-white' : 'bg-[#1a1a1a]'}`} />
          </button>
        </div>
      </nav>

      {/* Menu Panel — right sidebar, glassmorphism */}
      <div className={`fixed top-0 right-0 h-full w-80 md:w-[420px] z-40 flex flex-col items-start justify-center pl-14 md:pl-20 transition-transform duration-600 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
        style={{ background: 'rgba(10,10,10,0.65)', backdropFilter: 'blur(40px) saturate(1.6)', WebkitBackdropFilter: 'blur(40px) saturate(1.6)' }}
      >
        {/* Subtle left border accent */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#99ccff]/20 to-transparent" />

        <div className="flex flex-col items-start gap-7">
          <MenuVertical
            menuItems={[
              { label: t('Home'), viewKey: 'home' },
              ...navItems.map(item => ({ label: item.label, viewKey: item.key })),
            ]}
            activeView={activeView}
            onNavigate={(key) => { onNavigate(key as ViewType); setMenuOpen(false); }}
          />

          {/* Divider */}
          <div className="w-12 h-px bg-white/10 my-2 ml-6" />

          <div className="ml-6">
            <LanguageSelector position="header" />
          </div>
        </div>
      </div>

      {/* Backdrop — click to close */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: menuOpen ? 'blur(3px)' : 'blur(0px)' }}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Header;