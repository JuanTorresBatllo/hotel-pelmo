
import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusCards } from './ui/focus-cards';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const treatments = [
  { title: 'Sports Massage', desc: 'Deep tissue work to recover and revitalize after an active day in the mountains.' },
  { title: 'Massage with Essential Oils', desc: 'A soothing full-body massage using locally sourced alpine essential oils.' },
  { title: 'Crystal Therapy', desc: 'Restoring balance and energy through the healing power of natural crystals.' },
  { title: 'Yoga Lessons', desc: 'Guided yoga sessions on our panoramic terrace overlooking the Dolomites.' },
];

const wellnessImages = [
  { src: '/images/wellness_4.jpeg', label: 'Thermal Pool' },
  { src: '/images/wellness_5.jpeg', label: 'Sauna Suite' },
  { src: '/images/wellness_6.jpeg', label: 'Relaxation Room' },
  { src: '/images/wellness_7.jpeg', label: 'Alpine Room' },
  { src: '/images/Wellness_1.png', label: 'Steam Bath' },
  { src: '/images/Wellness_2.png', label: 'Treatment Room' },
];

const WellnessView: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger reveals
  useEffect(() => {
    gsap.set('[data-wellness-header]', { opacity: 0, y: 60 });
    gsap.set('[data-wellness-section]', { opacity: 0, y: 80 });

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Header reveal
        gsap.to('[data-wellness-header]', {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-wellness-header]',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // Section reveals — staggered
        gsap.utils.toArray<HTMLElement>('[data-wellness-section]').forEach((el) => {
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

  useEffect(() => {
    if (lightboxIndex !== null && lightboxRef.current) {
      setTimeout(() => {
        lightboxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
    }
  }, [lightboxIndex]);

  return (
    <div ref={sectionRef} className="selection:bg-[#99ccff]/20">

      {/* ── Sticky hero image — stays pinned while content scrolls over it ── */}
      <div className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <img
            src="/Pelmo_fotos/spa_section.jpg"
            alt="Alpine spa and wellness"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
          <div className="absolute inset-0 flex items-end pb-20 px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl">
              <span className="text-[#99ccff] font-semibold tracking-[0.5em] uppercase text-[10px] mb-8 block">{t('Wellness')}</span>
              <h1 className="overflow-hidden mb-8" style={{ fontFamily: "'PT Sans', sans-serif" }}>
                {['Rest, Restore', '& Rebalance'].map((line, i) => (
                  <span
                    key={i}
                    className="block font-bold text-white uppercase"
                    style={{
                      fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                      lineHeight: 0.9,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {t(line)}
                  </span>
                ))}
              </h1>
              <p className="text-white/60 font-light text-lg md:text-xl max-w-lg leading-relaxed">
                {t('Charge your battery in the wellness spa after an outdoor day!')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content section — overlaps and covers the sticky image ── */}
      <div className="relative bg-[#fdfbf7] -mt-[100vh]" style={{ zIndex: 1 }}>

      {/* ── Hero header — centered title + description ── */}
      <div
        data-wellness-header
        className="flex flex-col items-center justify-center text-center px-8 pt-32 pb-20 md:pt-44 md:pb-28"
      >
        <h1
          className="text-5xl md:text-7xl lg:text-8xl text-[#1a1a1a] font-light tracking-tight leading-[0.95]"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('Wellness')}
        </h1>
        <p
          className="mt-8 max-w-2xl text-[#1a1a1a]/50 text-base md:text-lg font-light leading-relaxed"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('Our concept is rooted in the "Path of the Elements". A sensorially guided journey that synchronizes your heart rate with the rhythm of the Dolomites.')}
        </p>
      </div>

      {/* Philosophy — editorial split */}
      <section className="relative">
        <div
          data-wellness-section
          className="flex flex-col lg:flex-row min-h-screen"
        >
          {/* Image side */}
          <div className="lg:w-[55%] h-[50vh] lg:h-auto relative overflow-hidden group">
            <img
              src="/images/wellness_7.jpeg"
              alt="Alpine Wellness Spa"
              className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-105"
            />
            {/* Floating stats */}
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 flex gap-4">
              {[
                { label: 'Thermal Pool', val: '38°C' },
                { label: 'Finnish Sauna', val: '70°C' },
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
                <span className="text-[#99ccff] font-semibold tracking-[0.4em] uppercase text-[10px]">{t('Philosophy')}</span>
              </div>
              <h2 className="font-bold text-[#1a1a1a] leading-[0.9] tracking-tight" style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                {t('Mountain')}<br /><span className="font-light italic text-[#99ccff]">{t('Resonance')}</span>
              </h2>
              <p className="text-gray-500 font-light text-lg leading-relaxed">
                {t('Our concept is rooted in the "Path of the Elements". A sensorially guided journey that synchronizes your heart rate with the rhythm of the Dolomites.')}
              </p>
              <div className="w-16 h-[1px] bg-[#99ccff]/30" />
              <p className="text-gray-400 font-light leading-relaxed italic">
                {t('"Where the mountain meets the body, healing begins."')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments — horizontal cards */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-white">
        <div
          data-wellness-section
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-[1px] bg-[#99ccff]" />
                <span className="text-[#99ccff] font-semibold tracking-[0.4em] uppercase text-[10px]">{t('Treatments')}</span>
              </div>
              <h3 className="font-bold text-[#1a1a1a] leading-[0.9]" style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                {t('Some of')}<br /><span className="font-light italic">{t('Our Rituals')}</span>
              </h3>
            </div>
            <p className="text-gray-400 font-light max-w-xs text-right">
              {t('We partner with local massage therapists to provide treatments on demand.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200">
            {treatments.map((treat, i) => (
              <div
                key={i}
                className={`group p-10 md:p-14 lg:p-16 cursor-default hover:bg-[#fdfbf7] transition-all duration-500 border-gray-200 ${
                  i < 2 ? 'border-b' : ''
                } ${i % 2 === 0 ? 'md:border-r' : ''}`}
              >
                <div className="w-12 h-[2px] bg-[#99ccff] mb-8 group-hover:w-20 transition-all duration-500" />
                <h4 className="font-bold text-[#1a1a1a] mb-4 group-hover:text-[#99ccff] transition-colors" style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                  {t(treat.title)}
                </h4>
                <p className="text-gray-500 font-light text-base md:text-lg leading-relaxed">{t(treat.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery — asymmetric masonry */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-[#fdfbf7]">
        <div
          data-wellness-section
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-[1px] bg-[#99ccff]" />
              </div>
              <h3 className="font-bold text-[#1a1a1a] leading-[0.9]" style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                {t('Gallery')}
              </h3>
            </div>
          </div>

          {/* Focus Cards grid */}
          <FocusCards cards={wellnessImages.map(img => ({ title: t(img.label), src: img.src }))} />
        </div>
      </section>
      </div>{/* end content wrapper */}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          onClick={() => setLightboxIndex(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10" onClick={() => setLightboxIndex(null)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + wellnessImages.length) % wellnessImages.length); }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={wellnessImages[lightboxIndex].src}
              alt={wellnessImages[lightboxIndex].label}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-6 text-center">
              <span className="text-white/90 text-xl font-light" style={{ fontFamily: "'PT Sans', sans-serif" }}>{t(wellnessImages[lightboxIndex].label)}</span>
              <span className="text-white/40 text-sm ml-4">{lightboxIndex + 1} / {wellnessImages.length}</span>
            </div>
          </div>
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % wellnessImages.length); }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default WellnessView;
