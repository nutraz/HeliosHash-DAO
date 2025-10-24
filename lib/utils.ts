import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getThemeColors() {
  return {
    saffron: {
      light: '#FF9933',
      dark: '#f97316',
    },
    green: {
      light: '#138808',
      dark: '#22c55e',
    },
    navy: {
      light: '#0A1A2F',
      dark: '#1e40af',
    },
  };
}
