
import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusCards } from './ui/focus-cards';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const foodImages = [
  { src: '/images/Food.jpeg', title: 'Mountain Terroir', desc: 'Game and mountain herbs from the Cadore valley.' },
  { src: '/images/Food_2.jpeg', title: 'Cadore Flavors', desc: "Hand-crafted pasta following nonna's legacy." },
  { src: '/images/food_3.jpeg', title: 'Alpine Deli', desc: 'The finest selection of local cheeses and cured meats.' },
  { src: '/images/food_5.jpeg', title: 'Symphony Sweet', desc: 'A sweet end with forest-inspired desserts.' },
];

const DiningView: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger reveals
  useEffect(() => {
    gsap.set('[data-dining-header]', { opacity: 0, y: 60 });
    gsap.set('[data-dining-section]', { opacity: 0, y: 80 });

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Header reveal
        gsap.to('[data-dining-header]', {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-dining-header]',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // Section reveals — staggered
        gsap.utils.toArray<HTMLElement>('[data-dining-section]').forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={sectionRef} className="selection:bg-[#99ccff]/20">

      {/* ── Sticky hero image — stays pinned while content scrolls over it ── */}
      <div className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <img
            src="/Pelmo_fotos/restaurant_pelmo_section.jpg"
            alt="Fine dining restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
          <div className="absolute inset-0 flex items-end pb-20 px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl">
              <span className="text-[#99ccff] font-semibold tracking-[0.5em] uppercase text-[10px] mb-8 block">{t('Gastronomy')}</span>
              <h1 className="overflow-hidden mb-8" style={{ fontFamily: "'PT Sans', sans-serif" }}>
                {['Ristorante', 'dal 1919'].map((line, i) => (
                  <span
                    key={i}
                    className={`block ${i === 1 ? 'font-light italic text-white/80' : 'font-bold text-white'}`}
                    style={{
                      fontSize: 'clamp(3.5rem, 10vw, 11rem)',
                      lineHeight: 0.9,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {t(line)}
                  </span>
                ))}
              </h1>
              <p className="text-white/60 font-light text-lg md:text-xl max-w-lg leading-relaxed">
                {t('Four generations of local dishes made with the classic style of an Italian trattoria.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content section — overlaps and covers the sticky image ── */}
      <div className="relative bg-[#fdfbf7] -mt-[100vh]" style={{ zIndex: 1 }}>

      {/* ── Hero header — centered title + description ── */}
      <div
        data-dining-header
        className="flex flex-col items-center justify-center text-center px-8 pt-32 pb-20 md:pt-44 md:pb-28"
      >
        <h1
          className="text-5xl md:text-7xl lg:text-8xl text-[#1a1a1a] font-light tracking-tight leading-[0.95]"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('Restaurant')}
        </h1>
        <p
          className="mt-8 max-w-2xl text-[#1a1a1a]/50 text-base md:text-lg font-light leading-relaxed"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('Genuine and simple cuisine that tastes of tradition. Four generations of local dishes made with the classic style of an Italian trattoria.')}
        </p>
      </div>

      {/* Editorial Story — editorial split */}
      <section className="relative">
        <div
          data-dining-section
          className="flex flex-col lg:flex-row min-h-screen"
        >
          {/* Image side */}
          <div className="lg:w-[55%] h-[50vh] lg:h-auto relative overflow-hidden group">
            <img
              src="/images/ristorante.jpeg"
              alt="Ristorante 1919"
              className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-105"
            />
            {/* Floating stats */}
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 flex gap-4">
              {[
                { label: t('Chef'), val: t('Moha Boulmane') },
                { label: t('Since'), val: '1919' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-lg">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold block">{stat.label}</span>
                  <span className="text-lg text-[#1a1a1a] font-semibold" style={{ fontFamily: "'PT Sans', sans-serif" }}>{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content side */}
          <div className="lg:w-[45%] flex items-center bg-[#fdfbf7] px-8 py-16 md:px-16 lg:px-20 lg:py-0">
            <div className="max-w-md w-full space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#99ccff]" />
                <span className="text-[#99ccff] font-semibold tracking-[0.4em] uppercase text-[10px]">{t('The Story')}</span>
              </div>
              <h2 className="font-bold text-[#1a1a1a] leading-[0.9] tracking-tight" style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                {t('The Art of')}<br /><span className="font-light italic text-[#99ccff]">{t('High Altitude')}</span>
              </h2>
              <p className="text-gray-500 font-light text-lg leading-relaxed">
                {t('Genuine and simple cuisine that tastes of tradition. Four generations of local dishes made with the classic style of an Italian trattoria.')}
              </p>
              <div className="w-16 h-[1px] bg-[#99ccff]/30" />
              <p className="text-gray-400 font-light leading-relaxed italic">
                {t('"Buon appetito!"')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Gallery — staggered grid */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-white">
        <div
          data-dining-section
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-[1px] bg-[#99ccff]" />
                <span className="text-[#99ccff] font-semibold tracking-[0.4em] uppercase text-[10px]">{t('The Menu')}</span>
              </div>
              <h3 className="font-bold text-[#1a1a1a] leading-[0.9]" style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                {t('Seasonal')}<br /><span className="font-light italic">{t('Highlights')}</span>
              </h3>
            </div>
            <p className="text-gray-400 font-light max-w-xs md:text-right">
              {t('Locally sourced ingredients at 878m altitude with terroir integrity in every dish.')}
            </p>
          </div>

          {/* Focus Cards food grid */}
          <FocusCards cards={foodImages.map(img => ({ title: t(img.title), src: img.src }))} />
        </div>
      </section>
      </div>{/* end content wrapper */}
    </div>
  );
};

export default DiningView;
