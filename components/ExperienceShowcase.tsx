import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

/* ─────────────────────────────────────────────────────────────────────────────
 * Experience data
 * ──────────────────────────────────────────────────────────────────────────── */

type Item = { name: string; description: string };

type Experience = {
  id: string;
  title: string;
  image: string;
  /** Bento-grid placement on >=md breakpoint (12-col) */
  span: string;
  intro: string;
  sections: { heading?: string; items: Item[] }[];
  cta?: { label: string; href: string; note?: string };
};

const LP_LINK =
  'https://lorenzopanzera.com/en?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn7XSiBQgL8iqqtH7vAQmeWtVJXBXTTm9eJRV0TNSseVnGxecfQZrB7zk5hFs_aem_lDxXJE4iZVl-RvU1pfcAJg';

const EXPERIENCES: Experience[] = [
  {
    id: 'hiking',
    title: 'Hiking',
    image: '/images/mountain_landscape_5.jpeg',
    span: 'md:col-span-8 md:row-span-2',
    intro:
      'From gentle pasture loops to the legendary peaks that crown the Cadore valley, the trails around Pieve are a living museum of the Dolomites.',
    sections: [
      {
        items: [
          {
            name: 'Rifugio Antelao',
            description:
              'A classic two-hour ascent from Pozzale di Cadore through larch forest to a sun-warmed terrace with sweeping views over the Cadore basin. A perfect first-day warm-up.',
          },
          {
            name: 'Vedorcia',
            description:
              'High pasture above Cibiana di Cadore — wide grassy plateau, grazing horses and a 360° amphitheatre of peaks. Family-friendly, great at sunset.',
          },
          {
            name: 'Antelao — King of the Dolomites',
            description:
              'The second-highest peak of the Dolomites (3,264 m). A serious alpine outing via the Galassi hut and the normal route. For experienced hikers, ideally with a mountain guide.',
          },
          {
            name: 'Anello del Pelmo',
            description:
              'The full loop around the iconic “Caregon del Padreterno”. Long, scenic, and crowned by the Rifugio Venezia — the soul of any Cadore hiking week.',
          },
          {
            name: 'Tre Cime di Lavaredo',
            description:
              'The UNESCO postcard of the Dolomites. A 10 km loop from Rifugio Auronzo, passing Lavaredo and Locatelli huts beneath the three sheer towers.',
          },
        ],
      },
    ],
  },
  {
    id: 'ski',
    title: 'Skiing & Snowboard',
    image: '/images/snow_3.jpeg',
    span: 'md:col-span-4 md:row-span-1',
    intro:
      'Three legendary domains within easy reach of the hotel — from the racing pistes of Cortina to the family-sized slopes of San Vito and Misurina.',
    sections: [
      {
        items: [
          {
            name: 'Cortina d’Ampezzo',
            description:
              'Tofana, Faloria and Cinque Torri — Olympic terrain, long red runs and some of the most photogenic chairlifts in the Alps. ~30 minutes by car.',
          },
          {
            name: 'San Vito di Cadore — Ski Civetta',
            description:
              'Quieter, perfectly groomed pistes at the foot of Mt. Antelao and Mt. Pelmo. Ideal for relaxed days and intermediate skiers.',
          },
          {
            name: 'Misurina',
            description:
              'A small, scenic resort beside the famous lake — gentle slopes for beginners and children, with the Tre Cime as a backdrop.',
          },
        ],
      },
    ],
    cta: {
      label: 'Book ski & snowboard lessons',
      href: LP_LINK,
      note: 'Private and group lessons with Lorenzo Panzera — certified mountain guide.',
    },
  },
  {
    id: 'bike',
    title: 'Mountain Biking',
    image: '/images/mountain_landscape_7.jpeg',
    span: 'md:col-span-4 md:row-span-1',
    intro:
      'Electric mountain bikes available for rent at the hotel — and a guiding service that opens up the whole valley, from forest singletrack to high-altitude crossings.',
    sections: [
      {
        items: [
          {
            name: 'e-MTB rentals',
            description:
              'Premium electric mountain bikes ready at reception. Helmets and route maps included.',
          },
          {
            name: 'Guided rides',
            description:
              'Personal MTB guiding through Lorenzo Panzera — choose your level, pace and itinerary.',
          },
          {
            name: 'Pieve di Cadore → Cortina d’Ampezzo',
            description:
              'The most-loved route of the valley. A spectacular ride along the old Dolomites railway, with viaducts, tunnels and the Pelmo–Antelao panorama. Around 30 km of pure beauty.',
          },
        ],
      },
    ],
    cta: {
      label: 'Book MTB guiding',
      href: LP_LINK,
    },
  },
  {
    id: 'lake',
    title: 'Lake Adventures',
    image: '/images/lago_estate.jpeg',
    span: 'md:col-span-4 md:row-span-1',
    intro:
      'Lago di Centro Cadore lies just below Pieve — a turquoise mountain lake circled by forest and dolomitic peaks.',
    sections: [
      {
        items: [
          {
            name: 'Kayak & SUP',
            description:
              'Glide across glass-still water in the early morning. Rentals available lakeside.',
          },
          {
            name: 'Swimming',
            description:
              'Designated bathing areas with crystal-clear alpine water — invigorating even in mid-summer.',
          },
          {
            name: 'Aperitivo at Miralago',
            description:
              'A waterfront classic — Aperol Spritz, local cheeses and the sun setting behind Mt. Antelao.',
          },
        ],
      },
    ],
  },
  {
    id: 'hub',
    title: 'Mountain Hub',
    image: '/images/interior_mountain_hub.jpeg',
    span: 'md:col-span-4 md:row-span-1',
    intro:
      'The high-altitude refuges of the Cadore are part shelter, part restaurant, part sanctuary — each one a destination of its own.',
    sections: [
      {
        items: [
          {
            name: 'Rifugio Antelao',
            description:
              'A short hike from Pozzale — sun terrace, hearty pasta, valley views.',
          },
          {
            name: 'Rifugio Ciareido',
            description:
              'Above Lozzo di Cadore, on the threshold of the Marmarole. Quiet, family-run, exceptional polenta.',
          },
          {
            name: 'Rifugio Chiggiato',
            description:
              'Perched on the southern flank of the Marmarole — one of the great balconies of the Dolomites.',
          },
          {
            name: 'Eremo dei Romiti',
            description:
              'A 17th-century hermitage carved into the rock above Pieve. A short, contemplative walk and an unforgettable place.',
          },
        ],
      },
    ],
  },
  {
    id: 'culture',
    title: 'Art & Culture',
    image: '/images/village_2.jpeg',
    span: 'md:col-span-4 md:row-span-1',
    intro:
      'Pieve di Cadore is the birthplace of Tiziano Vecellio — the master who would become Titian, court painter of emperors and popes. The town still carries his presence.',
    sections: [
      {
        items: [
          {
            name: 'Casa Natale di Tiziano',
            description:
              'The 15th-century house where Titian was born — preserved with original frescoes and period furnishings.',
          },
          {
            name: 'Museo dell’Occhiale',
            description:
              'A surprising, world-class museum dedicated to the Cadore tradition of eyewear-making — from Renaissance lenses to contemporary design.',
          },
          {
            name: 'Magnifica Comunità di Cadore',
            description:
              'The historic seat of the Cadore councils, now a museum with archeological finds, paintings and a small Titian gallery.',
          },
          {
            name: 'Arcidiaconale di Santa Maria Nascente',
            description:
              'The parish church that holds the “Madonna with Child and Saints”, painted by Titian himself for his hometown.',
          },
          {
            name: 'Piazza Tiziano & the old town',
            description:
              'Cobbled streets, the bronze statue of Titian, and historic cafés that have been pouring espresso since the 1800s.',
          },
        ],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────────────── */

const ExperienceShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId
    ? EXPERIENCES.find((e) => e.id === selectedId) ?? null
    : null;

  // ── Browser-history integration ─────────────────────────────────────────
  // Opening an experience pushes a marker entry so the browser Back button
  // closes the detail view instead of navigating away from the page.
  const open = useCallback((id: string) => {
    setSelectedId(id);
    if (typeof window !== 'undefined') {
      window.history.pushState({ experienceDetail: id }, '');
    }
  }, []);

  const close = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.state?.experienceDetail) {
      // Trigger popstate; the listener below will clear selectedId.
      window.history.back();
    } else {
      setSelectedId(null);
    }
  }, []);

  // Listen for the Back button (or programmatic history.back()).
  useEffect(() => {
    const onPop = () => {
      if (!window.history.state?.experienceDetail) {
        setSelectedId(null);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Esc to close
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, close]);

  return (
    <div className="relative max-w-[1400px] mx-auto px-4 md:px-8">
      <LayoutGroup id="experience-showcase">
        {/* ── Grid view ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {!selected && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-12 auto-rows-[260px] md:auto-rows-[260px] gap-3 md:gap-4"
            >
              {EXPERIENCES.map((exp, i) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  index={i}
                  onSelect={() => open(exp.id)}
                  t={t}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Detail view ───────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {selected && (
            <ExperienceDetail
              key={selected.id}
              experience={selected}
              onClose={close}
              t={t}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
};

export default ExperienceShowcase;

/* ─────────────────────────────────────────────────────────────────────────────
 * Card
 * ──────────────────────────────────────────────────────────────────────────── */

const ExperienceCard: React.FC<{
  experience: Experience;
  index: number;
  onSelect: () => void;
  t: (s: string) => string;
}> = ({ experience, index, onSelect, t }) => {
  return (
    <motion.button
      layoutId={`exp-card-${experience.id}`}
      onClick={onSelect}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.05 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        'group relative overflow-hidden text-left bg-[#0e0e0e]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#99ccff]',
        experience.span,
      ].join(' ')}
    >
      <motion.img
        layoutId={`exp-image-${experience.id}`}
        src={experience.image}
        alt={experience.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover saturate-[0.6] brightness-[0.85] transition-[filter,transform] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:saturate-100 group-hover:brightness-100 group-hover:scale-[1.04]"
      />

      {/* Bottom gradient — lifts the title without dominating the image */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-700 group-hover:opacity-90" />

      {/* Hairline frame on hover */}
      <div className="absolute inset-3 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Title block bottom-left */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
        <span
          aria-hidden
          className="block h-px w-8 bg-white/70 mb-4 origin-left transition-all duration-700 ease-out group-hover:w-24 group-hover:bg-[#99ccff]"
        />
        <h3
          className="text-white font-bold leading-[0.92] tracking-tight"
          style={{
            fontFamily: "'PT Sans', sans-serif",
            fontSize: 'clamp(1.5rem, 2.2vw, 2.25rem)',
          }}
        >
          {t(experience.title)}
        </h3>
      </div>
    </motion.button>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
 * Detail view
 * ──────────────────────────────────────────────────────────────────────────── */

const ExperienceDetail: React.FC<{
  experience: Experience;
  onClose: () => void;
  t: (s: string) => string;
}> = ({ experience, onClose, t }) => {
  const items = experience.sections.flatMap((s) => s.items);

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Close pill */}
      <motion.button
        onClick={onClose}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute -top-2 right-0 md:right-2 z-30 group flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] text-white text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#99ccff] hover:text-[#1a1a1a] transition-colors duration-300"
        style={{ fontFamily: "'PT Sans', sans-serif" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t('All experiences')}
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pt-6">
        {/* ── Image column (shared element) ────────────────────────────── */}
        <motion.div
          layoutId={`exp-card-${experience.id}`}
          className="lg:col-span-6 relative overflow-hidden bg-[#0e0e0e] aspect-[4/5] lg:aspect-auto lg:h-[78vh] lg:sticky lg:top-24"
        >
          <motion.img
            layoutId={`exp-image-${experience.id}`}
            src={experience.image}
            alt={experience.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </motion.div>

        {/* ── Content column ───────────────────────────────────────────── */}
        <div className="lg:col-span-6 lg:pt-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#1a1a1a] font-bold leading-[0.92] tracking-tight"
            style={{
              fontFamily: "'PT Sans', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            }}
          >
            {t(experience.title)}
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="origin-left mt-6 h-px bg-[#1a1a1a]/15"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-6 text-[#1a1a1a]/70 text-base md:text-[17px] leading-[1.7] font-light max-w-[58ch]"
            style={{ fontFamily: "'PT Sans', sans-serif" }}
          >
            {t(experience.intro)}
          </motion.p>

          {/* Bullet list */}
          <ul className="mt-10 space-y-7">
            {items.map((item, i) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.65 + i * 0.08,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="grid grid-cols-[auto_1fr] gap-5 md:gap-7 group"
              >
                <span
                  className="text-[#99ccff] text-[11px] font-bold tracking-[0.25em] mt-1.5 tabular-nums"
                  style={{ fontFamily: "'PT Sans', sans-serif" }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4
                    className="text-[#1a1a1a] font-bold text-lg md:text-xl tracking-tight"
                    style={{ fontFamily: "'PT Sans', sans-serif" }}
                  >
                    {t(item.name)}
                  </h4>
                  <p
                    className="mt-1.5 text-[#1a1a1a]/65 text-[15px] leading-[1.65] font-light"
                    style={{ fontFamily: "'PT Sans', sans-serif" }}
                  >
                    {t(item.description)}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          {experience.cta && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.65 + items.length * 0.08 + 0.1,
                duration: 0.6,
              }}
              className="mt-12 pt-8 border-t border-[#1a1a1a]/10"
            >
              <a
                href={experience.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 px-7 py-4 rounded-full bg-[#1a1a1a] text-white hover:bg-[#99ccff] hover:text-[#1a1a1a] transition-colors duration-300"
              >
                <span
                  className="text-sm font-bold tracking-[0.18em] uppercase"
                  style={{ fontFamily: "'PT Sans', sans-serif" }}
                >
                  {t(experience.cta.label)}
                </span>
                <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
              {experience.cta.note && (
                <p
                  className="mt-4 text-[#1a1a1a]/50 text-sm font-light max-w-[42ch]"
                  style={{ fontFamily: "'PT Sans', sans-serif" }}
                >
                  {t(experience.cta.note)}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
