/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefdf9',
          100: '#d4f7ec',
          200: '#aceedb',
          300: '#75e0c5',
          400: '#3ccaa9',
          500: '#18ae8f',
          600: '#0f8d74',
          700: '#10715f',
          800: '#125a4d',
          900: '#124a41',
        },
        surface: '#F7F8FA',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
      borderRadius: {
        xl2: '20px',
      },
    },
  },
  plugins: [],
};
