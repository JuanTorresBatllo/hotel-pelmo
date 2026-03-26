
import React, { useRef, useEffect, useState } from 'react';
import { getConciergeResponse } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { FocusCards } from './ui/focus-cards';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Activity data ─── */
const activities = [
  {
    id: 'hiking',
    title: 'Hiking',
    image: '/images/mountain_landscape_5.jpeg',
    tall: true,
  },
  {
    id: 'ski',
    title: 'Skiing & Snowboard',
    image: '/images/snow_3.jpeg',
    tall: false,
  },
  {
    id: 'bike',
    title: 'Mountain Biking',
    image: '/images/mountain_landscape_7.jpeg',
    tall: true,
  },
  {
    id: 'lake',
    title: 'Lake Adventures',
    image: '/images/lago_estate.jpeg',
    tall: false,
  },
  {
    id: 'hub',
    title: 'Mountain Hub',
    image: '/images/interior_mountain_hub.jpeg',
    tall: false,
  },
  {
    id: 'culture',
    title: 'Art & Culture',
    image: '/images/village_2.jpeg',
    tall: true,
  },
];

/* ─── Quick suggestion chips for the AI ─── */
const quickChips = [
  'Easy family hike with kids',
  'Best ski slopes for beginners',
  'Mountain biking trails nearby',
  'Rainy day activities',
  'Romantic sunset viewpoints',
];

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/* ─── Main Component ─── */
const WhatToDo: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger reveals
  useEffect(() => {
    // Set initial hidden state immediately
    gsap.set('[data-wtd-header]', { opacity: 0, y: 60 });
    gsap.set('[data-wtd-card]', { opacity: 0, y: 80 });

    // Small delay so layout settles after mount
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Header reveal
        gsap.to('[data-wtd-header]', {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-wtd-header]',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        // Grid items — staggered waterfall reveal
        const cards = gsap.utils.toArray<HTMLElement>('[data-wtd-card]');
        cards.forEach((card) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
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

  // FAB reveal — separate from scoped GSAP context since it's position:fixed
  useEffect(() => {
    const fab = fabRef.current;
    const grid = gridRef.current;
    if (!fab || !grid) return;

    gsap.set(fab, { scale: 0, rotation: -90, opacity: 0 });

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(fab, {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
          });
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(grid);
    return () => obs.disconnect();
  }, []);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Ciao! 👋 I'm your local Dolomites advisor. Before I suggest anything — what kind of experience are you looking for? Something active and adventurous, or more relaxed and scenic? And who are you traveling with?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customText?: string) => {
    const userMsg = (customText || input).trim();
    if (!userMsg || isTyping) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const contextPrompt = `The user is asking about outdoor activities around Pieve di Cadore and the Dolomites. 
They are staying at Hotel Al Pelmo. Please suggest activities tailored to their request, considering difficulty level, season, and group type. 
Be warm, concise, and use light formatting. User message: ${userMsg}`;

    const response = await getConciergeResponse(contextPrompt);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  return (
    <div ref={sectionRef} className="selection:bg-[#99ccff]/20">

      {/* ── Sticky hero image — stays pinned while content scrolls over it ── */}
      <div className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1733652106206-a944d460920b?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover object-[center_60%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
          <div className="absolute inset-0 flex items-end pb-20 px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl">
              <span className="text-[#99ccff] font-semibold tracking-[0.5em] uppercase text-[10px] mb-8 block">{t('Explore')}</span>
              <h1 className="overflow-hidden mb-8" style={{ fontFamily: "'PT Sans', sans-serif" }}>
                {['What to Do'].map((line, i) => (
                  <span
                    key={i}
                    className="block font-bold text-white"
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
                {t('Discover the best of the Dolomites — from alpine trails and ski slopes to hidden lakes and cultural gems.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content section — overlaps and covers the sticky image ── */}
      <div className="relative bg-[#f5f2ed] -mt-[100vh]" style={{ zIndex: 1 }}>

      {/* ── Hero header — centered title + description ── */}
      <div
        data-wtd-header
        className="flex flex-col items-center justify-center text-center px-8 pt-32 pb-20 md:pt-44 md:pb-28"
      >
        <h1
          className="text-5xl md:text-7xl lg:text-8xl text-[#1a1a1a] font-light tracking-tight leading-[0.95]"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('Experiences')}
        </h1>
        <p
          className="mt-8 max-w-2xl text-[#1a1a1a]/50 text-base md:text-lg font-light leading-relaxed"
          style={{ fontFamily: "'PT Sans', sans-serif" }}
        >
          {t('Visiting the Dolomites means leaving the daily routine behind. After your journey through the mountains, find an idyllic setting, an archaic alpine landscape, and room for new adventures. Explore our activities and experiences.')}
        </p>
      </div>

      {/* ── Focus Cards grid ── */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-28 md:pb-40">
        <FocusCards cards={activities.map(a => ({ title: t(a.title), src: a.image }))} />
      </div>

      {/* ── Floating AI Chat Widget ── */}
      <div ref={fabRef} className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        {/* Expanded chat panel */}
        <div
          className={`absolute bottom-20 right-0 w-[340px] md:w-[400px] bg-white rounded-2xl shadow-[0_16px_70px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-500 ease-out origin-bottom-right ${
            chatOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Chat header */}
          <div className="bg-gradient-to-r from-[#99ccff] to-[#7ab8ff] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg backdrop-blur-sm">
                ✨
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">{t('Ask Gildo')}</h3>
                <span className="text-white/70 text-[10px] uppercase tracking-[0.3em] font-bold">{t('AI Concierge')}</span>
              </div>
            </div>
          </div>

          {/* Quick chips */}
          <div className="px-5 pt-4 pb-2 flex flex-wrap gap-1.5">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className="text-[10px] font-semibold text-[#1a1a1a]/50 bg-[#1a1a1a]/[0.04] hover:bg-[#99ccff]/[0.12] hover:text-[#99ccff] px-3 py-1.5 rounded-full transition-all duration-300"
              >
                {t(chip)}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div ref={chatScrollRef} className="h-[300px] overflow-y-auto px-5 py-3 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#99ccff] to-[#b3d9ff] flex items-center justify-center text-white text-xs mr-2 mt-1 flex-shrink-0">
                    ✨
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 text-[13px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#1a1a1a] text-white rounded-2xl rounded-br-sm shadow-md'
                      : 'bg-[#f5f2ed] text-[#1a1a1a]/70 rounded-2xl rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#99ccff] to-[#b3d9ff] flex items-center justify-center text-white text-xs">
                  ✨
                </div>
                <div className="bg-[#f5f2ed] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#99ccff]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#99ccff]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#99ccff]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-5 pb-5 pt-2 border-t border-[#1a1a1a]/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('Ask me anything...')}
                className="flex-1 bg-[#f5f2ed] text-[#1a1a1a] text-sm px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#99ccff]/30 transition-all placeholder:text-[#1a1a1a]/30 font-light"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="w-11 h-11 bg-[#99ccff] hover:bg-[#7ab8ff] text-white rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* FAB button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`shadow-[0_8px_30px_rgba(153,204,255,0.4)] flex items-center justify-center transition-all duration-500 hover:shadow-[0_12px_40px_rgba(153,204,255,0.5)] hover:scale-105 active:scale-95 ${
            chatOpen
              ? 'w-14 h-14 rounded-full bg-[#1a1a1a]'
              : 'h-14 px-6 gap-2.5 rounded-full bg-gradient-to-br from-[#99ccff] to-[#7ab8ff]'
          }`}
        >
          {chatOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <span className="text-lg">✨</span>
              <span className="text-white font-semibold text-sm tracking-wide" style={{ fontFamily: "'PT Sans', sans-serif" }}>{t('Ask Gildo')}</span>
            </>
          )}
        </button>
      </div>
      </div>{/* end content wrapper */}
    </div>
  );
};

export default WhatToDo;
