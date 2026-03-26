
import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const milestones = [
  {
    year: '1919',
    title: 'The Beginning',
    description:
      'The Trevisan family opens a small mountain inn in the heart of Cadore — a warm refuge for travelers drawn by the majesty of the Dolomites.',
    image: '/Pelmo_fotos/pelmo_hotel.jpeg',
    tag: 'Origins',
  },
  {
    year: '1952',
    title: 'Post-War Revival',
    description:
      'The hotel is lovingly rebuilt. A new generation welcomes Europe back to the mountains, rekindling the warmth and spirit of the original inn.',
    image: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=1920&q=80',
    tag: 'Heritage',
  },
  {
    year: '1985',
    title: 'Culinaria dal 1919',
    description:
      'The celebrated Ristorante dal 1919 opens its doors. Mountain heritage meets contemporary refinement — dishes crafted from locally foraged ingredients.',
    image: '/Pelmo_fotos/ristorante.jpeg',
    tag: 'Gastronomy',
  },
  {
    year: '1990',
    title: 'The Terrace',
    description:
      'A panoramic terrace is built overlooking the valley — a place where guests can relax, take in the alpine air, and enjoy breathtaking views of the Dolomites.',
    image: '/Pelmo_fotos/terrace_pelmo.JPG',
    tag: 'Expansion',
  },
  {
    year: '2005',
    title: 'Alpine Wellness',
    description:
      'A world-class spa emerges amidst the peaks — panoramic infinity pool overlooking Lake Centro Cadore, salt-rock saunas, and Alpine-inspired treatments.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
    tag: 'Wellness',
  },
  {
    year: '2009',
    title: 'UNESCO World Heritage',
    description:
      'The Dolomites are officially recognised as a UNESCO World Heritage Site — a global tribute to the extraordinary natural beauty that surrounds Hotel Al Pelmo.',
    image: '/Pelmo_fotos/unesco.jpeg',
    tag: 'Heritage',
  },
  {
    year: '2024',
    title: 'A New Chapter',
    description:
      'Modern sustainability meets timeless hospitality. The next generation of the Trevisan family carries the torch forward.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80',
    tag: 'Legacy',
  },
  {
    year: '2025',
    title: 'Going Greener',
    description:
      'A deep commitment to sustainability — solar energy, zero-waste kitchen, locally sourced materials, and eco-certified operations. The mountains deserve nothing less.',
    image: '/Pelmo_fotos/solar_panels_pelmo.jpg',
    tag: 'Sustainability',
  },
  {
    year: '2026',
    title: 'Winter Olympic Games',
    description:
      'Milano Cortina 2026 brings the Winter Olympics to our doorstep. Hotel Al Pelmo stands ready to welcome the world to the heart of the Dolomites.',
    image: 'https://images.unsplash.com/photo-1770505071943-040ceb4f34f3?w=1920&q=80',
    tag: 'Milestone',
  },
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
   OurJourney — Single snap section with horizontal 
   timeline, CTA, and stats
   ══════════════════════════════════════════════════════ */
const OurJourney: React.FC = () => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const closingCta = useReveal(0.15);

  /* ── Mouse/touch drag state refs ── */
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  /* ── Track horizontal scroll progress ── */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;
      const pct = scrollLeft / maxScroll;
      setActiveIndex(Math.round(pct * (milestones.length - 1)));
    };

    container.addEventListener('scroll', update, { passive: true });
    update();
    return () => container.removeEventListener('scroll', update);
  }, []);

  /* ── Mouse drag handlers ── */
  const onPointerDown = (e: React.PointerEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    dragState.current = { isDown: true, startX: e.clientX, scrollLeft: container.scrollLeft };
    setIsDragging(false);
    container.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.isDown) return;
    const container = scrollRef.current;
    if (!container) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 5) setIsDragging(true);
    container.scrollLeft = dragState.current.scrollLeft - dx;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragState.current.isDown = false;
    const container = scrollRef.current;
    if (container) container.releasePointerCapture(e.pointerId);
    // Reset dragging state after a tick so click handlers on children can be suppressed
    requestAnimationFrame(() => setIsDragging(false));
  };

  const scrollToCard = (i: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    container.scrollTo({ left: (i / (milestones.length - 1)) * maxScroll, behavior: 'smooth' });
  };

  return (
    <section className="snap-section relative bg-[#f0f1e3] overflow-hidden">
      {/* ── Timeline Panel ── */}
      <div className="h-screen flex flex-col">
        {/* Header row */}
        <div className="flex items-end justify-between px-8 md:px-16 pt-20 md:pt-24 pb-4">
          <h2
            className="text-3xl md:text-5xl text-[#1a1a1a] font-light leading-none"
            style={{ fontFamily: "'PT Sans', sans-serif" }}
          >
            {t('Our Journey')}
          </h2>
          <span className="text-[#1a1a1a]/25 text-xs md:text-sm tracking-[0.3em] pb-1" style={{ fontFamily: "'PT Sans', sans-serif" }}>
            {milestones[0].year} — {milestones[milestones.length - 1].year}
          </span>
        </div>

        {/* Horizontal scroll container — mouse/touch drag + native scroll */}
        <div
          ref={scrollRef}
          className={`flex-1 overflow-x-auto overflow-y-hidden hide-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: 'pan-y' }}
        >
          <div
            className="flex h-full items-stretch gap-6 md:gap-8 px-8 md:px-16"
            style={{ paddingRight: '15vw' }}
          >
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[300px] md:w-[380px] flex flex-col py-4 group
                  transition-opacity duration-500 ${Math.abs(i - activeIndex) <= 1 ? 'opacity-100' : 'opacity-40'}`}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg flex-[0_0_58%]">
                  <img
                    src={m.image}
                    alt={t(m.title)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white text-[10px] font-bold tracking-[0.4em] uppercase border border-white/40 px-3 py-1 rounded-full backdrop-blur-sm bg-black/30">
                    {t(m.tag)}
                  </span>
                </div>

                {/* Text */}
                <div className="pt-5 flex-1 flex flex-col">
                  <p
                    className="text-[#1a1a1a]/30 text-sm tracking-widest mb-2"
                    style={{ fontFamily: "'PT Sans', sans-serif" }}
                  >
                    {m.year}
                  </p>
                  <h3
                    className="text-[#1a1a1a] text-lg md:text-xl font-semibold mb-2 leading-tight"
                    style={{ fontFamily: "'PT Sans', sans-serif" }}
                  >
                    {t(m.title)}
                  </h3>
                  <p className="text-[#1a1a1a]/45 text-sm leading-relaxed line-clamp-3">
                    {t(m.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Year navigation bar */}
        <div className="px-8 md:px-16 pb-6 pt-3">
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
            {milestones.map((m, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                aria-label={`Go to ${m.year}`}
                className={`flex-shrink-0 px-4 py-2 text-sm md:text-base tracking-wider transition-all duration-500 rounded-full ${
                  i === activeIndex
                    ? 'bg-[#99ccff]/15 text-[#99ccff] font-semibold'
                    : 'text-[#1a1a1a]/25 hover:text-[#1a1a1a]/50'
                }`}
                style={{ fontFamily: "'PT Sans', sans-serif" }}
              >
                {m.year}
              </button>
            ))}
            <span className="text-[#1a1a1a]/20 text-[9px] tracking-[0.3em] uppercase ml-auto pl-4 flex-shrink-0 hidden md:inline">
              {t('Drag to explore')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Closing CTA ── */}
      <div className="relative py-20 md:py-28 bg-[#f0f1e3] flex items-center justify-center text-center px-8 overflow-hidden">
        <div
          ref={closingCta.ref}
          className={`max-w-4xl sda-fade-scale ${!hasScrollTimeline ? `transition-all duration-[1.6s] ${closingCta.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}` : ''}`}
        >
          <p className="text-[#1a1a1a]/40 font-light text-xl md:text-2xl mb-6 leading-relaxed tracking-wide">
            {t('Will you join us')}
          </p>
          <h2
            className="text-5xl md:text-7xl lg:text-8xl text-[#1a1a1a] font-bold tracking-normal leading-[0.95] mb-4"
            style={{ fontFamily: "'PT Sans', sans-serif" }}
          >
            {t('AS WE TAKE OUR')}
          </h2>
          <h2
            className="text-5xl md:text-7xl lg:text-8xl leading-[0.95]"
            style={{ fontFamily: "'PT Sans', sans-serif" }}
          >
            <span className="text-[#99ccff] italic font-light">{t('next')} </span>
            <span className="text-[#1a1a1a] font-bold">{t('STEPS')}</span>
            <span className="text-[#99ccff]">?</span>
          </h2>
          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="w-20 h-[1px] bg-[#99ccff]/30" />
            <span className="text-[#99ccff] font-semibold tracking-[0.5em] uppercase text-[9px]">Hotel Al Pelmo</span>
            <div className="w-20 h-[1px] bg-[#99ccff]/30" />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-[#c5a059] text-lg">★</span>
            <span className="text-[#c5a059] text-lg">★</span>
            <span className="text-[#c5a059] text-lg">★</span>
          </div>
        </div>
      </div>

      {/* ── Animated Statistics ── */}
      <StatsSection t={t} />
    </section>
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
      // Ease-out cubic for a fast start, smooth finish
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

  // Always use IntersectionObserver for counter trigger (not scroll-driven)
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
    <section className="bg-[#f0f1e3] pt-4 pb-16 md:pb-24 px-6 md:px-12">
      <div
        ref={(el) => { reveal.ref.current = el; counterRef.current = el; }}
        className={`max-w-6xl mx-auto sda-fade-up ${
          !hasScrollTimeline ? `transition-all duration-[1.4s] ease-out ${reveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}` : ''
        }`}
      >
        <p
          className="text-center text-[#1a1a1a]/25 text-[10px] uppercase tracking-[0.5em] mb-16 md:mb-20"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('In Numbers')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 lg:gap-20">
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
