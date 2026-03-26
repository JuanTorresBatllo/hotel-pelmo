import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewType } from '../App';

const SkylineReveal: React.FC<{ onNavigate?: (view: ViewType) => void }> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [hotelVisible, setHotelVisible] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const svgDrawn = useRef(false);
  const { t } = useLanguage();

  const startSvgDraw = useCallback(() => {
    if (svgDrawn.current) return;
    svgDrawn.current = true;

    const container = svgContainerRef.current;
    if (!container) return;

    fetch('/Pelmo_fotos/profile_pelmo.svg')
      .then((r) => r.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (!svgEl) return;

        svgEl.setAttribute('class', 'absolute inset-0 w-full h-full');
        svgEl.style.position = 'absolute';
        svgEl.style.inset = '0';
        svgEl.style.width = '100%';
        svgEl.style.height = '100%';

        const paths = svgEl.querySelectorAll('path');
        const pathCount = paths.length;

        const indices = Array.from({ length: pathCount }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const rank = new Array(pathCount);
        indices.forEach((originalIdx, drawOrder) => {
          rank[originalIdx] = drawOrder;
        });

        const totalStagger = 3;
        const drawDuration = 1.5;

        paths.forEach((path, i) => {
          const len = path.getTotalLength?.() || 500;
          path.style.strokeDasharray = `${len}`;
          path.style.strokeDashoffset = `${len}`;
          path.style.transition = `stroke-dashoffset ${drawDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
          path.style.transitionDelay = `${(rank[i] / pathCount) * totalStagger}s`;
        });

        container.appendChild(svgEl);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            paths.forEach((path) => {
              path.style.strokeDashoffset = '0';
            });
          });
        });

        // Reveal title after skyline finishes drawing
        setTimeout(() => setTitleRevealed(true), (totalStagger + drawDuration) * 1000);
      });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !hotelVisible) {
          setHotelVisible(true);
          setTimeout(startSvgDraw, 800);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hotelVisible, startSvgDraw]);

  return (
    <section ref={sectionRef} className="relative bg-[#f0f1e3] overflow-hidden h-screen flex flex-col justify-center snap-section">
      {/* Title — pops up after skyline finishes drawing */}
      <div
        className="text-center pt-4 md:pt-6 pb-2 md:pb-4 relative z-10 transition-all duration-[1.2s] ease-out"
        style={{
          opacity: titleRevealed ? 1 : 0,
          transform: titleRevealed ? 'translateY(0)' : 'translateY(16px)',
        }}
      >
        <h1
          className="font-bold leading-none text-[#1a1a1a]"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 'clamp(3rem, 9vw, 7.5rem)',
            letterSpacing: '0.02em',
          }}
        >
          Hotel Al Pelmo
        </h1>

        {/* Three stars */}
        <div
          className="flex items-center justify-center gap-2 mt-2 transition-all duration-[1s] ease-out"
          style={{
            opacity: titleRevealed ? 1 : 0,
            transform: titleRevealed ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: '0.4s',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="text-[#c5a059] text-[clamp(0.6rem,1.2vw,1rem)]">★</span>
          ))}
        </div>

        <p
          className="mt-2 transition-all duration-[1s] ease-out"
          style={{
            opacity: titleRevealed ? 1 : 0,
            transform: titleRevealed ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: '0.7s',
            fontFamily: "'Metamorphous', serif",
            fontWeight: 700,
            fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'rgba(26, 26, 26, 0.4)',
          }}
        >
          {t('Hotel — Ristorante dal 1919')}
        </p>

      </div>

      {/* Layered canvas: hotel PNG + SVG landscape overlay + CTA buttons */}
      <div className="relative w-full flex-1 min-h-0">
        <div
          className="absolute inset-0"
          style={{ transform: 'scale(1.2)', transformOrigin: 'center bottom' }}
        >
          <div
            ref={svgContainerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          <img
            src="/Pelmo_fotos/pelmo_image_transparent.png"
            alt="Hotel Al Pelmo"
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-[1.8s] ease-out ${
              hotelVisible ? 'opacity-100 scale-95' : 'opacity-0 scale-[0.96]'
            }`}
          />
        </div>

        {/* CTA buttons — overlaid at bottom-center of image */}
        <div
          className="absolute bottom-[12%] inset-x-0 z-20 flex items-center justify-center gap-20 md:gap-40 transition-all duration-[1s] ease-out"
          style={{
            opacity: titleRevealed ? 1 : 0,
            transform: titleRevealed ? 'translateY(0)' : 'translateY(12px)',
            transitionDelay: '1.2s',
          }}
        >
          <button
            onClick={() => onNavigate?.('contact')}
            className="px-8 py-2.5 text-[13px] font-semibold tracking-[0.15em] uppercase rounded-full text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            style={{
              fontFamily: "'PT Sans', sans-serif",
              background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            }}
          >
            {t('Contact Us')}
          </button>
          <button
            id="be-submit-1"
            className="px-8 py-2.5 text-[13px] font-semibold tracking-[0.15em] uppercase rounded-full text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            style={{
              fontFamily: "'PT Sans', sans-serif",
              background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            }}
          >
            {t('Book Now')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SkylineReveal;
