/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VERITY Official Design Overhaul Palette Tokens
        midnight: '#0A1226',
        navy: {
          DEFAULT: '#101B35',
          soft: '#17254A',
          800: '#101B35',
          900: '#0E172E',
          950: '#0A1226',
        },
        'navy-soft': '#17254A',
        ivory: '#FAF8F2',
        champagne: {
          DEFAULT: '#F3EAD3',
          light: '#F8F3E5',
          deep: '#E2B857',
        },
        paper: '#FFFFFF',
        ink: {
          DEFAULT: '#14203D',
          soft: '#4A5675',
        },
        'ink-soft': '#4A5675',
        'text-on-navy': '#F4F1E8',
        'text-soft-on-navy': '#D5DBEE',
        gold: {
          DEFAULT: '#E2B857',
          deep: '#8A6A24',
          light: '#F3D98B',
        },
        'gold-deep': '#8A6A24',
        'verified-teal': '#1E9E78',
        'high-coral': '#D64550',
        'medium-amber': '#D99A2B',

        // Compatibility mappings
        charcoal: '#0B0E14',
        cream: '#EFE6D2',
        'text-dark': '#14203D',
        'text-muted': '#4A5675',
        emerald: '#1E9E78',
        amber: '#D99A2B',
        crimson: '#D64550',
        'deep-navy': '#0A1226',
        'card-navy': '#101B35',
        muted: '#4A5675',
        void: '#0A1226',
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
