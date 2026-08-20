/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#E6DFD2',
          200: '#CBBFAB',
          400: '#A4937A',
        },
        ink: {
          600: '#4A453F',
        },
        navy: {
          800: '#1B2133',
          900: '#0F1422',
        },
      },
      fontFamily: {
        display: ['OutfitVariable', 'Outfit', 'sans-serif'],
        sans: ['OutfitVariable', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        ultra: '0.35em',
      },
    },
  },
  plugins: [],
}
