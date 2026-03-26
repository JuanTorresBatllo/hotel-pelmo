
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

interface LanguageSelectorProps {
  position?: 'bottom-left' | 'header';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ position = 'header' }) => {
  const { language, setLanguage, isTranslating } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerClasses = position === 'bottom-left' 
    ? "fixed bottom-8 left-8 z-[100]" 
    : "relative z-[100]";

  const dropdownClasses = position === 'bottom-left'
    ? "absolute bottom-full left-0 mb-3 rounded-xl overflow-hidden min-w-[180px]"
    : "absolute bottom-full left-0 mb-3 rounded-xl overflow-hidden min-w-[180px]";

  const dropdownStyle = {
    background: 'rgba(10,10,10,0.7)',
    backdropFilter: 'blur(30px) saturate(1.5)',
    WebkitBackdropFilter: 'blur(30px) saturate(1.5)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <div ref={dropdownRef} className={containerClasses}>
      {/* Dropdown menu */}
      {isOpen && (
        <div className={dropdownClasses} style={dropdownStyle}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-200 hover:bg-white/10 ${
                language === lang.code
                  ? 'text-[#99ccff] font-semibold'
                  : 'text-white/70'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm">{lang.label}</span>
              {language === lang.code && (
                <svg className="w-4 h-4 ml-auto text-[#99ccff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 transition-all duration-500 hover:bg-white/10 active:scale-95 ${
          isTranslating ? 'animate-pulse' : ''
        }`}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">
          {currentLang.code.toUpperCase()}
        </span>
        {isTranslating && (
          <div className="w-3.5 h-3.5 border-2 border-[#99ccff] border-t-transparent rounded-full animate-spin" />
        )}
      </button>
    </div>
  );
};

export default LanguageSelector;
