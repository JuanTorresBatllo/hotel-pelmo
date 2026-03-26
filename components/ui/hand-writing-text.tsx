import React from "react";
import { motion } from "framer-motion";

interface HandWrittenTitleProps {
  title?: string;
  children?: React.ReactNode;
}

function HandWrittenTitle({
  title = "Hand Written",
  children,
}: HandWrittenTitleProps) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
        opacity: { duration: 0.5 },
      },
    },
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto" style={{ height: '50vh', minHeight: '360px' }}>
      <div className="absolute inset-0">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid meet"
          initial="hidden"
          animate="visible"
          className="w-full h-full"
        >
          <title>Hotel Al Pelmo</title>
          <motion.path
            d="M 950 90 
               C 1250 300, 1050 480, 600 520
               C 250 520, 150 480, 150 300
               C 150 120, 350 80, 600 80
               C 850 80, 950 180, 950 180"
            fill="none"
            strokeWidth="10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className="text-white/20"
          />
        </motion.svg>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <motion.h1
          className="uppercase"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(3rem, 10vw, 11rem)',
            lineHeight: 0.9,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.85)",
            textShadow:
              "0 0 40px rgba(153,204,255,0.15), 0 4px 20px rgba(0,0,0,0.4)",
            WebkitTextStroke: '0.5px rgba(255,255,255,0.3)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {title}
        </motion.h1>
        {children && (
          <motion.div
            className="mt-6 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export { HandWrittenTitle };
