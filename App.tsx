
import React, { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';
import GallerySection from './components/GallerySection';
import OurJourney from './components/OurJourney';
import WhatToDo from './components/WhatToDo';
import Footer from './components/Footer';
import RoomsView from './components/RoomsView';
import WellnessView from './components/WellnessView';
import DiningView from './components/DiningView';
import ContactView from './components/ContactView';
import SkylineReveal from './components/SkylineReveal';
import DolomitesShowcase from './components/DolomitesShowcase';

export type ViewType = 'home' | 'rooms' | 'wellness' | 'activities' | 'dining' | 'contact';

/* ── Fullpage-style section snap for .snap-section elements ── */
function useSectionSnap(enabled: boolean) {
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const SCROLL_COOLDOWN = 800; // ms before next snap is allowed

    const getSections = () =>
      Array.from(document.querySelectorAll('.snap-section')) as HTMLElement[];

    const getCurrentIdx = () => {
      const sections = getSections();
      const scrollY = window.scrollY;
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < sections.length; i++) {
        const dist = Math.abs(sections[i].offsetTop - scrollY);
        if (dist < minDist) { minDist = dist; closest = i; }
      }
      return closest;
    };

    const scrollToSection = (idx: number) => {
      const sections = getSections();
      if (idx < 0 || idx >= sections.length) return;
      isScrolling.current = true;
      window.scrollTo({ top: sections[idx].offsetTop, behavior: 'smooth' });
      setTimeout(() => { isScrolling.current = false; }, SCROLL_COOLDOWN);
    };

    const handleWheel = (e: WheelEvent) => {
      const sections = getSections();
      if (sections.length === 0) return;

      const idx = getCurrentIdx();
      const section = sections[idx];
      const sectionHeight = section.offsetHeight;
      const vh = window.innerHeight;

      // Tall section — allow native scroll within, snap only at edges
      if (sectionHeight > vh + 10) {
        const scrollInSection = window.scrollY - section.offsetTop;
        const maxScroll = sectionHeight - vh;
        if (e.deltaY > 0 && scrollInSection < maxScroll - 5) return; // let native scroll
        if (e.deltaY < 0 && scrollInSection > 5) return;
      }

      e.preventDefault();
      if (isScrolling.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      scrollToSection(idx + dir);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;
      const down = e.key === 'ArrowDown' || e.key === 'PageDown';
      const up = e.key === 'ArrowUp' || e.key === 'PageUp';
      if (!down && !up) return;

      const idx = getCurrentIdx();
      const section = getSections()[idx] ?? null;
      if (section && section.offsetHeight > window.innerHeight + 10) {
        const scrollIn = window.scrollY - section.offsetTop;
        const maxScroll = section.offsetHeight - window.innerHeight;
        if (down && scrollIn < maxScroll - 5) return; // let native key scroll
        if (up && scrollIn > 5) return;
      }

      e.preventDefault();
      scrollToSection(idx + (down ? 1 : -1));
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;

      const idx = getCurrentIdx();
      const section = getSections()[idx];
      if (section && section.offsetHeight > window.innerHeight + 10) {
        const scrollIn = window.scrollY - section.offsetTop;
        const maxScroll = section.offsetHeight - window.innerHeight;
        if (diff > 0 && scrollIn < maxScroll - 5) return;
        if (diff < 0 && scrollIn > 5) return;
      }

      scrollToSection(idx + (diff > 0 ? 1 : -1));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled]);
}

/* ── Fixed bullet dot section navigation ── */
const SectionDots: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const update = () => {
      const sections = Array.from(document.querySelectorAll('.snap-section')) as HTMLElement[];
      setTotal(sections.length);
      if (sections.length === 0) return;

      const scrollY = window.scrollY;
      let closestIdx = 0;
      let minDist = Infinity;
      for (let i = 0; i < sections.length; i++) {
        const dist = Math.abs(sections[i].offsetTop - scrollY);
        if (dist < minDist) { minDist = dist; closestIdx = i; }
      }
      setActiveIdx(closestIdx);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    // Re-check after layout settles
    const timer = setTimeout(update, 500);
    return () => { window.removeEventListener('scroll', update); clearTimeout(timer); };
  }, []);

  if (total === 0) return null;

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => {
            const sections = Array.from(document.querySelectorAll('.snap-section')) as HTMLElement[];
            if (sections[i]) window.scrollTo({ top: sections[i].offsetTop, behavior: 'smooth' });
          }}
          aria-label={`Go to section ${i + 1}`}
          className={`rounded-full transition-all duration-500 ${
            i === activeIdx
              ? 'w-2.5 h-2.5 bg-[#99ccff] shadow-[0_0_8px_rgba(153,204,255,0.5)]'
              : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
          }`}
        />
      ))}
    </div>
  );
};

/* ── Tagline Section — Badrutt's-style centered statement ── */
const hasScrollTimeline = typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()');

const TaglineSection: React.FC = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(hasScrollTimeline);

  useEffect(() => {
    if (hasScrollTimeline) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-[#f6f2e7] py-28 md:py-40 lg:py-48 px-8 text-center">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto sda-fade-up-slow ${
          !hasScrollTimeline ? `transition-all duration-[1.4s] ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` : ''
        }`}
      >
        <h2 style={{ fontFamily: "'PT Sans', sans-serif" }}>
          <span className="block text-[#1a1a1a] uppercase tracking-[0.14em] text-[clamp(1.4rem,3.5vw,2.8rem)] font-light leading-[1.3]">
            {t('In the Heart of the')}{' '}
            <em className="normal-case italic tracking-normal text-[#c5a059]">
              {t('Dolomites')}
            </em>
            .
          </span>
        </h2>
      </div>
    </section>
  );
};

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<ViewType>(() => {
    const path = window.location.pathname.replace(/^\//, '') as ViewType;
    const valid: ViewType[] = ['home', 'rooms', 'wellness', 'activities', 'dining', 'contact'];
    return valid.includes(path) ? path : 'home';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useSectionSnap(activeView === 'home');

  // Listen for browser back/forward
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const view = (e.state?.view as ViewType) || 'home';
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveView(view);
        window.scrollTo({ top: 0 });
        requestAnimationFrame(() => {
          setTimeout(() => setIsTransitioning(false), 50);
        });
      }, 400);
    };
    window.addEventListener('popstate', onPopState);
    // Replace current state so first entry has view info
    window.history.replaceState({ view: activeView }, '', activeView === 'home' ? '/' : `/${activeView}`);
    return () => window.removeEventListener('popstate', onPopState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateTo = (view: ViewType) => {
    if (view === activeView) {
      // If already on this view, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({ view }, '', view === 'home' ? '/' : `/${view}`);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveView(view);
      window.scrollTo({ top: 0 });
      requestAnimationFrame(() => {
        setTimeout(() => setIsTransitioning(false), 50);
      });
    }, 400);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'rooms':
        return <RoomsView />;
      case 'wellness':
        return <WellnessView />;
      case 'activities':
        return <WhatToDo />;
      case 'dining':
        return <DiningView />;
      case 'contact':
        return <ContactView />;
      default:
        return (
          <>
            <SkylineReveal onNavigate={navigateTo} />
            <DolomitesShowcase />
            <GallerySection onNavigate={navigateTo} />
            <OurJourney />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f1e3] text-[#1a1a1a] selection:bg-[#99ccff] selection:text-white">
      <Header onNavigate={navigateTo} activeView={activeView} />
      <SectionDots />

      <main className={`transition-all duration-400 ${isTransitioning ? 'opacity-0 scale-[0.99] blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
