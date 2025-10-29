import React from 'react';

interface CarouselProps {
  slides: React.ReactNode[];
}

export const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [current, setCurrent] = React.useState(0);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full mb-4">{slides[current]}</div>
      <div className="flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${current === idx ? 'bg-indigo-500' : 'bg-gray-500'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
