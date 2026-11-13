/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0A1128',
        navy: '#101B3D',
        'navy-2': '#18285A',
        ink: '#0F1A33',
        gold: '#C8A35A',
        'gold-light': '#EAD7A1',
        champagne: '#F5ECD2',
        ivory: '#FBF9F3',
        mist: '#EEF1F7',
        teal: '#19A883',
        coral: '#E5484D',
        amber: '#E9A23B',
        sky: '#5B8DEF',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(10, 17, 40, 0.05), 0 2px 6px -1px rgba(10, 17, 40, 0.03)',
        'card-hover': '0 10px 30px -4px rgba(10, 17, 40, 0.1), 0 4px 10px -2px rgba(10, 17, 40, 0.05)',
        'glow': '0 0 25px -5px rgba(200, 163, 90, 0.3)',
      }
    },
  },
  plugins: [],
}
