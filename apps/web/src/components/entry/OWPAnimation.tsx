"use client"

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

// Deterministic pseudo-random number generator for stable SSR
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

interface Particle {
  id: number;
  width: number;
  height: number;
  left: number;
  top: number;
  background: string;
  opacity: number;
  duration: number;
  delay: number;
  dx: number;
}

export default function OWPAnimation({ onComplete }: { onComplete: () => void }) {
  const [mounted, setMounted] = useState(false);

  // In dev or when explicitly disabled, render a lightweight static placeholder
  // To force the heavy animation even in development, set NEXT_PUBLIC_FORCE_HEAVY_SPLASH=true
  const forceHeavySplash = process.env.NEXT_PUBLIC_FORCE_HEAVY_SPLASH === 'true'
  const disableHeavy = !forceHeavySplash && (process.env.NEXT_PUBLIC_DISABLE_SPLASH === 'true' || process.env.NODE_ENV !== 'production')
  // Pre-generate stable particle data to avoid hydration mismatch
  // Keep hooks unconditionally at top level. When in dev/lightweight mode the memo will return an empty array.
  const particles = useMemo<Particle[]>(() => {
    if (disableHeavy) return [];
    return Array.from({ length: 60 }, (_, i) => {
      const seed = i * 7.3891; // Unique seed per particle
      return {
        id: i,
        width: seededRandom(seed) * 5 + 2,
        height: seededRandom(seed + 1) * 5 + 2,
        left: seededRandom(seed + 2) * 100,
        top: seededRandom(seed + 3) * 100,
        background: ['#fbbf24', '#f59e0b', '#22d3ee', '#06b6d4', '#10b981'][Math.floor(seededRandom(seed + 4) * 5)],
        opacity: seededRandom(seed + 5) * 0.7 + 0.2,
        duration: seededRandom(seed + 6) * 3 + 2,
        delay: seededRandom(seed + 7) * 2,
        dx: seededRandom(seed + 8) * 30 - 15,
      } as Particle;
    });
  }, [disableHeavy]);

  // Unconditional effect that handles both lightweight and heavy paths
  useEffect(() => {
    if (disableHeavy) {
      const t = setTimeout(onComplete, 300)
      return () => clearTimeout(t)
    }

    setMounted(true)
    const timer = setTimeout(onComplete, 5000)
    return () => clearTimeout(timer)
  }, [disableHeavy, onComplete])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black overflow-hidden">
      {/* Animated energy particles */}
      <div className="absolute inset-0">
        {particles.map((particle: Particle) => {
          const styleVars = { ['--dx']: `${particle.dx}px` } as Record<string, string> & React.CSSProperties;
          const style: React.CSSProperties = {
            ...styleVars,
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            background: particle.background,
            opacity: particle.opacity,
            animation: `energyFloat ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          };

          return (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={style}
            />
          )
        })}
      </div>

      {/* Main OWP Container */}
      <div className={`relative transition-all duration-1500 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        {/* Multi-layered glow effects */}
        <div className="absolute inset-0 animate-pulse">
          <div className="w-[500px] h-[500px] bg-amber-500 rounded-full blur-3xl opacity-30"></div>
        </div>
        <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <div className="w-[500px] h-[500px] bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="w-[500px] h-[500px] bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
        </div>

        {/* Outer decorative ring - slow reverse rotation */}
        <div className="relative w-[500px] h-[500px] animate-spin-very-slow-reverse">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            {/* Ornate outer frame with golden accents */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="url(#goldGradient)" strokeWidth="2" opacity="0.8" />

            {/* Decorative elements around the circle */}
            {[...Array(24)].map((_, i) => {
              const angle = (i * 360) / 24;
              return (
                <g key={`deco-${i}`} transform={`rotate(${angle} 100 100)`}>
                  <circle cx="100" cy="5" r="2" fill="#fbbf24" opacity="0.9">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.08}s`} />
                  </circle>
                  <path
                    d="M 100 8 Q 98 12 100 15 Q 102 12 100 8"
                    fill="url(#goldGradient)"
                    opacity="0.7"
                  />
                </g>
              );
            })}

            <defs>
              <linearGradient id="goldGradient">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Rotating sunburst rays - medium speed */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
          <svg viewBox="0 0 200 200" className="w-[480px] h-[480px]">
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              return (
                <g key={`ray-${i}`} transform={`rotate(${angle} 100 100)`}>
                  <path
                    d="M 100 50 L 105 90 L 100 85 L 95 90 Z"
                    fill="url(#rayGradient)"
                    opacity="0.6"
                  >
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
                  </path>
                </g>
              );
            })}
            <defs>
              <linearGradient id="rayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Tech elements ring - counter rotation */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-medium-reverse">
          <svg viewBox="0 0 200 200" className="w-[420px] h-[420px]">
            {/* Server icons */}
            {[0, 90, 180, 270].map((angle, idx) => (
              <g key={`server-${idx}`} transform={`rotate(${angle} 100 100)`}>
                <rect x="95" y="25" width="10" height="8" fill="#22d3ee" opacity="0.8" rx="1">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                </rect>
                <rect x="95" y="34" width="10" height="2" fill="#06b6d4" opacity="0.6" />
              </g>
            ))}

            {/* Bitcoin symbols */}
            {[45, 135].map((angle, idx) => (
              <g key={`btc-${idx}`} transform={`rotate(${angle} 100 100)`}>
                <circle cx="100" cy="30" r="6" fill="#fbbf24" opacity="0.9">
                  <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="100" y="33.5" fontSize="8" fill="#1e293b" fontWeight="bold" textAnchor="middle">₿</text>
              </g>
            ))}

            {/* Cube/block elements */}
            {[225, 315].map((angle, idx) => (
              <g key={`cube-${idx}`} transform={`rotate(${angle} 100 100)`}>
                <rect x="95" y="25" width="10" height="10" fill="#10b981" opacity="0.7" rx="1">
                  <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
                </rect>
              </g>
            ))}
          </svg>
        </div>

        {/* Central logo medallion with circuit pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48 animate-pulse-slow">
            {/* Circuit board background */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="90" fill="#1e293b" opacity="0.95" />
              <circle cx="100" cy="100" r="85" fill="#0f172a" />

              {/* Circuit traces */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 360) / 12;
                const rad = (angle * Math.PI) / 180;
                const x1 = 100 + 40 * Math.cos(rad);
                const y1 = 100 + 40 * Math.sin(rad);
                const x2 = 100 + 75 * Math.cos(rad);
                const y2 = 100 + 75 * Math.sin(rad);
                return (
                  <g key={`circuit-${i}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="0.5" opacity="0.4" />
                    <circle cx={x2} cy={y2} r="2" fill="#06b6d4" opacity="0.6">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                    </circle>
                  </g>
                );
              })}

              {/* Center circle with glow */}
              <circle cx="100" cy="100" r="35" fill="url(#centerGradient)" />
              <circle cx="100" cy="100" r="32" fill="#1e3a8a" opacity="0.8" />

              <defs>
                <radialGradient id="centerGradient">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </radialGradient>
              </defs>
            </svg>

            {/* HeliosHash Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-24 h-24" style={{ filter: 'drop-shadow(0 0 20px rgba(34,211,238,0.6))' }}>
                <Image src="/hhdaologo.svg" alt="HeliosHash" fill className="object-contain" priority />
              </div>
            </div>
          </div>
        </div>

        {/* Inner rotating ring with data flow effect */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-fast">
          <svg viewBox="0 0 200 200" className="w-[340px] h-[340px]">
            <circle cx="100" cy="100" r="60" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
            </circle>

            {/* Data packets */}
            {[...Array(8)].map((_, i) => (
              <circle key={`packet-${i}`} cx="100" cy="40" r="2" fill="#fbbf24" opacity="0.8">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`${i * 45} 100 100`}
                  to={`${i * 45 + 360} 100 100`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>
        </div>

        {/* Central blue glow pulse */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        </div>
      </div>

      {/* Title and tagline */}
      <div className={`absolute bottom-20 text-center transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 mb-3" style={{ textShadow: '0 0 30px rgba(251,191,36,0.5)' }}>
          HeliosHash DAO
        </h1>
        <p className="text-orange-300 text-xl mb-2 tracking-wide" style={{ textShadow: '0 0 10px rgba(251, 146, 60, 0.5)' }}>
          From Sunlight to Sovereignty
        </p>
        <p className="text-cyan-300 text-base font-semibold tracking-widest" style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.5)' }}>
          Truth • Equality • Freedom
        </p>
      </div>

      <style jsx>{`
        @keyframes energyFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.2;
          }
          50% {
            /* Use CSS variable --dx provided per-particle to avoid nondeterminism */
            transform: translateY(-40px) translateX(var(--dx, 0px)) scale(1.5);
            opacity: 0.9;
          }
        }

        .animate-spin-very-slow-reverse {
          animation: spin 20s linear infinite reverse;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        .animate-spin-medium-reverse {
          animation: spin 6s linear infinite reverse;
        }

        .animate-spin-fast {
          animation: spin 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
