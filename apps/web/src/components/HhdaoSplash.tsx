"use client"
import { useEffect, useState } from "react"

export default function HhdaoSplash({ onComplete }: { onComplete: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState(0) // 0: initial, 1: reveal, 2: full power

  // Allow disabling heavy animations in development or via env flag
  const disableHeavy = process.env.NEXT_PUBLIC_DISABLE_SPLASH === 'true' || process.env.NODE_ENV !== 'production'
  // Unconditionally declare hooks; handle dev/lightweight path inside the effect below
  useEffect(() => {
    if (disableHeavy) {
      const t = setTimeout(onComplete, 300)
      return () => clearTimeout(t)
    }

    setMounted(true)
    const phase1Timer = setTimeout(() => setPhase(1), 500)
    const phase2Timer = setTimeout(() => setPhase(2), 1500)
    const completeTimer = setTimeout(onComplete, 6000)
    return () => {
      clearTimeout(phase1Timer)
      clearTimeout(phase2Timer)
      clearTimeout(completeTimer)
    }
  }, [disableHeavy, onComplete])

  if (disableHeavy) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-center">
        <div>
          <img src="/hhdaologo.svg" alt="HeliosHash logo" className="w-40 h-40 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">HeliosHash DAO</h1>
          <p className="text-sm text-slate-300">Starting…</p>
        </div>
      </div>
    )
  }

  

  if (!mounted) return null

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0" style={{ perspective: "1000px" }}>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            transform: "rotateX(60deg) translateZ(-200px)",
            animation: "gridPulse 3s ease-in-out infinite"
          }}
        />
      </div>

      {/* Particle field */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 43) % 100}%`,
              background: i % 2 ? "#3b82f6" : "#00d4ff",
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              boxShadow: `0 0 ${4 + (i % 3) * 2}px currentColor`
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">

          {/* Outer energy ring - fiery */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
              phase >= 1 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <svg viewBox="0 0 400 400" className="w-96 h-96" style={{ filter: "drop-shadow(0 0 30px rgba(251, 146, 60, 0.5))" }}>
              <defs>
                <radialGradient id="fireGrad">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Rotating fire spikes */}
              <g style={{ animation: "spin 4s linear infinite", transformOrigin: "200px 200px" }}>
                {[...Array(24)].map((_, i) => {
                  const angle = (i * 360) / 24
                  return (
                    <g key={i} transform={`rotate(${angle} 200 200)`}>
                      <path
                        d="M 200 60 Q 195 80 200 95 Q 205 80 200 60"
                        fill="url(#fireGrad)"
                        filter="url(#glow)"
                        opacity="0.8"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.6;1;0.6"
                          dur={`${1 + (i % 3) * 0.2}s`}
                          repeatCount="indefinite"
                          begin={`${i * 0.05}s`}
                        />
                      </path>
                    </g>
                  )
                })}
              </g>

              {/* Energy ring */}
              <circle
                cx="200"
                cy="200"
                r="140"
                fill="none"
                stroke="url(#fireGrad)"
                strokeWidth="2"
                opacity="0.6"
              >
                <animate attributeName="r" values="138;142;138" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Blockchain tech ring */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 delay-300 ${
              phase >= 1 ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <svg viewBox="0 0 400 400" className="w-96 h-96">
              <defs>
                <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              <g style={{ animation: "spin 12s linear infinite reverse", transformOrigin: "200px 200px" }}>
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 360) / 12
                  const rad = (angle * Math.PI) / 180
                  const x = 200 + 110 * Math.cos(rad)
                  const y = 200 + 110 * Math.sin(rad)

                  return (
                    <g key={i}>
                      {/* Connection to center */}
                      <line
                        x1={x}
                        y1={y}
                        x2="200"
                        y2="200"
                        stroke="url(#techGrad)"
                        strokeWidth="1"
                        opacity="0.3"
                        strokeDasharray="4 4"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="8"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </line>

                      {/* Node */}
                      <g transform={`translate(${x - 6}, ${y - 6})`}>
                        <rect width="12" height="12" fill="#0f172a" rx="2" />
                        <rect width="10" height="10" x="1" y="1" fill="#1e293b" rx="1" />
                        <rect width="6" height="6" x="3" y="3" fill="url(#techGrad)" rx="1">
                          <animate
                            attributeName="opacity"
                            values="0.5;1;0.5"
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${i * 0.15}s`}
                          />
                        </rect>
                      </g>

                      {/* Data packet */}
                      <circle r="2" fill="#00ff88">
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          begin={`${i * 0.25}s`}
                          path={`M ${x} ${y} L 200 200`}
                        />
                        <animate
                          attributeName="opacity"
                          values="0;1;0"
                          dur="3s"
                          repeatCount="indefinite"
                          begin={`${i * 0.25}s`}
                        />
                      </circle>
                    </g>
                  )
                })}
              </g>
            </svg>
          </div>

          {/* Central Logo (hhdaologo.svg) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 delay-500 ${
              phase >= 2 ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="w-72 h-72 flex items-center justify-center" style={{ filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))" }}>
              {/* Use the canonical hhdaologo.svg from public root */}
              <img src="/hhdaologo.svg" alt="HeliosHash logo" className="w-72 h-72 object-contain" />
            </div>
          </div>

          {/* Central glow effect */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
              phase >= 2 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-32 h-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>

      {/* Title and tagline */}
      <div
        className={`absolute bottom-32 left-0 right-0 text-center transition-all duration-1000 delay-1000 ${
          phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h1
          className="text-6xl font-bold mb-4 tracking-wider"
          style={{
            background: 'linear-gradient(90deg, #fbbf24 0%, #3b82f6 50%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
            animation: 'shimmer 3s ease-in-out infinite'
          }}
        >
          HeliosHash DAO
        </h1>
        <p className="text-orange-300 text-lg mb-2 tracking-wide" style={{ textShadow: '0 0 10px rgba(251, 146, 60, 0.5)' }}>
          From Sunlight to Sovereignty. One Block at a Time.
        </p>
        <p className="text-blue-200 text-base font-semibold tracking-widest" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
          Truth • Freedom • Equality
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(-20px, -40px);
            opacity: 0.8;
          }
        }

        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes shimmer {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.5)) brightness(1); }
          50% { filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.8)) brightness(1.2); }
        }
      `}</style>
    </div>
  )
}
