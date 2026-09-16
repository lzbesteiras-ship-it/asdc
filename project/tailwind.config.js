/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdf8f0',
          100: '#f9ecd9',
          200: '#f0d5ad',
          300: '#e6b97e',
          400: '#db9d50',
          500: '#d08832',
          600: '#b86d26',
          700: '#935320',
          800: '#6f4019',
          900: '#4a2b12',
        },
        ocean: {
          50: '#eefcf6',
          100: '#d6f7e9',
          200: '#aeefd4',
          300: '#75e0b8',
          400: '#3ec996',
          500: '#1eaf7c',
          600: '#138c64',
          700: '#107051',
          800: '#0f5942',
          900: '#0d4a37',
        },
        coral: {
          50: '#fef2f0',
          100: '#fde0db',
          200: '#fac5bc',
          300: '#f59d8e',
          400: '#ee7060',
          500: '#e64a3a',
          600: '#d33324',
          700: '#af281d',
          800: '#8c241d',
          900: '#72231e',
        },
      },
    },
  },
  plugins: [],
};
