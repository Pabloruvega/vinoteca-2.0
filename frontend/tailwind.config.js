/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wine:  { DEFAULT: '#5a1a1f', light: '#7a2a30', dark: '#3e1015' },
        cream: { DEFAULT: '#f5f0e8', dark: '#ede8df' },
        earth: '#6b4c35',
        vine:  '#3d6b45',
        ink:   '#2e1f14',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}