import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

// LOCAL ONLY: Safelist custom color classes for Fedora OS development. Remove before pushing to GitHub/main.
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Custom color classes (add more as needed)
    'bg-primary', 'bg-primary-foreground',
    'bg-secondary', 'bg-secondary-foreground',
    'bg-accent', 'bg-accent-foreground',
    'bg-muted', 'bg-muted-foreground',
    'bg-destructive', 'bg-destructive-foreground',
    'bg-card', 'bg-card-foreground',
    'bg-popover', 'bg-popover-foreground',
    'bg-success', 'bg-info', 'bg-warning',
    'text-primary', 'text-primary-foreground',
    'text-secondary', 'text-secondary-foreground',
    'text-accent', 'text-accent-foreground',
    'text-muted', 'text-muted-foreground',
    'text-destructive', 'text-destructive-foreground',
    'text-card', 'text-card-foreground',
    'text-popover', 'text-popover-foreground',
    'text-success', 'text-info', 'text-warning',
    'border-primary', 'border-secondary', 'border-accent', 'border-muted', 'border-destructive', 'border-card', 'border-popover',
    'ring-primary', 'ring-secondary', 'ring-accent', 'ring-muted', 'ring-destructive', 'ring-card', 'ring-popover',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--color-background))',
        foreground: 'hsl(var(--color-foreground))',
        card: {
          DEFAULT: 'hsl(var(--color-card))',
          foreground: 'hsl(var(--color-card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--color-popover))',
          foreground: 'hsl(var(--color-popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          foreground: 'hsl(var(--color-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary))',
          foreground: 'hsl(var(--color-secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--color-muted))',
          foreground: 'hsl(var(--color-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--color-accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive))',
          foreground: 'hsl(var(--color-destructive-foreground))',
        },
        border: 'hsl(var(--color-border))',
        input: 'hsl(var(--color-input))',
        ring: 'hsl(var(--color-ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        saffron: '#FF9933',    // Primary brand color
        green: '#138808',      // Success/growth
        navy: '#0A1A2F',       // Dark backgrounds
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
