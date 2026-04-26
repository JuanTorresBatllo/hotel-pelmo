"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

interface WordData {
  text: string;
  duration: number;
  delay: number;
  blur: number;
  scale?: number;
}

interface BlurTextAnimationProps {
  text?: string;
  texts?: string[];
  words?: WordData[];
  className?: string;
  fontSize?: string;
  fontFamily?: string;
  textColor?: string;
  /** Pause (ms) while text is fully visible before fading out */
  holdDelay?: number;
  /** Pause (ms) between sentences */
  gapDelay?: number;
}

function buildWords(sentence: string): WordData[] {
  const splitWords = sentence.split(" ");
  const totalWords = splitWords.length;
  return splitWords.map((word, index) => {
    const progress = index / totalWords;
    const exponentialDelay = Math.pow(progress, 0.8) * 0.25;
    const baseDelay = index * 0.035;
    const microVariation = (Math.sin(index * 137.5) * 0.5) * 0.03;
    return {
      text: word,
      duration: 1.4 + Math.cos(index * 0.3) * 0.2,
      delay: baseDelay + exponentialDelay + microVariation,
      blur: 12 + (index % 8),
      scale: 0.9 + Math.sin(index * 0.2) * 0.05,
    };
  });
}

export default function BlurTextAnimation({
  text,
  texts,
  words,
  className = "",
  fontSize = "text-4xl md:text-6xl lg:text-7xl",
  fontFamily = "'Obra Letra', cursive",
  textColor = "text-white",
  holdDelay = 2200,
  gapDelay = 400,
}: BlurTextAnimationProps) {
  // Resolve the list of sentences to cycle through
  const sentences = useMemo<string[]>(() => {
    if (texts && texts.length > 0) return texts;
    if (text) return [text];
    return ["The Magic of the Dolomites"];
  }, [text, texts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const t1 = useRef<ReturnType<typeof setTimeout>>();
  const t2 = useRef<ReturnType<typeof setTimeout>>();
  const t3 = useRef<ReturnType<typeof setTimeout>>();

  const currentWords = useMemo<WordData[]>(() => {
    if (words && sentences.length === 1) return words;
    return buildWords(sentences[currentIndex] ?? "");
  }, [sentences, currentIndex, words]);

  useEffect(() => {
    const clearAll = () => {
      clearTimeout(t1.current);
      clearTimeout(t2.current);
      clearTimeout(t3.current);
    };

    clearAll();

    const maxAnimTime = currentWords.reduce(
      (acc, w) => Math.max(acc, w.delay + w.duration),
      0,
    );

    // Fade in
    t1.current = setTimeout(() => setIsAnimating(true), 200);

    // Hold → fade out
    t2.current = setTimeout(
      () => setIsAnimating(false),
      (maxAnimTime + 1) * 1000 + holdDelay,
    );

    // Advance to next sentence
    t3.current = setTimeout(
      () => {
        setCurrentIndex((prev) => (prev + 1) % sentences.length);
      },
      (maxAnimTime + 1) * 1000 + holdDelay + gapDelay + 600, // +600ms fade-out buffer
    );

    return clearAll;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, sentences.length, holdDelay, gapDelay]);

  return (
    <div className={`text-center ${className}`}>
      <p
        className={`${textColor} ${fontSize} font-bold leading-tight tracking-tight`}
        style={{ fontFamily }}
      >
        {currentWords.map((word, index) => (
          <span
            key={`${currentIndex}-${index}`}
            className="inline-block transition-all"
            style={{
              transitionDuration: `${word.duration}s`,
              transitionDelay: `${word.delay}s`,
              transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              opacity: isAnimating ? 1 : 0,
              filter: isAnimating
                ? "blur(0px) brightness(1)"
                : `blur(${word.blur}px) brightness(0.6)`,
              transform: isAnimating
                ? "translateY(0) scale(1) rotateX(0deg)"
                : `translateY(20px) scale(${word.scale ?? 1}) rotateX(-15deg)`,
              marginRight: "0.35em",
              willChange: "filter, transform, opacity",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              textShadow: isAnimating
                ? "0 2px 8px rgba(255,255,255,0.1)"
                : "0 0 40px rgba(255,255,255,0.4)",
            }}
          >
            {word.text}
          </span>
        ))}
      </p>
    </div>
  );
}

