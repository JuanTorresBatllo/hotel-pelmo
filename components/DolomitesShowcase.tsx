import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import BlurTextAnimation from './ui/blur-text-animation';

const DolomitesShowcase: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
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
        src="/images/dolomites/video_intro.mp4"
      />

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 bg-black/55" />

      {/* ── Blur text overlay ── */}
      <div className="relative z-10 flex items-center justify-center h-full px-6 md:px-12">
        <BlurTextAnimation
          texts={[
            t('The Magic of the Dolomites, discover the Cadore valley!'),
            t('We will bring you to the most iconic and unexplored areas from the Dolomiti Bellunesi.'),
          ]}
          fontSize="text-4xl md:text-6xl lg:text-7xl"
          fontFamily="'Obra Letra', cursive"
          textColor="text-white"
          holdDelay={2200}
          gapDelay={400}
        />
      </div>
    </section>
  );
};

export default DolomitesShowcase;
