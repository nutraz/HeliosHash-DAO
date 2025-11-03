'use client'; // Add this at the top

import { useEffect, useState } from 'react';

export default function DhammaChakra() {
  const [animationDuration, setAnimationDuration] = useState('1.5s'); // Default value

  useEffect(() => {
    // Set random duration only on client side
    setAnimationDuration(`${1 + Math.random() * 1.5}s`);
  }, []);

  return (
    <div
      style={{
        animation: `flare ${animationDuration} ease-in-out infinite alternate`,
        animationDelay: '0s'
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 360) / 8;
          const x = 50 + 40 * Math.cos((angle - 90) * Math.PI / 180);
          const y = 50 + 40 * Math.sin((angle - 90) * Math.PI / 180);
          return (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
}
