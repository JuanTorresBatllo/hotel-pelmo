
import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { WaveText } from './ui/wave-text';
import 'swiper/css';
import 'swiper/css/pagination';

interface MilestoneImage {
  src: string;
  caption: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  images: MilestoneImage[];
}

const milestones: Milestone[] = [
  {
    year: '1919',
    title: 'The Beginning',
    description:
      'The Trevisan family opens a small mountain inn in the heart of Cadore — a warm refuge for travelers drawn by the majesty of the Dolomites.',
    images: [
      { src: '/Pelmo_our_journey/pelmo_hotel.jpeg', caption: 'The original inn' },
      { src: '/Pelmo_fotos/village_2.jpeg', caption: 'Pieve di Cadore' },
      { src: '/Pelmo_fotos/mountain_landscape_5.jpeg', caption: 'The Dolomites' },
    ],
  },
  {
    year: '1952',
    title: 'Post-War Revival',
    description:
      'The hotel is lovingly rebuilt. A new generation welcomes Europe back to the mountains, rekindling the warmth and spirit of the original inn.',
    images: [
      { src: '/Pelmo_our_journey/post-war.png', caption: 'Post-war rebuild' },
      { src: '/Pelmo_fotos/pieve_foto.JPEG', caption: 'Pieve di Cadore' },
    ],
  },
  {
    year: '1956',
    title: 'Cortina Winter Olympics',
    description:
      'The VII Winter Olympic Games come to Cortina d\'Ampezzo — putting the Dolomites on the world stage. Hotel Al Pelmo welcomes its first wave of international guests.',
    images: [
      { src: '/Pelmo_our_journey/Olimpics_1956.png', caption: 'Cortina 1956' },
      { src: '/Pelmo_fotos/mountain_landscape_7.jpeg', caption: 'Alpine peaks' },
      { src: '/Pelmo_fotos/snow_3.jpeg', caption: 'Winter in the Dolomites' },
    ],
  },
  {
    year: '1985',
    title: 'Culinaria dal 1919',
    description:
      'The celebrated Ristorante dal 1919 opens its doors. Mountain heritage meets contemporary refinement — dishes crafted from locally foraged ingredients.',
    images: [
      { src: '/Pelmo_our_journey/ristorante.jpeg', caption: 'Ristorante dal 1919' },
      { src: '/Pelmo_fotos/food_3.jpeg', caption: 'Mountain cuisine' },
      { src: '/Pelmo_fotos/food_5.jpeg', caption: 'Local ingredients' },
    ],
  },
  {
    year: '1990',
    title: 'The Terrace',
    description:
      'A panoramic terrace is built overlooking the valley — a place where guests can relax, take in the alpine air, and enjoy breathtaking views of the Dolomites.',
    images: [
      { src: '/Pelmo_our_journey/terrace_pelmo.JPG', caption: 'The panoramic terrace' },
      { src: '/Pelmo_fotos/lago_estate.jpeg', caption: 'Lake Centro Cadore' },
    ],
  },
  {
    year: '2005',
    title: 'Alpine Wellness',
    description:
      'A world-class spa emerges amidst the peaks — panoramic infinity pool overlooking Lake Centro Cadore, salt-rock saunas, and Alpine-inspired treatments.',
    images: [
      { src: '/Pelmo_our_journey/spa.png', caption: 'The infinity pool' },
      { src: '/Pelmo_fotos/wellness_4.jpeg', caption: 'Alpine spa' },
      { src: '/Pelmo_fotos/wellness_5.jpeg', caption: 'Relaxation' },
    ],
  },
  {
    year: '2009',
    title: 'UNESCO World Heritage',
    description:
      'The Dolomites are officially recognised as a UNESCO World Heritage Site — a global tribute to the extraordinary natural beauty that surrounds Hotel Al Pelmo.',
    images: [
      { src: '/Pelmo_our_journey/unesco.jpeg', caption: 'UNESCO recognition' },
    ],
  },
  {
    year: '2024',
    title: 'A New Chapter',
    description:
      'Modern sustainability meets timeless hospitality. The next generation of the Trevisan family carries the torch forward.',
    images: [
      { src: '/Pelmo_our_journey/bar.png', caption: 'The mountain hub' },
      { src: '/Pelmo_fotos/interior_mountain_hub.jpeg', caption: 'Interior design' },
      { src: '/Pelmo_our_journey/new_era.png', caption: 'A new era' },
    ],
  },
  {
    year: '2025',
    title: 'Going Greener',
    description:
      'A deep commitment to sustainability — solar energy, zero-waste kitchen, locally sourced materials, and eco-certified operations. The mountains deserve nothing less.',
    images: [
      { src: '/Pelmo_our_journey/solar_panels_pelmo.jpg', caption: 'Solar energy' },
      { src: '/Pelmo_fotos/wellness_6.jpeg', caption: 'Eco wellness' },
    ],
  },
  {
    year: '2026',
    title: 'Winter Olympic Games',
    description:
      'Milano Cortina 2026 brings the Winter Olympics to our doorstep. Hotel Al Pelmo stands ready to welcome the world to the heart of the Dolomites.',
    images: [
      { src: '/Pelmo_our_journey/olimpics_2026.png', caption: 'Milano Cortina 2026' },
      { src: '/Pelmo_fotos/snow_3.jpeg', caption: 'Alpine winter' },
      { src: '/Pelmo_fotos/wellness_7.jpeg', caption: 'Ready for the world' },
    ],
  },
];

/* ── Deterministic per-image rotations for the polaroid stack ── */
const ROTATIONS = [
  [0, -6, 4],    // 1919
  [-3, 5],       // 1952
  [2, -4, 6],    // 1956
  [-2, 5, -5],   // 1985
  [3, -5],       // 1990
  [-1, 4, -6],   // 2005
  [0],           // 2009
  [3, -5, 2],    // 2024
  [-3, 4],       // 2025
  [2, -4, 5],    // 2026
];

/* ── Scroll-driven animation feature detection ── */
const hasScrollTimeline = typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()');

/* ── Reveal hook — scroll-driven with IntersectionObserver fallback ── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(hasScrollTimeline);
  useEffect(() => {
    if (hasScrollTimeline) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible, sdaClass: hasScrollTimeline };
}

/* ══════════════════════════════════════════════════════
   OurJourney — AW Hainsworth "Our Story" style
   Hero + Centered Intro + Swiper Timeline + CTA + Stats
   ══════════════════════════════════════════════════════ */
const OurJourney: React.FC = () => {
  const { t } = useLanguage();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [spreadSlide, setSpreadSlide] = useState(-1);
  const spreadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closingCta = useReveal(0.15);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroRevealed, setHeroRevealed] = useState(hasScrollTimeline);

  useEffect(() => {
    if (hasScrollTimeline) return;
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeroRevealed(true); },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── Hero — GallerySection-style fullscreen image with centered title ── */}
      <div
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden snap-section bg-[#f0f1e3]"
        data-header-transparent
      >
        <div
          className={`absolute inset-0 ${hasScrollTimeline ? 'sda-clip-up' : 'transition-[clip-path] duration-[1.6s]'}`}
          style={!hasScrollTimeline ? {
            clipPath: heroRevealed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
            transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
          } : undefined}
        >
          <img
            src="/Pelmo_our_journey/OurJourneyBackground.png"
            alt={t('Our Journey')}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <WaveText
            text={t('Our Journey')}
            className="text-white font-bold tracking-tight leading-none uppercase"
            style={{
              fontFamily: "'PT Sans', sans-serif",
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              letterSpacing: '-0.02em',
            }}
          />
        </div>
      </div>

      {/* ── Timeline Section ── */}
      <section className="relative bg-[#f0f1e3] snap-section" data-no-dot>

        {/* Centered intro heading */}
        <div className="flex flex-col items-center justify-center text-center px-8 pt-24 pb-10 md:pt-36 md:pb-16">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-[#1a1a1a] font-light tracking-tight leading-[1.3]"
            style={{ fontFamily: "'PT Sans', sans-serif" }}
          >
            {t('Hotel Al Pelmo through the')}{' '}
            <em className="italic text-[#c5a059]">{t('years')}</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-[#1a1a1a]/50 text-base md:text-lg font-light leading-relaxed"
            style={{ fontFamily: "'PT Sans', sans-serif" }}
          >
            {t('Established in 1919, our heritage is a testament to enduring craftsmanship and alpine hospitality. Explore our heritage and experience the tradition of excellence that defines Hotel Al Pelmo.')}
          </p>
          <div className="w-[60px] h-[2px] bg-[#c5a059] mx-auto mt-8" />
        </div>

        {/* Swiper Timeline — sticky so CTA/stats scroll over it */}
        <div className="relative h-[200vh]">
          <div className="sticky top-0 h-screen overflow-hidden bg-[#f0f1e3] flex items-center">
            <div className="oj-swiper-timeline w-full">
              <div className="oj-swiper-timeline__slider">
                {/* Date pagination */}
                <div className="oj-swiper-timeline__dates">
                  {milestones.map((m, i) => (
                    <button
                      key={i}
                      className="oj-swiper-timeline__date-btn"
                      onClick={() => swiperInstance?.slideTo(i)}
                    >
                      {m.year}
                    </button>
                  ))}
                </div>

                <Swiper
                  modules={[Pagination]}
                  slidesPerView={1}
                  onSwiper={(sw) => setSwiperInstance(sw)}
                  onSlideChange={(sw) => {
                    const btns = document.querySelectorAll('.oj-swiper-timeline__date-btn');
                    btns.forEach((btn, idx) => {
                      btn.classList.toggle('active', idx === sw.activeIndex);
                    });
                    if (spreadTimer.current) clearTimeout(spreadTimer.current);
                    setSpreadSlide(-1);
                    if (milestones[sw.activeIndex]?.images.length > 1) {
                      spreadTimer.current = setTimeout(() => setSpreadSlide(sw.activeIndex), 900);
                    }
                  }}
                  onInit={(sw) => {
                    const btns = document.querySelectorAll('.oj-swiper-timeline__date-btn');
                    btns.forEach((btn, idx) => {
                      btn.classList.toggle('active', idx === sw.activeIndex);
                    });
                    if (milestones[0]?.images.length > 1) {
                      spreadTimer.current = setTimeout(() => setSpreadSlide(0), 900);
                    }
                  }}
                >
                  {milestones.map((m, i) => (
                    <SwiperSlide key={i}>
                      <div className="oj-event">
                        <div className="oj-event__images">
                          <div className={`oj-polaroid-stack ${m.images.length > 1 ? 'oj-polaroid-stack--multi' : ''} ${spreadSlide === i ? 'oj-polaroid-stack--spread' : ''}`}>
                            {m.images.map((img, j) => (
                              <div
                                key={j}
                                className="oj-polaroid"
                                style={{
                                  '--rot': `${(ROTATIONS[i] ?? [0])[j] ?? 0}deg`,
                                  zIndex: m.images.length - j,
                                } as React.CSSProperties}
                              >
                                <img
                                  src={img.src}
                                  alt={t(img.caption)}
                                  loading="lazy"
                                  decoding="async"
                                />
                                <span className="oj-polaroid__caption">{t(img.caption)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="oj-event__content">
                          <h3 className="oj-event__date">{m.year}</h3>
                          <h4 className="oj-event__title">{t(m.title)}</h4>
                          <p className="oj-event__text">{t(m.description)}</p>
                          <div className="oj-event__buttons">
                            <button
                              className="oj-event__btn oj-event__btn--prev"
                              onClick={() => swiperInstance?.slidePrev()}
                              aria-label="Previous"
                            >
                              <svg width="57" height="56" viewBox="0 0 57 56" fill="none">
                                <path d="m28.499 39 9.68-10.5c-2.428-2.626-7.252-7.874-9.68-10.5l-1.222 1.303c2.184 2.362 5.073 5.51 7.622 8.27H19.137v1.854H34.9l-7.622 8.255L28.499 39Z" fill="currentColor" />
                                <path d="M56.002 28c0 15.188-12.312 27.5-27.5 27.5S1.002 43.188 1.002 28 13.314.5 28.502.5s27.5 12.312 27.5 27.5Z" stroke="currentColor" />
                              </svg>
                            </button>
                            <button
                              className="oj-event__btn oj-event__btn--next"
                              onClick={() => swiperInstance?.slideNext()}
                              aria-label="Next"
                            >
                              <svg width="57" height="56" viewBox="0 0 57 56" fill="none">
                                <path d="m28.499 39 9.68-10.5c-2.428-2.626-7.252-7.874-9.68-10.5l-1.222 1.303c2.184 2.362 5.073 5.51 7.622 8.27H19.137v1.854H34.9l-7.622 8.255L28.499 39Z" fill="currentColor" />
                                <path d="M56.002 28c0 15.188-12.312 27.5-27.5 27.5S1.002 43.188 1.002 28 13.314.5 28.502.5s27.5 12.312 27.5 27.5Z" stroke="currentColor" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA + Stats — scrolls up over the sticky timeline ── */}
        <div className="relative bg-[#f0f1e3] -mt-[100vh]" style={{ zIndex: 1 }}>
          {/* Closing CTA */}
          <div className="text-center px-8 pt-24 pb-6 md:pt-32 md:pb-8">
            <div
              ref={closingCta.ref}
              className={`max-w-4xl mx-auto sda-fade-scale ${!hasScrollTimeline ? `transition-all duration-[1.6s] ${closingCta.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}` : ''}`}
            >
              <p className="text-[#1a1a1a]/40 font-light text-xl md:text-2xl mb-4 leading-relaxed tracking-wide">
                {t('Will you join us')}
              </p>
              <h2
                className="text-5xl md:text-7xl lg:text-[8rem] text-[#1a1a1a] font-bold tracking-tight leading-[0.9] mb-2"
                style={{ fontFamily: "'PT Sans', sans-serif" }}
              >
                {t('AS WE TAKE OUR')}
              </h2>
              <h2
                className="text-5xl md:text-7xl lg:text-[8rem] leading-[0.9] mb-6"
                style={{ fontFamily: "'PT Sans', sans-serif" }}
              >
                <span className="text-[#99ccff] italic font-light">{t('next')} </span>
                <span className="text-[#1a1a1a] font-bold">{t('STEPS')}</span>
                <span className="text-[#99ccff] text-[0.7em]"> ?</span>
              </h2>
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-16 h-[1px] bg-[#99ccff]/30" />
                <span className="text-[#99ccff] font-semibold tracking-[0.5em] uppercase text-[9px]">Hotel Al Pelmo</span>
                <div className="w-16 h-[1px] bg-[#99ccff]/30" />
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[#c5a059] text-sm">★</span>
                <span className="text-[#c5a059] text-sm">★</span>
                <span className="text-[#c5a059] text-sm">★</span>
              </div>
            </div>
          </div>

          {/* Animated Statistics */}
          <StatsSection t={t} />
        </div>
      </section>
    </>
  );
};

/* ──────────────────────────────────────────────────────────
   AnimatedCounter — counts from 0 to target on scroll
   ────────────────────────────────────────────────────────── */
const AnimatedCounter: React.FC<{ target: number; suffix?: string; duration?: number; visible: boolean }> = ({
  target, suffix = '', duration = 2000, visible,
}) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!visible || hasAnimated.current) return;
    hasAnimated.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
};

/* ──────────────────────────────────────────────────────────
   StatsSection — animated hotel stats after CTA
   ────────────────────────────────────────────────────────── */
const stats = [
  { value: 3247, suffix: '+', label: 'Guests Last Year' },
  { value: 107, suffix: '', label: 'Years of Tradition' },
  { value: 82, suffix: '%', label: 'Guest Satisfaction' },
  { value: 42, suffix: '', label: 'Rooms & Suites' },
  { value: 15000, suffix: '+', label: 'Meals Served Yearly' },
  { value: 4, suffix: '', label: 'Generations of Family' },
];

const StatsSection: React.FC<{ t: (s: string) => string }> = ({ t }) => {
  const reveal = useReveal(0.2);
  const counterRef = useRef<HTMLDivElement>(null);
  const [counterVisible, setCounterVisible] = useState(false);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setCounterVisible(true);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-[#f0f1e3] pt-0 pb-10 md:pb-14 px-6 md:px-12">
      <div
        ref={(el) => { reveal.ref.current = el; counterRef.current = el; }}
        className={`max-w-5xl mx-auto sda-fade-up ${
          !hasScrollTimeline ? `transition-all duration-[1.4s] ease-out ${reveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}` : ''
        }`}
      >
        <p
          className="text-center text-[#1a1a1a]/25 text-[10px] uppercase tracking-[0.5em] mb-8 md:mb-10"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('In Numbers')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] font-light tracking-tight mb-3"
                style={{ fontFamily: "'PT Sans', sans-serif" }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} visible={counterVisible} />
              </p>
              <p className="text-[#1a1a1a]/35 text-[10px] md:text-xs uppercase tracking-[0.3em]">
                {t(stat.label)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurJourney;
