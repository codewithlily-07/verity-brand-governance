/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Navy and Gold tokens
        navy: {
          950: '#050A1F',
          800: '#0A1230',
          DEFAULT: '#0A1230',
        },
        ink: '#05070F',
        charcoal: '#0B0E14',
        gold: {
          light: '#F3D98B',
          DEFAULT: '#D4AF37',
          deep: '#A67C00',
        },
        ivory: '#F7F2E7',
        cream: '#EFE6D2',
        'text-dark': '#121826',
        'text-muted': '#9AA6C7',
        emerald: '#2ECC9A',
        amber: '#F5A623',
        crimson: '#C8414B',

        // Backwards compatibility mappings for existing inner pages
        'deep-navy': '#050A1F',
        'card-navy': '#0A1230',
        muted: '#9AA6C7',
        void: '#050A1F',
        midnight: '#0A1230',
        champagne: '#F3D98B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.45)',
        'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.35)',
        'gold-glow-card': '0 0 40px rgba(212, 175, 55, 0.35)',
        'luxury': '0 20px 50px rgba(5, 7, 15, 0.65)',
      }
    },
  },
  plugins: [],
}
