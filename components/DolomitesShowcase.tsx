import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Typewriter } from './ui/typewriter';

const DolomitesShowcase: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [titleActive, setTitleActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visible) {
          setVisible(true);
          setTimeout(() => setTitleActive(true), 600);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      className="snap-section relative h-screen w-full overflow-hidden"
      data-header-transparent
    >
      {/* ── Video background ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/dolomites/pieve_cadore_video.mp4"
      />

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 bg-black/45" />

      {/* ── Text overlay ── */}
      <div className="relative z-10 flex items-center justify-center h-full px-6 md:px-12">
        <div className="max-w-4xl text-center">
          {/* Subtitle */}
          <p
            className={`text-white/50 uppercase tracking-[0.35em] text-[10px] md:text-xs font-semibold mb-6 transition-all duration-[1.4s] ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ fontFamily: "'PT Sans', sans-serif" }}
          >
            {t('A World Heritage Wonder')}
          </p>

          {/* Title */}
          <h2
            className={`mb-8 md:mb-10 text-4xl md:text-6xl lg:text-7xl text-white font-bold leading-none [&_strong]:text-[#c5a059] [&_strong]:italic transition-all duration-[1.6s] ease-out ${
              visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.92]'
            }`}
            style={{ fontFamily: "'PT Sans', sans-serif", transitionDelay: '0.2s' }}
          >
            {titleActive && (
              <Typewriter
                text={t('The Magic of the Dolomites')}
                speed={55}
                loop={false}
                showCursor={true}
                cursorChar="|"
                cursorClassName="ml-0.5 text-[#c5a059]/50"
                boldWords={['Dolomites']}
                initialDelay={300}
              />
            )}
          </h2>

          {/* Paragraph */}
          <p
            className={`text-white/85 text-[clamp(1rem,2vw,1.25rem)] leading-[2] font-light tracking-wide transition-all duration-[1.8s] ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ fontFamily: "'PT Sans', sans-serif", transitionDelay: '0.4s' }}
          >
            {t('In the heart of the Cadore Valley, where the Boite river carves its way beneath the mighty Monte Pelmo and Antelao, Hotel Al Pelmo has welcomed travellers since 1919. The')}{' '}
            <span className="relative inline-block font-semibold italic text-[#c5a059]">
              {t('Dolomites')}
              <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
            </span>{' '}
            {t('— a UNESCO World Heritage site — rise all around Pieve di Cadore, the historic birthplace of Titian. Their pale limestone towers blush pink and gold at every dawn and dusk, while below, the forests of larch and spruce give way to alpine meadows, glacial lakes like Lago di Centro Cadore, and centuries-old villages where Ladin traditions still live on.')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DolomitesShowcase;
