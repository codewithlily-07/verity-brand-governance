/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Specific phase 4 palette
        navy: '#0A1230',
        'deep-navy': '#060B1F',
        'card-navy': '#111B3D',
        gold: '#D4AF37',
        'gold-light': '#F3D98B',
        ivory: '#F5F1E6',
        muted: '#9AA6C7',
        emerald: '#2ECC9A',
        amber: '#F5A623',
        red: '#E5484D',

        // Extended aliases for backwards-compatibility
        void: '#060B1F',
        midnight: '#0A1230',
        'navy-2': '#18285A',
        'indigo-glow': 'rgba(28, 58, 140, 0.25)',
        ink: '#060B1F',
        'gold-shadow': '#8A5A12',
        'gold-glow': 'rgba(212, 175, 55, 0.55)',
        'glass-fill': 'rgba(17, 27, 61, 0.7)',
        'text-soft': '#9AA6C7',
        champagne: '#F3D98B',
        mist: '#EEF1F7',
        teal: '#2ECC9A',
        coral: '#E5484D',
        sky: '#5B8DEF',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        serif: ['"Cormorant Garamond"', 'Fraunces', 'serif'],
        sans: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(6, 11, 31, 0.4), 0 2px 6px -1px rgba(6, 11, 31, 0.3)',
        'card-hover': '0 12px 32px -4px rgba(6, 11, 31, 0.6), 0 0 20px rgba(212, 175, 55, 0.25)',
        'glow': '0 0 25px -5px rgba(212, 175, 55, 0.45)',
        'glow-lg': '0 0 45px rgba(212, 175, 55, 0.65)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
