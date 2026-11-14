/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#040A1C',
        midnight: '#071230',
        'deep-navy': '#0D1D4A',
        navy: '#0D1D4A',
        'navy-2': '#18285A',
        'indigo-glow': 'rgba(28, 58, 140, 0.25)',
        ink: '#0F1A33',
        'gold-shadow': '#8A5A12',
        gold: '#E8B84B',
        'gold-light': '#FFF1B8',
        'gold-glow': 'rgba(255, 196, 80, 0.55)',
        'glass-fill': 'rgba(255, 255, 255, 0.06)',
        'text-soft': 'rgba(255, 255, 255, 0.78)',
        champagne: '#F5ECD2',
        ivory: '#FBF9F3',
        mist: '#EEF1F7',
        teal: '#19A883',
        coral: '#E5484D',
        amber: '#E9A23B',
        sky: '#5B8DEF',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        serif: ['Fraunces', 'serif'],
        sans: ['Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(10, 17, 40, 0.05), 0 2px 6px -1px rgba(10, 17, 40, 0.03)',
        'card-hover': '0 10px 30px -4px rgba(10, 17, 40, 0.1), 0 4px 10px -2px rgba(10, 17, 40, 0.05)',
        'glow': '0 0 25px -5px rgba(232, 184, 75, 0.45)',
        'glow-lg': '0 0 45px rgba(232, 184, 75, 0.65)',
      }
    },
  },
  plugins: [],
}
