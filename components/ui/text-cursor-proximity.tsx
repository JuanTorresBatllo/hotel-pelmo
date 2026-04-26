import React, { CSSProperties, forwardRef, useRef } from 'react';
import { useAnimationFrame } from 'framer-motion';
import { useMousePositionRef } from '../../hooks/use-mouse-position-ref';

// ── Interpolation helpers ──────────────────────────────────────────────────

function lerpNum(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function interpolateValue(from: string | number, to: string | number, t: number): string {
  if (typeof from === 'number' && typeof to === 'number') {
    return String(Math.round(lerpNum(from, to, t)));
  }
  const fs = String(from);
  const ts = String(to);
  const fRgb = hexToRgb(fs);
  const tRgb = hexToRgb(ts);
  if (fRgb && tRgb) {
    const r = Math.round(lerpNum(fRgb[0], tRgb[0], t));
    const g = Math.round(lerpNum(fRgb[1], tRgb[1], t));
    const b = Math.round(lerpNum(fRgb[2], tRgb[2], t));
    return `rgb(${r},${g},${b})`;
  }
  const fromNums = fs.match(/-?\d+(\.\d+)?/g);
  const toNums   = ts.match(/-?\d+(\.\d+)?/g);
  if (fromNums && toNums && fromNums.length === toNums.length) {
    let i = 0;
    return fs.replace(/-?\d+(\.\d+)?/g, () => {
      const val = lerpNum(parseFloat(fromNums[i]), parseFloat(toNums[i]), t);
      i++;
      return String(parseFloat(val.toFixed(4)));
    });
  }
  return t < 0.5 ? fs : ts;
}

// ── Types ──────────────────────────────────────────────────────────────────

type CSSPropertiesWithValues = {
  [K in keyof CSSProperties]: string | number;
};

interface StyleValue<T extends keyof CSSPropertiesWithValues> {
  from: CSSPropertiesWithValues[T];
  to: CSSPropertiesWithValues[T];
}

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  styles: Partial<{ [K in keyof CSSPropertiesWithValues]: StyleValue<K> }>;
  containerRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
}

// ── Component ──────────────────────────────────────────────────────────────

const TextCursorProximity = forwardRef<HTMLSpanElement, TextProps>(
  ({ label, styles, containerRef, radius = 50, falloff = 'linear', className, onClick, ...props }, ref) => {
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const mousePositionRef = useMousePositionRef(containerRef);

    const styleEntries = Object.entries(styles) as [string, { from: any; to: any }][];

    const calcFalloff = (distance: number): number => {
      const n = Math.min(Math.max(1 - distance / radius, 0), 1);
      if (falloff === 'exponential') return n * n;
      if (falloff === 'gaussian') return Math.exp(-Math.pow(distance / (radius / 2), 2) / 2);
      return n;
    };

    // Only top-level hooks — no conditionals, no loops around hooks.
    useAnimationFrame(() => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      letterRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - containerRect.left;
        const cy = rect.top + rect.height / 2 - containerRect.top;
        const dx = mousePositionRef.current.x - cx;
        const dy = mousePositionRef.current.y - cy;
        const proximity = calcFalloff(Math.sqrt(dx * dx + dy * dy));
        styleEntries.forEach(([key, value]) => {
          (el.style as any)[key] = interpolateValue(value.from, value.to, proximity);
        });
      });
    });

    const words = label.split(' ');
    let letterIndex = 0;

    return (
      <span ref={ref} className={`${className ?? ''} inline`} onClick={onClick} {...props}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split('').map((letter) => {
              const idx = letterIndex++;
              return (
                <span
                  key={idx}
                  ref={(el) => { letterRefs.current[idx] = el; }}
                  className="inline-block"
                  aria-hidden="true"
                  style={{ willChange: 'transform, color, font-weight' }}
                >
                  {letter}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
        <span className="sr-only">{label}</span>
      </span>
    );
  }
);

TextCursorProximity.displayName = 'TextCursorProximity';
export default TextCursorProximity;
export { TextCursorProximity };
