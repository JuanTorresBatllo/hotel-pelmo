
import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const rooms = [
  {
    id: 1,
    name: 'Classic Alpine Room',
    tag: 'Authentic Comfort',
    description: 'Elegantly furnished with local larch wood, offering a cozy atmosphere and a view of the surrounding forest and mountains.',
    price: '120 - 150',
    size: '16 m²',
    guests: '2',
    image: '/Pelmo_fotos/room0.png',
    amenities: ['Mountain View', 'Fireplace', 'Larch Wood'],
  },
  {
    id: 2,
    name: 'Lake View Junior Suite',
    tag: 'Panoramic Bliss',
    description: 'Spacious suites with floor-to-ceiling windows overlooking the valley and the hillside charm of Pieve di Cadore.',
    price: '150 - 180',
    size: '25 m²',
    guests: '3',
    image: '/Pelmo_fotos/room1.png',
    amenities: ['Valley Views', 'Private Terrace', 'Rain Shower'],
  },
  {
    id: 3,
    name: 'Pelmo Presidential Penthouse',
    tag: 'Peak Luxury',
    description: 'The pinnacle of luxury. A multi-level suite featuring iconic framed views of the snowy Dolomites peaks directly from your window.',
    price: '180 - 220',
    size: '30 m²',
    guests: '4',
    image: '/Pelmo_fotos/room2.png',
    amenities: ['Dolomites Panorama', 'Private Sauna', 'Two Levels'],
  }
];

const RoomsView: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger reveals
  useEffect(() => {
    gsap.set('[data-room-header]', { opacity: 0, y: 60 });
    gsap.set('[data-room-section]', { opacity: 0, y: 80 });

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Header reveal
        gsap.to('[data-room-header]', {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-room-header]',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // Section reveals — staggered
        gsap.utils.toArray<HTMLElement>('[data-room-section]').forEach((el) => {
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
            src="/Pelmo_fotos/room_pelmo_section.jpg"
            alt="Luxury hotel room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
          <div className="absolute inset-0 flex items-end pb-20 px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl">
              <span className="text-[#99ccff] font-semibold tracking-[0.5em] uppercase text-[10px] mb-8 block">{t('The Collection')}</span>
              <h1 className="overflow-hidden mb-8" style={{ fontFamily: "'PT Sans', sans-serif" }}>
                {['Rooms &', 'Suites'].map((line, i) => (
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
                {t('Each room is a carefully curated retreat — blending local materials, panoramic views, and mountain tranquility.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content section — overlaps and covers the sticky image ── */}
      <div className="relative bg-[#fdfbf7] -mt-[100vh]" style={{ zIndex: 1 }}>

      {/* ── Hero header — centered title + description ── */}
      <div
        data-room-header
        className="flex flex-col items-center justify-center text-center px-8 pt-32 pb-20 md:pt-44 md:pb-28"
      >
        <h1
          className="text-5xl md:text-7xl lg:text-8xl text-[#1a1a1a] font-light tracking-tight leading-[0.95]"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('Rooms & Suites')}
        </h1>
        <p
          className="mt-8 max-w-2xl text-[#1a1a1a]/50 text-base md:text-lg font-light leading-relaxed"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('Each room is a carefully curated retreat — blending local materials, panoramic views, and mountain tranquility.')}
        </p>
      </div>

      {/* Room Sections — each room is a full editorial spread */}
      {rooms.map((room, idx) => {
        const isReversed = idx % 2 !== 0;

        return (
          <section key={room.id} className="relative">
            <div
              data-room-section
              className="relative"
            >
              <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-screen`}>
                {/* Image side — 60% */}
                <div className="relative lg:w-[60%] h-[50vh] lg:h-auto overflow-hidden group">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-105"
                  />
                  {/* Room number watermark */}
                  <div className="absolute top-8 left-8 lg:top-12 lg:left-12">
                    <span className="text-white/10 font-bold text-[8rem] lg:text-[12rem] leading-none" style={{ fontFamily: "'PT Sans', sans-serif" }}>
                      0{room.id}
                    </span>
                  </div>
                </div>

                {/* Content side — 40% */}
                <div className="lg:w-[40%] flex items-center bg-[#fdfbf7] px-8 py-16 md:px-16 lg:px-20 lg:py-0">
                  <div className="max-w-md w-full space-y-8">
                    {/* Tag */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-[#99ccff]" />
                      <span className="text-[#99ccff] font-semibold tracking-[0.4em] uppercase text-[10px]">{t(room.tag)}</span>
                    </div>

                    {/* Title */}
                    <h2 className="font-bold text-[#1a1a1a] leading-[0.9] tracking-tight" style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
                      {t(room.name)}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-500 font-light text-lg leading-relaxed">
                      {t(room.description)}
                    </p>

                    {/* Stats — horizontal divider style */}
                    <div className="flex items-center gap-0 border-t border-b border-gray-200 py-5">
                      <div className="flex-1 text-center">
                        <span className="block text-2xl font-bold text-[#1a1a1a]">{room.size}</span>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-semibold mt-1 block">{t('Size')}</span>
                      </div>
                      <div className="w-[1px] h-10 bg-gray-200" />
                      <div className="flex-1 text-center">
                        <span className="block text-2xl font-bold text-[#1a1a1a]">{room.guests}</span>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-semibold mt-1 block">{t('Guests')}</span>
                      </div>
                      <div className="w-[1px] h-10 bg-gray-200" />
                      <div className="flex-1 text-center">
                        <span className="block text-2xl font-bold text-[#99ccff]">€{room.price}</span>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-semibold mt-1 block">{t('Per Night')}</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-3">
                      {room.amenities.map((a, i) => (
                        <span key={i} className="px-4 py-2 border border-gray-200 text-[11px] text-gray-600 font-medium uppercase tracking-[0.15em] hover:border-[#99ccff] hover:text-[#99ccff] transition-colors cursor-default">
                          {t(a)}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <button className="group inline-flex items-center gap-4 text-[#1a1a1a] text-xs font-bold uppercase tracking-[0.3em] pt-2">
                      <span className="group-hover:text-[#99ccff] transition-colors">{t('Check Availability')}</span>
                      <div className="w-12 h-[1px] bg-[#1a1a1a] group-hover:w-20 group-hover:bg-[#99ccff] transition-all duration-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
      </div>{/* end content wrapper */}
    </div>
  );
};

export default RoomsView;
