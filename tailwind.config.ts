import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-montserrat)', 'sans-serif'],
        'noto-sc': ['var(--font-noto-sc)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Nouveau dégradé subtil "Paris" (Blanc vers Bleu très pâle)
        'paris-gradient': 'linear-gradient(to bottom, #ffffff, #f0f9ff)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // --- NOUVELLE PALETTE (FORCÉE EN HEXADÉCIMAL) ---
        
        // FOND : Blanc Pur
        background: '#ffffff',
        // TEXTE : Bleu Nuit (Slate 900)
        foreground: '#0f172a',

        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },

        // PRIMAIRE : Bleu Nuit (Confiance / Titres)
        primary: {
          DEFAULT: '#0f172a',
          foreground: '#ffffff',
        },

        // SECONDAIRE : Gris Tech
        secondary: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },

        // ACCENT : Rouge Framboise (Amour / Action)
        accent: {
          DEFAULT: '#e11d48', 
          foreground: '#ffffff',
        },

        muted: {
          DEFAULT: '#f8fafc', // Gris très pâle
          foreground: '#64748b', // Gris texte
        },
        
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        
        border: '#e2e8f0', // Gris clair
        input: '#e2e8f0',
        ring: '#e11d48',   // Le focus est rouge
        
        // Graphiques (Optionnel)
        chart: {
          '1': '#0f172a',
          '2': '#e11d48',
          '3': '#64748b',
          '4': '#f1f5f9',
          '5': '#e2e8f0',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        // Glow mis à jour en Rouge (au lieu de doré)
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(225, 29, 72, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(225, 29, 72, 0.6)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'shimmer': 'shimmer 3s infinite linear',
        'glow': 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;