'use client'
import { useEffect, useState, useMemo } from 'react'

export default function AshokChakraEntry({ onComplete }: { onComplete: () => void }) {
  const [mounted, setMounted] = useState(false)

  // Pre-generate particle data to avoid hydration mismatch
  const particles = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      background: ['#ff4500', '#ff6b00', '#ff8c00', '#ffa500', '#ff0000'][Math.floor(Math.random() * 5)],
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 2,
    })), []
  )

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(onComplete, 6000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-orange-950 to-black overflow-hidden">
      {/* Animated fire particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
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
            {/* Outer flame spikes */}
            {[...Array(24)].map((_, i) => {
              const angle = (i * 360) / 24;
              return (
                <g key={`outer-${i}`} transform={`rotate(${angle} 100 100)`}>
                  {/* Main flame spike */}
                  <path
                    d="M 100 10 Q 95 25 100 35 Q 105 25 100 10"
                    fill="url(#flameGradient1)"
                    opacity="0.9"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="1;1.2;1"
                      dur="0.5s"
                      repeatCount="indefinite"
                      additive="sum"
                    />
                  </path>
                  <path
                    d="M 100 15 Q 97 25 100 32 Q 103 25 100 15"
                    fill="url(#flameGradient2)"
                    opacity="0.8"
                  />
                  {/* Extended fire trails */}
                  <path
                    d="M 100 20 L 105 55 Q 100 50 95 55 Z"
                    fill="url(#flameGradient3)"
                    opacity="0.7"
                  />
                  {/* Glowing embers */}
                  <circle cx="100" cy="12" r="2" fill="#ffff00" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
            
            {/* Fire ring effects */}
            <circle cx="100" cy="100" r="78" fill="none" stroke="url(#ringGradient)" strokeWidth="2" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="75" fill="none" stroke="#ff6b00" strokeWidth="1" opacity="0.4" />
            
            {/* Gradients for flames */}
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
            {/* Center circle with blue glow */}
            <circle cx="100" cy="100" r="15" fill="#0a2463" />
            <circle cx="100" cy="100" r="12" fill="#1e40af" />
            <circle cx="100" cy="100" r="8" fill="#3b82f6">
              <animate attributeName="r" values="8;9;8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="100" r="5" fill="#60a5fa" />
            
            {/* 24 Blue Spokes */}
            {[...Array(24)].map((_, i) => {
              const angle = (i * 360) / 24;
              const radians = (angle * Math.PI) / 180;
              const x1 = 100 + 14 * Math.cos(radians);
              const y1 = 100 + 14 * Math.sin(radians);
              const x2 = 100 + 68 * Math.cos(radians);
              const y2 = 100 + 68 * Math.sin(radians);
              
              return (
                <g key={`spoke-${i}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#0a2463"
                    strokeWidth="3"
                  />
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  {/* Glowing circles at spoke ends */}
                  <circle cx={x2} cy={y2} r="3.5" fill="#1e40af" />
                  <circle cx={x2} cy={y2} r="2" fill="#60a5fa">
                    <animate attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.05}s`} />
                  </circle>
                </g>
              );
            })}
            
            {/* Outer rim with glow */}
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

      {/* App title fade in */}
      <div className={`absolute bottom-20 text-center transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 mb-2" style={{ textShadow: '0 0 20px rgba(255,107,0,0.5)' }}>
          HeliosHash DAO
        </h1>
        <p className="text-orange-200 text-lg italic mb-1">From Sunlight to Sovereignty. One Block at a Time.</p>
        <p className="text-white text-base font-semibold tracking-wide">Truth • Freedom • Equality</p>
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
