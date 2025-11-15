
"use client";

import React, { useEffect } from 'react';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashProps {
  delay?: number; // seconds
  duration?: number; // seconds
  particleCount?: number;
  showLogo?: boolean;
  onAnimationComplete?: () => void;
}

const Particle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      width: 8,
      height: 8,
      borderRadius: 9999,
      backgroundColor: 'rgba(255,255,255,0.08)',
      ...style,
    }}
  />
);

export default function SplashScreen({ delay = 0.3, duration = 1.0, particleCount = 40, showLogo = true, onAnimationComplete }: SplashProps) {
  useEffect(() => {
    const total = (delay + duration) * 1000 + 200; // small buffer
    const t = setTimeout(() => onAnimationComplete && onAnimationComplete(), total);
    return () => clearTimeout(t);
  }, [delay, duration, onAnimationComplete]);

  // Generate simple particle positions
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const left = Math.round(Math.random() * 100);
    const top = Math.round(Math.random() * 100);
    const size = Math.round(4 + Math.random() * 8);
    const opacity = 0.05 + Math.random() * 0.15;
    return { id: i, left: `${left}%`, top: `${top}%`, size, opacity };
  });

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay, duration } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const logoVariant = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: delay + 0.1, duration: duration } },
  };

  return (
    <AnimatePresence>
      <motion.div initial="hidden" animate="visible" exit="exit" variants={container} className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
        <div className="relative w-full h-full">
          {/* Particles */}
          {particles.map(p => (
            <Particle key={p.id} style={{ left: p.left, top: p.top, width: p.size, height: p.size, opacity: p.opacity }} />
          ))}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div variants={logoVariant} className="pointer-events-auto text-center">
                  {showLogo ? (
                    <div className="w-28 h-28 mx-auto rounded-lg bg-white/5 flex items-center justify-center shadow-lg">
                      {/* Replace with your svg/logo file */}
                      <NextImage src="/your-logo.svg" alt="HeliosHash" width={80} height={80} />
                    </div>
              ) : (
                <div className="text-3xl font-bold text-white">HeliosHash</div>
              )}

              <p className="mt-4 text-sm text-white/80">Initializing dashboard…</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
