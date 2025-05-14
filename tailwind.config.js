/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#939393',
          600: '#333333', // Main dark gray (replacing Navy blue)
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
        },
        secondary: {
          50: '#f2f2f2',
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#808080',
          600: '#555555', // Main medium gray (replacing Teal)
          700: '#404040',
          800: '#2b2b2b',
          900: '#1a1a1a',
        },
        accent: {
          50: '#fffaeb',
          100: '#fff2c7',
          200: '#ffea9e',
          300: '#ffe176',
          400: '#ffda4d',
          500: '#FFC107', // Amber #FFC107 (main)
          600: '#cc9a06',
          700: '#997304',
          800: '#664d03',
          900: '#332601',
        },
      },
      fontSize: {
        'xxs': '.65rem',
      },
      fontFamily: {
        sans: ['Inter', 'Dubai', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 5px 0 rgba(0, 0, 0, 0.05)',
      },
      transitionProperty: {
        'height': 'height',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};