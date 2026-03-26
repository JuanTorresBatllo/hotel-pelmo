
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const distanceData = [
  { placeKey: 'Venice Airport', time: "1h 20'" },
  { placeKey: 'Treviso Airport', time: "1h 05'" },
  { placeKey: 'Venice/Mestre Train Station', time: "1h 40'" },
  { placeKey: 'Verona Airport', time: "2h" },
];

const ContactView: React.FC = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [cascadeRevealed, setCascadeRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger reveals
  useEffect(() => {
    gsap.set('[data-contact-header]', { opacity: 0, y: 60 });
    gsap.set('[data-contact-section]', { opacity: 0, y: 80 });

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Header reveal
        gsap.to('[data-contact-header]', {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-contact-header]',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onComplete: () => setCascadeRevealed(true),
        });

        // Section reveals
        gsap.utils.toArray<HTMLElement>('[data-contact-section]').forEach((el) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-[#fdfbf7] selection:bg-[#99ccff]/20">
      {/* ── Sticky hero wrapper ── */}
      <div className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <img
            src="/Pelmo_fotos/pieve_foto.JPEG"
            alt={t('Mountain village in the Dolomites')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
          <div className="absolute inset-0 flex items-end pb-20 px-8 md:px-16 lg:px-24">
            <div data-contact-header className="max-w-4xl">
            <span className="text-[#99ccff] font-semibold tracking-[0.5em] uppercase text-[10px] mb-8 block">{t('Contact')}</span>
            <h1 className="overflow-hidden mb-8" style={{ fontFamily: "'PT Sans', sans-serif" }}>
              {['Get in', 'Touch'].map((line, i) => (
                <span
                  key={i}
                  className={`hero-cascade-line ${cascadeRevealed ? 'is-revealed' : ''} ${
                    i === 1 ? 'font-light italic text-white/80' : 'font-bold text-white'
                  }`}
                  style={{
                    fontSize: 'clamp(3.5rem, 10vw, 11rem)',
                    lineHeight: 0.9,
                    transitionDelay: `${0.3 + i * 0.2}s`,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {t(line)}
                </span>
              ))}
            </h1>
            <p className="text-white/60 font-light text-lg md:text-xl max-w-lg leading-relaxed">
              {t("We'd love to hear from you. Reach out for reservations, special requests, or simply to say hello.")}
            </p>
          </div>
        </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-bounce">
            <span className="text-white/40 text-[9px] uppercase tracking-[0.4em]">{t('Discover')}</span>
            <div className="w-[1px] h-8 bg-white/30" />
          </div>
        </div>
      </div>

      {/* ── Content section — overlaps and covers the sticky hero ── */}
      <div className="relative bg-[#fdfbf7] -mt-[100vh]" style={{ zIndex: 1 }}>
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left — info side */}
          <div data-contact-section className="lg:w-[45%] bg-[#1a1a1a] text-white px-8 py-20 md:px-16 lg:px-20 flex items-center">
            <div className="max-w-md w-full space-y-12">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-[#99ccff]" />
                  <span className="text-[#99ccff] font-semibold tracking-[0.4em] uppercase text-[10px]">{t('Direct Channels')}</span>
                </div>
                <div className="space-y-8">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold mb-2">{t('Call Us')}</p>
                    <a href="tel:+390435500900" className="text-3xl md:text-4xl font-bold text-white hover:text-[#99ccff] transition-colors" style={{ fontFamily: "'PT Sans', sans-serif" }}>
                      +39 0435 500900
                    </a>
                  </div>
                  <div className="w-full h-[1px] bg-white/10" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold mb-2">{t('Email')}</p>
                    <a href="mailto:info@hotelpelmo.it" className="text-xl text-white hover:text-[#99ccff] transition-colors font-light">
                      info@hotelpelmo.it
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-[#99ccff]" />
                  <span className="text-[#99ccff] font-semibold tracking-[0.4em] uppercase text-[10px]">{t('Location')}</span>
                </div>
                <p className="text-xl text-white/70 font-light leading-relaxed">
                  Via Nazionale 60<br />
                  Pieve di Cadore, Belluno<br />
                  Italia
                </p>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-[#99ccff]" />
                  <span className="text-[#99ccff] font-semibold tracking-[0.4em] uppercase text-[10px]">{t('Getting Here')}</span>
                </div>
                <div className="space-y-0">
                  {distanceData.map((item, idx) => (
                    <div key={idx} className="group cursor-default border-b border-white/6 last:border-0 py-5 first:pt-0">
                      <div className="flex justify-between items-baseline">
                        <p className="text-white/70 font-light text-[15px] group-hover:text-white transition-colors duration-300">{t(item.placeKey)}</p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-px bg-white/10 group-hover:w-14 group-hover:bg-[#99ccff]/40 transition-all duration-500" />
                          <span className="text-sm font-mono font-bold text-[#99ccff]/70 group-hover:text-[#99ccff] transition-colors duration-300 tabular-nums">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — form side */}
          <div data-contact-section className="lg:w-[55%] bg-[#fdfbf7] px-8 py-20 md:px-16 lg:px-24 flex items-center">
            <div className="max-w-lg w-full mx-auto">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-20">
                  <div className="w-20 h-20 border-2 border-[#99ccff] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#99ccff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl text-[#1a1a1a] mb-2 font-bold" style={{ fontFamily: "'PT Sans', sans-serif" }}>{t('Thank you!')}</h3>
                    <p className="text-gray-500 font-light">{t("We'll be in touch shortly. Arrivederci!")}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-[1px] bg-[#99ccff]" />
                      <span className="text-[#99ccff] font-semibold tracking-[0.4em] uppercase text-[10px]">{t('Write to Us')}</span>
                    </div>
                    <h3 className="font-bold text-[#1a1a1a] mb-3 leading-[0.95]" style={{ fontFamily: "'PT Sans', sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>{t('Send a Message')}</h3>
                    <p className="text-gray-400 font-light">{t('Each stay is tailored by our concierge.')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold block mb-3">{t('Name')}</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-transparent border-b border-gray-200 pb-3 text-[#1a1a1a] placeholder:text-gray-300 focus:border-[#99ccff] outline-none transition-all"
                        placeholder={t('Your name')}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold block mb-3">{t('Email')}</label>
                      <input
                        required
                        type="email"
                        className="w-full bg-transparent border-b border-gray-200 pb-3 text-[#1a1a1a] placeholder:text-gray-300 focus:border-[#99ccff] outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold block mb-3">{t('Message')}</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full bg-transparent border-b border-gray-200 pb-3 text-[#1a1a1a] placeholder:text-gray-300 focus:border-[#99ccff] outline-none transition-all resize-none"
                      placeholder={t('Describe your ideal retreat...')}
                    />
                  </div>

                  <button
                    type="submit"
                    className="group/btn relative inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-[#1a1a1a] hover:text-[#99ccff] transition-colors"
                  >
                    <span>{t('Send Message')}</span>
                    <div className="w-12 h-[1px] bg-current group-hover/btn:w-20 transition-all duration-500" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps Section — full width */}
        <section className="relative">
          <div data-contact-section>
            <div className="relative w-full h-[60vh]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2746.8!2d12.3752!3d46.4306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477830d4c2b8b8ed%3A0x5a0b1e8e5a0b1e8e!2sVia%20Nazionale%2C%2060%2C%2032044%20Pieve%20di%20Cadore%20BL%2C%20Italy!5e0!3m2!1sen!2sit!4v1700000000000!5m2!1sen!2sit&maptype=satellite"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Al Pelmo Location"
                style={{ filter: 'saturate(0.85) contrast(1.05)' }}
              />

              {/* Floating Info Card */}
              <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 md:w-96 bg-white/95 backdrop-blur-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <h4 className="text-xl text-[#1a1a1a] font-bold mb-1" style={{ fontFamily: "'PT Sans', sans-serif" }}>Hotel Al Pelmo</h4>
                <p className="text-gray-500 text-sm font-light leading-relaxed mb-4">
                  Via Nazionale 60<br />
                  32044 Pieve di Cadore (BL)
                </p>
                <a
                  href="https://www.google.com/maps/dir//Via+Nazionale+60,+32044+Pieve+di+Cadore+BL,+Italy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#99ccff] hover:text-[#1a1a1a] transition-colors group/link"
                >
                  {t('Get Directions')}
                  <div className="w-8 h-[1px] bg-current group-hover/link:w-14 transition-all duration-500" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactView;

