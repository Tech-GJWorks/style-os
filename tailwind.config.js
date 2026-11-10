/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F1E6',
        paper: '#FBF7EF',
        olive: { DEFAULT: '#3E4A2F', deep: '#2C3522', soft: '#6B7450' },
        choc: { DEFAULT: '#3B2A20', soft: '#6A5444' },
        camel: { DEFAULT: '#C19A6B', light: '#E6D3B5' },
        sand: '#EFE4D2',
        rust: { DEFAULT: '#A4502F', soft: '#C77A57' },
        teal: { DEFAULT: '#1F5C5A' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
