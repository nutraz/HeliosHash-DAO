"use client";

import React, { useEffect, useState, useMemo } from 'react'

interface Particle {
  id: number
  width: number
  height: number
  left: number
  top: number
  background: string
  opacity: number
  duration: number
  delay: number
}

export default function AshokChakraEntry({ onComplete }: { onComplete?: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)

  // Generate stable particle data to avoid hydration mismatch
  const particles = useMemo<Particle[]>(() => {
    if (typeof window === 'undefined') return []

  return Array.from({ length: 50 }, (_: unknown, i: number) => {
      const seed = i * 1234567890
      const random1 = ((seed % 987654321) / 987654321)
      const random2 = (((seed * 2) % 987654321) / 987654321)
      const random3 = (((seed * 3) % 987654321) / 987654321)
      const random4 = (((seed * 4) % 987654321) / 987654321)
      const random5 = (((seed * 5) % 987654321) / 987654321)
      const random6 = (((seed * 6) % 987654321) / 987654321)
      const random7 = (((seed * 7) % 987654321) / 987654321)

      return {
        id: i,
        width: random1 * 6 + 2,
        height: random2 * 6 + 2,
        left: random3 * 100,
        top: random4 * 100,
        background: ['#ff4500', '#ff6b00', '#ff8c00', '#ffa500', '#ff0000'][Math.floor(random5 * 5)],
        opacity: random6 * 0.6 + 0.2,
        duration: random7 * 2 + 1,
        delay: random1 * 2,
      }
    }) as Particle[]
  }, [])

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      // first let the component hide itself
      setVisible(false)
      // then call optional external callback
      try { onComplete?.() } catch (_e) { void _e }
    }, 6000)
    return () => clearTimeout(timer)
  }, [onComplete])
  
  // normalize unused error variable names in internal catches

  if (!visible) return null

  // Don't render particles until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-orange-950 to-black overflow-hidden">
        {/* Static loading state */}
        <div className="relative">
          <div className="w-96 h-96 bg-orange-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-orange-950 to-black overflow-hidden">
      {/* Animated fire particles */}
      <div className="absolute inset-0 pointer-events-none">
  {particles.map((particle: Particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: particle.background,
              opacity: particle.opacity,
              animation: `flameFloat ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Chakra Container */}
      <div className={`relative transition-all duration-1000 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        {/* Outer fire glow layers */}
        <div className="absolute inset-0 animate-pulse">
          <div className="w-96 h-96 bg-orange-600 rounded-full blur-3xl opacity-40"></div>
        </div>
        <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <div className="w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-30"></div>
        </div>

        {/* Outer rotating ring - Fiery Sudarshan Chakra effect */}
        <div className="relative w-96 h-96" style={{ animation: 'spin 4s linear infinite' }}>
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
            {[...Array(24)].map((_, i) => {
              const angle = (i * 360) / 24
              return (
                <g key={`outer-${i}`} transform={`rotate(${angle} 100 100)`}>
                  <path d="M 100 10 Q 95 25 100 35 Q 105 25 100 10" fill="url(#flameGradient1)" opacity="0.9">
                    <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="0.5s" repeatCount="indefinite" additive="sum" />
                  </path>
                  <path d="M 100 15 Q 97 25 100 32 Q 103 25 100 15" fill="url(#flameGradient2)" opacity="0.8" />
                  <path d="M 100 20 L 105 55 Q 100 50 95 55 Z" fill="url(#flameGradient3)" opacity="0.7" />
                  <circle cx="100" cy="12" r="2" fill="#ffff00" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite" />
                  </circle>
                </g>
              )
            })}

            <circle cx="100" cy="100" r="78" fill="none" stroke="url(#ringGradient)" strokeWidth="2" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="75" fill="none" stroke="#ff6b00" strokeWidth="1" opacity="0.4" />

            <defs>
              <radialGradient id="flameGradient1">
                <stop offset="0%" stopColor="#ffff00" />
                <stop offset="50%" stopColor="#ff6b00" />
                <stop offset="100%" stopColor="#ff0000" />
              </radialGradient>
              <radialGradient id="flameGradient2">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#ffa500" />
                <stop offset="100%" stopColor="#ff4500" />
              </radialGradient>
              <linearGradient id="flameGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff4500" />
                <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ringGradient">
                <stop offset="0%" stopColor="#ff0000" />
                <stop offset="50%" stopColor="#ff6b00" />
                <stop offset="100%" stopColor="#ff0000" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Inner spinning Ashoka Chakra - Cool Blue */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'spin 5s linear infinite reverse' }}>
          <svg viewBox="0 0 200 200" className="w-72 h-72 drop-shadow-2xl">
            <circle cx="100" cy="100" r="15" fill="#0a2463" />
            <circle cx="100" cy="100" r="12" fill="#1e40af" />
            <circle cx="100" cy="100" r="8" fill="#3b82f6">
              <animate attributeName="r" values="8;9;8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="5" fill="#60a5fa" />

            {[...Array(24)].map((_, i) => {
              const angle = (i * 360) / 24
              const radians = (angle * Math.PI) / 180
              const x1 = 100 + 14 * Math.cos(radians)
              const y1 = 100 + 14 * Math.sin(radians)
              const x2 = 100 + 68 * Math.cos(radians)
              const y2 = 100 + 68 * Math.sin(radians)

              return (
                <g key={`spoke-${i}`}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0a2463" strokeWidth="3" />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="2" />
                  <circle cx={x2} cy={y2} r="3.5" fill="#1e40af" />
                  <circle cx={x2} cy={y2} r="2" fill="#60a5fa">
                    <animate attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.05}s`} />
                  </circle>
                </g>
              )
            })}

            <circle cx="100" cy="100" r="71" fill="none" stroke="#0a2463" strokeWidth="5" />
            <circle cx="100" cy="100" r="71" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="71" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.6">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>

            <defs>
              <filter id="blueGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Center blue glow pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full blur-2xl opacity-70 animate-pulse"></div>
        </div>
      </div>

      {/* Tagline */}
      <div className={`absolute bottom-20 text-center transition-all duration-1000 delay-500`}> 
        <div className="text-center">
          <p className="text-orange-200 text-lg italic mb-1">From Sunlight to Sovereignty. One Block at a Time.</p>
          <p className="text-white text-base font-semibold tracking-wide">Truth • Freedom • Equality</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes flameFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-30px) translateX(10px);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
